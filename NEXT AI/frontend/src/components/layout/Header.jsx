import { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import "./Header.css";
import { useEffect } from "react";
const [showThemes, setShowThemes] = useState(false);

function Header({
  selectedModel,
  setSelectedModel,
  webSearch,
  setWebSearch,
  selectedPersona,
  setSelectedPersona,
  logout,
  showThemes,
  setShowThemes,
}) {
  const [mobile, setMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const resize = () => setMobile(window.innerWidth < 900);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const { darkMode, toggleTheme } = useContext(ThemeContext);

return (
  <>
    <div className="header">
      <h2
        className="header-title"
        style={{
          fontSize: mobile ? "22px" : "30px",
          margin: 0,
        }}
      >
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
          onClick={toggleTheme}
          className="header-btn"
        >
          {darkMode ? "☀️" : "🌙"}
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
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="header-select"
        >
          <option value="gemini-3.5-flash">
            Gemini 3.5 Flash
          </option>
        </select>

        <select
          value={selectedPersona}
          onChange={(e) => setSelectedPersona(e.target.value)}
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

    {/* Theme Panel */}
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