import { useState } from "react";

import MainLayout from "./components/layout/MainLayout";
import Header from "./components/layout/Header";
import ChatWindow from "./components/chat/ChatWindow";
import ChatInput from "./components/chat/ChatInput";
import TypingIndicator from "./components/chat/TypingIndicator";


function App() {
  const API = import.meta.env.VITE_API_URL;
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
      const res = await fetch(
        `${API}/history/chat/${id}`
      );

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
    if (!message.trim()) return;

    const user = {
      sender: "user",
      text: message,
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

      const response = await fetch(`${API}/chat`, 
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            chat_id: chatId,
            messages: formatted,
            model: selectedModel,
            image: imagePath,
          }),
        }
      );

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
      console.log(err);
    }

    setLoading(false);
  }

  return (
    <MainLayout
      newChat={newChat}
      openChat={openChat}
    >
      <Header
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
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