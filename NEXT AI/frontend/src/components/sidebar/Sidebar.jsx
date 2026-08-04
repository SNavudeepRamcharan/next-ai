import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import "./Sidebar.css";

function Sidebar({ newChat, openChat }) {
  const { darkMode } = useContext(ThemeContext);
  const API = import.meta.env.VITE_API_URL;

  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);


  async function logout() {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  }

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
      toast.success("Share link copied!");
    } else {
      alert("Sharing disabled.");
    }

    loadChats();
  }

  const menuStyle = {
    background: "var(--card)",
    color: "var(--text)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "10px 14px",
    cursor: "pointer",
    textAlign: "left",
    transition: ".2s",
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        ✦ Next AI
      </div>

      <button
        onClick={newChat}
        className="new-chat"
      >
        ➕ New Chat
      </button>

      <input
        type="text"
        placeholder="🔍 Search chats..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      <div className="chat-list">
        {chats
          .filter((chat) =>
            chat.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((chat) => (
            <div
              key={chat.id}
              className="chat-item"
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
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      border: "none",
                      background: "transparent",
                      color: "var(--text)",
                      cursor: "pointer",
                      transition: ".2s",
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

      <div className="sidebar-footer">
        Next AI v2
      </div>
    </div>
  );
}

export default Sidebar;