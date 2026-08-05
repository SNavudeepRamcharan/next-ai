import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import "./ThemePanel.css";

const themes = [
  ["dark", "🌙"],
  ["light", "☀️"],
  ["ocean", "🌊"],
  ["forest", "🌲"],
  ["purple", "💜"],
  ["sakura", "🌸"],
  ["coffee", "☕"],
  ["amoled", "🖤"],
  ["cyberpunk", "⚡"],
  ["dracula", "🦇"],
];

export default function ThemePanel() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className="theme-panel">
      <h3>🎨 Themes</h3>

      <div className="theme-grid">
        {themes.map(([name, icon]) => (
          <button
            key={name}
            className={`theme-btn ${theme === name ? "active" : ""}`}
            onClick={() => setTheme(name)}
          >
            <span>{icon}</span>
            <span>{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}