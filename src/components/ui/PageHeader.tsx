import { ReactNode } from 'react';
import { LucideIcon, Plus, RefreshCw } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  onRefresh?: () => void;
  onAdd?: () => void;
  addLabel?: string;
  refreshLabel?: string;
  isRefreshing?: boolean;
  showForm?: boolean;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-600 dark:text-blue-500',
  onRefresh,
  onAdd,
  addLabel = 'Nuevo',
  refreshLabel = 'Actualizar',
  isRefreshing = false,
  showForm = false,
  className = ''
}: PageHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
            {Icon && <Icon className={`mr-3 h-8 w-8 ${iconColor}`} />}
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center rounded-lg bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {refreshLabel}
            </button>
          )}
          {onAdd && (
            <button
              onClick={onAdd}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              {showForm ? 'Cancelar' : addLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

