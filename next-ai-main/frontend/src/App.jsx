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

  async function sendMessage() {
    if (!message.trim()) return;

    const userMessage = {
      sender: "user",
      text: message,
    };

    // 1. Pre-calculate the updated history including the brand new user message
    const updatedMessages = [...messages, userMessage];

    // Show the user message on screen immediately
    setMessages(updatedMessages);

    const currentMessage = message;
    setMessage("");
    setLoading(true);
    
    try {
      // 2. Map the conversation history format to what OpenRouter/FastAPI expects
      const formattedHistory = updatedMessages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: formattedHistory, // Sending the full thread history
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Backend error");
      }

      setLoading(false);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedText = "";

      // Append an initial empty AI message bubble
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "" }
      ]);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          accumulatedText += chunk;

          setMessages((prev) => {
            const updated = [...prev];
            if (updated.length > 0) {
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                text: accumulatedText,
              };
            }
            return updated;
          });
        }
      }

    } catch (err) {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "❌ " + err.message,
        },
      ]);
    }
  }

  return (
    <MainLayout>
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
      />
    </MainLayout>
  );
}

export default App;