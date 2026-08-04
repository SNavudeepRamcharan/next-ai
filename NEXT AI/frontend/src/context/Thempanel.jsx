export default function ThemePanel() {
  return (
    <div
      style={{
        width: "300px",
        padding: "20px",
        background: "#222",
        color: "white",
        borderRadius: "12px",
      }}
    >
      <h3>Hello Theme Panel</h3>
      <button>Dark</button>
      <button>Light</button>
    </div>
  );
}