import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Inbox,
  AlertCircle,
} from 'lucide-react';
import { ReportRecord } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ReportsTableProps {
  records: ReportRecord[];
  isLoading?: boolean;
  error?: string | null;
  
  // Sorting
  sortColumn: keyof ReportRecord | null;
  sortDirection: 'asc' | 'desc';
  onSort: (column: keyof ReportRecord) => void;
  
  // Pagination
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const columns: Array<{
  key: keyof ReportRecord;
  label: string;
  sortable: boolean;
  width?: string;
}> = [
  { key: 'fecha', label: 'Fecha', sortable: true, width: 'w-28' },
  { key: 'empleado_nombre', label: 'Empleado', sortable: true, width: 'w-40' },
  { key: 'activo_tipo', label: 'Tipo Activo', sortable: true, width: 'w-28' },
  { key: 'activo_nombre', label: 'Activo', sortable: true, width: 'w-48' },
  { key: 'evento', label: 'Evento', sortable: true, width: 'w-32' },
  { key: 'duracion_minutos', label: 'Duración', sortable: true, width: 'w-24' },
  { key: 'estado', label: 'Estado', sortable: true, width: 'w-28' },
  { key: 'zona', label: 'Zona', sortable: true, width: 'w-24' },
  { key: 'observaciones', label: 'Observaciones', sortable: false, width: 'flex-1' },
];

const statusVariants: Record<string, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'> = {
  'OK': 'success',
  'Pendiente': 'warning',
  'En curso': 'primary',
  'Cerrado': 'default',
};

const eventVariants: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'danger'> = {
  'Inspección': 'primary',
  'Mantenimiento': 'secondary',
  'Reparación': 'danger',
  'Lectura': 'success',
};

export function ReportsTable({
  records,
  isLoading = false,
  error = null,
  sortColumn,
  sortDirection,
  onSort,
  currentPage,
  pageSize,
  totalPages,
  totalRecords,
  onPageChange,
  onPageSizeChange,
}: ReportsTableProps) {
  const renderSortIcon = (columnKey: keyof ReportRecord) => {
    if (sortColumn !== columnKey) {
      return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 text-primary-600" />
    ) : (
      <ChevronDown className="h-4 w-4 text-primary-600" />
    );
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Pagination info
  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-12 flex flex-col items-center justify-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-red-200 dark:border-red-900">
        <div className="p-12 flex flex-col items-center justify-center">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Error al cargar reportes
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center">{error}</p>
          <Button variant="primary" className="mt-4" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (records.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-12 flex flex-col items-center justify-center">
          <Inbox className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No se encontraron resultados
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Intenta ajustar los filtros para ver más resultados
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider',
                    column.width
                  )}
                >
                  {column.sortable ? (
                    <button
                      onClick={() => onSort(column.key)}
                      className="flex items-center gap-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
                    >
                      <span>{column.label}</span>
                      {renderSortIcon(column.key)}
                    </button>
                  ) : (
                    <span>{column.label}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {records.map((record, idx) => (
              <tr
                key={record.id}
                className={cn(
                  'hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors',
                  idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-800/50'
                )}
              >
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium whitespace-nowrap">
                  {formatDate(record.fecha)}
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {record.empleado_nombre}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {record.empleado_rol}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="secondary" size="sm">
                    {record.activo_tipo}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {record.activo_nombre}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={eventVariants[record.evento] as any} size="sm">
                    {record.evento}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 text-center">
                  {formatDuration(record.duracion_minutos)}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariants[record.estado] as any} size="sm">
                    {record.estado}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 text-center">
                  {record.zona}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                  {record.observaciones}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">Filas por página:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="input py-1 px-2 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {startRecord}-{endRecord} de {totalRecords}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={cn(
                    'px-3 py-1 text-sm font-medium rounded transition-colors',
                    currentPage === pageNum
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

