import { create } from 'zustand';

type Toast = { id: string; message: string };

type UIState = {
	toasts: Toast[];
	showToast: (message: string, ttlMs?: number) => void;
};

export const useUIStore = create<UIState>((set, get) => ({
	toasts: [],
	showToast: (message: string, ttlMs: number = 1600) => {
		const id = crypto.randomUUID();
		set({ toasts: [...get().toasts, { id, message }] });
		setTimeout(() => {
			set({ toasts: get().toasts.filter((t) => t.id !== id) });
		}, ttlMs);
	},
}));






