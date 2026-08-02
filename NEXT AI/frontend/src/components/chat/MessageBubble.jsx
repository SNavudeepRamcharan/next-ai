import { useState, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import toast from "react-hot-toast";

function MessageBubble({
  sender,
  text,
  time,
  regenerateResponse,
  onEdit,
}) {
  const [copied, setCopied] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  const isUser = sender === "user";
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  function speakText() {
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
  }

  function copyMessage() {
    navigator.clipboard.writeText(text);

    toast.success("Copied!");
setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "24px",
        padding: "0 20px",
      }}
    >
      <div
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0px)";
        }}
        style={{
          display: "inline-block",
          width: "fit-content",
          maxWidth: window.innerWidth < 900 ? "95%" : "78%",
          minWidth: "120px",

          padding: "12px 16px",

          borderRadius: "18px",
          background: isUser
            ? "linear-gradient(135deg,var(--accent),#3b82f6)"
            : "var(--card)",

          color: "var(--text)",
          border: "1px solid var(--border)",

          lineHeight: "1.6",

          overflow: "hidden",
          wordBreak: "break-word",
          transition: ".25s",
          boxShadow: "0 8px 20px rgba(0,0,0,.12)",
        }}
      >
        {isUser ? (
          <>
            <div
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
              }}

              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
              style={{
                fontSize: "13px",
                opacity: 0.75,
                marginBottom: "8px",
                fontWeight: "600",
                transition: ".2s",
              }}
            >
              👤 You
            </div>

            <div
              style={{
                whiteSpace: "pre-wrap",
                fontSize: "16px",
              }}
            >
              {text}
            </div>

            <div
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={onEdit}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.08)";
                }}

                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
                style={{
                  background: "var(--header)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  cursor: "pointer",
                  transition: ".2s",
                }}
              >
                ✏ Edit
              </button>
            </div>
          </>
        ) : (
          <>
            <div
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
              }}

              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
              style={{
                fontSize: "13px",
                opacity: 0.75,
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              🤖 Next AI
            </div>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");

                  return !inline && match ? (
                    <div style={{ position: "relative" }}>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            String(children).replace(/\n$/, "")
                          );

                          setCopied(true);

                          setTimeout(() => {
                            setCopied(false);
                          }, 1500);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.08)";
                        }}

                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "10px",
                          border: "none",
                          background: "var(--bg)",
                          color: "var(--text)",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          zIndex: 10,
                          transition: ".2s",
                        }}
                      >
                        {copied ? "✅ Copied" : "📋 Copy"}
                      </button>

                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                          overflowX: "auto",
                          borderRadius: "10px",
                          maxWidth: "100%",
                          transition: ".2s",
                        }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code
                      className={className}
                      {...props}
                      style={{
                        background: "var(--bg)",
                        color: "var(--text)",
                        padding: "2px 6px",
                        borderRadius: "5px",
                        transition: ".2s",
                      }}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {text}
            </ReactMarkdown>
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "12px",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => {
                  setLiked(true);
                  setDisliked(false);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
                style={{
                  background: liked ? "#16a34a" : "var(--header)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  transition: ".2s",
                  cursor: "pointer",
                }}
              >
                👍
              </button>

              <button
                onClick={() => {
                  setDisliked(true);
                  setLiked(false);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.08)";
                }}

                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
                style={{
                  background: disliked ? "#dc2626" : "var(--header)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  cursor: "pointer",
                  transition: ".2s",
                }}
              >
                👎
              </button>

              <button
                onClick={copyMessage}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
                style={{
                  background: "var(--header)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  transition: ".2s",
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                {copied ? "✅ Copied" : "📋 Copy"}
              </button>

              <button
                onClick={speakText}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.08)";
                }}

                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
                style={{
                  background: "var(--header)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  transition: ".2s",
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                🔊 Read
              </button>

              <button
                onClick={regenerateResponse}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.08)";
                }}

                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
                style={{
                  background: "var(--header)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  transition: ".2s",
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                🔄 Regenerate
              </button>
            </div>
          </>
        )}
        <div
          style={{
            fontSize: "11px",
            color: "var(--text)",
            opacity: 0.6,
            textAlign: "right",
            marginTop: "8px",
          }}
        >
          {time}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;