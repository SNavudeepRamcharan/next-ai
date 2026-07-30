import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import Sidebar from "../sidebar/Sidebar";

function MainLayout({ children, newChat, openChat }) {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: darkMode ? "#343541" : "#f8f8f8",
        color: darkMode ? "white" : "black",
      }}
    >
      <Sidebar
        newChat={newChat}
        openChat={openChat}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: darkMode ? "#343541" : "#f8f8f8",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default MainLayout;