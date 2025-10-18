import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from './Button';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  loading = false,
}) => {
  if (!isOpen) return null;

  const getVariantConfig = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
          confirmButtonVariant: 'danger' as const,
          iconBgColor: 'bg-red-100 dark:bg-red-900/20',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
          confirmButtonVariant: 'warning' as const,
          iconBgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
        };
      case 'info':
        return {
          icon: <CheckCircle className="h-6 w-6 text-blue-600" />,
          confirmButtonVariant: 'primary' as const,
          iconBgColor: 'bg-blue-100 dark:bg-blue-900/20',
        };
      default:
        return {
          icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
          confirmButtonVariant: 'danger' as const,
          iconBgColor: 'bg-red-100 dark:bg-red-900/20',
        };
    }
  };

  const config = getVariantConfig();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${config.iconBgColor} sm:mx-0 sm:h-10 sm:w-10`}>
              {config.icon}
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {message}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <Button
              variant={config.confirmButtonVariant}
              onClick={onConfirm}
              disabled={loading}
              className="w-full sm:ml-3 sm:w-auto"
            >
              {loading ? 'Procesando...' : confirmText}
            </Button>
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              className="mt-3 w-full sm:mt-0 sm:w-auto"
            >
              {cancelText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;