import { useState } from 'react';
import { Wrench, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ReportTable, TableColumn } from '@/components/reports/ReportTable';
import { usePipesBySector } from '@/queries/reportsQueries';
import { PipeBySectorReport } from '@/types';

export default function PipesBySectorPage() {
  const [sectorId, setSectorId] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, isLoading, error, refetch } = usePipesBySector(
    sectorId ? parseInt(sectorId) : null,
    { enabled: !!sectorId && !isNaN(parseInt(sectorId)) }
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleGenerateReport = () => {
    if (sectorId && !isNaN(parseInt(sectorId))) {
      refetch();
    }
  };

  const columns: TableColumn<PipeBySectorReport['pipes'][0]>[] = [
    { key: 'id_pipes', label: 'ID', sortable: true, width: 'w-20' },
    { key: 'material', label: 'Material', sortable: true, width: 'w-32' },
    { key: 'diameter', label: 'Diámetro', sortable: true, width: 'w-24' },
    { key: 'size', label: 'Tamaño', sortable: true, width: 'w-24' },
    {
      key: 'installation_date',
      label: 'Fecha Instalación',
      sortable: true,
      width: 'w-40',
      render: (value) => (value ? new Date(value).toLocaleDateString('es-ES') : 'N/A'),
    },
    {
      key: 'distance',
      label: 'Distancia',
      sortable: true,
      width: 'w-32',
      render: (value) => (value ? `${value}m` : 'N/A'),
    },
    {
      key: 'total_connections',
      label: 'Conexiones',
      sortable: true,
      width: 'w-32',
      render: (value) => <span className="font-semibold">{value || 0}</span>,
    },
    {
      key: 'total_interventions',
      label: 'Intervenciones',
      sortable: true,
      width: 'w-40',
      render: (value) => <span className="font-semibold">{value || 0}</span>,
    },
    {
      key: 'active',
      label: 'Estado',
      sortable: true,
      width: 'w-24',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
        }`}>
          {value ? 'Activo' : 'Inactivo'}
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
              <Wrench className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Tuberías por Sector
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Listado de tuberías agrupadas por sector
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading || !sectorId}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing || isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="sector-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ID del Sector
            </label>
            <Input
              id="sector-id"
              type="number"
              placeholder="Ingrese el ID del sector"
              value={sectorId}
              onChange={(e) => setSectorId(e.target.value)}
              min="1"
            />
          </div>
          <Button
            variant="primary"
            onClick={handleGenerateReport}
            disabled={!sectorId || isNaN(parseInt(sectorId)) || isLoading}
          >
            Generar Reporte
          </Button>
        </div>
      </Card>

      {/* Sector Info */}
      {data?.sector && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Sector</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{data.sector.name}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total de Tuberías</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.total_pipes}</p>
          </Card>
        </div>
      )}

      {/* Table */}
      <ReportTable
        data={data?.pipes || []}
        columns={columns}
        isLoading={isLoading}
        error={error?.message || null}
        emptyMessage={!sectorId ? "Ingrese un ID de sector para generar el reporte" : "No hay tuberías registradas para este sector"}
      />
    </div>
  );
}

