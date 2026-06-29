const PHRASES = [
  "Hello, how are you?",
  "Thank you very much",
  "Where is the nearest station?",
  "How much does this cost?",
  "I need help",
  "Good morning",
  "Nice to meet you",
  "Can you speak slowly?",
  "I don't understand",
  "Where is the bathroom?",
];

export default function QuickPhrases({ setInputText }) {
  return (
    <div style={{ width: "100%", maxWidth: 780, marginTop: 24 }}>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 10, paddingLeft: 4 }}
        className="phrases-title">
        Quick phrases
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {PHRASES.map((phrase) => (
          <button
            key={phrase}
            className="chip"
            onClick={() => setInputText(phrase)}
          >
            {phrase}
          </button>
        ))}
      </div>

      <style>{`
        .phrases-title { color: rgba(255,255,255,0.5); }
        .light .phrases-title { color: rgba(0,0,0,0.45); }
        .chip {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(14px);
          color: white;
          padding: 9px 16px;
          border-radius: 20px;
          font-family: inherit;
          font-size: 13.5px;
          cursor: pointer;
          transition: 0.2s;
        }
        .light .chip {
          background: rgba(255,255,255,0.55);
          border: 1px solid rgba(255,255,255,0.7);
          color: #1b1d2e;
          box-shadow: 0 4px 14px rgba(91,110,200,0.15);
        }
        .chip:hover {
          background: rgba(91,140,255,0.35);
          box-shadow: 0 0 16px rgba(91,140,255,0.3);
          color: white;
        }
      `}</style>
    </div>
  );
}