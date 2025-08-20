// PWA helper для определения мобильных устройств и standalone режима
export function isStandalone(): boolean {
	return window.matchMedia('(display-mode: standalone)').matches || 
		   (window.navigator as any).standalone === true;
}

export function isMobileDevice(): boolean {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
		   window.innerWidth <= 768;
}

export function isAndroid(): boolean {
	return /Android/i.test(navigator.userAgent);
}

export function isIOS(): boolean {
	return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function shouldShowInstallPrompt(): boolean {
	// Показываем только на мобильных устройствах
	return isMobileDevice() && !isStandalone();
}

export function onSWUpdateReady(cb: () => void) {
	// vite-plugin-pwa внедряет `window.__WB_MANIFEST` и регистрацию service worker
	// Слушаем событие нового контента при использовании autoUpdate
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.addEventListener('controllerchange', () => {
			cb();
		});
	}
}

export function registerServiceWorker(): Promise<void> {
	return new Promise((resolve, reject) => {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('/sw.js')
				.then((registration) => {
					console.log('SW registered: ', registration);
					resolve();
				})
				.catch((registrationError) => {
					console.log('SW registration failed: ', registrationError);
					reject(registrationError);
				});
		} else {
			reject(new Error('Service Worker не поддерживается'));
		}
	});
}


