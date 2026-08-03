import { useState } from "react";

import MainLayout from "./components/layout/MainLayout";
import Header from "./components/layout/Header";
import ChatWindow from "./components/chat/ChatWindow";
import ChatInput from "./components/chat/ChatInput";
import TypingIndicator from "./components/chat/TypingIndicator";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Navigate, Routes, Route } from "react-router-dom";
import ShareChat from "./pages/ShareChat";
import { Toaster } from "react-hot-toast";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
function App() {
  const API = import.meta.env.VITE_API_URL;
  console.log("API =", API);
  const { user, loading: authLoading } = useContext(AuthContext);
  const [selectedPersona, setSelectedPersona] = useState("general");
  const [webSearch, setWebSearch] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedModel, setSelectedModel] = useState("openai/gpt-4.1-mini");

  const [chatId, setChatId] = useState(crypto.randomUUID());
  const [imagePath, setImagePath] = useState(null);
  const [controller, setController] = useState(null);
  const [showThemes, setShowThemes] = useState(false);

  async function logout() {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  }
  const [showThemes, setShowThemes] = useState(false);

  function newChat() {
    setMessages([]);
    setMessage("");
    setImagePath(null);
    setChatId(crypto.randomUUID());
  }

  function editMessage(index) {
    const userMessage = messages[index];

    if (!userMessage || userMessage.sender !== "user") return;

    setMessage(userMessage.text);

    // Remove this user message and everything after it
    setMessages(messages.slice(0, index + 1));

    // Optional: keep the same chat id so conversation continues
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

    const abortController = new AbortController();

    if (!message.trim()) return; if (!message || !message.trim()) {
      console.log("Message is empty");
      return;
    }

    console.log("Sending:", message);

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
        signal: abortController.signal,
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
          persona: selectedPersona,
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

        const chunk = decoder.decode(value);

        console.log("CHUNK =", chunk);

        reply += chunk;

        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1].text = reply;
          return copy;
        });
      }
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Generation stopped.");
      } else {
        console.error("Fetch Error:", err);
      }
    }

    setLoading(false);
    setController(null);
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
    if (controller) {
      controller.abort();
      setLoading(false);
    }
  }

  async function regenerateResponse() {
    const lastUser = [...messages]
      .reverse()
      .find((m) => m.sender === "user");

    if (!lastUser) return;

    setLoading(true);

    try {
      const history = messages
        .filter((m) => m !== messages[messages.length - 1])
        .map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text,
        }));

      history.push({
        role: "user",
        content: lastUser.text,
      });

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
          persona: selectedPersona,
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let reply = "";

      setMessages((prev) => [
        ...prev.slice(0, -1),
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
      if (err.name === "AbortError") {
        console.log("Generation stopped.");
      } else {
        console.error(err);
      }
    }

    setLoading(false);
  }
  if (authLoading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 2500,
          style: {
            background: "var(--card)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
          },
        }}
      />

      <>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2500,
            style: {
              background: "var(--card)",
              color: "var(--text)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
            },
          }}
        />

        <Routes>

          <Route
            path="/share/:id"
            element={<ShareChat />}
          />

          <Route
            path="*"
            element={
              <MainLayout
                newChat={newChat}
                openChat={openChat}

                webSearch={webSearch}
                setWebSearch={setWebSearch}

                selectedPersona={selectedPersona}
                setSelectedPersona={setSelectedPersona}

                logout={logout}
                showThemes={showThemes}
                setShowThemes={setShowThemes}
              >
                <Header
                  selectedModel={selectedModel}
                  setSelectedModel={setSelectedModel}
                  webSearch={webSearch}
                  setWebSearch={setWebSearch}
                  selectedPersona={selectedPersona}
                  setSelectedPersona={setSelectedPersona}
                />

                <ChatWindow
                  messages={messages}
                  regenerateResponse={regenerateResponse}
                  editMessage={editMessage}
                />

                {loading && <TypingIndicator />}

                <ChatInput
                  message={message}
                  setMessage={setMessage}
                  sendMessage={sendMessage}
                  stopGenerating={stopGenerating}
                  loading={loading}
                  setImagePath={setImagePath}
                />

              </MainLayout>
            }
          />

        </Routes>
      </>
    </>
  );
}

export default App;