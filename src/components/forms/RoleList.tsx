import React from 'react';
import { Rol } from '../../types';
import { useRoles } from '../../hooks/useRoles';

interface RoleListProps {
  className?: string;
  roles?: Rol[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

const RoleList: React.FC<RoleListProps> = ({ 
  className = '', 
  roles: externalRoles,
  loading: externalLoading,
  error: externalError,
  onRefresh
}) => {
  const { roles: hookRoles, loading: hookLoading, error: hookError, refreshRoles } = useRoles();
  
  // Usar props externas si están disponibles, sino usar el hook interno
  const roles = externalRoles ?? hookRoles;
  const loading = externalLoading ?? hookLoading;
  const error = externalError ?? hookError;
  const handleRefresh = onRefresh ?? refreshRoles;

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-300">Cargando roles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 ${className}`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
              Error al cargar los roles
            </h3>
            <div className="mt-2 text-sm text-red-700 dark:text-red-400">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={handleRefresh}
                className="bg-red-100 dark:bg-red-800 px-2 py-1 rounded text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-gray-500 dark:text-gray-400">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay roles disponibles</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No se encontraron roles en el sistema.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={className}>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Lista de Roles
            </h3>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualizar
            </button>
          </div>
          
          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Descripción
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Creado
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Actualizado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800">
                {roles.map((rol) => (
                  <tr key={rol.id_rol} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 border-b border-gray-50 dark:border-gray-700/50">
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                      {rol.id_rol}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {rol.name}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-900 dark:text-gray-100">
                      <div className="max-w-xs truncate" title={rol.description}>
                        {rol.description || 'Sin descripción'}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                        rol.status === 1 
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                      }`}>
                        {rol.status === 1 ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(rol.created_at)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(rol.updated_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {roles.length > 0 && (
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Mostrando {roles.length} rol{roles.length !== 1 ? 'es' : ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleList;