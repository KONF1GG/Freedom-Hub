import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./pages/App";
import "./index.css";

// Устанавливаем темную тему по умолчанию
document.documentElement.setAttribute("data-theme", "dark");

// Отключаем зум через колесо мыши
document.addEventListener(
  "wheel",
  (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
    }
  },
  { passive: false }
);

// Отключаем зум через клавиатуру
document.addEventListener("keydown", (e) => {
  if (
    (e.ctrlKey || e.metaKey) &&
    (e.key === "+" || e.key === "-" || e.key === "=" || e.key === "0")
  ) {
    e.preventDefault();
  }
});

// Отключаем зум через жесты на мобильных
document.addEventListener("gesturestart", (e) => {
  e.preventDefault();
});

document.addEventListener("gesturechange", (e) => {
  e.preventDefault();
});

document.addEventListener("gestureend", (e) => {
  e.preventDefault();
});

// Регистрация PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
