import { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import "./Header.css";
import { useEffect } from "react";

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

        {!mobile && (
          <div
            className="header-actions"
          >
            

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
        )}
      </div>

      
    </>
  );
}

export default Header;