import { useState, useEffect, useMemo } from 'react';
import { ReportRecord, ReportFilters, ActiveFilter } from '@/types';
import { generateMockReportData } from '@/utils/mockReportData';

interface UseReportsReturn {
  records: ReportRecord[];
  filteredRecords: ReportRecord[];
  filters: ReportFilters;
  activeFilters: ActiveFilter[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setFilters: (filters: ReportFilters) => void;
  clearFilters: () => void;
  removeFilter: (filterId: string) => void;
  applyFilters: () => void;
  
  // Pagination
  currentPage: number;
  pageSize: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  
  // Sorting
  sortColumn: keyof ReportRecord | null;
  sortDirection: 'asc' | 'desc';
  setSorting: (column: keyof ReportRecord) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function useReports(): UseReportsReturn {
  const [records, setRecords] = useState<ReportRecord[]>([]);
  const [filters, setFiltersState] = useState<ReportFilters>({});
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  
  // Sorting
  const [sortColumn, setSortColumn] = useState<keyof ReportRecord | null>('fecha');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockData = generateMockReportData(120); // Generate 120 records
        setRecords(mockData);
        setError(null);
      } catch (err) {
        setError('Error al cargar los reportes');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Build active filters
  useEffect(() => {
    const active: ActiveFilter[] = [];

    if (filters.dateRange) {
      active.push({
        id: 'dateRange',
        type: 'dateRange',
        label: `${filters.dateRange.start} - ${filters.dateRange.end}`,
        value: filters.dateRange,
      });
    }

    if (filters.employees && filters.employees.length > 0) {
      filters.employees.forEach((empId) => {
        const record = records.find(r => r.id === empId);
        if (record) {
          active.push({
            id: `employee-${empId}`,
            type: 'employee',
            label: record.empleado_nombre,
            value: empId,
          });
        }
      });
    }

    if (filters.assetTypes && filters.assetTypes.length > 0) {
      filters.assetTypes.forEach((type) => {
        active.push({
          id: `assetType-${type}`,
          type: 'asset',
          label: type,
          value: type,
        });
      });
    }

    if (filters.zones && filters.zones.length > 0) {
      filters.zones.forEach((zone) => {
        active.push({
          id: `zone-${zone}`,
          type: 'zone',
          label: `Zona ${zone}`,
          value: zone,
        });
      });
    }

    if (filters.statuses && filters.statuses.length > 0) {
      filters.statuses.forEach((status) => {
        active.push({
          id: `status-${status}`,
          type: 'status',
          label: status,
          value: status,
        });
      });
    }

    if (filters.events && filters.events.length > 0) {
      filters.events.forEach((event) => {
        active.push({
          id: `event-${event}`,
          type: 'event',
          label: event,
          value: event,
        });
      });
    }

    setActiveFilters(active);
  }, [filters, records]);

  // Filter records
  const filteredRecords = useMemo(() => {
    let filtered = [...records];

    // Apply filters
    if (filters.dateRange) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.fecha);
        const startDate = new Date(filters.dateRange!.start);
        const endDate = new Date(filters.dateRange!.end);
        return recordDate >= startDate && recordDate <= endDate;
      });
    }

    if (filters.assetTypes && filters.assetTypes.length > 0) {
      filtered = filtered.filter(record => 
        filters.assetTypes!.includes(record.activo_tipo)
      );
    }

    if (filters.zones && filters.zones.length > 0) {
      filtered = filtered.filter(record => 
        filters.zones!.includes(record.zona)
      );
    }

    if (filters.statuses && filters.statuses.length > 0) {
      filtered = filtered.filter(record => 
        filters.statuses!.includes(record.estado)
      );
    }

    if (filters.events && filters.events.length > 0) {
      filtered = filtered.filter(record => 
        filters.events!.includes(record.evento)
      );
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(record => 
        record.empleado_nombre.toLowerCase().includes(query) ||
        record.activo_nombre.toLowerCase().includes(query) ||
        record.observaciones.toLowerCase().includes(query) ||
        record.zona.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortColumn) {
      filtered.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue === bValue) return 0;

        const comparison = aValue > bValue ? 1 : -1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [records, filters, searchQuery, sortColumn, sortDirection]);

  // Paginated records
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredRecords.slice(startIndex, endIndex);
  }, [filteredRecords, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize);

  // Actions
  const setFilters = (newFilters: ReportFilters) => {
    setFiltersState(newFilters);
    setCurrentPage(1); // Reset to first page
  };

  const clearFilters = () => {
    setFiltersState({});
    setSearchQuery('');
    setCurrentPage(1);
  };

  const removeFilter = (filterId: string) => {
    const newFilters = { ...filters };

    if (filterId === 'dateRange') {
      delete newFilters.dateRange;
    } else if (filterId.startsWith('employee-')) {
      const empId = parseInt(filterId.replace('employee-', ''));
      newFilters.employees = newFilters.employees?.filter(id => id !== empId);
    } else if (filterId.startsWith('assetType-')) {
      const type = filterId.replace('assetType-', '') as any;
      newFilters.assetTypes = newFilters.assetTypes?.filter(t => t !== type);
    } else if (filterId.startsWith('zone-')) {
      const zone = filterId.replace('zone-', '') as any;
      newFilters.zones = newFilters.zones?.filter(z => z !== zone);
    } else if (filterId.startsWith('status-')) {
      const status = filterId.replace('status-', '') as any;
      newFilters.statuses = newFilters.statuses?.filter(s => s !== status);
    } else if (filterId.startsWith('event-')) {
      const event = filterId.replace('event-', '') as any;
      newFilters.events = newFilters.events?.filter(e => e !== event);
    }

    setFiltersState(newFilters);
    setCurrentPage(1);
  };

  const applyFilters = () => {
    setCurrentPage(1);
  };

  const setSorting = (column: keyof ReportRecord) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSetPageSize = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    records: paginatedRecords,
    filteredRecords,
    filters,
    activeFilters,
    isLoading,
    error,
    setFilters,
    clearFilters,
    removeFilter,
    applyFilters,
    currentPage,
    pageSize,
    totalPages,
    setCurrentPage,
    setPageSize: handleSetPageSize,
    sortColumn,
    sortDirection,
    setSorting,
    searchQuery,
    setSearchQuery,
  };
}

