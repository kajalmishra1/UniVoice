import { useState, useRef } from "react";
import LangSelector, { LANGUAGES } from "./LangSelector";
import axios from "axios";

const TTS_LANG_MAP = {
  en: "en-US", hi: "hi-IN", ja: "ja-JP", zh: "zh-CN", es: "es-ES",
  fr: "fr-FR", de: "de-DE", ru: "ru-RU", ar: "ar-SA", ko: "ko-KR",
  pt: "pt-PT", it: "it-IT", bn: "bn-IN", ta: "ta-IN", te: "te-IN",
  tr: "tr-TR", vi: "vi-VN", th: "th-TH", id: "id-ID", nl: "nl-NL",
  pl: "pl-PL", sv: "sv-SE", uk: "uk-UA", el: "el-GR", he: "he-IL",
};

const RECOGNITION_LANG_MAP = {
  en: "en-US", hi: "hi-IN", ja: "ja-JP", zh: "zh-CN", es: "es-ES",
  fr: "fr-FR", de: "de-DE", ru: "ru-RU", ar: "ar-SA", ko: "ko-KR",
  pt: "pt-PT", it: "it-IT", bn: "bn-IN", ta: "ta-IN", te: "te-IN",
  tr: "tr-TR", vi: "vi-VN", th: "th-TH", id: "id-ID", nl: "nl-NL",
  pl: "pl-PL", sv: "sv-SE", uk: "uk-UA", el: "el-GR", he: "he-IL",
};

function detectLanguage(text) {
  const s = text.trim();
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(s)) return "ja";
  if (/[\uAC00-\uD7AF]/.test(s)) return "ko";
  if (/[\u4E00-\u9FFF]/.test(s)) return "zh";
  if (/[\u0900-\u097F]/.test(s)) return "hi";
  if (/[\u0600-\u06FF]/.test(s)) return "ar";
  if (/[\u0400-\u04FF]/.test(s)) return "ru";
  if (/[\u0980-\u09FF]/.test(s)) return "bn";
  if (/[\u0B80-\u0BFF]/.test(s)) return "ta";
  if (/[\u0C00-\u0C7F]/.test(s)) return "te";
  return "en";
}

function typeOutput(text, setter, speed = 10) {
  let i = 0;
  function step() {
    setter(text.slice(0, i));
    i++;
    if (i <= text.length) requestAnimationFrame(() => setTimeout(step, speed));
  }
  step();
}

