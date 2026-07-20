import { useState } from "react";

import MainLayout from "./components/layout/MainLayout";
import Header from "./components/layout/Header";
import ChatWindow from "./components/chat/ChatWindow";
import ChatInput from "./components/chat/ChatInput";
import TypingIndicator from "./components/chat/TypingIndicator";

function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedModel, setSelectedModel] = useState("openai/gpt-4.1-mini");

  const [chatId, setChatId] = useState(crypto.randomUUID());

  // NEW
  const [imagePath, setImagePath] = useState(null);

  function newChat() {
    setMessages([]);
    setMessage("");
    setImagePath(null);
    setChatId(crypto.randomUUID());
  }

  async function sendMessage() {
    if (!message.trim()) return;

    const userMessage = {
      sender: "user",
      text: message,
    };

    const updated = [...messages, userMessage];

    setMessages(updated);

    setMessage("");

    setLoading(true);

    try {
      const formatted = updated.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const response = await fetch(
        "http://127.0.0.1:8000/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            chat_id: chatId,
            messages: formatted,
            model: selectedModel,

            // NEW
            image: imagePath,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Backend Error");
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
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "❌ " + err.message,
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <MainLayout newChat={newChat}>
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

        // NEW
        setImagePath={setImagePath}
      />
    </MainLayout>
  );
}

export default App;