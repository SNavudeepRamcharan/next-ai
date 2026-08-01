import { useState, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";


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

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          padding: "16px",
          borderRadius: "12px",
          background: isUser ? "var(--accent)" : "var(--card)",
          color: "var(--text)",
          border: "1px solid var(--border)",
          lineHeight: "1.8",
          overflow: "hidden",
          wordBreak: "break-word",
        }}
      >
        {isUser ? (
          <>
            <div>{text}</div>

            <div
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={onEdit}
                style={{
                  background: "var(--header)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                ✏ Edit
              </button>
            </div>
          </>
        ) : (
          <>
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
                style={{
                  background: liked ? "#16a34a" : "var(--header)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "6px 10px",
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
                style={{
                  background: disliked ? "#dc2626" : "var(--header)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                👎
              </button>

              <button
                onClick={copyMessage}
                style={{
                  background: "var(--header)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                {copied ? "✅ Copied" : "📋 Copy"}
              </button>

              <button
                onClick={speakText}
                style={{
                  background: "var(--header)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                🔊 Read
              </button>

              <button
                onClick={regenerateResponse}
                style={{
                  background: "var(--header)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
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