export default function TranslatorCard({
  inputText, setInputText,
  outputText, setOutputText,
  sourceLang, setSourceLang,
  targetLang, setTargetLang,
  addToHistory,
}) {
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("info"); // info | error | success
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [copied, setCopied] = useState(false);
  const recognitionRef = useRef(null);
  const micTimeoutRef = useRef(null);

  function showStatus(msg, type = "info", duration = 2500) {
    setStatus(msg);
    setStatusType(type);
    if (duration) setTimeout(() => setStatus(""), duration);
  }

  // ── translate ──
  async function handleTranslate() {
    const text = inputText.trim();
    if (!text) return;
    setLoading(true);
    setStatus("");
    setOutputText("");

    try {
      let result, detected;
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/translate`,
          { text, source: sourceLang, target: targetLang },
          { timeout: 10000 }
        );
        result = res.data.translatedText;
        detected = res.data.detectedLanguage;
      } catch {
        const resolvedSource = sourceLang === "auto" ? detectLanguage(text) : sourceLang;
        const params = new URLSearchParams({
          client: "gtx", sl: sourceLang === "auto" ? "auto" : sourceLang,
          tl: targetLang, dt: "t", q: text,
        });
        const r = await fetch(`https://translate.googleapis.com/translate_a/single?${params}`);
        const data = await r.json();
        result = Array.isArray(data?.[0]) ? data[0].map((c) => c?.[0] ?? "").join("") : null;
        detected = data?.[2] || resolvedSource;
        if (!result) throw new Error("No translation returned");
      }

      typeOutput(result, setOutputText);

      const detectedLang = sourceLang === "auto" && detected
        ? LANGUAGES.find((l) => l.code === detected) || null
        : null;

      if (detectedLang) {
        showStatus(`Detected: ${detectedLang.name}`, "info", 3000);
      }

      addToHistory(text, result, sourceLang, targetLang, detectedLang?.name || null);
    } catch {
      showStatus("Translation failed — check your connection", "error", 3000);
    } finally {
      setLoading(false);
    }
  }

  // ── swap ──
  function handleSwap() {
    if (sourceLang === "auto") return;
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(outputText);
    setOutputText(inputText);
  }

  // ── copy ──
  function handleCopy() {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  // ── listen ──
  function handleListen() {
    if (!outputText) return;
    if (!("speechSynthesis" in window)) { showStatus("TTS not supported", "error"); return; }
    speechSynthesis.cancel();

    const langTag = TTS_LANG_MAP[targetLang] || "en-US";

    function speakWithVoice() {
      const voices = speechSynthesis.getVoices();
      const base = langTag.split("-")[0];

      // Try exact match first, then base language match, then any voice
      const voice =
        voices.find((v) => v.lang === langTag) ||
        voices.find((v) => v.lang.startsWith(base)) ||
        voices.find((v) => v.lang.startsWith("en")) ||
        voices[0] ||
        null;

      const utter = new SpeechSynthesisUtterance(outputText);
      utter.lang = langTag;
      if (voice) utter.voice = voice;
      utter.rate = 0.9;
      utter.onerror = () => showStatus("Audio error", "error");
      speechSynthesis.speak(utter);
    }

    // Chrome loads voices async — if empty, wait for onvoiceschanged
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      speakWithVoice();
    } else {
      speechSynthesis.onvoiceschanged = () => {
        speechSynthesis.onvoiceschanged = null;
        speakWithVoice();
      };
    }
  }

  // ── mic ──
  function handleMic() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { showStatus("Use Chrome for mic support", "error"); return; }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      clearTimeout(micTimeoutRef.current);
      return;
    }

    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = RECOGNITION_LANG_MAP[sourceLang] || "en-US";

    rec.onstart = () => {
      setListening(true);
      showStatus("Listening…", "info", 0);
      micTimeoutRef.current = setTimeout(() => {
        rec.abort();
        setListening(false);
        showStatus("No response — check network", "error", 3000);
      }, 6000);
    };

    rec.onresult = (e) => {
      setInputText(e.results[0][0].transcript);
      setStatus("");
      clearTimeout(micTimeoutRef.current);
    };

    rec.onerror = (e) => {
      const msgs = {
        "not-allowed": "Mic permission denied",
        "no-speech": "No speech detected",
        "audio-capture": "No microphone found",
        "network": "Network error",
      };
      if (e.error !== "aborted") showStatus(msgs[e.error] || "Mic error", "error");
    };

    rec.onend = () => { setListening(false); clearTimeout(micTimeoutRef.current); };
    recognitionRef.current = rec;
    try { rec.start(); } catch { showStatus("Couldn't start mic", "error"); }
  }

  const statusColor = statusType === "error" ? "#ff5c5c" : statusType === "success" ? "#4ade80" : "rgba(255,255,255,0.5)";

  return (
    <div className="tc-root">

      {/* ── lang bar ── */}
      <div className="tc-langbar">
        <LangSelector value={sourceLang} onChange={setSourceLang} excludeAuto={false} />

        <button className="tc-swap" onClick={handleSwap} title="Swap languages"
          style={{ opacity: sourceLang === "auto" ? 0.35 : 1 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M7 7h11l-3-3M17 17H6l3 3"/>
          </svg>
        </button>

        <LangSelector value={targetLang} onChange={setTargetLang} excludeAuto={true} />
      </div>

      {/* ── panes ── */}
      <div className="tc-panes">

        {/* source */}
        <div className="tc-pane">
          <textarea
            className="tc-textarea"
            placeholder="Type or speak your text here…"
            maxLength={2000}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleTranslate(); }}
          />
          <div className="tc-pane-bar">
            <button
              className={`tc-icon-btn ${listening ? "tc-icon-active" : ""}`}
              onClick={handleMic} title="Voice input">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                <path d="M12 1a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8"/>
              </svg>
              {listening && <span className="tc-mic-ring" />}
            </button>
            <span className="tc-charcount">{inputText.length} / 2000</span>
            <button className="tc-icon-btn" onClick={() => { setInputText(""); setOutputText(""); }} title="Clear">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* divider */}
        <div className="tc-divider">
          <button
            className={`tc-translate-btn ${loading ? "tc-loading" : ""}`}
            onClick={handleTranslate}
            disabled={loading || !inputText.trim()}
            title="Translate (Ctrl+Enter)">
            {loading
              ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"
                  style={{ animation: "tc-spin 0.7s linear infinite" }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
              : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
            }
          </button>
        </div>

        {/* output */}
        <div className="tc-pane tc-pane-out">
          <div className="tc-output">
            {loading
              ? <div className="tc-loading-effect">
                  <div className="tc-shimmer-line" style={{ width: "85%" }} />
                  <div className="tc-shimmer-line" style={{ width: "65%" }} />
                  <div className="tc-shimmer-line" style={{ width: "75%" }} />
                  <div className="tc-typing-dots">
                    <span /><span /><span />
                  </div>
                </div>
              : outputText
                ? <span className="tc-output-text">{outputText}</span>
                : <span className="tc-placeholder">Translation appears here</span>
            }
          </div>
          <div className="tc-pane-bar">
            <button className="tc-icon-btn" onClick={handleListen} title="Listen">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                <path d="M11 5 6 9H2v6h4l5 4V5zM16.5 8.5a5 5 0 0 1 0 7"/>
              </svg>
            </button>
            {status && (
              <span className="tc-status" style={{ color: statusColor }}>{status}</span>
            )}
            <button
              className={`tc-icon-btn ${copied ? "tc-icon-active" : ""}`}
              onClick={handleCopy} title="Copy"
              style={{ marginLeft: "auto" }}>
              {copied
                ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15">
                    <rect x="9" y="9" width="11" height="11" rx="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
              }
            </button>
          </div>
        </div>
      </div>

      {/* ── translate bar (bottom) ── */}
      <div className="tc-bottom-bar">
        <span className="tc-hint">Ctrl + Enter to translate</span>
        <button
          className={`tc-main-btn ${loading ? "tc-main-loading" : ""}`}
          onClick={handleTranslate}
          disabled={loading || !inputText.trim()}>
          {loading ? "Translating…" : "Translate"}
          {!loading && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          )}
        </button>
      </div>

      <style>{`
        .tc-root {
          width: 100%;
          max-width: 880px;
        }

        /* ── lang bar ── */
        .tc-langbar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .tc-swap {
          width: 36px; height: 36px; min-width: 36px;
          border-radius: 50%;
          background: #5B8CFF;
          border: none; color: white;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: transform 0.3s, opacity 0.2s;
          box-shadow: 0 0 16px rgba(91,140,255,0.45);
          flex-shrink: 0;
        }
        .tc-swap:hover { transform: rotate(180deg); }

        /* ── panes ── */
        .tc-panes {
          display: grid;
          grid-template-columns: 1fr 56px 1fr;
          min-height: 360px;
          border-radius: 20px;
          overflow: visible;
          gap: 0;
        }

        .tc-pane {
          display: flex;
          flex-direction: column;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: border-color 0.2s, background 0.4s;
        }

        .tc-pane:first-child {
          border-radius: 20px 0 0 20px;
        }

        .tc-pane-out {
          border-radius: 0 20px 20px 0;
          border-left: none;
        }

        .tc-pane:focus-within {
          border-color: rgba(91,140,255,0.4);
        }

        .light .tc-pane {
          background: rgba(255,255,255,0.65);
          border-color: rgba(255,255,255,0.75);
          box-shadow: 0 8px 32px rgba(91,110,200,0.1);
        }

        /* divider col */
        .tc-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.03);
          border-top: 1px solid rgba(255,255,255,0.08);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          position: relative;
        }

        .light .tc-divider {
          background: rgba(255,255,255,0.4);
          border-color: rgba(255,255,255,0.6);
        }

        /* translate circle button */
        .tc-translate-btn {
          width: 42px; height: 42px;
          border-radius: 50%;
          background: #5B8CFF;
          border: none; color: white;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: 0.25s;
          box-shadow: 0 0 20px rgba(91,140,255,0.5);
          z-index: 1;
        }
        .tc-translate-btn:hover:not(:disabled) {
          transform: scale(1.1);
          box-shadow: 0 0 30px rgba(91,140,255,0.65);
        }
        .tc-translate-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* textarea */
        .tc-textarea {
          flex: 1;
          background: transparent;
          border: none; outline: none;
          resize: none;
          color: white;
          font-family: 'Poppins', sans-serif;
          font-size: 16px;
          line-height: 1.65;
          padding: 20px;
        }
        .light .tc-textarea { color: #1b1d2e; }
        .tc-textarea::placeholder { color: rgba(255,255,255,0.28); }
        .light .tc-textarea::placeholder { color: rgba(27,29,46,0.3); }

        /* output */
        .tc-output {
          flex: 1;
          padding: 20px;
          font-size: 16px;
          line-height: 1.65;
          overflow-y: auto;
        }
        .tc-output-text { color: white; }
        .light .tc-output-text { color: #1b1d2e; }
        .tc-placeholder { color: rgba(255,255,255,0.25); font-style: italic; }
        .light .tc-placeholder { color: rgba(27,29,46,0.28); }

        /* ── loading effect inside output box ── */
        .tc-loading-effect {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 4px 0;
        }

        .tc-shimmer-line {
          height: 14px;
          border-radius: 8px;
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.06) 25%,
            rgba(91,140,255,0.18) 50%,
            rgba(255,255,255,0.06) 75%
          );
          background-size: 200% 100%;
          animation: tc-shimmer 1.4s ease-in-out infinite;
        }
        .light .tc-shimmer-line {
          background: linear-gradient(
            90deg,
            rgba(0,0,0,0.05) 25%,
            rgba(91,140,255,0.15) 50%,
            rgba(0,0,0,0.05) 75%
          );
          background-size: 200% 100%;
        }

        @keyframes tc-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .tc-typing-dots {
          display: flex;
          gap: 6px;
          align-items: center;
          margin-top: 4px;
        }

        .tc-typing-dots span {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #5B8CFF;
          opacity: 0.4;
          animation: tc-dot-bounce 1.2s ease-in-out infinite;
        }
        .tc-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .tc-typing-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes tc-dot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-8px); opacity: 1; }
        }

        /* pane bottom bar */
        .tc-pane-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px 14px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .light .tc-pane-bar { border-top-color: rgba(0,0,0,0.05); }

        .tc-charcount {
          font-size: 11.5px;
          color: rgba(255,255,255,0.3);
          margin-left: auto;
          font-variant-numeric: tabular-nums;
        }
        .light .tc-charcount { color: rgba(27,29,46,0.35); }

        .tc-status {
          font-size: 12px;
          flex: 1;
          text-align: center;
        }

        /* icon buttons */
        .tc-icon-btn {
          width: 30px; height: 30px;
          border-radius: 8px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.55);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: 0.2s;
          position: relative;
          flex-shrink: 0;
        }
        .light .tc-icon-btn {
          border-color: rgba(0,0,0,0.1);
          color: rgba(27,29,46,0.5);
        }
        .tc-icon-btn:hover {
          background: rgba(91,140,255,0.18);
          border-color: rgba(91,140,255,0.3);
          color: #5B8CFF;
        }
        .tc-icon-active {
          background: rgba(91,140,255,0.25) !important;
          border-color: #5B8CFF !important;
          color: #5B8CFF !important;
        }

        /* mic pulse ring */
        .tc-mic-ring {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid #5B8CFF;
          animation: tc-pulse 1s ease-out infinite;
        }
        @keyframes tc-pulse {
          0% { transform: scale(0.9); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        /* bottom bar */
        .tc-bottom-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 14px;
          padding: 0 4px;
        }

        .tc-hint {
          font-size: 12px;
          color: rgba(255,255,255,0.25);
        }
        .light .tc-hint { color: rgba(27,29,46,0.3); }

        .tc-main-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          border-radius: 14px;
          background: #5B8CFF;
          border: none;
          color: white;
          font-family: 'Poppins', sans-serif;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: 0.25s;
          letter-spacing: 0.3px;
          box-shadow: 0 0 22px rgba(91,140,255,0.4);
        }
        .tc-main-btn:hover:not(:disabled) {
          background: #4a7dee;
          transform: translateY(-1px);
          box-shadow: 0 0 32px rgba(91,140,255,0.55);
        }
        .tc-main-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        @keyframes tc-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .tc-panes {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 48px 1fr;
          }
          .tc-pane:first-child { border-radius: 20px 20px 0 0; }
          .tc-pane-out { border-radius: 0 0 20px 20px; border-left: 1px solid rgba(255,255,255,0.1); border-top: none; }
          .tc-divider { border: none; border-left: 1px solid rgba(255,255,255,0.08); border-right: 1px solid rgba(255,255,255,0.08); }
          .tc-hint { display: none; }
        }
      `}</style>
    </div>
  );
}