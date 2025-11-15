import React, { useState, useMemo } from 'react';

interface Column {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface ScrollableTableProps {
  columns: Column[];
  children: React.ReactNode;
  className?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  loadingMessage?: string;
  enablePagination?: boolean;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
}

const ScrollableTable: React.FC<ScrollableTableProps> = ({
  columns,
  children,
  className = '',
  emptyMessage = 'No hay datos disponibles',
  isLoading = false,
  loadingMessage = 'Cargando...',
  enablePagination = false,
  defaultPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100]
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Convertir children a array para poder paginar
  const childrenArray = React.Children.toArray(children);
  const totalItems = childrenArray.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Calcular los items de la página actual
  const paginatedChildren = useMemo(() => {
    if (!enablePagination) return childrenArray;
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return childrenArray.slice(startIndex, endIndex);
  }, [childrenArray, currentPage, pageSize, enablePagination]);

  // Resetear a página 1 cuando cambia el pageSize
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  // Navegar a página específica
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-300">{loadingMessage}</span>
      </div>
    );
  }

  return (
    <div className={`glass-card ${className}`}>
      <div className="px-4 py-5 sm:p-6">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full divide-y divide-white/20 dark:divide-white/10">
            <thead className="bg-white/60 text-gray-600 dark:bg-white/5 dark:text-gray-300">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.3em] ${
                      column.align === 'center' ? 'text-center' :
                      column.align === 'right' ? 'text-right' :
                      'text-left'
                    }`}
                    style={{ width: column.width }}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white/80 dark:bg-gray-900/50 divide-y divide-white/30 dark:divide-white/10">
              {paginatedChildren}
            </tbody>
          </table>
        </div>
        
        {/* Controles de paginación */}
        {enablePagination && totalItems > 0 && (
          <div className="mt-4 flex items-center justify-between border-t border-white/40 pt-4 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Mostrando {Math.min((currentPage - 1) * pageSize + 1, totalItems)} - {Math.min(currentPage * pageSize, totalItems)} de {totalItems}
              </span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="ml-2 rounded-xl border border-white/40 bg-white/80 px-3 py-1 text-sm text-gray-900 shadow-sm dark:border-white/10 dark:bg-gray-900/60 dark:text-gray-100"
              >
                {pageSizeOptions.map(size => (
                  <option key={size} value={size}>{size} por página</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm rounded-xl border border-white/40 bg-white/70 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:border-white/10 dark:bg-gray-900/60 dark:hover:bg-gray-900/40"
              >
                ««
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm rounded-xl border border-white/40 bg-white/70 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:border-white/10 dark:bg-gray-900/60 dark:hover:bg-gray-900/40"
              >
                «
              </button>
              <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm rounded-xl border border-white/40 bg-white/70 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:border-white/10 dark:bg-gray-900/60 dark:hover:bg-gray-900/40"
              >
                »
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm rounded-xl border border-white/40 bg-white/70 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:border-white/10 dark:bg-gray-900/60 dark:hover:bg-gray-900/40"
              >
                »»
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente auxiliar para las filas de la tabla
interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isStriped?: boolean; // Para controlar manualmente el striped si es necesario
}

export const TableRow: React.FC<TableRowProps> = ({ 
  children, 
  className = '', 
  onClick,
  isStriped = false
}) => {
  // Clase base para striped: filas pares tienen fondo ligeramente diferente
  const stripedClass = isStriped 
    ? 'bg-white/80 dark:bg-gray-900/40' 
    : 'even:bg-white/70 odd:bg-white/90 dark:even:bg-gray-900/40 dark:odd:bg-gray-900/60';
  
  return (
    <tr 
      className={`${stripedClass} hover:bg-white dark:hover:bg-white/10 transition-colors duration-150 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

// Componente auxiliar para las celdas de la tabla
interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export const TableCell: React.FC<TableCellProps> = ({ 
  children, 
  className = '',
  align = 'left'
}) => (
  <td 
    className={`px-6 py-5 text-sm text-gray-700 dark:text-gray-100 ${
      align === 'center' ? 'text-center' :
      align === 'right' ? 'text-right' :
      'text-left'
    } ${className}`}
  >
    {children}
  </td>
);

// Componente para mostrar estado vacío
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon, 
  title, 
  message, 
  action 
}) => (
  <div className="text-center py-8">
    <div className="text-gray-500 dark:text-gray-400">
      {icon || (
        <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )}
      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{message}</p>
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  </div>
);

export default ScrollableTable;