import { LANGUAGES } from "./LangSelector";

function labelFor(code) {
  if (!code || code === "auto") return "Auto";
  return LANGUAGES.find((l) => l.code === code)?.name || code;
}

export default function HistoryPanel({
  open, onClose, history, clearHistory, setInputText, setOutputText,
}) {
  return (
    <>
      <div className={`overlay ${open ? "show" : ""}`} onClick={onClose} />

      <aside className={`history-panel ${open ? "open" : ""}`}>
        <div className="history-head">
          <h3 style={{ margin: 0, fontWeight: 600, letterSpacing: "0.3px", fontSize: 16 }}>
            History
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              className="clear-btn"
              onClick={clearHistory}
              disabled={history.length === 0}
            >
              Clear all
            </button>
            <button className="close-btn" onClick={onClose} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="17" height="17">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="history-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="36" height="36" style={{ opacity: 0.25, marginBottom: 10 }}>
              <path d="M3 12a9 9 0 1 0 2.6-6.4M3 4v5h5M12 7v5l3 3"/>
            </svg>
            <p>No translations yet</p>
            <span>Your history will appear here</span>
          </div>
        ) : (
          <ul className="history-list">
            {history.map((item, i) => {
              // Build pair label — show detected language if source was auto
              const sourceLabel = item.source === "auto" && item.detectedLang
                ? `${item.detectedLang} (detected)`
                : labelFor(item.source);
              const targetLabel = labelFor(item.target);

              return (
                <li
                  key={i}
                  className="history-item"
                  onClick={() => { setInputText(item.src); setOutputText(item.out); onClose(); }}
                >
                  <div className="hi-pair">
                    <span className="hi-src-lang">{sourceLabel}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="10" height="10" style={{ opacity: 0.5, flexShrink: 0 }}>
                      <path d="M5 12h14M13 6l6 6-6 6"/>
                    </svg>
                    <span className="hi-tgt-lang">{targetLabel}</span>
                  </div>
                  <div className="hi-src-text">{item.src}</div>
                  <div className="hi-out-text">{item.out}</div>
                </li>
              );
            })}
          </ul>
        )}
      </aside>

      <style>{`
        .overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 40; opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s;
          backdrop-filter: blur(2px);
        }
        .overlay.show { opacity: 1; pointer-events: auto; }

        .history-panel {
          position: fixed; top: 0; right: -360px;
          width: 340px; height: 100%;
          background: rgba(8,8,18,0.9);
          border-left: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          z-index: 50;
          padding: 0;
          overflow-y: auto;
          transition: right 0.35s cubic-bezier(0.4,0,0.2,1), background 0.4s;
          color: white;
          display: flex;
          flex-direction: column;
        }
        .light .history-panel {
          background: rgba(245,246,252,0.92);
          border-left-color: rgba(255,255,255,0.7);
          color: #1b1d2e;
        }
        .history-panel.open { right: 0; }

        .history-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 20px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          position: sticky;
          top: 0;
          background: rgba(8,8,18,0.95);
          backdrop-filter: blur(20px);
          z-index: 2;
        }
        .light .history-head {
          background: rgba(245,246,252,0.95);
          border-bottom-color: rgba(0,0,0,0.06);
        }

        .clear-btn {
          background: rgba(255,92,92,0.12);
          border: 1px solid rgba(255,92,92,0.25);
          color: #ff6b6b;
          font-family: inherit;
          font-size: 12px;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.2s;
        }
        .clear-btn:hover:not(:disabled) {
          background: rgba(255,92,92,0.22);
        }
        .clear-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        .close-btn {
          width: 34px; height: 34px;
          border-radius: 10px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.7);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: 0.2s;
        }
        .light .close-btn {
          background: rgba(0,0,0,0.05);
          border-color: rgba(0,0,0,0.1);
          color: #1b1d2e;
        }
        .close-btn:hover {
          background: rgba(91,140,255,0.2);
          border-color: rgba(91,140,255,0.35);
          color: #5B8CFF;
        }

        /* empty state */
        .history-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          text-align: center;
          color: rgba(255,255,255,0.4);
        }
        .light .history-empty { color: rgba(27,29,46,0.4); }
        .history-empty p {
          font-size: 15px;
          font-weight: 500;
          margin: 0 0 6px;
        }
        .history-empty span { font-size: 13px; opacity: 0.7; }

        /* list */
        .history-list {
          list-style: none;
          margin: 0;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .history-item {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 14px;
          cursor: pointer;
          transition: 0.2s;
        }
        .light .history-item {
          background: rgba(255,255,255,0.7);
          border-color: rgba(255,255,255,0.8);
          box-shadow: 0 2px 10px rgba(91,110,200,0.08);
        }
        .history-item:hover {
          background: rgba(91,140,255,0.1);
          border-color: rgba(91,140,255,0.25);
          transform: translateY(-1px);
        }
        .light .history-item:hover {
          background: rgba(91,140,255,0.08);
        }

        /* pair label */
        .hi-pair {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }

        .hi-src-lang {
          font-size: 11px;
          font-weight: 500;
          color: #5B8CFF;
          background: rgba(91,140,255,0.12);
          border: 1px solid rgba(91,140,255,0.2);
          padding: 2px 8px;
          border-radius: 20px;
          white-space: nowrap;
        }

        .hi-tgt-lang {
          font-size: 11px;
          font-weight: 500;
          color: #a78bfa;
          background: rgba(167,139,250,0.12);
          border: 1px solid rgba(167,139,250,0.2);
          padding: 2px 8px;
          border-radius: 20px;
          white-space: nowrap;
        }

        .hi-src-text {
          font-size: 13.5px;
          color: rgba(255,255,255,0.85);
          margin-bottom: 5px;
          line-height: 1.5;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .light .hi-src-text { color: #1b1d2e; }

        .hi-out-text {
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          line-height: 1.5;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .light .hi-out-text { color: rgba(27,29,46,0.5); }

        @media (max-width: 500px) {
          .history-panel { width: 88%; right: -90%; }
          .history-panel.open { right: 0; }
        }
      `}</style>
    </>
  );
}