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
  showAddButton?: boolean;
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
  className = '',
  showAddButton = true
}: PageHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex flex-col gap-4 rounded-3xl border border-white/30 bg-white/80 p-6 shadow-card-soft backdrop-blur-2xl dark:border-white/10 dark:bg-gray-900/70 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center">
            {Icon && (
              <div className="mr-4 rounded-2xl bg-gradient-to-br from-mint-100 to-aqua-100 p-3 text-mint-600 dark:from-white/10 dark:to-white/5">
                <Icon className={`h-6 w-6 ${iconColor}`} />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center rounded-2xl border border-white/40 bg-white/80 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm backdrop-blur hover:bg-white disabled:opacity-50 dark:border-white/20 dark:bg-white/10 dark:text-gray-200"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {refreshLabel}
            </button>
          )}
          {onAdd && showAddButton && (
            <button
              onClick={onAdd}
              className="inline-flex items-center rounded-2xl bg-gradient-to-r from-mint-500 to-aqua-500 px-5 py-2 text-sm font-semibold text-white shadow-card-soft hover:from-mint-400 hover:to-aqua-400"
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

