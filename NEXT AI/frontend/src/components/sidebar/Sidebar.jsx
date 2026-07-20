import { useEffect, useState } from "react";

function Sidebar({ newChat, openChat }) {
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

  async function renameChat(chat) {
    const title = prompt("Enter new chat title", chat.title);

    if (!title) return;

    await fetch(`http://127.0.0.1:8000/history/chat/${chat.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
      }),
    });

    loadChats();
  }

  async function deleteChat(id) {
    if (!window.confirm("Delete this chat?")) return;

    await fetch(`http://127.0.0.1:8000/history/chat/${id}`, {
      method: "DELETE",
    });

    loadChats();
  }

  return (
    <div
      style={{
        width: "270px",
        height: "100vh",
        background: "#202123",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "20px",
          fontWeight: "bold",
          fontSize: "24px",
          borderBottom: "1px solid #333",
        }}
      >
        ✦ Next AI
      </div>

      <button
        onClick={newChat}
        style={{
          margin: "15px",
          padding: "12px",
          border: "none",
          borderRadius: "8px",
          background: "#10a37f",
          color: "white",
          cursor: "pointer",
        }}
      >
        ➕ New Chat
      </button>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
        }}
      >
        {chats.map((chat) => (
          <div
            key={chat.id}
            style={{
              background: "#2a2b32",
              borderRadius: "8px",
              marginBottom: "10px",
              padding: "10px",
            }}
          >
            <div
              onClick={() => openChat(chat.id)}
              style={{
                cursor: "pointer",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              💬 {chat.title}
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
              }}
            >
              <button
                onClick={() => renameChat(chat)}
                style={{
                  flex: 1,
                  background: "#3b82f6",
                  border: "none",
                  color: "white",
                  padding: "6px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                ✏️ Rename
              </button>

              <button
                onClick={() => deleteChat(chat.id)}
                style={{
                  flex: 1,
                  background: "#dc2626",
                  border: "none",
                  color: "white",
                  padding: "6px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: "20px",
          borderTop: "1px solid #333",
          color: "#888",
        }}
      >
        Next AI v2
      </div>
    </div>
  );
}

export default Sidebar;