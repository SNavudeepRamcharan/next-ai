import { useState, useEffect } from "react";
import Sidebar from "../sidebar/Sidebar";

function MainLayout({
  children,
  newChat,
  openChat,
}) {
  const [mobile, setMobile] = useState(window.innerWidth < 900);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 900;
      setMobile(isMobile);

      if (!isMobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100dvh",
overflow: "hidden",
        overflow: "hidden",
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <Sidebar
        mobile={mobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        newChat={newChat}
        openChat={openChat}
      />

      <main
  style={{
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    background: "var(--bg)",
    color: "var(--text)",
  }}
>
        {mobile && (
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              position: "fixed",
              top: 15,
              left: 15,
              zIndex: 1001,
              width: 45,
              height: 45,
              borderRadius: 12,
              border: "none",
              background: "#2563eb",
              color: "white",
              fontSize: 22,
              cursor: "pointer",
            }}
          >
            ☰
          </button>
        )}

        {children}
      </main>
    </div>
  );
}

export default MainLayout;