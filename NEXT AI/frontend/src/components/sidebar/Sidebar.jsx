import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import "./Sidebar.css";

import toast from "react-hot-toast";
import ThemePanel from "../layout/ThemePanel";

function Sidebar({
  newChat,
  openChat,
  mobile,
  sidebarOpen,
  setSidebarOpen,

  webSearch,
  setWebSearch,

  selectedPersona,
  setSelectedPersona,

  showThemes,
  setShowThemes,
}) {
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
    <>
      {mobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.30)",
            backdropFilter: "blur(4px)",
            zIndex: 999,
          }}
        />
      )}

      <div
        className="sidebar"
        style={{
          position: mobile ? "fixed" : "relative",
          left: mobile ? (sidebarOpen ? "0" : "-85vw") : "0",
          width: mobile ? "80vw" : "320px",
          maxWidth: "320px",
          top: 0,
          height: "100vh",

          display: "flex",
          flexDirection: "column",

          zIndex: 1000,
          transition: "left .28s cubic-bezier(.22,.61,.36,1)",
          flexShrink: 0,
        }}
      >
        <div
          className="sidebar-header"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "18px",
            fontWeight: "700",
          }}
        >
          <span style={{ fontSize: "26px" }}>✨</span>
          <div>
            <div>Next AI</div>
            <div
              style={{
                fontSize: "11px",
                opacity: 0.6,
                fontWeight: 400,
              }}
            >
              Your AI Workspace
            </div>
          </div>
        </div>

        <button
          onClick={newChat}
          className="new-chat"
        >
          ➕ New Chat
        </button>

        <div
          style={{
            padding: "0 16px 18px",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,.12)",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "18px",
                opacity: 0.6,
                pointerEvents: "none",
              }}
            >
              🔍
            </span>

            <input
              type="text"
              placeholder="Search chats..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                height: "50px",
                paddingLeft: "48px",
                paddingRight: "16px",
                border: "none",
                outline: "none",
                background: "transparent",
                color: "var(--text)",
                fontSize: "15px",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        <div className="chat-list">
          {chats
            .filter((chat) =>
              chat.title.toLowerCase().includes(search.toLowerCase())
            )
            .map((chat) => (
              <div
                key={chat.id}
                className="chat-item"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(4px)";
                  e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,.18)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                style={{
                  transition: ".25s",
                  borderRadius: "14px",
                  padding: "10px",
                  marginBottom: "10px",
                  background: "var(--card)",
                  border: "1px solid var(--border)",
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

                      if (mobile) setSidebarOpen(false);
                    }}
                    style={{
                      cursor: "pointer",
                      flex: 1,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      fontSize: "15px",
                      fontWeight: "500",
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
                      marginTop: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      background: "var(--header)",
                      padding: "10px",
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
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
            marginTop: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <button
            className="new-chat"
            onClick={() => setShowThemes(!showThemes)}
          >
            🎨 Themes
          </button>

          {showThemes && (
            <div
              style={{
                position: "absolute",
                bottom: "90px",
                left: "15px",
                zIndex: 2000,
              }}
            >
              <ThemePanel />
            </div>
          )}

          <button
            className="new-chat"
            onClick={() => setWebSearch(!webSearch)}
          >
            🌐 {webSearch ? "Web ON" : "Web OFF"}
          </button>

          <select
            value={selectedPersona}
            onChange={(e) => setSelectedPersona(e.target.value)}
            className="search-box"
          >
            <option value="general">🤖 General</option>
            <option value="coder">👨‍💻 Programmer</option>
            <option value="teacher">👨‍🏫 Teacher</option>
            <option value="doctor">🩺 Doctor</option>
            <option value="writer">✍️ Writer</option>
            <option value="friend">😂 Friend</option>
          </select>

          <button
            className="new-chat"
            style={{ background: "#a44e5b" }}
            onClick={logout}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;