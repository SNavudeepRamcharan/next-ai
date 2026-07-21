import { useState } from "react";

function ChatInput({
  message,
  setMessage,
  sendMessage,
  loading,
  setImagePath,
}) {
  const API = import.meta.env.VITE_API_URL;
  const [selectedImage, setSelectedImage] = useState(null);

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

      console.log("Uploaded:", data);

      setImagePath(data.path);

      alert("✅ Image uploaded successfully!");

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

  return (
    <div
      style={{
        padding: "20px",
        borderTop: "1px solid #333",
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
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <label
          style={{
            background: "#444",
            color: "white",
            padding: "12px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "20px",
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
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Next AI..."
          style={{
            flex: 1,
            height: "80px",
            resize: "none",
            padding: "10px",
            borderRadius: "10px",
            background: "#2b2b2b",
            color: "white",
            border: "none",
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            width: "120px",
            border: "none",
            borderRadius: "10px",
            background: "#2563eb",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChatInput;