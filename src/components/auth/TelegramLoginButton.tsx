import { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";

interface TelegramLoginButtonProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

// Функция для создания Telegram Login Widget
const createTelegramLoginWidget = (onAuth: (user: any) => void) => {
  // Очищаем предыдущий виджет
  const existingScript = document.querySelector(
    'script[src*="telegram.org/js/telegram-widget"]'
  );
  if (existingScript) {
    existingScript.remove();
  }

  // Создаем callback функцию в глобальном объекте
  (window as any).onTelegramAuth = onAuth;

  // Создаем элемент для виджета
  const widgetContainer = document.createElement("div");
  widgetContainer.id = "telegram-login-widget";

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://telegram.org/js/telegram-widget.js?22";
  script.setAttribute(
    "data-telegram-login",
    import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "your_bot_username"
  );
  script.setAttribute("data-size", "large");
  script.setAttribute("data-onauth", "onTelegramAuth(user)");
  script.setAttribute("data-request-access", "write");

  widgetContainer.appendChild(script);
  return widgetContainer;
};

export default function TelegramLoginButton({
  variant = "primary",
  size = "md",
}: TelegramLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWidget, setShowWidget] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleTelegramAuth = async (user: any) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Получен Telegram ID:", user.id);

      // Отправляем только telegramId на тот же роут /auth
      await login({
        telegramId: user.id,
      });

      navigate("/");
    } catch (error: any) {
      console.error("Ошибка при входе через Telegram:", error);
      setError(error.message || "Неизвестная ошибка");
    } finally {
      setIsLoading(false);
      setShowWidget(false);
    }
  };

  const handleTelegramLogin = () => {
    if (!import.meta.env.VITE_TELEGRAM_BOT_USERNAME) {
      setError("Не настроен BOT_USERNAME в конфигурации");
      return;
    }

    setShowWidget(true);
    setError(null);
  };

  useEffect(() => {
    if (showWidget) {
      const widget = createTelegramLoginWidget(handleTelegramAuth);
      const container = document.getElementById("telegram-widget-container");
      if (container) {
        container.innerHTML = "";
        container.appendChild(widget);
      }
    }
  }, [showWidget]);

  const getButtonText = () => {
    if (isLoading) return "Вход...";
    if (showWidget) return "Авторизуйтесь в Telegram";
    return "Войти через Telegram";
  };

  return (
    <div className="d-flex flex-column gap-4">
      {!showWidget ? (
        <button
          type="button"
          onClick={handleTelegramLogin}
          disabled={isLoading}
          className={`btn ${
            variant === "primary" ? "btn-primary" : "btn-secondary"
          } ${size === "lg" ? "btn-lg" : size === "sm" ? "btn-sm" : ""}`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-2"
          >
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
          {getButtonText()}
        </button>
      ) : (
        <div className="text-center">
          <p className="text-secondary mb-4">
            Нажмите кнопку ниже для авторизации через Telegram:
          </p>
          <div
            id="telegram-widget-container"
            className="d-flex justify-content-center mb-4"
          ></div>
          <button
            type="button"
            onClick={() => setShowWidget(false)}
            className="btn btn-secondary"
          >
            Отмена
          </button>
        </div>
      )}

      {error && <div className="text-danger text-center">{error}</div>}

      {!showWidget && (
        <p className="text-muted text-center text-sm">
          Получим ваш Telegram ID для авторизации
        </p>
      )}
    </div>
  );
}
