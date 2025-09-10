import { PropsWithChildren, useEffect, useState } from "react";
import {
  isStandalone,
  shouldShowInstallPrompt,
  isAndroid,
  isIOS,
} from "../../utils/pwa";

export default function RequireStandalone({ children }: PropsWithChildren) {
  const [standalone, setStandalone] = useState(isStandalone());
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const onChange = () => setStandalone(isStandalone());
    window
      .matchMedia("(display-mode: standalone)")
      .addEventListener("change", onChange);

    const onBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const onAppInstalled = () => setDeferredPrompt(null);

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window
        .matchMedia("(display-mode: standalone)")
        .removeEventListener("change", onChange);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  // На десктопе не требуем PWA
  if (!shouldShowInstallPrompt()) {
    return <>{children}</>;
  }

  if (standalone) return <>{children}</>;

  const isIosDevice = isIOS();
  const isAndroidDevice = isAndroid();

  return (
    <div className="modal-overlay show">
      <div className="modal-content">
        <div className="card-body text-center">
          <div className="mb-6">
            <div className="mb-4" style={{ fontSize: "4rem" }}>
              📱
            </div>
            <h2 className="card-title mb-3">Установите приложение</h2>
            <p className="text-secondary">
              Для доступа к приложению установите его на устройство
            </p>
          </div>

          <div className="mb-6">
            <button
              className="btn btn-primary btn-lg"
              onClick={async () => {
                if (deferredPrompt?.prompt) {
                  deferredPrompt.prompt();
                  try {
                    const choice = await deferredPrompt.userChoice;
                    if (choice?.outcome === "accepted") return;
                  } finally {
                    setDeferredPrompt(null);
                  }
                } else {
                  setShowHelp(true);
                }
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="mr-2"
              >
                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
              </svg>
              Установить
            </button>
          </div>

          <p className="text-muted text-sm mb-4">
            После установки откройте приложение и войдите ещё раз
          </p>

          {showHelp && (
            <div className="text-left">
              <h3 className="font-semibold text-lg mb-3">
                Инструкция по установке:
              </h3>
              <div className="d-flex flex-column gap-3">
                {isIosDevice ? (
                  <>
                    <div className="d-flex align-items-start gap-3">
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: "var(--color-primary)",
                          color: "white",
                          fontSize: "14px",
                          flexShrink: 0,
                        }}
                      >
                        1
                      </div>
                      <div className="text-secondary">Откройте Safari</div>
                    </div>
                    <div className="d-flex align-items-start gap-3">
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: "var(--color-accent)",
                          color: "white",
                          fontSize: "14px",
                          flexShrink: 0,
                        }}
                      >
                        2
                      </div>
                      <div className="text-secondary">
                        Нажмите кнопку "Поделиться" (квадрат со стрелкой)
                      </div>
                    </div>
                    <div className="d-flex align-items-start gap-3">
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: "var(--color-teal)",
                          color: "white",
                          fontSize: "14px",
                          flexShrink: 0,
                        }}
                      >
                        3
                      </div>
                      <div className="text-secondary">
                        Выберите "На экран «Домой»"
                      </div>
                    </div>
                  </>
                ) : isAndroidDevice ? (
                  <>
                    <div className="d-flex align-items-start gap-3">
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: "var(--color-primary)",
                          color: "white",
                          fontSize: "14px",
                          flexShrink: 0,
                        }}
                      >
                        1
                      </div>
                      <div className="text-secondary">
                        Откройте меню браузера (три точки)
                      </div>
                    </div>
                    <div className="d-flex align-items-start gap-3">
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: "var(--color-accent)",
                          color: "white",
                          fontSize: "14px",
                          flexShrink: 0,
                        }}
                      >
                        2
                      </div>
                      <div className="text-secondary">
                        Выберите "Установить приложение"
                      </div>
                    </div>
                    <div className="d-flex align-items-start gap-3">
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: "var(--color-teal)",
                          color: "white",
                          fontSize: "14px",
                          flexShrink: 0,
                        }}
                      >
                        3
                      </div>
                      <div className="text-secondary">
                        Подтвердите установку
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-secondary">
                    Откройте меню браузера и выберите "Установить приложение"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
