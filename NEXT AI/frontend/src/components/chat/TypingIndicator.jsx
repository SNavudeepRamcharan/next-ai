import "./TypingIndicator.css";

function TypingIndicator() {
  return (
    <div className="typing-wrapper">
      <div className="typing-card">

        <div className="typing-avatar">
          🤖
        </div>

        <div className="typing-content">

          <div className="typing-title">
            Next AI
          </div>

          <div className="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>

        </div>

      </div>
    </div>
  );
}

export default TypingIndicator;