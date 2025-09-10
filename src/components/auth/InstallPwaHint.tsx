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
    <div className="card">
      <div className="card-body text-center">
        <div className="mb-4">
          <div className="mb-3" style={{ fontSize: "2.5rem" }}>
            📱
          </div>
          <h3 className="font-semibold text-lg mb-2">Установите приложение</h3>
          <p className="text-secondary">
            Для лучшего опыта использования установите Freedom Hub на ваше
            устройство
          </p>
        </div>

        <button onClick={handleInstallClick} className="btn btn-primary mb-4">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-2"
          >
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </svg>
          Установить
        </button>

        {showHelp && (
          <div className="text-left">
            <div className="text-sm text-secondary">
              {isIosDevice ? (
                <>Откройте меню Safari и выберите «На экран "Домой"»</>
              ) : isAndroidDevice ? (
                <>Откройте меню браузера и выберите «Установить приложение»</>
              ) : (
                <>Откройте меню браузера и выберите «Установить приложение»</>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
