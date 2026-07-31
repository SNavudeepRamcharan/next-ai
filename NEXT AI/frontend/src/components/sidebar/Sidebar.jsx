import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

import { useEffect, useState } from "react";

function Sidebar({ newChat, openChat }) {
  const { darkMode } = useContext(ThemeContext);
  const API = import.meta.env.VITE_API_URL;

  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);

  async function loadChats() {
    try {
      const response = await fetch(`${API}/history/chats`);
      const data = await response.json();
      setChats(
        data.sort((a, b) => {
          if (a.pinned === b.pinned) return 0;
          return a.pinned ? -1 : 1;
        })
      );
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadChats();

    const interval = setInterval(loadChats, 2000);

    return () => clearInterval(interval);
  }, []);

  async function renameChat(chat) {
    const title = prompt("Enter new chat title", chat.title);

    if (!title) return;

    await fetch(`${API}/history/chat/${chat.id}`, {
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

    await fetch(`${API}/history/chat/${id}`, {
      method: "DELETE",
    });

    loadChats();
  }

  // NEW FUNCTION
  async function pinChat(id) {
    await fetch(`${API}/history/chat/${id}/pin`, {
      method: "PATCH",
    });

    loadChats();
  }
  async function shareChat(id) {
    const response = await fetch(`${API}/history/share/${id}`, {
      method: "PUT",
    });

    const data = await response.json();

    if (data.shared) {
      navigator.clipboard.writeText(data.url);
      alert("🔗 Share link copied!");
    } else {
      alert("Sharing disabled.");
    }

    loadChats();
  }

  const menuStyle = {
    background: "#343541",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "8px",
    cursor: "pointer",
    textAlign: "left",
  };

  return (
    <div
      style={{
        width: "270px",
        height: "100vh",
        background: darkMode ? "#202123" : "#f3f3f3",
        color: darkMode ? "white" : "black",
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

      <input
        type="text"
        placeholder="🔍 Search chats..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          margin: "0 15px 15px",
          padding: "10px",
          borderRadius: "8px",
          border: "none",
          outline: "none",
          background: darkMode ? "#232534" : "white",
          color: darkMode ? "white" : "black",
          border: darkMode ? "none" : "1px solid #ccc",
        }}
      />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
        }}
      >
        {chats
          .filter((chat) =>
            chat.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((chat) => (
            <div
              key={chat.id}
              style={{
                background: darkMode ? "#2a2b32" : "#ffffff",
                color: darkMode ? "white" : "black",
                border: darkMode ? "none" : "1px solid #ddd",
                borderRadius: "8px",
                marginBottom: "10px",
                padding: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  onClick={() => openChat(chat.id)}
                  style={{
                    cursor: "pointer",
                    fontWeight: "bold",
                    flex: 1,
                  }}
                >
                  {chat.pinned ? "⭐ " : "💬 "}
                  {chat.title}
                </div>

                <button
                  onClick={() =>
                    setMenuOpen(menuOpen === chat.id ? null : chat.id)
                  }
                  style={{
                    background: "transparent",
                    color: darkMode ? "white" : "black",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  ⋮
                </button>
              </div>

              {menuOpen === chat.id && (
                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <button
                    onClick={() => {
                      renameChat(chat);
                      setMenuOpen(null);
                    }}
                    style={menuStyle}
                  >
                    ✏ Rename
                  </button>

                  <button
                    onClick={() => {
                      pinChat(chat.id);
                      setMenuOpen(null);
                    }}
                    style={menuStyle}
                  >
                    {chat.pinned ? "📍 Unpin" : "📌 Pin"}
                  </button>
                  <button
                    onClick={() => {
                      shareChat(chat.id);
                      setMenuOpen(null);
                    }}
                    style={menuStyle}
                  >
                    🔗 Share
                  </button>
                  <button
                    onClick={() => {
                      deleteChat(chat.id);
                      setMenuOpen(null);
                    }}
                    style={menuStyle}
                  >
                    🗑 Delete
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>

      <div
        style={{
          padding: "20px",
          borderTop: "1px solid #333",
          color: darkMode ? "#888" : "#555",
        }}
      >
        Next AI v2
      </div>
    </div>
  );
}

export default Sidebar;