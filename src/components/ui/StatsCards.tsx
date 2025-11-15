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
    <div className={`grid ${getGridCols(stats.length)} gap-6 mb-6 ${className}`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const iconColor = stat.iconColor || 'text-mint-600 dark:text-mint-300';

        return (
          <div
            key={index}
            className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/85 p-6 shadow-card-soft backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-white/60 dark:border-white/10 dark:bg-gray-900/80"
          >
            <div className="absolute inset-0 opacity-60">
              <div className="h-full w-full bg-gradient-to-br from-mint-50 via-white to-aqua-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" />
            </div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="mt-3 text-3xl font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-mint-100 to-aqua-100 p-3 shadow-inner dark:from-white/10 dark:to-white/5">
                <Icon className={`h-6 w-6 ${iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

