export default function Topbar({ theme, toggleTheme, onHistoryOpen }) {
  const sunIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
      <circle cx="12" cy="12" r="4.5"/>
      <path d="M12 2.5v2.5M12 19v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2.5 12H5M19 12h2.5M4.2 19.8 6 18M18 6l1.8-1.8"/>
    </svg>
  );

  const moonIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>
    </svg>
  );

  const historyIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
      <path d="M3 12a9 9 0 1 0 2.6-6.4M3 4v5h5"/>
      <path d="M12 7v5l3 3"/>
    </svg>
  );

  return (
    <header className="flex items-center justify-between px-6 py-5 relative z-10">
      <a href="/" className="text-xl font-semibold tracking-wide" style={{ color: "var(--text-color, white)", textDecoration: "none" }}>
        Uni<span style={{ color: "#5B8CFF", textShadow: "0 0 14px rgba(91,140,255,0.6)" }}>Voice</span>
      </a>

      <div className="flex gap-3">
        <button
          onClick={onHistoryOpen}
          className="topbar-btn"
          title="History"
        >
          {historyIcon}
        </button>
        <button
          onClick={toggleTheme}
          className="topbar-btn"
          title="Toggle theme"
        >
          {theme === "light" ? sunIcon : moonIcon}
        </button>
      </div>

      <style>{`
        .topbar-btn {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(14px);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.25s;
        }
        .light .topbar-btn {
          background: rgba(255,255,255,0.55);
          border: 1px solid rgba(255,255,255,0.7);
          color: #1b1d2e;
          box-shadow: 0 4px 14px rgba(91,110,200,0.15);
        }
        .topbar-btn:hover {
          background: rgba(91,140,255,0.35);
          box-shadow: 0 0 18px rgba(91,140,255,0.35);
        }
      `}</style>
    </header>
  );
}