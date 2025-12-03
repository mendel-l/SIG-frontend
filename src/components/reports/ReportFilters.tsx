import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DateRangeModal } from './DateRangeModal';

export interface DateRange {
  start: string;
  end: string;
}

interface ReportFiltersProps {
  dateRange?: DateRange;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  additionalFilters?: React.ReactNode;
  showDateFilter?: boolean;
}

export function ReportFilters({
  dateRange,
  onDateRangeChange,
  additionalFilters,
  showDateFilter = true,
}: ReportFiltersProps) {
  const [showDateModal, setShowDateModal] = useState(false);

  const handleDateRangeApply = (start: string, end: string) => {
    onDateRangeChange({ start, end });
    setShowDateModal(false);
  };

  const handleClearDateRange = () => {
    onDateRangeChange(undefined);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        {showDateFilter && (
          <Button
            variant={dateRange ? 'primary' : 'outline'}
            size="md"
            onClick={() => setShowDateModal(true)}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            {dateRange
              ? `${new Date(dateRange.start).toLocaleDateString('es-ES')} - ${new Date(dateRange.end).toLocaleDateString('es-ES')}`
              : 'Rango de Fechas'}
            {dateRange && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearDateRange();
                }}
                className="ml-2 rounded-full hover:bg-white/20 p-1"
              >
                ×
              </button>
            )}
          </Button>
        )}
        {additionalFilters}
      </div>

      {showDateFilter && (
        <DateRangeModal
          isOpen={showDateModal}
          onClose={() => setShowDateModal(false)}
          onApply={handleDateRangeApply}
          initialStart={dateRange?.start}
          initialEnd={dateRange?.end}
        />
      )}
    </>
  );
}

