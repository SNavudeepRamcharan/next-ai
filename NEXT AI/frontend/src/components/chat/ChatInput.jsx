import { useState } from "react";

function ChatInput({
  message,
  setMessage,
  sendMessage,
  loading,
  setImageUrl,
}) {
  const [selectedImage, setSelectedImage] = useState(null);


  async function uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log("Uploaded:", data);

      setImageUrl(data.path);

      alert("Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Image upload failed.");
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedImage(file);

    uploadImage(file);
  }

  return (
    <div
      style={{
        padding: "20px",
        borderTop: "1px solid #333",
      }}
    >
      {selectedImage && (
        <div style={{ marginBottom: "10px" }}>
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="preview"
            style={{
              width: "150px",
              borderRadius: "10px",
            }}
          />
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <label
          style={{
            background: "#444",
            color: "white",
            padding: "12px",
            borderRadius: "10px",
            cursor: "pointer",
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
            background: "#3b82f6",
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