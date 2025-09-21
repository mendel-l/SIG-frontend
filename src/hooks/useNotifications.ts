import { toast } from 'react-hot-toast';

export interface NotificationOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  description?: string;
}

export function useNotifications() {
  // Notificación de éxito
  const showSuccess = (message: string, description?: string | NotificationOptions, options?: NotificationOptions) => {
    const finalOptions = typeof description === 'string' ? { ...options, description } : description || options;
    
    return toast.success(message, {
      duration: finalOptions?.duration || 3000,
      position: finalOptions?.position || 'top-right',
      style: {
        background: '#10b981',
        color: '#fff',
        border: '1px solid #059669',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10b981',
      },
    });
  };

  // Notificación de error
  const showError = (message: string, description?: string | NotificationOptions, options?: NotificationOptions) => {
    const finalOptions = typeof description === 'string' ? { ...options, description } : description || options;
    
    return toast.error(message, {
      duration: finalOptions?.duration || 5000,
      position: finalOptions?.position || 'top-right',
      style: {
        background: '#ef4444',
        color: '#fff',
        border: '1px solid #dc2626',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#ef4444',
      },
    });
  };

  // Notificación de advertencia
  const showWarning = (message: string, description?: string | NotificationOptions, options?: NotificationOptions) => {
    const finalOptions = typeof description === 'string' ? { ...options, description } : description || options;
    
    return toast(message, {
      duration: finalOptions?.duration || 4000,
      position: finalOptions?.position || 'top-right',
      style: {
        background: '#f59e0b',
        color: '#fff',
        border: '1px solid #d97706',
      },
      icon: '⚠️',
    });
  };

  // Notificación de información
  const showInfo = (message: string, description?: string | NotificationOptions, options?: NotificationOptions) => {
    const finalOptions = typeof description === 'string' ? { ...options, description } : description || options;
    
    return toast(message, {
      duration: finalOptions?.duration || 4000,
      position: finalOptions?.position || 'top-right',
      style: {
        background: '#3b82f6',
        color: '#fff',
        border: '1px solid #2563eb',
      },
      icon: 'ℹ️',
    });
  };

  // Notificación de carga
  const showLoading = (message: string, options?: NotificationOptions) => {
    return toast.loading(message, {
      position: options?.position || 'top-right',
      style: {
        background: '#6b7280',
        color: '#fff',
        border: '1px solid #4b5563',
      },
    });
  };

  // Actualizar notificación de carga
  const updateLoading = (toastId: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    switch (type) {
      case 'success':
        return toast.success(message, { id: toastId });
      case 'error':
        return toast.error(message, { id: toastId });
      case 'warning':
        return toast(message, { id: toastId, icon: '⚠️' });
      case 'info':
        return toast(message, { id: toastId, icon: 'ℹ️' });
      default:
        return toast.success(message, { id: toastId });
    }
  };

  // Notificación personalizada
  const showCustom = (message: string, options?: NotificationOptions & {
    icon?: string;
    style?: Record<string, any>;
  }) => {
    return toast(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'top-right',
      icon: options?.icon,
      style: options?.style || {
        background: '#374151',
        color: '#fff',
        border: '1px solid #4b5563',
      },
    });
  };

  // Dismissar notificación
  const dismiss = (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

  // Dismissar todas las notificaciones
  const dismissAll = () => {
    toast.dismiss();
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    updateLoading,
    showCustom,
    dismiss,
    dismissAll,
  };
}
