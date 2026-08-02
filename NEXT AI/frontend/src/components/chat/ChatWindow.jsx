import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import "./ChatWindow.css";

function ChatWindow({
  messages,
  editMessage,
  regenerateResponse,
}) {
  const [mobile, setMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const resize = () => setMobile(window.innerWidth < 900);

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);
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
            marginTop: mobile ? "24px" : "40px",
            minHeight: "100%",
          }}
        >
          <div
            style={{
              fontSize: mobile ? "48px" : "72px",
              marginBottom: "20px",
            }}
          >
            ✨
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: mobile ? "30px" : "42px",
            }}
          >
            Welcome to Next AI
          </h1>

          <p
            style={{
              marginTop: "18px",
              fontSize: mobile ? "15px" : "18px",
              opacity: ".7",
              maxWidth: "650px",
              lineHeight: "1.5",
            }}
          >
            Ask anything, upload files, generate images,
            search the web, or simply chat naturally.
          </p>

          <div
            style={{
              padding: mobile ? "20px" : "40px",
              display: "grid",
              gridTemplateColumns:
                mobile
                  ? "1fr"
                  : "repeat(2,1fr)",
              gap: mobile ? "10px" : "16px",
              width: "100%",
              maxWidth: "700px",
            }}
          >
            {[
              "💻 Explain React",
              "🌍 AI News",
              "🎨 Generate Image",
              "📄 Summarize PDF",
            ].map((item) => (
              <div
                key={item}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  padding:
                    mobile
                      ? "12px"
                      : "20px",
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