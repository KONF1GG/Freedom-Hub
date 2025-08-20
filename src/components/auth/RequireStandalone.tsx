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
    <div className="min-h-screen grid place-items-center p-6 bg-slate-900">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-xl p-6 text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h2 className="text-xl font-semibold text-white">
          Установите приложение
        </h2>

        <p className="text-sm text-slate-300">
          Для доступа к приложению установите его на устройство
        </p>

        <div className="flex justify-center gap-3">
          <button
            className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 transition-colors"
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
            Установить
          </button>
        </div>

        <p className="text-xs text-slate-400">
          После установки откройте приложение и войдите ещё раз
        </p>

        {showHelp && (
          <div className="mt-4 p-3 bg-slate-700 rounded-lg">
            <p className="text-xs text-slate-300 mb-2">
              <strong>Инструкция по установке:</strong>
            </p>
            {isIosDevice ? (
              <p className="text-xs text-slate-300">
                1. Откройте Safari
                <br />
                2. Нажмите кнопку "Поделиться" (квадрат со стрелкой)
                <br />
                3. Выберите "На экран «Домой»"
              </p>
            ) : isAndroidDevice ? (
              <p className="text-xs text-slate-300">
                1. Откройте меню браузера (три точки)
                <br />
                2. Выберите "Установить приложение"
                <br />
                3. Подтвердите установку
              </p>
            ) : (
              <p className="text-xs text-slate-300">
                Откройте меню браузера и выберите "Установить приложение"
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
