import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Background from "../components/Background";

const HELLO_WORDS = [
  { word: "Hello", lang: "English" },
  { word: "नमस्ते", lang: "Hindi" },
  { word: "こんにちは", lang: "Japanese" },
  { word: "Bonjour", lang: "French" },
  { word: "你好", lang: "Chinese" },
  { word: "Hola", lang: "Spanish" },
  { word: "Ciao", lang: "Italian" },
  { word: "Привет", lang: "Russian" },
  { word: "مرحبا", lang: "Arabic" },
  { word: "안녕하세요", lang: "Korean" },
  { word: "Olá", lang: "Portuguese" },
  { word: "Hallo", lang: "German" },
];

const STATS = [
  { value: "70+", label: "Languages" },
  { value: "2M+", label: "Free chars / month" },
  { value: "< 1s", label: "Translation speed" },
  { value: "100%", label: "Free to use" },
];

const FEATURES = [
  {
    icon: "🌐",
    title: "Auto Language Detect",
    desc: "Just type — UniVoice figures out what language you're using and translates instantly.",
  },
  {
    icon: "🎤",
    title: "Voice Input",
    desc: "Speak naturally in your language. UniVoice listens and translates your words in real time.",
  },
  {
    icon: "🔊",
    title: "Listen to Translation",
    desc: "Hear your translation spoken aloud with native-quality text-to-speech voices.",
  },
  {
    icon: "🌙",
    title: "Dark & Light Mode",
    desc: "Stunning glassmorphism design that looks premium in both dark and light themes.",
  },
  {
    icon: "⚡",
    title: "Instant Results",
    desc: "Powered by Microsoft Azure — enterprise-grade translation with sub-second response times.",
  },
  {
    icon: "📋",
    title: "Translation History",
    desc: "Every translation is saved locally so you can revisit and reuse past results anytime.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [helloIndex, setHelloIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const featuresRef = useRef(null);
  const [featuresVisible, setFeaturesVisible] = useState(false);

  // Cycle through hello words
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setHelloIndex((i) => (i + 1) % HELLO_WORDS.length);
        setVisible(true);
      }, 400);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Scroll reveal for features
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setFeaturesVisible(true); },
      { threshold: 0.15 }
    );
    if (featuresRef.current) observer.observe(featuresRef.current);
    return () => observer.disconnect();
  }, []);

  const current = HELLO_WORDS[helloIndex];

  return (
    <div className="home-root">
      <Background />

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-eyebrow">✦ Real-time translation for everyone</div>

        <h1 className="hero-title">
          Say it in any language.
          <br />
          <span className="hero-accent">UniVoice</span> says it back.
        </h1>

        <p className="hero-sub">
          Type, speak, or paste — get instant, accurate translations
          <br className="hide-mobile" /> powered by Microsoft Azure across 70+ languages.
        </p>

        {/* Animated language cycler */}
        <div className="hello-box">
          <span className="hello-label">Say hello in {current.lang}</span>
          <span className={`hello-word ${visible ? "hello-in" : "hello-out"}`}>
            {current.word}
          </span>
        </div>

        <div className="hero-actions">
          <button className="btn-primary" onClick={() => navigate("/translate")}>
            Start Translating →
          </button>
          <button className="btn-ghost" onClick={() => {
            featuresRef.current?.scrollIntoView({ behavior: "smooth" });
          }}>
            See features ↓
          </button>
        </div>

        {/* Floating image */}
        <div className="hero-image-wrap">
          <div className="hero-image-glow" />
          <img src="/frontpic.png" alt="UniVoice app preview" className="hero-image" />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-section">
        {STATS.map((s) => (
          <div className="stat-card" key={s.label}>
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section" ref={featuresRef}>
        <div className="section-eyebrow">What makes UniVoice different</div>
        <h2 className="section-title">Everything you need to break language barriers</h2>

        <div className={`features-grid ${featuresVisible ? "features-visible" : ""}`}>
          {FEATURES.map((f, i) => (
            <div className="feature-card" key={f.title} style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-card">
          <div className="cta-glow" />
          <h2 className="cta-title">Ready to speak the world's languages?</h2>
          <p className="cta-sub">Free forever. No account needed. Just translate.</p>
          <button className="btn-primary btn-large" onClick={() => navigate("/translate")}>
            Open Translator →
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <span>© 2026 UniVoice</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span>Built with ♥ </span>
      </footer>

      <style>{`
        .home-root {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          color: white;
          font-family: 'Poppins', sans-serif;
        }

        /* ── HERO ── */
        .hero-section {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 80px 24px 40px;
        }

        .hero-eyebrow {
          font-size: 13px;
          letter-spacing: 1.5px;
          color: #5B8CFF;
          background: rgba(91,140,255,0.12);
          border: 1px solid rgba(91,140,255,0.25);
          padding: 7px 18px;
          border-radius: 30px;
          margin-bottom: 28px;
          backdrop-filter: blur(10px);
        }

        .hero-title {
          font-size: clamp(32px, 6vw, 62px);
          font-weight: 700;
          line-height: 1.15;
          margin: 0 0 20px;
          letter-spacing: -0.5px;
          max-width: 720px;
        }

        .hero-accent {
          background: linear-gradient(135deg, #5B8CFF, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: none;
        }

        .hero-sub {
          font-size: clamp(14px, 2vw, 17px);
          color: rgba(255,255,255,0.65);
          line-height: 1.7;
          margin: 0 0 36px;
          max-width: 520px;
        }

        .hide-mobile { display: inline; }
        @media (max-width: 500px) { .hide-mobile { display: none; } }

        /* Hello cycler */
        .hello-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          margin-bottom: 36px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 20px;
          padding: 18px 40px;
          backdrop-filter: blur(14px);
          min-width: 220px;
        }

        .hello-label {
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.5px;
        }

        .hello-word {
          font-size: clamp(28px, 5vw, 44px);
          font-weight: 600;
          letter-spacing: 1px;
          background: linear-gradient(135deg, #ffffff, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: opacity 0.35s ease, transform 0.35s ease;
        }

        .hello-in { opacity: 1; transform: translateY(0); }
        .hello-out { opacity: 0; transform: translateY(-12px); }

        /* Buttons */
        .hero-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 56px;
        }

        .btn-primary {
          padding: 14px 32px;
          border-radius: 16px;
          background: #5B8CFF;
          color: white;
          border: none;
          font-family: inherit;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: 0.3s;
          letter-spacing: 0.3px;
          box-shadow: 0 0 24px rgba(91,140,255,0.4);
        }

        .btn-primary:hover {
          background: rgba(91,140,255,0.8);
          transform: translateY(-2px);
          box-shadow: 0 0 35px rgba(91,140,255,0.55);
        }

        .btn-large { padding: 16px 42px; font-size: 16px; }

        .btn-ghost {
          padding: 14px 28px;
          border-radius: 16px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.8);
          font-family: inherit;
          font-size: 15px;
          cursor: pointer;
          transition: 0.3s;
          backdrop-filter: blur(10px);
        }

        .btn-ghost:hover {
          background: rgba(255,255,255,0.13);
          color: white;
        }

        /* Hero image */
        .hero-image-wrap {
          position: relative;
          display: flex;
          justify-content: center;
        }

        .hero-image-glow {
          position: absolute;
          width: 70%;
          height: 60%;
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: radial-gradient(ellipse, rgba(91,140,255,0.35) 0%, transparent 70%);
          filter: blur(30px);
          z-index: 0;
        }

        .hero-image {
          width: 90%;
          max-width: 520px;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(12px);
          padding: 10px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          animation: floatImg 4s ease-in-out infinite;
          position: relative;
          z-index: 1;
        }

        @keyframes floatImg {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }

        /* ── STATS ── */
        .stats-section {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 16px;
          padding: 60px 24px 40px;
          max-width: 860px;
          margin: 0 auto;
        }

        .stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 20px;
          padding: 22px 36px;
          backdrop-filter: blur(14px);
          min-width: 140px;
          flex: 1;
          transition: 0.3s;
        }

        .stat-card:hover {
          background: rgba(91,140,255,0.12);
          border-color: rgba(91,140,255,0.3);
          transform: translateY(-4px);
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(135deg, #5B8CFF, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-label {
          font-size: 13px;
          color: rgba(255,255,255,0.55);
          letter-spacing: 0.3px;
        }

        /* ── FEATURES ── */
        .features-section {
          position: relative;
          z-index: 2;
          padding: 60px 24px;
          max-width: 1000px;
          margin: 0 auto;
          text-align: center;
        }

        .section-eyebrow {
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #5B8CFF;
          margin-bottom: 14px;
        }

        .section-title {
          font-size: clamp(22px, 4vw, 36px);
          font-weight: 600;
          margin: 0 0 48px;
          color: white;
          line-height: 1.3;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .feature-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 28px 24px;
          text-align: left;
          backdrop-filter: blur(14px);
          transition: transform 0.5s ease, opacity 0.5s ease, background 0.3s;
          opacity: 0;
          transform: translateY(30px);
        }

        .features-visible .feature-card {
          opacity: 1;
          transform: translateY(0);
        }

        .feature-card:hover {
          background: rgba(91,140,255,0.1);
          border-color: rgba(91,140,255,0.25);
          transform: translateY(-4px) !important;
        }

        .feature-icon { font-size: 30px; margin-bottom: 14px; }

        .feature-title {
          font-size: 16px;
          font-weight: 600;
          color: white;
          margin: 0 0 10px;
        }

        .feature-desc {
          font-size: 14px;
          color: rgba(255,255,255,0.55);
          line-height: 1.65;
          margin: 0;
        }

        /* ── CTA ── */
        .cta-section {
          position: relative;
          z-index: 2;
          padding: 40px 24px 60px;
          display: flex;
          justify-content: center;
        }

        .cta-card {
          position: relative;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.13);
          border-radius: 28px;
          padding: 56px 40px;
          text-align: center;
          backdrop-filter: blur(20px);
          max-width: 640px;
          width: 100%;
          overflow: hidden;
        }

        .cta-glow {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(91,140,255,0.25) 0%, transparent 70%);
          top: -80px;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        }

        .cta-title {
          font-size: clamp(20px, 3.5vw, 30px);
          font-weight: 600;
          margin: 0 0 12px;
          color: white;
          position: relative;
          z-index: 1;
        }

        .cta-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.55);
          margin: 0 0 32px;
          position: relative;
          z-index: 1;
        }

        /* ── FOOTER ── */
        .footer {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: center;
          gap: 12px;
          padding: 20px 24px 36px;
          font-size: 13px;
          color: rgba(255,255,255,0.35);
        }

        /* ── LIGHT MODE ── */
        .light .home-root { color: #1b1d2e; }
        .light .hero-title { color: #1b1d2e; }
        .light .hero-sub { color: rgba(27,29,46,0.6); }
        .light .hello-box {
          background: rgba(255,255,255,0.6);
          border-color: rgba(255,255,255,0.7);
        }
        .light .hello-label { color: rgba(27,29,46,0.5); }
        .light .hero-eyebrow {
          background: rgba(91,140,255,0.1);
          color: #3b6fff;
        }
        .light .btn-ghost {
          background: rgba(255,255,255,0.6);
          border-color: rgba(255,255,255,0.7);
          color: #1b1d2e;
        }
        .light .stat-card {
          background: rgba(255,255,255,0.6);
          border-color: rgba(255,255,255,0.7);
        }
        .light .stat-label { color: rgba(27,29,46,0.5); }
        .light .feature-card {
          background: rgba(255,255,255,0.55);
          border-color: rgba(255,255,255,0.7);
        }
        .light .feature-title { color: #1b1d2e; }
        .light .feature-desc { color: rgba(27,29,46,0.55); }
        .light .section-title { color: #1b1d2e; }
        .light .cta-card {
          background: rgba(255,255,255,0.6);
          border-color: rgba(255,255,255,0.7);
        }
        .light .cta-title { color: #1b1d2e; }
        .light .cta-sub { color: rgba(27,29,46,0.55); }
        .light .footer { color: rgba(27,29,46,0.4); }
      `}</style>
    </div>
  );
}