import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import Sidebar from "../sidebar/Sidebar";
import { useState, useEffect } from "react";

function MainLayout({ children, newChat, openChat }) {
  const { darkMode } = useContext(ThemeContext);

  const [mobile, setMobile] = useState(window.innerWidth < 900);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {

    const resize = () => setMobile(window.innerWidth < 900);

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);

  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <Sidebar
        newChat={newChat}
        openChat={openChat}
        mobile={mobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main
  style={{
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    background: "var(--bg)",
    overflow: "hidden",
    margin: 0,
    padding: 0,
  }}
>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            height: "100vh",
          }}
        >
          {children}
          {mobile && (

            <button

              onClick={() => setSidebarOpen(true)}

              style={{

                position: "fixed",

                top: 16,

                left: 16,

                zIndex: 2000,

                width: 50,

                height: 50,

                borderRadius: "50%",

                border: "none",

                background: "var(--accent)",

                color: "white",

                fontSize: 24,

                cursor: "pointer",

                boxShadow: "0 8px 20px rgba(0,0,0,.3)"

              }}

            >

              ☰

            </button>

          )}
        </div>
      </main>
    </div>
  );
}

export default MainLayout;