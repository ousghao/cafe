import { useState, useCallback } from 'react';
import { CustomToastProps } from '@/components/ui/custom-toast';

export function useCustomToast() {
  const [toasts, setToasts] = useState<CustomToastProps[]>([]);

  const addToast = useCallback((toast: Omit<CustomToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: CustomToastProps = {
      ...toast,
      id,
      onClose: () => removeToast(id),
    };
    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((title: string, message?: string) => {
    addToast({ type: 'success', title, message });
  }, [addToast]);

  const error = useCallback((title: string, message?: string) => {
    addToast({ type: 'error', title, message });
  }, [addToast]);

  const info = useCallback((title: string, message?: string) => {
    addToast({ type: 'info', title, message });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string) => {
    addToast({ type: 'warning', title, message });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  };
} 