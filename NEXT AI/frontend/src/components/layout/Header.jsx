import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

function Header({
  selectedModel,
  setSelectedModel,
  webSearch,
  setWebSearch,
}) {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <div
      style={{
  height: "70px",
  borderBottom: darkMode ? "1px solid #333" : "1px solid #ddd",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 25px",
  background: darkMode ? "#131314" : "#ffffff",
  color: darkMode ? "white" : "black",
}}
    >
      <h2>✦ Next AI</h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <button
  onClick={toggleTheme}
style={{
  background: darkMode ? "#2a2b32" : "#ffffff",
  color: darkMode ? "white" : "black",
  padding: "10px",
  borderRadius: "8px",
  border: darkMode ? "1px solid #444" : "1px solid #ccc",
  fontSize: "15px",
}}
>
  {darkMode ? "☀️" : "🌙"}
</button>
        <button
          onClick={() => setWebSearch(!webSearch)}
          style={{
            background: webSearch ? "#10a37f" : "#444",
            color: "white",
            border: "none",
            padding: "10px 14px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          🌐 {webSearch ? "Web ON" : "Web OFF"}
        </button>


        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          style={{
            background: "#2a2b32",
            color: "white",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #444",
            fontSize: "15px",
          }}
        >
          <option value="openai/gpt-4.1-mini">
            GPT-4.1 Mini
          </option>

          <option value="deepseek/deepseek-chat-v3.1">
            DeepSeek V3.1
          </option>

          <option value="google/gemini-2.5-flash">
            Gemini 2.5 Flash
          </option>

          <option value="anthropic/claude-sonnet-4">
            Claude Sonnet 4
          </option>

          <option value="meta-llama/llama-4-maverick">
            Llama 4 Maverick
          </option>
        </select>
      </div>
    </div>
  );
}

export default Header;