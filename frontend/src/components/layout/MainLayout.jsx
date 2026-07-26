import Sidebar from "./Sidebar";

function MainLayout({
  children,
  newChat,
  chats,
  activeChat,
  setActiveChat,
}) {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#111",
      }}
    >
      <Sidebar
        newChat={newChat}
        chats={chats}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default MainLayout;