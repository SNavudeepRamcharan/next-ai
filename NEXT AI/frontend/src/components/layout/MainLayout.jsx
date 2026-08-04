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

      if (!isMobile) {
        setSidebarOpen(true);
      } else {
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
        height: "100vh",
        background: darkMode ? "#343541" : "#f8f8f8",
        color: darkMode ? "white" : "black",
        overflow: "hidden",
      }}
    >
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
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default MainLayout;