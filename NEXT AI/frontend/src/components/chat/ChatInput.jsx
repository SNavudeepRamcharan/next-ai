import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import "./ChatInput.css";
import toast from "react-hot-toast";

function ChatInput({
  message,
  setMessage,
  sendMessage,
  stopGenerating,
  loading,
  setImagePath,
}) {
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
      toast.error("Speech Recognition is not supported.");
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
      console.error(event.error);
      toast.error(`Voice Error: ${event.error}`);
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

      setImagePath(data.path);

      setSelectedImage(file);

      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed.");
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file) return;

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
      toast.error("Enter an image prompt first.");
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

    // ===========================
  // DESKTOP UI
  // ===========================

  if (!mobile) {
    return (
      <div className="chat-input-wrapper">

        {selectedImage && (
          <div className="selected-image">
            📷 {selectedImage.name}
          </div>
        )}

        <div className="chat-card">

          <div className="chat-top">

            <label className="circle-btn">
              📎
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>

            <textarea
              value={message}
              rows={1}
              placeholder="Ask Next AI..."
              className="chat-textarea"
              onChange={(e) => {
                setMessage(e.target.value);

                e.target.style.height = "0px";
                e.target.style.height =
                  e.target.scrollHeight + "px";
              }}
              onKeyDown={handleKeyDown}
            />

            <button
              className="send-btn"
              onClick={loading ? stopGenerating : sendMessage}
            >
              {loading ? "■" : "➤"}
            </button>

          </div>

          <div className="chat-bottom">

            <button
              className="tool-btn"
              onClick={startVoice}
            >
              🎤 Voice
            </button>

            <button
              className="tool-btn"
              onClick={generateImage}
            >
              🎨 Image
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ===========================
  // MOBILE UI
  // ===========================

  return (
    <div className="mobile-chat-wrapper">

      {selectedImage && (
        <div className="selected-image">
          📷 {selectedImage.name}
        </div>
      )}

      <div className="mobile-chat-card">

        {/* Top Row */}

        <div className="mobile-top-row">

          <label className="mobile-circle-btn">
            📎
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>

          <textarea
            className="mobile-textarea"
            rows={1}
            value={message}
            placeholder="Ask Next AI..."
            onChange={(e) => {
              setMessage(e.target.value);

              e.target.style.height = "0px";
              e.target.style.height =
                e.target.scrollHeight + "px";
            }}
            onKeyDown={handleKeyDown}
          />

          <button
            className="mobile-send-btn"
            onClick={loading ? stopGenerating : sendMessage}
          >
            {loading ? "■" : "➤"}
          </button>

        </div>

        {/* Bottom Row */}

        <div className="mobile-bottom-row">

          <button
            className="tool-btn"
            onClick={startVoice}
          >
            🎤 Voice
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
          >
            🎨 Image
          </button>

        </div>

      </div>

    </div>
  );
}

export default ChatInput;