import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";


function MessageBubble({ sender, text , time}) {
  const [copied, setCopied] = useState(false);
  
  const isUser = sender === "user";
  const [liked, setLiked] = useState(false);
const [disliked, setDisliked] = useState(false);

function speakText() {
  const speech = new SpeechSynthesisUtterance(text);
  speech.rate = 1;
  speech.pitch = 1;
  speech.volume = 1;
  window.speechSynthesis.speak(speech);
}

function copyMessage() {
  navigator.clipboard.writeText(text);
  alert("Copied!");
}

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "75%",
          padding: "16px",
          borderRadius: "12px",
          background: isUser ? "#2563eb" : "#1f1f1f",
          color: "white",
          lineHeight: "1.8",
          overflowX: "auto",
        }}
      >
        {isUser ? (
          text
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
                          background: "#333",
                          color: "white",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          zIndex: 10,
                        }}
                      >
                        {copied ? "Copied!" : "Copy"}
                      </button>

                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
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
                        background: "#333",
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
                gap: "8px",
                marginTop: "10px",
              }}
            >
              <button
                onClick={() => {
                  setLiked(true);
                  setDisliked(false);
                }}
              >
                👍
              </button>

              <button
                onClick={() => {
                  setDisliked(true);
                  setLiked(false);
                }}
              >
                👎
              </button>

              <button onClick={copyMessage}>
                📋
              </button>

              <button onClick={speakText}>
                🔊
              </button>
            </div>
          </>
        )}
        <div
  style={{
    fontSize: "11px",
    color: "#aaa",
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