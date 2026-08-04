import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import "./ChatInput.css";
import { useEffect } from "react";
import toast from "react-hot-toast";
function ChatInput({
  message,
  setMessage,
  sendMessage,
  stopGenerating,
  loading,
  setImagePath,
}) {
  const [mobile, setMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const resize = () => setMobile(window.innerWidth < 900);

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);
  const API = import.meta.env.VITE_API_URL;

  const { darkMode } = useContext(ThemeContext);

  const [selectedImage, setSelectedImage] = useState(null);

  const [mobile, setMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const resize = () => {
      setMobile(window.innerWidth < 900);
    };

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  const recognition =
    typeof window !== "undefined"
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null;

  function startVoice() {
    if (!recognition) {

      alert("Speech Recognition is not supported in this browser.");

      return;
    }

    const speech = new recognition();

    speech.lang = "en-US";
    speech.interimResults = false;
    speech.maxAlternatives = 1;

    speech.onresult = (event) => {
      setMessage(event.results[0][0].transcript);
    };

    speech.onerror = (event) => {

      console.error("Speech Error:", event.error);

      alert(`Voice Error: ${event.error}`);
    };

    speech.onend = () => {

      console.log("Voice recognition ended");

    };

    speech.start();
  }

  async function uploadImage(file) {
    const formData = new FormData();

    formData.append("file", file);

    try {
      const response = await fetch(`${API}/file/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log("IMAGE RESPONSE:", data);
      alert(JSON.stringify(data, null, 2));

      setImagePath(data.path);

    } catch (err) {
      console.error(err);
      alert("❌ Image upload failed.");
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedImage(file);

    uploadImage(file);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }
   async function generateImage() {
    const prompt = message.trim();

    if (!prompt) {
      toast("Enter an image prompt first.");
      return;
    }

    try {
      const response = await fetch(`${API}/file/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      const data = await response.json();

      if (data.image) {
        const imageUrl = `data:image/png;base64,${data.image}`;
        window.open(imageUrl, "_blank");
        toast.success("Image generated!");
      } else {
        toast.error("Image generation failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error generating image.");
    }
  }

  return (
    <div
      style={{
        padding: "14px",
        borderTop: darkMode ? "1px solid #333" : "1px solid #ddd",
        background: darkMode ? "#343541" : "#f8f8f8",
      }}
    >
      {selectedImage && (
        <div
          style={{
            marginBottom: "12px",
          }}
        >
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="preview"
            style={{
              width: "150px",
              borderRadius: "10px",
              border: "1px solid #444",
            }}
          />
        </div>
      )}

      <div className="chat-box">
        <label
          style={{
            width: "56px",
            height: "56px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "var(--card)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            cursor: "pointer",
            fontSize: "22px",
          }}
        >
          📎

          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </label>

        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);

            e.target.style.height = "0px";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask Next AI..."
          rows={1}
          style={{
            flex: "1 1 auto",
            minWidth: 0,
            minHeight: "55px",
            maxHeight: "150px",
            resize: "none",
            overflowY: "auto",
            padding: "15px",
            borderRadius: "18px",
            background: "var(--card)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            fontSize: "16px",
          }}
        />
        <div className="chat-actions">
          <button
            className="icon-btn"
            onClick={startVoice}
            style={{
              height: "56px",
              width: "56px",
              border: "none",
              borderRadius: "16px",
              background: "#2563eb",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            🎤
          </button>

          <button
            className="icon-btn"
            onClick={generateImage}
          >
            🎨
          </button>

          <button
            className="send-btn"
            onClick={loading ? stopGenerating : sendMessage}
          >
            {loading ? "■" : "➤"}
          </button>

        </div>

      </div>
    );
  }

    return (
    <div className="mobile-chat-wrapper">

      {selectedImage && (
        <div className="mobile-image-preview">
          📷 {selectedImage.name}
        </div>
      )}

      <div className="mobile-chat-input">

        <div className="mobile-input-row">

          <label className="mobile-icon-btn">
            📎
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>

          <textarea
            className="mobile-input"
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Next AI..."
          />

          <button
            className="mobile-send-btn"
            onClick={loading ? stopGenerating : sendMessage}
            style={{
              height: "56px",
              padding: "0 18px",
              border: "none",
              borderRadius: "16px",
              background: "#2563eb",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {loading ? "⏹ Stop" : "📤 Send"}
          </button>

          <label className="tool-btn">
            📎 Upload
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>

          <button
            className="tool-btn"
            onClick={generateImage}
            style={{
              height: "56px",
              padding: "0 18px",
              border: "none",
              borderRadius: "16px",
              background: "#9333ea",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            🎨 Generate
          </button>

        </div>

      </div>

    </div>
  );
}

export default ChatInput;