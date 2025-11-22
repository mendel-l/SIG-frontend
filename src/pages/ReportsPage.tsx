import { useState, useMemo, useRef } from 'react';
import { FileText, Search, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FilterBar } from '@/components/reports/FilterBar';
import { FilterChips } from '@/components/reports/FilterChips';
import { ReportsTable } from '@/components/reports/ReportsTable';
import { ExportButtons } from '@/components/reports/ExportButtons';
import { ExportExcelButton } from '@/components/reports/ExportExcelButton';
import { useReports } from '@/hooks/useReports';
import { useDebounce } from '@/hooks/useDebounce';

export default function ReportsPage() {
  const {
    records,
    filteredRecords,
    filters,
    activeFilters,
    isLoading,
    error,
    setFilters,
    clearFilters,
    removeFilter,
    currentPage,
    pageSize,
    totalPages,
    setCurrentPage,
    setPageSize,
    sortColumn,
    sortDirection,
    setSorting,
    setSearchQuery,
  } = useReports();

  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [showAllRows, setShowAllRows] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300);

  // Update search query after debounce
  useMemo(() => {
    setSearchQuery(debouncedSearchQuery);
  }, [debouncedSearchQuery, setSearchQuery]);

  const handleRefresh = () => {
    window.location.reload();
  };

  // Get last update time
  const lastUpdateTime = useMemo(() => {
    return new Date().toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Reportes Operacionales
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Consulta y exporta información de inspecciones, mantenimientos y reparaciones
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Última actualización: {lastUpdateTime}
        </p>
      </div>


      {/* Filters */}
      <Card className="p-6">
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
        />
      </Card>

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <FilterChips
          filters={activeFilters}
          onRemove={removeFilter}
          onClearAll={clearFilters}
        />
      )}

      {/* Stats and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="primary" size="lg" className="text-base">
            <span className="font-bold mr-1">{filteredRecords.length}</span>
            {filteredRecords.length === 1 ? 'registro' : 'registros'}
          </Badge>

          {filters.dateRange && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Período:</span>{' '}
              {new Date(filters.dateRange.start).toLocaleDateString('es-ES')} -{' '}
              {new Date(filters.dateRange.end).toLocaleDateString('es-ES')}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <div className="flex-1 sm:flex-initial sm:w-80">
            <Input
              type="text"
              placeholder="Buscar en resultados..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              leftIcon={<Search />}
            />
          </div>
          <ExportButtons 
            filteredRecords={filteredRecords}
            filters={filters} 
            disabled={isLoading}
            tableRef={tableRef}
            setShowAllRows={setShowAllRows}
          />
          
          {/* Botón de prueba para exportación Excel desde backend */}
          <div className="flex items-center gap-2 pl-3 border-l border-gray-300 dark:border-gray-600">
            <ExportExcelButton filters={filters} disabled={isLoading} />
          </div>
        </div>
      </div>

      {/* Table */}
      <ReportsTable
        ref={tableRef}
        records={showAllRows ? filteredRecords : records}
        isLoading={isLoading}
        error={error}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={setSorting}
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        totalRecords={filteredRecords.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        showAllRows={showAllRows}
      />

      {/* Info Footer */}
      <Card className="p-4 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>
              Visualizando <strong>{records.length}</strong> de{' '}
              <strong>{filteredRecords.length}</strong> registros filtrados
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Sistema operativo</span>
            </div>
            <span className="text-xs">
              Página {currentPage} de {totalPages}
            </span>
          </div>
        </div>
      </Card>

      {/* Help Card */}
      <Card className="p-6 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-primary-200 dark:border-primary-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          💡 Consejos para reportes efectivos
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-primary-600 dark:text-primary-400 font-bold">•</span>
            <span>
              Usa <strong>filtros combinados</strong> para obtener reportes más precisos
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 dark:text-primary-400 font-bold">•</span>
            <span>
              Los reportes se exportan con todos los registros filtrados, no solo la página actual
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 dark:text-primary-400 font-bold">•</span>
            <span>
              Haz clic en los encabezados de columna para <strong>ordenar</strong> los resultados
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 dark:text-primary-400 font-bold">•</span>
            <span>
              Usa la búsqueda rápida para encontrar registros específicos en los resultados actuales
            </span>
          </li>
        </ul>
      </Card>
    </div>
  );
}

