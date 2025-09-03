import { useUIStore } from "../../stores/uiStore";

export default function Toaster() {
  const toasts = useUIStore((s) => s.toasts);

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          {t.message}
        </div>
      ))}
    </div>
  );
}
