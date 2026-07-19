import MessageBubble from "./MessageBubble";

function ChatWindow({ messages }) {
  return (
    <div
      style={{
        flex: 1,
        padding: "20px",
        overflowY: "auto",
      }}
    >
      {messages.length === 0 ? (
        <div
          style={{
            color: "#888",
            textAlign: "center",
            marginTop: "100px",
            fontSize: "22px",
          }}
        >
          👋 Welcome to <strong>Next AI</strong>
          <br />
          Ask me anything!
        </div>
      ) : (
        messages.map((msg, index) => (
          <MessageBubble
            key={index}
            sender={msg.sender}
            text={msg.text}
          />
        ))
      )}
    </div>
  );
}

export default ChatWindow;