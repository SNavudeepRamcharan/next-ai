function ChatInput({ message, setMessage, sendMessage, loading }) {
  return (
    <div
      style={{
        padding: "20px",
        borderTop: "1px solid #333",
        display: "flex",
        gap: "10px",
      }}
    >
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
  );
}

export default ChatInput;