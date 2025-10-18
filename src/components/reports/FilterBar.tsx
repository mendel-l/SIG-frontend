import { useState } from 'react';
import { Calendar, Users, Package, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DateRangeModal } from './DateRangeModal';
import { EmployeeFilterModal } from './EmployeeFilterModal';
import { AssetFilterModal } from './AssetFilterModal';
import { ReportFilters, AssetType } from '@/types';
import { getUniqueEmployees, getUniqueAssets } from '@/utils/mockReportData';
import { generateMockReportData } from '@/utils/mockReportData';

interface FilterBarProps {
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
  onClearFilters: () => void;
}

export function FilterBar({ filters, onFiltersChange, onClearFilters }: FilterBarProps) {
  const [showDateModal, setShowDateModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);

  // Generate mock data for filters (in real app, this would come from API)
  const allRecords = generateMockReportData(120);
  const employees = getUniqueEmployees(allRecords).map((emp, idx) => ({
    id: idx + 1,
    name: emp.nombre,
    role: emp.rol,
  }));
  const assets = getUniqueAssets(allRecords).map((asset, idx) => ({
    id: idx + 1,
    name: asset.nombre,
    type: asset.tipo,
    zone: asset.zona,
  }));

  const handleDateRangeApply = (start: string, end: string) => {
    onFiltersChange({
      ...filters,
      dateRange: { start, end },
    });
  };

  const handleEmployeeApply = (selectedIds: number[]) => {
    onFiltersChange({
      ...filters,
      employees: selectedIds.length > 0 ? selectedIds : undefined,
    });
  };

  const handleAssetApply = (selectedTypes: AssetType[], selectedIds: number[]) => {
    onFiltersChange({
      ...filters,
      assetTypes: selectedTypes.length > 0 ? selectedTypes : undefined,
      assetIds: selectedIds.length > 0 ? selectedIds : undefined,
    });
  };

  const hasActiveFilters = Object.keys(filters).some((key) => {
    const value = filters[key as keyof ReportFilters];
    return value !== undefined && (Array.isArray(value) ? value.length > 0 : true);
  });

  const filterCount = [
    filters.dateRange ? 1 : 0,
    filters.employees?.length || 0,
    filters.assetTypes?.length || 0,
    filters.assetIds?.length || 0,
    filters.zones?.length || 0,
    filters.statuses?.length || 0,
    filters.events?.length || 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <Filter className="h-5 w-5" />
          <span className="font-medium">Filtros:</span>
        </div>

        <Button
          variant="secondary"
          onClick={() => setShowDateModal(true)}
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          {filters.dateRange
            ? `${filters.dateRange.start} - ${filters.dateRange.end}`
            : 'Rango de fechas'}
        </Button>

        <Button
          variant="secondary"
          onClick={() => setShowEmployeeModal(true)}
          className="flex items-center gap-2"
        >
          <Users className="h-4 w-4" />
          Empleados
          {filters.employees && filters.employees.length > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-semibold rounded-full">
              {filters.employees.length}
            </span>
          )}
        </Button>

        <Button
          variant="secondary"
          onClick={() => setShowAssetModal(true)}
          className="flex items-center gap-2"
        >
          <Package className="h-4 w-4" />
          Activos
          {((filters.assetTypes?.length || 0) + (filters.assetIds?.length || 0)) > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-semibold rounded-full">
              {(filters.assetTypes?.length || 0) + (filters.assetIds?.length || 0)}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="secondary"
            onClick={onClearFilters}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <X className="h-4 w-4" />
            Limpiar todo
          </Button>
        )}

        {filterCount > 0 && (
          <div className="ml-auto px-3 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium">
            {filterCount} filtro{filterCount !== 1 ? 's' : ''} activo{filterCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Modals */}
      <DateRangeModal
        isOpen={showDateModal}
        onClose={() => setShowDateModal(false)}
        onApply={handleDateRangeApply}
        initialStart={filters.dateRange?.start}
        initialEnd={filters.dateRange?.end}
      />

      <EmployeeFilterModal
        isOpen={showEmployeeModal}
        onClose={() => setShowEmployeeModal(false)}
        onApply={handleEmployeeApply}
        employees={employees}
        initialSelected={filters.employees}
      />

      <AssetFilterModal
        isOpen={showAssetModal}
        onClose={() => setShowAssetModal(false)}
        onApply={handleAssetApply}
        assets={assets}
        initialSelectedTypes={filters.assetTypes}
        initialSelectedIds={filters.assetIds}
      />
    </div>
  );
}

