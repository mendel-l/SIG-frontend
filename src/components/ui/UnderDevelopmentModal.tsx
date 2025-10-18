import React from 'react';
import { Construction, AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

interface UnderDevelopmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
  title?: string;
  message?: string;
}

const UnderDevelopmentModal: React.FC<UnderDevelopmentModalProps> = ({
  isOpen,
  onClose,
  feature = 'esta funcionalidad',
  title = 'Funcionalidad en Desarrollo',
  message
}) => {
  if (!isOpen) return null;

  const defaultMessage = `${feature} está siendo implementada y no está disponible por el momento. Nuestro equipo está trabajando para tenerla lista pronto.`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Icon and content */}
          <div className="flex flex-col items-center text-center">
            {/* Warning icon with construction */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
              <div className="relative">
                <Construction className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />
                <AlertTriangle className="absolute -right-1 -top-1 h-4 w-4 text-orange-500" />
              </div>
            </div>

            {/* Title */}
            <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>

            {/* Message */}
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
              {message || defaultMessage}
            </p>

            {/* Development status badge */}
            <div className="mb-6 inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/20 px-3 py-1 text-xs font-medium text-blue-800 dark:text-blue-300">
              <div className="mr-2 h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              En desarrollo activo
            </div>

            {/* Action button */}
            <Button
              onClick={onClose}
              variant="primary"
              className="w-full"
            >
              Entendido
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderDevelopmentModal;