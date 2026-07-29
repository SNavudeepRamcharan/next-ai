function TypingIndicator() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        margin: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "6px",
          padding: "12px 18px",
          borderRadius: "15px",
          background: "#2b2b2b",
        }}
      >
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
}

export default TypingIndicator;