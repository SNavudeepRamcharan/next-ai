import React, { useContext, useState, useRef, useEffect } from "react";
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
  logout,
}) {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const [showThemes, setShowThemes] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const themeRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        (!themeRef.current ||
          !themeRef.current.contains(event.target))
      ) {
        setShowMenu(false);
        setShowThemes(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <>
      <header className="header">

        {/* Logo */}
        <h2 className="header-title">✦ Next AI</h2>

        {/* Desktop Header */}
        <div className="header-actions desktop-actions">

          <button
            className="header-btn"
            onClick={() => setShowThemes(!showThemes)}
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

        {/* Mobile Menu */}
        <button
          className="mobile-menu-btn"
          onClick={() => setShowMenu(!showMenu)}
        >
          ⋮
        </button>

      </header>

      {/* Mobile Popup */}
      {showMenu && (
        <div
          ref={menuRef}
          className="mobile-popup"
        >

          <button onClick={() => setShowThemes(true)}>
            🎨 Themes
          </button>

          <button onClick={toggleTheme}>
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          <button onClick={() => setWebSearch(!webSearch)}>
            🌐 {webSearch ? "Web ON" : "Web OFF"}
          </button>

          <select
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

          <button onClick={logout}>
            🚪 Logout
          </button>

        </div>
      )}

      {showThemes && (
  <div
    ref={themeRef}
    className="theme-popup"
  >
    <ThemePanel />
  </div>
)}
    </>
  );
}

export default Header;