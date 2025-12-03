import { useState } from 'react';
import { ClipboardList, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ReportTable, TableColumn } from '@/components/reports/ReportTable';
import { ReportFilters } from '@/components/reports/ReportFilters';
import { useAssignmentsReport } from '@/queries/reportsQueries';
import { AssignmentReportItem, DateRange } from '@/types';

export default function AssignmentsPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const { data, isLoading, error, refetch } = useAssignmentsReport(
    dateRange?.start || null,
    dateRange?.end || null,
    { enabled: !!dateRange }
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const columns: TableColumn<AssignmentReportItem>[] = [
    { key: 'id_assignment', label: 'ID', sortable: true, width: 'w-20' },
    {
      key: 'assigned_at',
      label: 'Fecha de Asignación',
      sortable: true,
      width: 'w-48',
      render: (value) =>
        value ? new Date(value).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }) : '-',
    },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      width: 'w-32',
      render: (value) => {
        const statusColors: Record<string, string> = {
          ASIGNADO: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
          'EN PROCESO': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          COMPLETADO: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[value as string] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {value}
          </span>
        );
      },
    },
    {
      key: 'employee',
      label: 'Empleado',
      sortable: false,
      width: 'w-48',
      render: (value: { id: number; name: string }) => value?.name || 'N/A',
    },
    {
      key: 'intervention',
      label: 'Intervención',
      sortable: false,
      width: 'w-64',
      render: (value: { id: number; description: string; status?: string }) =>
        value?.description || 'N/A',
    },
    {
      key: 'notes',
      label: 'Notas',
      sortable: false,
      width: 'w-64',
      render: (value) => (value ? String(value).substring(0, 50) + '...' : '-'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <ClipboardList className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Trabajos Asignados
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Reporte de trabajos asignados a empleados en un rango de fechas
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

        {/* Filters */}
        <ReportFilters
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>

      {/* Summary */}
      {data && data.total_assignments !== undefined && (
        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Total de asignaciones:</span>{' '}
            {data.total_assignments}
          </p>
        </div>
      )}

      {/* Table */}
      <ReportTable
        data={data?.assignments || []}
        columns={columns}
        isLoading={isLoading}
        error={error?.message || null}
        emptyMessage={
          !dateRange
            ? 'Selecciona un rango de fechas para ver los trabajos asignados'
            : 'No hay trabajos asignados en el rango de fechas seleccionado'
        }
      />
    </div>
  );
}

