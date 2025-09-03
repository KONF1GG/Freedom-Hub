import { useAuthStore } from "../../stores/authStore";

export default function Header() {
  const { logout, employer } = useAuthStore();

  return (
    <header>
      <div className="header-container">
        <div className="header-content">
          <div className="header-brand">
            <h1>Freedom Hub</h1>
            {employer && <span className="employer-name">{employer}</span>}
          </div>

          <button onClick={logout} className="logout-button">
            Выйти
          </button>
        </div>
      </div>
    </header>
  );
}
