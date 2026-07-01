# 🌐 UniVoice — Multilingual Translation Web App

> Translate instantly, connect globally.

**UniVoice** is a modern, full-stack multilingual translation web app built with React + Vite. It supports 70+ languages, voice input, text-to-speech, and a beautiful glassmorphism UI with dark/light mode.

🔗 **Live Demo:** [uni-voice-five.vercel.app](https://uni-voice-five.vercel.app)  
🔗 **Backend Repo:** [github.com/kajalmishra1/UniVoice-Backend](https://github.com/kajalmishra1/UniVoice-Backend)

---

## ✨ Features

- 🌍 **70+ Languages** — Translate between 70+ languages with a searchable dropdown
- 🎤 **Voice Input** — Speak your text using the Web Speech API
- 🔊 **Text-to-Speech** — Listen to the translated text in the target language
- 📋 **Copy Button** — Copy translation to clipboard instantly
- 🕐 **Translation History** — View and reuse past translations
- 🌙 **Dark / Light Mode** — Premium glassmorphism design in both themes
- ⚡ **Auto Language Detection** — Detects source language automatically
- 💬 **Quick Phrases** — One-click common phrases for fast translation
- 📱 **Responsive Design** — Works on mobile, tablet, and desktop
- ✍️ **Typing Animation** — Smooth character-by-character output effect
- 🔄 **Shimmer Loading** — Beautiful skeleton loader while translating

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | Frontend UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| React Router DOM | Client-side routing |
| Axios | HTTP requests to backend |
| Web Speech API | Voice input & text-to-speech |
| Vercel | Frontend deployment |

---

## 📁 Project Structure

```
univoice-frontend/
├── public/
│   └── frontpic.png
├── src/
│   ├── components/
│   │   ├── Background.jsx       # Animated background bubbles & blobs
│   │   ├── HistoryPanel.jsx     # Slide-in translation history panel
│   │   ├── LangSelector.jsx     # Language dropdown with search
│   │   └── TranslatorCard.jsx   # Main translator UI component
│   ├── pages/
│   │   ├── Home.jsx             # Landing/welcome page
│   │   └── TranslatePage.jsx    # Translator page
│   ├── App.jsx                  # Root component with routing
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── index.html
├── vite.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/kajalmishra1/UniVoice.git

# Navigate to the project
cd UniVoice

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:5000
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

---

## 🌐 Deployment

This project is deployed on **Vercel**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kajalmishra1/UniVoice)

**Steps:**
1. Fork this repo
2. Go to [vercel.com](https://vercel.com) → Import project
3. Add environment variable: `VITE_API_URL=your_backend_url`
4. Deploy

---

## 📸 Screenshots

| Dark Mode | Light Mode |
|---|---|
| ![Dark Mode](https://via.placeholder.com/400x250/010105/5B8CFF?text=Dark+Mode) | ![Light Mode](https://via.placeholder.com/400x250/eef1fb/5B8CFF?text=Light+Mode) |

---

## 🔗 Related

- 🔧 **Backend API:** [UniVoice-Backend](https://github.com/kajalmishra1/UniVoice-Backend) — Node.js + Express REST API

---

## 👩‍💻 Author

**Kajal Mishra**  
[![GitHub](https://img.shields.io/badge/GitHub-kajalmishra1-black?logo=github)](https://github.com/kajalmishra1)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
