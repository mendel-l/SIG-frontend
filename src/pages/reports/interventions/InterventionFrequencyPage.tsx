import { useState } from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ReportTable, TableColumn } from '@/components/reports/ReportTable';
import { ReportFilters, DateRange } from '@/components/reports/ReportFilters';
import { useInterventionFrequency } from '@/queries/reportsQueries';
import { InterventionFrequencyReport } from '@/types';

export default function InterventionFrequencyPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, isLoading, error, refetch } = useInterventionFrequency(
    dateRange?.start || null,
    dateRange?.end || null,
    { enabled: !!dateRange }
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const columns: TableColumn<InterventionFrequencyReport>[] = [
    { key: 'description', label: 'Descripción', sortable: true, width: 'w-96' },
    {
      key: 'cantidad',
      label: 'Cantidad',
      sortable: true,
      width: 'w-32',
      render: (value) => <span className="font-semibold">{value}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <BarChart3 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Frecuencia de Intervenciones
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Conteo de intervenciones agrupadas por descripción
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing || isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <ReportFilters
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </Card>

      <ReportTable
        data={data || []}
        columns={columns}
        isLoading={isLoading}
        error={error?.message || null}
        emptyMessage="No hay datos de frecuencia disponibles en el rango de fechas seleccionado"
      />
    </div>
  );
}

