function Header({ selectedModel, setSelectedModel }) {
  return (
    <div
      style={{
        height: "70px",
        borderBottom: "1px solid #333",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 25px",
        background: "#131314",
        color: "white",
      }}
    >
      <h2>✦ Next AI</h2>

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
  );
}

export default Header;