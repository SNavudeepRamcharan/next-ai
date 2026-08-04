import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

import { useEffect, useState } from "react";

import "./Sidebar.css";

function Sidebar({
  newChat,
  openChat,
  mobile,
  sidebarOpen,
  setSidebarOpen,
}) {
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
  className="sidebar"
  style={{
    position: mobile ? "fixed" : "relative",
    left: mobile ? 0 : "auto",
    top: 0,
    width: "320px",
    height: "100vh",
    zIndex: 1000,
    transform:
      mobile && !sidebarOpen
        ? "translateX(-100%)"
        : "translateX(0)",
    transition: "transform .3s ease",
  }}
>
      <div className="sidebar-header">
        ✦ Next AI
      </div>

      <button
        onClick={() => {
  newChat();

  if (mobile) {
    setSidebarOpen(false);
  }
}}
        className="new-chat"
        style={{
          margin: "0 18px 20px",
          boxSizing: "border-box",
          width: "calc(100% - 36px)",
          height: "54px",
          borderRadius: "16px",
          fontSize: "17px",
          fontWeight: "600",
          cursor: "pointer",
          transition: ".25s",
        }}
      >
        ➕ New Chat
      </button>
      <div
        style={{
          padding: "0 18px 18px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-box"
          style={{
            width: "100%",
            height: "48px",
            padding: "0 16px",
            boxSizing: "border-box",
            background: "var(--card)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            outline: "none",
            fontSize: "15px",
          }}
        />
      </div>

      <div
        className="chat-list"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 16px",
        }}
      >
        {chats
          .filter((chat) =>
            chat.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((chat) => (
            <div
              key={chat.id}
              className="chat-item"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                marginBottom: "10px",
                padding: "12px",
                transition: "all .2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateX(4px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateX(0)";
                e.currentTarget.style.boxShadow = "none";
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
                  onClick={() => {
  openChat(chat.id);

  if (mobile) {
    setSidebarOpen(false);
  }
}}
                  style={{
                    cursor: "pointer",
                    flex: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontWeight: "600",
                  }}
                >
                  {chat.pinned ? "📌 " : "💬 "}
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
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "var(--header)",
                    padding: "10px 12px",
                    borderRadius: "12px",
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
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span style={{ fontSize: "26px" }}>✨</span>

        <div>
          <div
            style={{
              fontWeight: 700,
              fontSize: "18px",
            }}
          >
            Next AI
          </div>

          <div
            style={{
              opacity: .6,
              fontSize: "12px",
            }}
          >
            v2
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;