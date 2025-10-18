import React from 'react';
import { Construction, AlertTriangle, Clock } from 'lucide-react';

interface UnderDevelopmentBadgeProps {
  variant?: 'badge' | 'alert' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

const UnderDevelopmentBadge: React.FC<UnderDevelopmentBadgeProps> = ({
  variant = 'badge',
  size = 'md',
  message = 'En desarrollo',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4', 
    lg: 'h-5 w-5'
  };

  if (variant === 'badge') {
    return (
      <span className={`inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 font-medium ${sizeClasses[size]} ${className}`}>
        <Construction className={`mr-1.5 ${iconSizes[size]}`} />
        {message}
      </span>
    );
  }

  if (variant === 'alert') {
    return (
      <div className={`flex items-center rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 p-3 ${className}`}>
        <AlertTriangle className={`mr-3 ${iconSizes[size]} text-yellow-600 dark:text-yellow-500 flex-shrink-0`} />
        <div className="flex-1">
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Funcionalidad en desarrollo
          </p>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
            {message}
          </p>
        </div>
      </div>
    );
  }

  // variant === 'inline'
  return (
    <span className={`inline-flex items-center text-yellow-700 dark:text-yellow-300 ${sizeClasses[size]} ${className}`}>
      <Clock className={`mr-1 ${iconSizes[size]}`} />
      {message}
    </span>
  );
};

export default UnderDevelopmentBadge;