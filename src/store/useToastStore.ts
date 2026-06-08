import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

interface ToastState {
  toasts: ToastItem[];
  showToast: (type: ToastType, message: string, duration?: number) => string;
  removeToast: (id: string) => void;
  clear: () => void;
}

let toastSeq = 0;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  showToast(type, message, duration = 2800) {
    toastSeq++;
    const id = `t_${Date.now()}_${toastSeq}`;
    const item: ToastItem = { id, type, message, duration };
    set({ toasts: [...get().toasts, item] });
    if (duration > 0) {
      setTimeout(() => {
        set({ toasts: get().toasts.filter(t => t.id !== id) });
      }, duration);
    }
    return id;
  },
  removeToast(id) {
    set({ toasts: get().toasts.filter(t => t.id !== id) });
  },
  clear() {
    set({ toasts: [] });
  }
}));
