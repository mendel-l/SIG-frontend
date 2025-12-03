import { useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ReportTable, TableColumn } from '@/components/reports/ReportTable';
import { useDeviationsReport } from '@/queries/reportsQueries';
import { DeviationsReport } from '@/types';

export default function DeviationsPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data, isLoading, error, refetch } = useDeviationsReport();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const columns: TableColumn<DeviationsReport>[] = [
    { key: 'id_connection', label: 'ID', sortable: true, width: 'w-20' },
    {
      key: 'sector',
      label: 'Sector',
      sortable: true,
      width: 'w-40',
      render: (value) => (value ? String(value) : 'N/A'),
    },
    {
      key: 'material',
      label: 'Material',
      sortable: true,
      width: 'w-32',
      render: (value) => (value ? String(value) : 'N/A'),
    },
    {
      key: 'type',
      label: 'Tipo',
      sortable: true,
      width: 'w-32',
      render: (value) => (value ? String(value) : 'N/A'),
    },
    {
      key: 'installed_date',
      label: 'Fecha de Instalación',
      sortable: true,
      width: 'w-40',
      render: (value) =>
        value ? new Date(value).toLocaleDateString('es-ES') : 'N/A',
    },
    {
      key: 'coordinates',
      label: 'Coordenadas',
      sortable: false,
      width: 'w-64',
      render: (value) => (value ? String(value) : 'N/A'),
    },
    {
      key: 'active',
      label: 'Activo',
      sortable: true,
      width: 'w-24',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}
        >
          {value ? 'Sí' : 'No'}
        </span>
      ),
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
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <AlertTriangle className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Reporte de Desvíos
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Listado de conexiones (desvíos) con información de intervenciones
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
        emptyMessage="No hay datos de desvíos disponibles"
      />
    </div>
  );
}

