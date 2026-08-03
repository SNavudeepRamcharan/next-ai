import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import Sidebar from "../sidebar/Sidebar";
import { useState, useEffect } from "react";

function MainLayout({
children,
newChat,
openChat,

webSearch,
setWebSearch,

selectedPersona,
setSelectedPersona,

logout,
showThemes,
setShowThemes
}) {
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
            height:"100vh",
paddingTop:mobile ? "64px" : 0
          }}
        >
          {children}
          {mobile && (
<div
    style={{
        position:"fixed",
        top:0,
        left:0,
        right:0,
        height:"64px",
        background:"var(--header)",
        borderBottom:"1px solid var(--border)",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        zIndex:2000
    }}
>
    <button
        onClick={()=>setSidebarOpen(true)}
        style={{
            position:"absolute",
            left:"16px",
            width:"46px",
            height:"46px",
            border:"none",
            borderRadius:"50%",
            background:"var(--accent)",
            color:"#fff",
            fontSize:"24px",
            cursor:"pointer"
        }}
    >
        ☰
    </button>

    <h2
        style={{
            margin:0,
            fontSize:"30px",
            fontWeight:700
        }}
    >
        ✦ Next AI
    </h2>
</div>
)}
        </div>
      </main>
    </div>
  );
}

export default MainLayout;