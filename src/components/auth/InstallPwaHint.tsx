import { useEffect, useState } from "react";
import { shouldShowInstallPrompt, isAndroid, isIOS } from "../../utils/pwa";

export default function InstallPwaHint() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    // Показываем только на мобильных устройствах
    if (!shouldShowInstallPrompt()) {
      return;
    }

    function onBeforeInstallPrompt(e: any) {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    }

    function onAppInstalled() {
      setVisible(false);
      setDeferredPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  // Не показываем на десктопе
  if (!shouldShowInstallPrompt() || !visible) return null;

  const isIosDevice = isIOS();
  const isAndroidDevice = isAndroid();

  async function handleInstallClick() {
    if (deferredPrompt?.prompt) {
      deferredPrompt.prompt();
      try {
        const choice = await deferredPrompt.userChoice;
        if (choice?.outcome === "accepted") {
          setVisible(false);
        } else if (choice?.outcome === "dismissed") {
          setShowHelp(true);
        }
      } finally {
        setDeferredPrompt(null);
      }
    } else {
      setShowHelp(true);
    }
  }

  return (
    <div className="fixed bottom-4 inset-x-0 px-4 z-50">
      <div className="mx-auto max-w-sm bg-slate-900/95 border border-slate-800 rounded-xl p-4 shadow-xl backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-slate-100">
            Установите приложение для лучшего опыта
          </div>
          <button
            className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 transition-colors"
            onClick={handleInstallClick}
          >
            Установить
          </button>
        </div>
        {showHelp && (
          <div className="mt-3 text-xs text-slate-300">
            {isIosDevice ? (
              <>Откройте меню Safari и выберите «На экран "Домой"»</>
            ) : isAndroidDevice ? (
              <>Откройте меню браузера и выберите «Установить приложение»</>
            ) : (
              <>Откройте меню браузера и выберите «Установить приложение»</>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
