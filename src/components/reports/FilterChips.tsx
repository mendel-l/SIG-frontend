import { X } from 'lucide-react';
import { ActiveFilter } from '@/types';
import { cn } from '@/utils';

interface FilterChipsProps {
  filters: ActiveFilter[];
  onRemove: (filterId: string) => void;
  onClearAll: () => void;
  className?: string;
}

export function FilterChips({ filters, onRemove, onClearAll, className }: FilterChipsProps) {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
        Filtros activos:
      </span>
      
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onRemove(filter.id)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 text-sm font-medium rounded-full hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors group"
          aria-label={`Remover filtro: ${filter.label}`}
        >
          <span>{filter.label}</span>
          <X className="h-3.5 w-3.5 group-hover:text-primary-900 dark:group-hover:text-primary-200" />
        </button>
      ))}

      {filters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium underline underline-offset-2 ml-1"
        >
          Limpiar todo
        </button>
      )}
    </div>
  );
}

