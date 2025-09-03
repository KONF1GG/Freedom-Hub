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
    <div className="pwa-hint">
      <div className="pwa-hint-content">
        <div className="pwa-hint-text">
          Установите приложение для лучшего опыта
        </div>
        <button className="pwa-hint-button" onClick={handleInstallClick}>
          Установить
        </button>
      </div>
      {showHelp && (
        <div className="pwa-hint-help">
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
  );
}
