import { useState } from "react";
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
        background: "#2d2d2d",
        color: "white",
        border: "none",
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
                          background: "#333",
                          color: "white",
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
      background: liked ? "#16a34a" : "#2d2d2d",
      color: "white",
      border: "none",
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
      background: disliked ? "#dc2626" : "#2d2d2d",
      color: "white",
      border: "none",
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
      background: "#2d2d2d",
      color: "white",
      border: "none",
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
      background: "#2d2d2d",
      color: "white",
      border: "none",
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
    background: "#2d2d2d",
    color: "white",
    border: "none",
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