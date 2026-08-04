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


      toast.error("Speech Recognition is not supported.");


      alert("Speech Recognition is not supported.");

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

      toast.error(`Voice Error: ${event.error}`);
    };

    speech.onend = () => {

      console.log("Voice recognition ended");

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


      console.log("IMAGE RESPONSE:", data);
      toast.success("Image uploaded successfully!");

      console.log(data);


      setImagePath(data.path);

    } catch (err) {
      console.error(err);


      alert("Image upload failed");

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

  // ===========================
  // DESKTOP LAYOUT
  // ===========================

  if (!mobile) {
    return (
      <div className="chat-input-container">

        {selectedImage && (
          <div className="selected-image">
            📷 {selectedImage.name}
          </div>
        )}

        <div className="chat-input-row">

          <label className="icon-btn">
            📎
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Next AI..."
            className="chat-input"
            rows={1}
          />

          <button
            className="icon-btn"
            onClick={startVoice}
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
          >
            {loading ? "⏹️" : "➡️"}
          </button>

        </div>

        <div className="mobile-tools">

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
            🏞️ Image
          </button>

        </div>

      </div>

    </div>
  );
}

export default ChatInput;