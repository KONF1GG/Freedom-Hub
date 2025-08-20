import { useUIStore } from "../../stores/uiStore";

export default function Toaster() {
  const toasts = useUIStore((s) => s.toasts);

  return (
    <div className="fixed bottom-4 inset-x-0 z-50 px-4 space-y-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="mx-auto max-w-sm rounded-lg bg-slate-900/90 border border-slate-800 px-3 py-2 text-sm text-center shadow-xl pointer-events-auto"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
