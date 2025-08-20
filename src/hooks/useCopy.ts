import { useCallback } from 'react';

export const useCopy = () => {
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Ошибка копирования:', err);
      return false;
    }
  }, []);

  return { copyToClipboard };
};
