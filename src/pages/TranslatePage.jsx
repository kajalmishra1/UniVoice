import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TranslatorCard from "../components/TranslatorCard";
import LangSelector, { LANGUAGES } from "../components/LangSelector";
import HistoryPanel from "../components/HistoryPanel";
import Background from "../components/Background";

const QUICK_PHRASES = [
  "Hello, how are you?",
  "Thank you very much",
  "Where is the station?",
  "How much does this cost?",
  "I need help",
  "Good morning",
  "Nice to meet you",
  "I don't understand",
];

export default function TranslatePage({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("hi");

  function addToHistory(src, out, source, target, detectedLang) {
    setHistory((prev) => [{ src, out, source, target, detectedLang }, ...prev].slice(0, 20));
  }

  return (
    <div className="tp-root">
      <Background />

      {/* ── topbar ── */}
      <header className="tp-header">
        <button className="tp-logo" onClick={() => navigate("/")}>
          Uni<span>Voice</span>
        </button>
        <div className="tp-header-right">
          <button className="tp-icon" onClick={() => setHistoryOpen(true)} title="History">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
              <path d="M3 12a9 9 0 1 0 2.6-6.4M3 4v5h5M12 7v5l3 3"/>
            </svg>
          </button>
          <button className="tp-icon" onClick={toggleTheme} title="Toggle theme">
            {theme === "light"
              ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                  <circle cx="12" cy="12" r="4.5"/>
                  <path d="M12 2.5v2.5M12 19v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2.5 12H5M19 12h2.5M4.2 19.8 6 18M18 6l1.8-1.8"/>
                </svg>
              : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>
                </svg>
            }
          </button>
        </div>
      </header>

      {/* ── page title ── */}
      <div className="tp-page-title">
        <h1 className="tp-title">Translate</h1>
        <p className="tp-subtitle">Type, speak, or paste text to instantly translate across 70+ languages</p>
      </div>

      {/* ── main card ── */}
      <main className="tp-main">
        <TranslatorCard
          inputText={inputText}
          setInputText={setInputText}
          outputText={outputText}
          setOutputText={setOutputText}
          sourceLang={sourceLang}
          setSourceLang={setSourceLang}
          targetLang={targetLang}
          setTargetLang={setTargetLang}
          addToHistory={addToHistory}
        />

        {/* ── quick phrases ── */}
        <div className="tp-phrases">
          <span className="tp-phrases-label">Quick phrases</span>
          <div className="tp-chips">
            {QUICK_PHRASES.map((p) => (
              <button key={p} className="tp-chip" onClick={() => setInputText(p)}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </main>

      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        clearHistory={() => setHistory([])}
        setInputText={setInputText}
        setOutputText={setOutputText}
      />

      <style>{`
        .tp-root {
          min-height: 100vh;
          position: relative;
          font-family: 'Poppins', sans-serif;
          color: white;
        }

        /* ── header ── */
        .tp-header {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 28px;
        }

        .tp-logo {
          font-size: 20px;
          font-weight: 600;
          letter-spacing: 0.5px;
          color: white;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          padding: 0;
          transition: opacity 0.2s;
        }
        .light .tp-logo { color: #1b1d2e; }
        .tp-logo:hover { opacity: 0.75; }
        .tp-logo span { color: #5B8CFF; }

        .tp-header-right { display: flex; gap: 10px; }

        .tp-icon {
          width: 40px; height: 40px;
          border-radius: 12px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.8);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: 0.2s;
          backdrop-filter: blur(10px);
        }
        .light .tp-icon {
          background: rgba(255,255,255,0.6);
          border-color: rgba(255,255,255,0.75);
          color: #1b1d2e;
        }
        .tp-icon:hover {
          background: rgba(91,140,255,0.2);
          border-color: rgba(91,140,255,0.35);
          color: #5B8CFF;
        }

        /* ── page title ── */
        .tp-page-title {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 0 24px 32px;
        }

        .tp-title {
          font-size: clamp(28px, 5vw, 44px);
          font-weight: 700;
          margin: 0 0 8px;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .light .tp-title {
          background: linear-gradient(135deg, #1b1d2e 0%, #3b3d50 100%);
          -webkit-background-clip: text;
          background-clip: text;
        }

        .tp-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.45);
          margin: 0;
          line-height: 1.6;
        }
        .light .tp-subtitle { color: rgba(27,29,46,0.45); }

        /* ── main ── */
        .tp-main {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 20px 60px;
          gap: 24px;
        }

        /* ── quick phrases ── */
        .tp-phrases {
          width: 100%;
          max-width: 880px;
        }

        .tp-phrases-label {
          display: block;
          font-size: 11.5px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 10px;
          padding-left: 2px;
        }
        .light .tp-phrases-label { color: rgba(27,29,46,0.35); }

        .tp-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tp-chip {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7);
          padding: 8px 16px;
          border-radius: 30px;
          font-family: inherit;
          font-size: 13px;
          cursor: pointer;
          transition: 0.2s;
          backdrop-filter: blur(10px);
        }
        .light .tp-chip {
          background: rgba(255,255,255,0.55);
          border-color: rgba(255,255,255,0.7);
          color: #1b1d2e;
        }
        .tp-chip:hover {
          background: rgba(91,140,255,0.2);
          border-color: rgba(91,140,255,0.35);
          color: white;
        }
        .light .tp-chip:hover {
          background: rgba(91,140,255,0.15);
          color: #3b6fff;
        }
      `}</style>
    </div>
  );
}