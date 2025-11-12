import { LucideIcon } from 'lucide-react';

export interface StatCard {
  label: string;
  value: number | string;
  icon: LucideIcon;
  iconColor?: string;
}

interface StatsCardsProps {
  stats: StatCard[];
  className?: string;
}

export function StatsCards({ stats, className = '' }: StatsCardsProps) {
  // Determinar el número de columnas basado en la cantidad de stats
  const getGridCols = (count: number) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2';
    if (count === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
  };

  return (
    <div className={`grid ${getGridCols(stats.length)} gap-5 mb-6 ${className}`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const iconColor = stat.iconColor || 'text-blue-600 dark:text-blue-500';
        
        return (
          <div key={index} className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

