import { useEffect } from "react";
import { isStandalone } from "../../utils/pwa";

export function StandaloneEnforcer() {
  useEffect(() => {
    if (!isStandalone()) {
      // Принудительно остаёмся в PWA режиме: блокируем навигацию на внешние URL
      // В веб-версии оставляем всё как есть; ключевая логика — не открывать новые окна
      document.querySelectorAll('a[target="_blank"]').forEach((a) => {
        a.removeAttribute("target");
      });
    }
  }, []);
  return null;
}
