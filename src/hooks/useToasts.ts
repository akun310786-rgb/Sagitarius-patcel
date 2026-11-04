/**
 * useToasts.ts
 * Custom hook untuk mengelola notifikasi toast di aplikasi.
 */

import { useState, useCallback } from 'react';
import { ToastNotification, ToastType } from '../types/toast';

export const useToasts = () => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = useCallback(
    (notification: Omit<ToastNotification, 'id' | 'timestamp'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const newToast: ToastNotification = {
        ...notification,
        id,
        timestamp: new Date().toISOString(),
      };
      setToasts((prev) => [...prev, newToast]);

      // Hapus otomatis setelah 5 detik untuk success/info, 8 detik untuk error
      const duration = notification.type === 'error' ? 8000 : 5000;
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const success = useCallback(
    (title: string, message?: string) =>
      addToast({ type: 'success', title, message: message || '' }),
    [addToast]
  );

  const error = useCallback(
    (title: string, message?: string) =>
      addToast({ type: 'error', title, message: message || '' }),
    [addToast]
  );

  const warning = useCallback(
    (title: string, message?: string) =>
      addToast({ type: 'warning', title, message: message || '' }),
    [addToast]
  );

  const info = useCallback(
    (title: string, message?: string) =>
      addToast({ type: 'info', title, message: message || '' }),
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    clearAll,
    success,
    error,
    warning,
    info,
  };
};