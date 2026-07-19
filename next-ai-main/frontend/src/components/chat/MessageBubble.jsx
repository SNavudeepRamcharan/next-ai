import ReactMarkdown from "react-markdown";

function MessageBubble({ sender, text }) {
  const isUser = sender === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "75%",
          padding: "16px",
          borderRadius: "12px",
          background: isUser ? "#2563eb" : "#1f1f1f",
          color: "white",
          lineHeight: "1.8",
        }}
      >
        {isUser ? (
          text
        ) : (
          <ReactMarkdown>{text}</ReactMarkdown>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;