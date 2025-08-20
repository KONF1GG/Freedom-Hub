// Telegram OAuth Configuration
export const TELEGRAM_CONFIG = {
  // Bot Token - нужно будет заменить на реальный токен вашего бота
  BOT_TOKEN: import.meta.env.VITE_TELEGRAM_BOT_TOKEN || "",

  // Bot Username - нужно будет заменить на реальное имя вашего бота
  BOT_USERNAME: import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "",

  // Login Widget URL для Telegram
  OAUTH_URL: "https://oauth.telegram.org/auth",

  // Redirect URI после авторизации
  REDIRECT_URI:
    import.meta.env.VITE_TELEGRAM_REDIRECT_URI ||
    window.location.origin + "/auth/telegram-callback",

  // Scope для запрашиваемых разрешений
  SCOPE: "basic",

  // Request ID для OAuth
  REQUEST_ID: "freedom_hub_auth",
};

// Проверка доступности Telegram Web App
export const isTelegramWebApp = (): boolean => {
  return (
    typeof window !== "undefined" &&
    "Telegram" in window &&
    "WebApp" in (window as any).Telegram
  );
};

// Получение данных пользователя из Telegram Web App
export const getTelegramUserData = () => {
  if (isTelegramWebApp()) {
    const webApp = (window as any).Telegram.WebApp;
    return {
      id: webApp.initDataUnsafe?.user?.id,
      username: webApp.initDataUnsafe?.user?.username,
      firstName: webApp.initDataUnsafe?.user?.first_name,
      lastName: webApp.initDataUnsafe?.user?.last_name,
      languageCode: webApp.initDataUnsafe?.user?.language_code,
      isPremium: webApp.initDataUnsafe?.user?.is_premium,
      photoUrl: webApp.initDataUnsafe?.user?.photo_url,
    };
  }
  return null;
};
