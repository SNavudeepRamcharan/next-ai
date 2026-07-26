import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

function ChatWindow({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

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
        <>
          {messages.map((msg, index) => (
            <MessageBubble
              key={index}
              sender={msg.sender}
              text={msg.text}
              time={msg.time}
            />
          ))}

          <div ref={bottomRef} />
        </>
      )}
    </div>
  );
}

export default ChatWindow;