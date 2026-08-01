import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import "./ChatWindow.css";

function ChatWindow({
  messages,
  editMessage,
  regenerateResponse,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="chat-window">
      {messages.length === 0 ? (
        <div className="welcome-screen">
          <div className="welcome-icon">🤖</div>

          <h1>Welcome to Next AI</h1>

          <p>How can I help you today?</p>
        </div>
      ) : (
        <>
          {messages.map((msg, index) => (
            <MessageBubble
              key={index}
              sender={msg.sender}
              text={msg.text}
              time={msg.time}
              regenerateResponse={regenerateResponse}
              onEdit={() => editMessage(index)}
            />
          ))}

          <div ref={bottomRef}></div>
        </>
      )}
    </div>
  );
}

export default ChatWindow;