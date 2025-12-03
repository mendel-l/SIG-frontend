import { useState } from 'react';
import { Settings, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ReportTable, TableColumn } from '@/components/reports/ReportTable';
import { ReportFilters, DateRange } from '@/components/reports/ReportFilters';
import { useInterventionsBySector } from '@/queries/reportsQueries';

interface SectorCountItem {
  sector_name: string;
  count: number;
}

export default function InterventionsBySectorPage() {
  const [sectorId, setSectorId] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, isLoading, error, refetch } = useInterventionsBySector(
    sectorId ? parseInt(sectorId) : null,
    dateRange?.start || null,
    dateRange?.end || null,
    { enabled: !!sectorId && !!dateRange?.start && !!dateRange?.end }
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleGenerateReport = () => {
    if (sectorId && dateRange?.start && dateRange?.end) {
      refetch();
    }
  };

  // Combinar todos los datos en una sola tabla
  const allData = data
    ? [
        ...(data.pipes || []).map((item: SectorCountItem) => ({ ...item, type: 'Tuberías' })),
        ...(data.tanks || []).map((item: SectorCountItem) => ({ ...item, type: 'Tanques' })),
        ...(data.connections || []).map((item: SectorCountItem) => ({ ...item, type: 'Conexiones' })),
      ]
    : [];

  const columns: TableColumn<{ sector_name: string; count: number; type: string }>[] = [
    { key: 'sector_name', label: 'Sector', sortable: true, width: 'w-48' },
    { key: 'type', label: 'Tipo', sortable: true, width: 'w-32' },
    {
      key: 'count',
      label: 'Cantidad',
      sortable: true,
      width: 'w-32',
      render: (value) => <span className="font-semibold">{value}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <Settings className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Intervenciones por Sector
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Listado de intervenciones agrupadas por sector y tipo de entidad
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading || !sectorId || !dateRange}
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
              disabled={!sectorId || !dateRange?.start || !dateRange?.end || isLoading}
            >
              Generar Reporte
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats by Type */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Intervenciones en Tuberías</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.pipes?.reduce((acc: number, item: SectorCountItem) => acc + item.count, 0) || 0}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Intervenciones en Tanques</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.tanks?.reduce((acc: number, item: SectorCountItem) => acc + item.count, 0) || 0}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Intervenciones en Conexiones</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.connections?.reduce((acc: number, item: SectorCountItem) => acc + item.count, 0) || 0}
            </p>
          </Card>
        </div>
      )}

      {/* Table */}
      <ReportTable
        data={allData}
        columns={columns}
        isLoading={isLoading}
        error={error?.message || null}
        emptyMessage={!sectorId || !dateRange ? "Ingrese el ID del sector y seleccione un rango de fechas para generar el reporte" : "No hay intervenciones registradas para este sector en el rango de fechas seleccionado"}
      />
    </div>
  );
}

