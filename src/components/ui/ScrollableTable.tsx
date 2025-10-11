import React from 'react';

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
}

const ScrollableTable: React.FC<ScrollableTableProps> = ({
  columns,
  children,
  className = '',
  emptyMessage = 'No hay datos disponibles',
  isLoading = false,
  loadingMessage = 'Cargando...'
}) => {
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-300">{loadingMessage}</span>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="px-4 py-5 sm:p-6">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className={`px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 ${
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
            <tbody className="bg-white dark:bg-gray-800">
              {children}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para las filas de la tabla
interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const TableRow: React.FC<TableRowProps> = ({ 
  children, 
  className = '', 
  onClick 
}) => (
  <tr 
    className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 border-b border-gray-50 dark:border-gray-700/50 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </tr>
);

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
    className={`px-6 py-5 text-sm text-gray-900 dark:text-gray-100 ${
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