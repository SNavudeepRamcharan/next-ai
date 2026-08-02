import { useState, useContext } from "react";
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
  const recognition =
    typeof window !== "undefined"
      ? (window.SpeechRecognition || window.webkitSpeechRecognition)
      : null;

  function startVoice() {

    if (!recognition) {

      toast.error("Speech Recognition is not supported.");

      return;
    }

    const speech = new recognition();

    speech.lang = "en-US";

    speech.interimResults = false;

    speech.maxAlternatives = 1;

    speech.onresult = (event) => {

      const text = event.results[0][0].transcript;

      setMessage(text);
    };

    speech.onerror = (event) => {

      console.error("Speech Error:", event.error);

      toast.error(`Voice Error: ${event.error}`);
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
      const response = await fetch(
        `${API}/file/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      console.log("IMAGE RESPONSE:", data);
      toast.success("Image uploaded successfully!");

      return;

    } catch (err) {
      console.error(err);
      toast.error("Image upload failed.");
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

      console.log(data);

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
        width: "100%",
        boxSizing: "border-box",

        padding: "18px",

        background: "transparent",

        position: "sticky",
        bottom: "max(0px, env(safe-area-inset-bottom))",
        zIndex: 10,
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

      <div
        className="chat-box"
        style={{
          maxWidth: "980px",
          margin: "0 auto",
          padding: mobile ? "10px" : "14px",
          borderRadius: mobile ? "18px" : "24px",
          background: "var(--header)",
          border: "1px solid var(--border)",
          boxShadow: "0 10px 30px rgba(0,0,0,.18)",
          display: "flex",
          flexDirection: mobile ? "column" : "row",
          gap: "10px",
        }}
      >
        <label
          htmlFor="image-upload"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "52px",
            height: "52px",
            marginBottom: "12px",
            borderRadius: "16px",
            background: "#2563eb",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          📎
        </label>

        <input
          id="image-upload"
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageChange}
        />

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
            minHeight: "60px",
            maxHeight: "150px",
            resize: "none",
            overflowY: "auto",
            padding: "16px",
            borderRadius: "20px",
            background: "var(--card)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            fontSize: "16px",
          }}
        />
        <div className="chat-actions">
          <button
            onClick={startVoice}
            style={{
              height: "52px",
              width: "56px",
              border: "none",
              borderRadius: "18px",
              background: "#2563eb",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            🎤
          </button>

          <button
            onClick={loading ? stopGenerating : sendMessage}
            style={{
              height: "52px",
              padding: "0 18px",
              border: "none",
              borderRadius: "18px",
              background: "#2563eb",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {loading ? "⏹ Stop" : "📤 Send"}
          </button>
          <button
            onClick={generateImage}
            style={{
              height: "52px",
              padding: "0 18px",
              border: "none",
              borderRadius: "18px",
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