import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ShareChat() {
  const { id } = useParams();

  const API = import.meta.env.VITE_API_URL;

  const [chat, setChat] = useState(null);

  useEffect(() => {
    async function load() {
      const response = await fetch(`${API}/history/share/${id}`);

      const data = await response.json();

      setChat(data);
    }

    load();
  }, []);

  if (!chat)
    return (
      <div style={{ padding: "40px" }}>
        Loading...
      </div>
    );

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <h1>{chat.chat.title}</h1>

      {chat.messages.map((msg, index) => (
        <div
          key={index}
          style={{
            marginBottom: "20px",
            padding: "15px",
            borderRadius: "10px",
            background:
              msg.role === "user"
                ? "#2563eb"
                : "#1f1f1f",
            color: "white",
          }}
        >
          <strong>{msg.role}</strong>

          <p>{msg.content}</p>
        </div>
      ))}
    </div>
  );
}

export default ShareChat;