import { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import ThemePanel from "./ThemePanel";
import "./Header.css";

function Header({
  selectedModel,
  setSelectedModel,
  webSearch,
  setWebSearch,
  selectedPersona,
  setSelectedPersona,
}) {
  const [showThemes, setShowThemes] = useState(false);

  const { darkMode, toggleTheme } = useContext(ThemeContext);

  async function logout() {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <div className="header">
        <h2 className="header-title">
          ✦ Next AI
        </h2>

        <div className="header-actions">
          <button
            onClick={() => setShowThemes(!showThemes)}
            className="header-btn"
          >
            🎨 Themes
          </button>

          

          <button
            onClick={logout}
            className="header-btn logout-btn"
          >
            🚪 Logout
          </button>

          <button
  onClick={() => setWebSearch(!webSearch)}
  className={`header-btn web-btn ${webSearch ? "active" : ""}`}
>
            🌐 {webSearch ? "Web ON" : "Web OFF"}
          </button>

          <select
  value={selectedPersona}
  onChange={(e)=>setSelectedPersona(e.target.value)}
  className="header-select"
>
            <option value="general">🤖 General</option>
            <option value="coder">👨‍💻 Programmer</option>
            <option value="teacher">👨‍🏫 Teacher</option>
            <option value="doctor">🩺 Doctor</option>
            <option value="writer">🎨 Writer</option>
            <option value="friend">😂 Friend</option>
          </select>
        </div>
      </div>

      {showThemes && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            right: "20px",
            zIndex: 9999,
          }}
        >
          <ThemePanel />
        </div>
      )}
    </>
  );
}

export default Header;