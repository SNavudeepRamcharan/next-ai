import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import Sidebar from "../sidebar/Sidebar";

function MainLayout({ children, newChat, openChat }) {
  const { darkMode } = useContext(ThemeContext);

  const [mobile, setMobile] = useState(window.innerWidth < 900);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 900);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 900;
      setMobile(isMobile);
      setSidebarOpen(!isMobile);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  if (window.innerWidth < 900) {
  return null;
}

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: darkMode ? "#343541" : "#f8f8f8",
        color: darkMode ? "white" : "black",
        overflow: "hidden",
      }}
    >
      {mobile && sidebarOpen && (
  <div
    onClick={() => setSidebarOpen(false)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.4)",
      zIndex: 999,
    }}
  />
)}
      {(!mobile || sidebarOpen) && (
        <Sidebar
          newChat={newChat}
          openChat={openChat}
          mobile={mobile}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      )}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: darkMode ? "#343541" : "#f8f8f8",
          position: "relative",
        }}
      >
        {mobile && (
          <div
            style={{
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderBottom: "1px solid var(--border)",
              background: "var(--header)",
              position: "sticky",
              top: 0,
              zIndex: 100,
            }}
          >
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                position: "absolute",
                left: "16px",
                border: "none",
                background: "transparent",
                color: "var(--text)",
                fontSize: "26px",
                cursor: "pointer",
              }}
            >
              ☰
            </button>

            <h2
              style={{
                margin: 0,
                fontSize: "22px",
              }}
            >
              ✦ Next AI
            </h2>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

export default MainLayout;