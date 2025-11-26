import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ 
  title = 'No se pudo cargar la información', 
  message = 'Ocurrió un problema al intentar obtener los datos. Por favor, intenta nuevamente.',
  onRetry,
  className = ''
}: ErrorMessageProps) {
  return (
    <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
            {title}
          </h3>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">
            {message}
          </p>
          {onRetry && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Intentar nuevamente
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

