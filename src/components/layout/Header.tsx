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

          <div className="d-flex align-items-center gap-3">
            <button onClick={logout} className="btn btn-danger">
              Выйти
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
