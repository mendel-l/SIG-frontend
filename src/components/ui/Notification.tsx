import { toast } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

interface NotificationProps {
  title: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

export function Notification({ title, message, type, duration = 4000, onClose }: NotificationProps) {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  };

  const textColors = {
    success: 'text-green-800 dark:text-green-200',
    error: 'text-red-800 dark:text-red-200',
    warning: 'text-yellow-800 dark:text-yellow-200',
    info: 'text-blue-800 dark:text-blue-200',
  };

  return (
    <div className={`
      flex items-start p-4 rounded-lg border shadow-lg
      ${bgColors[type]}
      animate-fade-in
    `}>
      <div className="flex-shrink-0 mr-3">
        {icons[type]}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-medium ${textColors[type]}`}>
          {title}
        </h4>
        {message && (
          <p className={`mt-1 text-sm ${textColors[type]} opacity-90`}>
            {message}
          </p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`ml-3 flex-shrink-0 ${textColors[type]} hover:opacity-75 transition-opacity`}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// Funciones helper para mostrar notificaciones
export const showNotification = {
  success: (title: string, message?: string, duration?: number) => {
    return toast.custom((t) => (
      <Notification
        title={title}
        message={message}
        type="success"
        duration={duration}
        onClose={() => toast.dismiss(t.id)}
      />
    ), { duration: duration || 4000 });
  },

  error: (title: string, message?: string, duration?: number) => {
    return toast.custom((t) => (
      <Notification
        title={title}
        message={message}
        type="error"
        duration={duration}
        onClose={() => toast.dismiss(t.id)}
      />
    ), { duration: duration || 5000 });
  },

  warning: (title: string, message?: string, duration?: number) => {
    return toast.custom((t) => (
      <Notification
        title={title}
        message={message}
        type="warning"
        duration={duration}
        onClose={() => toast.dismiss(t.id)}
      />
    ), { duration: duration || 4000 });
  },

  info: (title: string, message?: string, duration?: number) => {
    return toast.custom((t) => (
      <Notification
        title={title}
        message={message}
        type="info"
        duration={duration}
        onClose={() => toast.dismiss(t.id)}
      />
    ), { duration: duration || 4000 });
  },
};
