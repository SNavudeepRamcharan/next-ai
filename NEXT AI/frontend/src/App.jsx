import { useState } from "react";

import MainLayout from "./components/layout/MainLayout";
import Header from "./components/layout/Header";
import ChatWindow from "./components/chat/ChatWindow";
import ChatInput from "./components/chat/ChatInput";
import TypingIndicator from "./components/chat/TypingIndicator";

function App() {
  const API = import.meta.env.VITE_API_URL;

  const [webSearch, setWebSearch] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedModel, setSelectedModel] = useState("openai/gpt-4.1-mini");

  const [chatId, setChatId] = useState(crypto.randomUUID());
  const [imagePath, setImagePath] = useState(null);

  function newChat() {
    setMessages([]);
    setMessage("");
    setImagePath(null);
    setChatId(crypto.randomUUID());
  }

  async function openChat(id) {
    try {
      const res = await fetch(`${API}/history/chat/${id}`);
      const data = await res.json();

      setChatId(id);

      setMessages(
        data.map((m) => ({
          sender: m.role === "assistant" ? "ai" : "user",
          text: m.content,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function sendMessage() {
    console.log("sendMessage called");

    if (!message.trim()) return;

    const user = {
      sender: "user",
      text: message,
       time: new Date().toLocaleTimeString([], {
       hour: "2-digit",
       minute: "2-digit",
      }),
    };

    const updated = [...messages, user];

    setMessages(updated);
    setMessage("");
    setLoading(true);

    try {
      const formatted = updated.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      console.log("Sending request to:", `${API}/chat`);

      const response = await fetch(`${API}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          messages: formatted,
          model: selectedModel,
          image: imagePath,
          web_search: webSearch,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let reply = "";

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "",
        },
      ]);

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        reply += decoder.decode(value);

        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1].text = reply;
          return copy;
        });
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    }

    setLoading(false);
  }
  function exportChat() {
  if (messages.length === 0) {
    alert("No chat to export.");
    return;
  }

  const text = messages
    .map(
      (m) =>
        `${m.sender === "user" ? "You" : "Next AI"}:\n${m.text}\n`
    )
    .join("\n-----------------\n");

  const blob = new Blob([text], {
    type: "text/plain",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = "next_ai_chat.txt";

  a.click();

  URL.revokeObjectURL(url);
}
function stopGenerating() {
  // We'll implement this later
}

function regenerateResponse() {
  if (messages.length < 2) return;

  const lastUser = [...messages]
    .reverse()
    .find((m) => m.sender === "user");

  if (!lastUser) return;

  setMessage(lastUser.text);

  setTimeout(() => {
    sendMessage();
  }, 0);
}

  return (
    <MainLayout
      newChat={newChat}
      openChat={openChat}
    >
      <Header
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        webSearch={webSearch}
        setWebSearch={setWebSearch}
        exportChat={exportChat}
      />

      <ChatWindow messages={messages} />

      {loading && <TypingIndicator />}

      <ChatInput
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        loading={loading}
        setImagePath={setImagePath}
      />
    </MainLayout>
  );
}

export default App;