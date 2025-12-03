import { useState } from 'react';
import { Settings, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ReportTable, TableColumn } from '@/components/reports/ReportTable';
import { ReportFilters, DateRange } from '@/components/reports/ReportFilters';
import { useInterventions } from '@/queries/reportsQueries';
import { Intervention } from '@/types';

export default function InterventionsGeneralPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, isLoading, error, refetch } = useInterventions(
    dateRange?.start || null,
    dateRange?.end || null,
    { enabled: !!dateRange }
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const columns: TableColumn<Intervention>[] = [
    { key: 'id_interventions', label: 'ID', sortable: true, width: 'w-20' },
    { key: 'description', label: 'Descripción', sortable: true, width: 'w-64' },
    { key: 'status', label: 'Estado', sortable: true, width: 'w-32' },
    {
      key: 'start_date',
      label: 'Fecha Inicio',
      sortable: true,
      render: (value) => (value ? new Date(value).toLocaleDateString('es-ES') : '-'),
    },
    {
      key: 'end_date',
      label: 'Fecha Fin',
      sortable: true,
      render: (value) => (value ? new Date(value).toLocaleDateString('es-ES') : '-'),
    },
    {
      key: 'created_at',
      label: 'Fecha Creación',
      sortable: true,
      render: (value) => (value ? new Date(value).toLocaleDateString('es-ES') : '-'),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <Settings className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Reporte General de Intervenciones
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Listado de todas las intervenciones en el rango de fechas seleccionado
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
        emptyMessage="No hay intervenciones en el rango de fechas seleccionado"
      />
    </div>
  );
}
