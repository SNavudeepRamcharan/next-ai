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
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            textAlign: "center",
            color: "var(--text)",
            padding: "40px",
            minHeight: "100%",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              marginBottom: "20px",
            }}
          >
            ✨
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "42px",
            }}
          >
            Welcome to Next AI
          </h1>

          <p
            style={{
              marginTop: "18px",
              fontSize: "18px",
              opacity: ".7",
              maxWidth: "650px",
              lineHeight: "1.7",
            }}
          >
            Ask anything, upload files, generate images,
            search the web, or simply chat naturally.
          </p>

          <div
            style={{
              marginTop: "40px",
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: "16px",
              width: "100%",
              maxWidth: "700px",
            }}
          >
            {[
              "💻 Explain React hooks",
              "🌍 Search today's AI news",
              "🎨 Generate a futuristic city",
              "📄 Summarize my PDF",
            ].map((item) => (
              <div
                key={item}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "18px",
                  padding: "clamp(10px,2vw,20px)",
                  cursor: "pointer",
                  transition: ".25s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {item}
              </div>
            ))}
          </div>
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