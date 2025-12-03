import { useState } from 'react';
import { Database, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ReportTable, TableColumn } from '@/components/reports/ReportTable';
import { useTanksReport } from '@/queries/reportsQueries';
import { TankReport } from '@/types';

export default function TanksReportPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data, isLoading, error, refetch } = useTanksReport();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const columns: TableColumn<TankReport>[] = [
    { key: 'id_tank', label: 'ID', sortable: true, width: 'w-20' },
    { key: 'name', label: 'Nombre', sortable: true, width: 'w-48' },
    {
      key: 'coordinates',
      label: 'Coordenadas',
      sortable: false,
      width: 'w-64',
      render: (value) => (value ? String(value) : 'N/A'),
    },
    {
      key: 'photos',
      label: 'Fotos',
      sortable: false,
      width: 'w-24',
      render: (value) => (value ? 'Sí' : 'No'),
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
                Reporte de Tanques
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Listado completo de tanques registrados en el sistema
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
        emptyMessage="No hay tanques registrados"
      />
    </div>
  );
}

