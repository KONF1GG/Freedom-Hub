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
    <div className="min-h-screen d-flex align-items-center justify-content-center p-4">
      <div className="card" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body">
          <div className="text-center mb-6">
            <h1 className="card-title">Freedom Hub</h1>
            <p className="text-secondary">Войдите в систему</p>
          </div>

          {/* Кнопка входа через Telegram */}
          <div className="mb-6">
            <TelegramLoginButton variant="primary" size="lg" />

            <div className="d-flex align-items-center gap-3 my-4">
              <div
                className="flex-grow-1"
                style={{
                  height: "1px",
                  backgroundColor: "var(--color-border)",
                }}
              ></div>
              <span className="text-muted">или</span>
              <div
                className="flex-grow-1"
                style={{
                  height: "1px",
                  backgroundColor: "var(--color-border)",
                }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
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

            {error && <div className="text-danger text-center">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? "Вход..." : "Войти с паролем"}
            </button>
          </form>
        </div>
      </div>

      <InstallPwaHint />
    </div>
  );
}
