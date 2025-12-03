import { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ReportTable, TableColumn } from '@/components/reports/ReportTable';
import { useCleanersReport } from '@/queries/reportsQueries';
import { CleanerReport } from '@/types';

export default function CleanersPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data, isLoading, error, refetch } = useCleanersReport();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const columns: TableColumn<CleanerReport>[] = [
    { key: 'id_employee', label: 'ID', sortable: true, width: 'w-20' },
    {
      key: 'nombre',
      label: 'Nombre',
      sortable: true,
      width: 'w-64',
    },
    {
      key: 'telefono',
      label: 'Teléfono',
      sortable: false,
      width: 'w-40',
      render: (value) => (value ? String(value) : 'N/A'),
    },
    {
      key: 'activo',
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
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <Sparkles className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Lista de Encargados de Limpieza
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Listado completo de encargados de limpieza registrados
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

      <ReportTable
        data={data || []}
        columns={columns}
        isLoading={isLoading}
        error={error?.message || null}
        emptyMessage="No hay encargados de limpieza registrados"
      />
    </div>
  );
}

