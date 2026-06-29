export default function Background() {
  return (
    <>
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Gradient blobs */}
        <div className="absolute w-96 h-96 rounded-full -top-24 -left-24 bg-blue-500 opacity-30 blur-[80px] animate-blob1" />
        <div className="absolute w-96 h-96 rounded-full -bottom-24 -right-24 bg-purple-600 opacity-30 blur-[80px] animate-blob2" />

        {/* Floating bubbles */}
        <div className="bubble" style={{ top: "12%", left: "8%", background: "linear-gradient(145deg, #cba6f7, #7c4dff)", animationName: "floatUp", animationDuration: "8s" }}>A</div>
        <div className="bubble" style={{ top: "65%", left: "12%", background: "linear-gradient(145deg, #5B8CFF, #2b5cff)", animationName: "floatSide", animationDuration: "10s", animationDelay: "1s" }}>あ</div>
        <div className="bubble" style={{ top: "20%", left: "88%", background: "linear-gradient(145deg, #ff9f43, #ff6b00)", animationName: "rotateBubble", animationDuration: "12s", animationDelay: "2s" }}>文</div>
        <div className="bubble" style={{ top: "78%", left: "80%", background: "linear-gradient(145deg, #490a2e, #7c4dff)", animationName: "zigzag", animationDuration: "14s", animationDelay: "3s" }}>ह</div>
        <div className="bubble" style={{ top: "45%", left: "50%", background: "linear-gradient(145deg, #43ff64, #4dffb4)", animationName: "slowFloat", animationDuration: "16s", animationDelay: "4s", opacity: 0.3 }}>Ж</div>
      </div>

      <style>{`
        .bubble {
          position: absolute;
          width: 65px;
          height: 65px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: bold;
          border-radius: 20px;
          color: white;
          opacity: 0.5;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          box-shadow: 6px 6px 15px rgba(0,0,0,0.5), inset 3px 3px 6px rgba(255,255,255,0.3);
        }

        .light .bubble { opacity: 0.85; }
        .light .animate-blob1 { opacity: 0.45 !important; }
        .light .animate-blob2 { opacity: 0.45 !important; }

        @keyframes floatUp {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
        @keyframes floatSide {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(40px); }
        }
        @keyframes rotateBubble {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          50% { transform: rotate(12deg) translateY(-20px); }
        }
        @keyframes zigzag {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(15px, -15px); }
          50% { transform: translate(-15px, -30px); }
          75% { transform: translate(15px, -15px); }
        }
        @keyframes slowFloat {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(40px, -20px); }
        }
        @keyframes blob1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(80px, 60px) scale(1.2); }
        }
        @keyframes blob2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-80px, -60px) scale(1.3); }
        }
        .animate-blob1 { animation: blob1 10s ease-in-out infinite; }
        .animate-blob2 { animation: blob2 12s ease-in-out infinite; }
      `}</style>
    </>
  );
}