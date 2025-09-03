import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import InstallPwaHint from "../../components/auth/InstallPwaHint";
import TelegramLoginButton from "../../components/auth/TelegramLoginButton";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await login({ login: username, password });

      if (result.token || result.authtoken) {
        navigate("/");
      } else {
        setError(result.error || result.message || "Ошибка входа");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      setError("Ошибка сети");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Freedom Hub</h1>
          <p>Войдите в систему</p>
        </div>

        {/* Кнопка входа через Telegram */}
        <div className="login-telegram-section">
          <TelegramLoginButton variant="primary" size="lg" className="w-full" />

          <div className="login-divider">
            <div className="login-divider-line"></div>
            <div className="login-divider-text">
              <span>или</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Имя пользователя
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder="Введите имя пользователя"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Введите пароль"
              required
            />
          </div>

          {error && <div className="login-error-message">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="login-submit-button"
          >
            {isLoading ? "Вход..." : "Войти с паролем"}
          </button>
        </form>
      </div>

      <InstallPwaHint />
    </div>
  );
}
