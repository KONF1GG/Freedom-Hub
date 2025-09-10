import { useUIStore } from "../../stores/uiStore";

export default function Toaster() {
  const toasts = useUIStore((s) => s.toasts);

  return (
    <div
      className="position-fixed"
      style={{
        top: "var(--spacing-4)",
        right: "var(--spacing-4)",
        zIndex: "var(--z-modal)",
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`notification show bounce-in`}
          style={{ cursor: "pointer", marginBottom: "var(--spacing-2)" }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor: "var(--color-primary)",
                color: "white",
                fontSize: "12px",
              }}
            >
              ℹ
            </div>
            <div className="flex-grow-1">
              <div className="text-sm font-medium">{t.message}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
