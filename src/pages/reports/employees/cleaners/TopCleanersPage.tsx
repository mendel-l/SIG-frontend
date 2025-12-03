import { useState } from 'react';
import { Trophy, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ReportTable, TableColumn } from '@/components/reports/ReportTable';
import { ReportFilters } from '@/components/reports/ReportFilters';
import { useTopCleanersReport } from '@/queries/reportsQueries';
import { TopCleanerReport, DateRange } from '@/types';

export default function TopCleanersPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const { data, isLoading, error, refetch } = useTopCleanersReport(
    dateRange?.start || null,
    dateRange?.end || null,
    { enabled: !!dateRange }
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const columns: TableColumn<TopCleanerReport>[] = [
    { key: 'id_employee', label: 'ID', sortable: true, width: 'w-20' },
    {
      key: 'nombre',
      label: 'Nombre',
      sortable: true,
      width: 'w-64',
    },
    {
      key: 'actividad',
      label: 'Actividad',
      sortable: true,
      width: 'w-40',
      render: (value) => (
        <span className="font-semibold text-primary-600 dark:text-primary-400">
          {value || 0}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <Trophy className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Top Encargados de Limpieza
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Encargados de limpieza más activos ordenados por actividad
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading || !dateRange}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing || isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>

        <ReportFilters
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>

      <ReportTable
        data={data || []}
        columns={columns}
        isLoading={isLoading}
        error={error?.message || null}
        emptyMessage={
          !dateRange
            ? 'Selecciona un rango de fechas para ver el top de encargados de limpieza'
            : 'No hay datos disponibles en el rango de fechas seleccionado'
        }
      />
    </div>
  );
}

