import { useState } from 'react';
import { Wrench, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ReportTable, TableColumn } from '@/components/reports/ReportTable';
import { ReportFilters, DateRange } from '@/components/reports/ReportFilters';
import { usePipeInterventions } from '@/queries/reportsQueries';
import { PipeInterventionsReport } from '@/types';

export default function PipeInterventionsPage() {
  const [pipeId, setPipeId] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, isLoading, error, refetch } = usePipeInterventions(
    pipeId ? parseInt(pipeId) : null,
    dateRange?.start || null,
    dateRange?.end || null,
    { enabled: !!pipeId && !!dateRange?.start && !!dateRange?.end }
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleGenerateReport = () => {
    if (pipeId && dateRange?.start && dateRange?.end) {
      refetch();
    }
  };

  const columns: TableColumn<PipeInterventionsReport['interventions'][0]>[] = [
    { key: 'id_intervention', label: 'ID', sortable: true, width: 'w-20' },
    { key: 'description', label: 'Descripción', sortable: true, width: 'w-96' },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      width: 'w-32',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'FINALIZADO' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : value === 'EN CURSO'
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
        }`}>
          {value || 'N/A'}
        </span>
      ),
    },
    {
      key: 'start_date',
      label: 'Fecha Inicio',
      sortable: true,
      width: 'w-40',
      render: (value) => (value ? new Date(value).toLocaleDateString('es-ES') : 'N/A'),
    },
    {
      key: 'end_date',
      label: 'Fecha Fin',
      sortable: true,
      width: 'w-40',
      render: (value) => (value ? new Date(value).toLocaleDateString('es-ES') : 'N/A'),
    },
    {
      key: 'assigned_to',
      label: 'Asignado a',
      sortable: true,
      width: 'w-48',
      render: (value) => value || 'Sin asignar',
    },
    {
      key: 'assignment_status',
      label: 'Estado Asignación',
      sortable: true,
      width: 'w-40',
      render: (value) => value || 'N/A',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <Wrench className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Intervenciones en Tuberías
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Listado de intervenciones realizadas en una tubería específica
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading || !pipeId || !dateRange}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing || isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="pipe-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ID de la Tubería
            </label>
            <Input
              id="pipe-id"
              type="number"
              placeholder="Ingrese el ID de la tubería"
              value={pipeId}
              onChange={(e) => setPipeId(e.target.value)}
              min="1"
              className="max-w-xs"
            />
          </div>
          <ReportFilters
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            showDateFilter={true}
          />
          <div>
            <Button
              variant="primary"
              onClick={handleGenerateReport}
              disabled={!pipeId || !dateRange?.start || !dateRange?.end || isLoading}
            >
              Generar Reporte
            </Button>
          </div>
        </div>
      </Card>

      {/* Pipe Info */}
      {data?.pipe && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">ID Tubería</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{data.pipe.id_pipes}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Material</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{data.pipe.material}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Diámetro</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{data.pipe.diameter}mm</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Intervenciones</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.total_interventions}</p>
          </Card>
        </div>
      )}

      {/* Table */}
      <ReportTable
        data={data?.interventions || []}
        columns={columns}
        isLoading={isLoading}
        error={error?.message || null}
        emptyMessage={!pipeId || !dateRange ? "Ingrese el ID de la tubería y seleccione un rango de fechas para generar el reporte" : "No hay intervenciones registradas para esta tubería en el rango de fechas seleccionado"}
      />
    </div>
  );
}

