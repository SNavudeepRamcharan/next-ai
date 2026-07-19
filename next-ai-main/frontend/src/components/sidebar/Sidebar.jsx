function Sidebar() {
  const chats = [
    "New Chat",
    "React Help",
    "Python Notes",
    "AI Models",
  ];

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
      {/* Logo */}
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

      {/* New Chat Button */}
      <button
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

      {/* Chat List */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 10px",
        }}
      >
        {chats.map((chat, index) => (
          <div
            key={index}
            style={{
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "8px",
              background: "#2a2b32",
              cursor: "pointer",
            }}
          >
            💬 {chat}
          </div>
        ))}
      </div>

      {/* Footer */}
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