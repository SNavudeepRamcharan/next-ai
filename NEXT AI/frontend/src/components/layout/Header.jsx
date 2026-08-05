import React, { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import ThemePanel from "./ThemePanel";
import "./Header.css";

function Header({
  selectedModel,
  setSelectedModel,
  webSearch,
  setWebSearch,
  selectedPersona,
  setSelectedPersona,
  logout
}) {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [showThemes, setShowThemes] = useState(false);

  return (
    <>
      <header className="header">
        <h2 className="header-title">✦ Next AI</h2>

        <div className="header-actions">
          <button
            className="header-btn"
            onClick={() => setShowThemes((prev) => !prev)}
          >
            🎨 Themes
          </button>

          <button
            className="header-btn"
            onClick={toggleTheme}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <button
            className={`header-btn ${webSearch ? "web-active" : ""}`}
            onClick={() => setWebSearch(!webSearch)}
          >
            🌐 Web
          </button>

          <select
            className="header-select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="openai/gpt-4.1-mini">
              GPT-4.1 Mini
            </option>
            <option value="google/gemini-2.5-flash">
              Gemini Flash
            </option>
          </select>

          <select
            className="header-select"
            value={selectedPersona}
            onChange={(e) => setSelectedPersona(e.target.value)}
          >
            <option value="general">General</option>
            <option value="coder">Coder</option>
            <option value="teacher">Teacher</option>
            <option value="doctor">Doctor</option>
            <option value="writer">Writer</option>
            <option value="friend">Friend</option>
          </select>

          <button
            className="header-btn logout-btn"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      {showThemes && (
        <div className="theme-popup">
          <ThemePanel />
        </div>
      )}
    </>
  );
}

export default Header;