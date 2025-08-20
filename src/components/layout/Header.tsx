import { useAuthStore } from "../../stores/authStore";

export default function Header() {
  const { logout, employer } = useAuthStore();

  return (
    <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
      <div className="container-responsive py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">Freedom Hub</h1>
            {employer && (
              <span className="text-sm text-slate-300">{employer}</span>
            )}
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Выйти
          </button>
        </div>
      </div>
    </header>
  );
}
