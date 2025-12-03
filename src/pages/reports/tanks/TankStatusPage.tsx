import { useState } from 'react';
import { Database, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ReportTable, TableColumn } from '@/components/reports/ReportTable';
import { useTankStatusReport } from '@/queries/reportsQueries';
import { TankStatusReport } from '@/types';

export default function TankStatusPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data, isLoading, error, refetch } = useTankStatusReport();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const columns: TableColumn<TankStatusReport>[] = [
    { key: 'id_tank', label: 'ID', sortable: true, width: 'w-20' },
    { key: 'name', label: 'Nombre', sortable: true, width: 'w-48' },
    {
      key: 'state',
      label: 'Estado',
      sortable: true,
      width: 'w-32',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'ACTIVO'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'coordinates',
      label: 'Coordenadas',
      sortable: false,
      width: 'w-64',
      render: (value) => (value ? String(value) : 'N/A'),
    },
    {
      key: 'total_interventions',
      label: 'Total Intervenciones',
      sortable: true,
      width: 'w-40',
      render: (value) => (
        <span className="font-semibold text-primary-600 dark:text-primary-400">
          {value || 0}
        </span>
      ),
    },
    {
      key: 'last_intervention',
      label: 'Última Intervención',
      sortable: false,
      width: 'w-64',
      render: (value) => (value ? String(value) : 'Sin intervenciones'),
    },
    {
      key: 'created_at',
      label: 'Fecha de Creación',
      sortable: true,
      width: 'w-40',
      render: (value) => (value ? new Date(value).toLocaleDateString('es-ES') : '-'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <Database className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Estado de Tanques
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Reporte de estado de tanques con información de intervenciones
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

      {/* Table */}
      <ReportTable
        data={data || []}
        columns={columns}
        isLoading={isLoading}
        error={error?.message || null}
        emptyMessage="No hay datos de tanques disponibles"
      />
    </div>
  );
}

