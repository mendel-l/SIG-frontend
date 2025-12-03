import { useState } from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ReportTable, TableColumn } from '@/components/reports/ReportTable';
import { useSectorComparative } from '@/queries/reportsQueries';
import { SectorComparativeReport } from '@/types';

export default function SectorComparativePage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data, isLoading, error, refetch } = useSectorComparative();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const columns: TableColumn<SectorComparativeReport['results'][0]>[] = [
    { key: 'sector_name', label: 'Sector', sortable: true, width: 'w-48' },
    { key: 'total_pipes', label: 'Total Tuberías', sortable: true, width: 'w-32' },
    { key: 'total_connections', label: 'Total Conexiones', sortable: true, width: 'w-40' },
    { key: 'interventions_pipes', label: 'Interv. Tuberías', sortable: true, width: 'w-40' },
    { key: 'interventions_connections', label: 'Interv. Conexiones', sortable: true, width: 'w-40' },
    { key: 'interventions_total', label: 'Total Intervenciones', sortable: true, width: 'w-40' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <BarChart3 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Comparativo entre Sectores
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Comparación de infraestructura e intervenciones por sector
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

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total de Sectores</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.total_sectors}</p>
          </Card>
        </div>
      )}

      {/* Table */}
      <ReportTable
        data={data?.results || []}
        columns={columns}
        isLoading={isLoading}
        error={error?.message || null}
        emptyMessage="No hay datos de sectores disponibles"
      />
    </div>
  );
}

