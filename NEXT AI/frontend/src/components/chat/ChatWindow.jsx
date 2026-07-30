import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

function ChatWindow({
  messages,
  editMessage,
  regenerateResponse,
}) {
  const bottomRef = useRef(null);
  const { darkMode } = useContext(ThemeContext);

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
        background: darkMode ? "#343541" : "#ffffff",
      }}
    >
      {messages.length === 0 ? (
        <div
          style={{
            background: darkMode ? "#343541" : "#ffffff",
            color: darkMode ? "#aaa" : "#555",
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
              regenerateResponse={regenerateResponse}
              onEdit={() => editMessage(index)}
            />
          ))}
          <div ref={bottomRef} />
        </>
      )}
    </div>
  );
}

export default ChatWindow;