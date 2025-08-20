import { useEffect } from 'react';
import { isStandalone } from '../utils/pwa';

// Гарантируем, что после авторизации остаёмся в standalone: если открыто в браузере, предложим установить
export function useStandaloneGuard() {
	useEffect(() => {
		if (!isStandalone()) {
			// Показываем предупреждение или перенаправляем
			console.warn('Приложение должно быть запущено в PWA режиме');
		}
	}, []);
}


