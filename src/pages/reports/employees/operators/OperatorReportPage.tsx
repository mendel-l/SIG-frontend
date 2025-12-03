import { useState } from 'react';
import { Cog, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ReportTable, TableColumn } from '@/components/reports/ReportTable';
import { ReportFilters } from '@/components/reports/ReportFilters';
import { useOperatorReport } from '@/queries/reportsQueries';
import { useEmployees } from '@/queries/employeesQueries';
import { OperatorReport, DateRange } from '@/types';

export default function OperatorReportPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const { data: employeesData } = useEmployees(1, 1000);
  const operators = employeesData?.items?.filter(
    (emp) => emp.type_employee?.name?.toLowerCase() === 'operador'
  ) || [];

  const { data, isLoading, error, refetch } = useOperatorReport(
    selectedEmployeeId,
    dateRange?.start || null,
    dateRange?.end || null,
    { enabled: !!selectedEmployeeId && !!dateRange }
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const columns: TableColumn<OperatorReport>[] = [
    { key: 'id_employee', label: 'ID', sortable: true, width: 'w-20' },
    { key: 'name', label: 'Nombre', sortable: true, width: 'w-64' },
    {
      key: 'total_trabajos',
      label: 'Total Trabajos',
      sortable: true,
      width: 'w-32',
      render: (value) => (
        <span className="font-semibold text-primary-600 dark:text-primary-400">
          {value || 0}
        </span>
      ),
    },
    {
      key: 'asignado',
      label: 'Asignado',
      sortable: true,
      width: 'w-32',
      render: (value) => (
        <span className="text-blue-600 dark:text-blue-400">{value || 0}</span>
      ),
    },
    {
      key: 'en_proceso',
      label: 'En Proceso',
      sortable: true,
      width: 'w-32',
      render: (value) => (
        <span className="text-yellow-600 dark:text-yellow-400">{value || 0}</span>
      ),
    },
    {
      key: 'completado',
      label: 'Completado',
      sortable: true,
      width: 'w-32',
      render: (value) => (
        <span className="text-green-600 dark:text-green-400">{value || 0}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <Cog className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Reporte por Operador
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Reporte detallado de actividad de un operador específico
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading || !selectedEmployeeId || !dateRange}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing || isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Seleccionar Operador
            </label>
            <select
              value={selectedEmployeeId || ''}
              onChange={(e) => setSelectedEmployeeId(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Selecciona un operador</option>
              {operators.map((operator) => (
                <option key={operator.id_employee} value={operator.id_employee}>
                  {operator.first_name} {operator.last_name}
                </option>
              ))}
            </select>
          </div>
          <ReportFilters
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            showDateFilter={true}
          />
        </div>
      </div>

      {data && (
        <Card className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Trabajos</p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {data.total_trabajos || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Asignado</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {data.asignado || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">En Proceso</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {data.en_proceso || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completado</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {data.completado || 0}
              </p>
            </div>
          </div>
        </Card>
      )}

      <ReportTable
        data={data ? [data] : []}
        columns={columns}
        isLoading={isLoading}
        error={error?.message || null}
        emptyMessage={
          !selectedEmployeeId || !dateRange
            ? 'Selecciona un operador y un rango de fechas para ver el reporte'
            : 'No hay datos disponibles para el operador seleccionado'
        }
      />
    </div>
  );
}

