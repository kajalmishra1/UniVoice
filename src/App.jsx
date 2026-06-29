import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TranslatePage from "./pages/TranslatePage";

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("univoice-theme") ||
      (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  });

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    localStorage.setItem("univoice-theme", theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/translate" element={
          <TranslatePage
            theme={theme}
            toggleTheme={() => setTheme((t) => t === "dark" ? "light" : "dark")}
          />
        } />
      </Routes>
    </BrowserRouter>
  );
}