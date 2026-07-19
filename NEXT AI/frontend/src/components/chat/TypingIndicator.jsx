function TypingIndicator() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          background: "#1f1f1f",
          color: "#aaa",
          padding: "14px 18px",
          borderRadius: "12px",
          fontSize: "16px",
        }}
      >
        🤖 Next AI is thinking...
      </div>
    </div>
  );
}

export default TypingIndicator;