import { useState, useRef, useEffect } from "react";

const LANGUAGES = [
  { code: "auto", name: "Detect language", flag: "🌐" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "zh", name: "Chinese (Simplified)", flag: "🇨🇳" },
  { code: "zh-Hant", name: "Chinese (Traditional)", flag: "🇹🇼" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "bn", name: "Bengali", flag: "🇧🇩" },
  { code: "pa", name: "Punjabi", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", flag: "🇮🇳" },
  { code: "te", name: "Telugu", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", flag: "🇮🇳" },
  { code: "ur", name: "Urdu", flag: "🇵🇰" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
  { code: "th", name: "Thai", flag: "🇹🇭" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" },
  { code: "ms", name: "Malay", flag: "🇲🇾" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "pl", name: "Polish", flag: "🇵🇱" },
  { code: "sv", name: "Swedish", flag: "🇸🇪" },
  { code: "no", name: "Norwegian", flag: "🇳🇴" },
  { code: "da", name: "Danish", flag: "🇩🇰" },
  { code: "fi", name: "Finnish", flag: "🇫🇮" },
  { code: "cs", name: "Czech", flag: "🇨🇿" },
  { code: "sk", name: "Slovak", flag: "🇸🇰" },
  { code: "ro", name: "Romanian", flag: "🇷🇴" },
  { code: "hu", name: "Hungarian", flag: "🇭🇺" },
  { code: "el", name: "Greek", flag: "🇬🇷" },
  { code: "he", name: "Hebrew", flag: "🇮🇱" },
  { code: "fa", name: "Persian", flag: "🇮🇷" },
  { code: "sw", name: "Swahili", flag: "🇰🇪" },
  { code: "af", name: "Afrikaans", flag: "🇿🇦" },
  { code: "uk", name: "Ukrainian", flag: "🇺🇦" },
  { code: "ca", name: "Catalan", flag: "🏳️" },
  { code: "hr", name: "Croatian", flag: "🇭🇷" },
  { code: "lt", name: "Lithuanian", flag: "🇱🇹" },
  { code: "lv", name: "Latvian", flag: "🇱🇻" },
  { code: "et", name: "Estonian", flag: "🇪🇪" },
  { code: "sl", name: "Slovenian", flag: "🇸🇮" },
  { code: "bg", name: "Bulgarian", flag: "🇧🇬" },
  { code: "sr", name: "Serbian", flag: "🇷🇸" },
  { code: "az", name: "Azerbaijani", flag: "🇦🇿" },
  { code: "ka", name: "Georgian", flag: "🇬🇪" },
  { code: "hy", name: "Armenian", flag: "🇦🇲" },
  { code: "km", name: "Khmer", flag: "🇰🇭" },
  { code: "lo", name: "Lao", flag: "🇱🇦" },
  { code: "my", name: "Burmese", flag: "🇲🇲" },
  { code: "ne", name: "Nepali", flag: "🇳🇵" },
  { code: "si", name: "Sinhala", flag: "🇱🇰" },
  { code: "am", name: "Amharic", flag: "🇪🇹" },
  { code: "so", name: "Somali", flag: "🇸🇴" },
  { code: "ha", name: "Hausa", flag: "🇳🇬" },
  { code: "yo", name: "Yoruba", flag: "🇳🇬" },
  { code: "ig", name: "Igbo", flag: "🇳🇬" },
  { code: "zu", name: "Zulu", flag: "🇿🇦" },
  { code: "mt", name: "Maltese", flag: "🇲🇹" },
  { code: "is", name: "Icelandic", flag: "🇮🇸" },
  { code: "mk", name: "Macedonian", flag: "🇲🇰" },
  { code: "sq", name: "Albanian", flag: "🇦🇱" },
  { code: "bs", name: "Bosnian", flag: "🇧🇦" },
];

export { LANGUAGES };

export default function LangSelector({ value, onChange, excludeAuto = false }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  const langs = excludeAuto ? LANGUAGES.filter((l) => l.code !== "auto") : LANGUAGES;
  const filtered = langs.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );
  const selected = LANGUAGES.find((l) => l.code === value) || LANGUAGES[0];

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", flex: 1 }}>
      <button className="lang-btn" onClick={() => setOpen((o) => !o)}>
        <span>{selected.flag}</span>
        <span style={{ flex: 1, textAlign: "left" }}>{selected.name}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"
          style={{ opacity: 0.6, transform: open ? "rotate(180deg)" : "none", transition: "0.2s" }}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <ul className="lang-dropdown">
          <li style={{ padding: "6px 6px 4px", listStyle: "none" }}>
            <input
              className="lang-search"
              placeholder="Search language..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </li>
          {filtered.length === 0 && (
            <li className="lang-option" style={{ opacity: 0.5, cursor: "default" }}>
              No results
            </li>
          )}
          {filtered.map((lang) => (
            <li
              key={lang.code}
              className={`lang-option ${lang.code === value ? "active" : ""}`}
              onClick={() => { onChange(lang.code); setOpen(false); setSearch(""); }}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </li>
          ))}
        </ul>
      )}

      <style>{`
        .lang-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          color: white;
          padding: 10px 14px;
          border-radius: 14px;
          font-family: inherit;
          font-size: 14px;
          cursor: pointer;
          transition: 0.2s;
        }
        .light .lang-btn {
          background: rgba(255,255,255,0.55);
          border: 1px solid rgba(255,255,255,0.7);
          color: #1b1d2e;
        }
        .lang-btn:hover { background: rgba(255,255,255,0.14); }
        .light .lang-btn:hover { background: rgba(255,255,255,0.75); }
        .lang-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 100%;
          max-height: 260px;
          overflow-y: auto;
          background: rgba(10,10,18,0.95);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(20px);
          border-radius: 14px;
          list-style: none;
          padding: 6px;
          z-index: 50;
          box-shadow: 0 12px 30px rgba(0,0,0,0.5);
        }
        .light .lang-dropdown {
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(255,255,255,0.7);
          box-shadow: 0 12px 30px rgba(91,110,200,0.2);
        }
        .lang-search {
          width: 100%;
          padding: 8px 10px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.08);
          color: white;
          font-family: inherit;
          font-size: 13px;
          outline: none;
        }
        .light .lang-search {
          background: rgba(0,0,0,0.05);
          border: 1px solid rgba(0,0,0,0.1);
          color: #1b1d2e;
        }
        .lang-option {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px 10px;
          border-radius: 10px;
          font-size: 14px;
          cursor: pointer;
          transition: 0.15s;
          color: white;
        }
        .light .lang-option { color: #1b1d2e; }
        .lang-option:hover, .lang-option.active { background: rgba(91,140,255,0.35); }
        .light .lang-option:hover, .light .lang-option.active { background: rgba(91,140,255,0.2); }
      `}</style>
    </div>
  );
}