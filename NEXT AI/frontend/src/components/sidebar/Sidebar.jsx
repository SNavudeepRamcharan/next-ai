import { useEffect, useState } from "react";

function Sidebar({ newChat }) {
  const [chats, setChats] = useState([]);

  async function loadChats() {
    try {
      const response = await fetch("http://127.0.0.1:8000/history/chats");

      const data = await response.json();

      setChats(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadChats();
  }, []);

  return (
    <div
      style={{
        width: "260px",
        height: "100vh",
        background: "#202123",
        color: "white",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #333",
      }}
    >
      <div
        style={{
          padding: "20px",
          fontSize: "24px",
          fontWeight: "bold",
          borderBottom: "1px solid #333",
        }}
      >
        ✦ Next AI
      </div>

      <button
        onClick={newChat}
        style={{
          margin: "20px",
          padding: "12px",
          background: "#10a37f",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        ➕ New Chat
      </button>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 10px",
        }}
      >
        {chats.length === 0 ? (
          <div
            style={{
              color: "#888",
              padding: "10px",
            }}
          >
            No chats yet
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              style={{
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "8px",
                background: "#2a2b32",
                cursor: "pointer",
              }}
            >
              💬 {chat.title}
            </div>
          ))
        )}
      </div>

      <div
        style={{
          padding: "20px",
          borderTop: "1px solid #333",
          color: "#999",
        }}
      >
        ⚙️ Settings
      </div>
    </div>
  );
}

export default Sidebar;