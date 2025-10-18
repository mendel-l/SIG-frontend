import React, { useState, useEffect } from 'react';
import RoleForm from '../components/forms/RoleForm';
import { useRolesStore } from '../stores/rolesStore';
import { useNotifications } from '../hooks/useNotifications';
import { ScrollableTable, TableRow, TableCell, EmptyState } from '../components/ui';
import { RolBase } from '../types';

const RolesPage: React.FC = () => {
  const { roles, loading, error, fetchRoles, createRole, clearError } = useRolesStore();
  const { showSuccess, showError } = useNotifications();
  const [showForm, setShowForm] = useState(false);

  // Cargar roles al montar el componente
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Mostrar errores como notificación
  useEffect(() => {
    if (error) {
      showError('Error', error);
      clearError();
    }
  }, [error, showError, clearError]);

  const handleCreateRole = async (roleData: RolBase) => {
    const success = await createRole(roleData);
    if (success) {
      setShowForm(false);
      showSuccess('Rol creado exitosamente', 'El nuevo rol ha sido guardado correctamente en el sistema');
    }
    return success;
  };

  const handleRefresh = () => {
    fetchRoles();
    showSuccess('Lista actualizada', 'Los roles han sido actualizados correctamente');
  };

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header con botones de acción */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white">
              Gestión de Roles
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Administra los roles del sistema y sus permisos
            </p>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualizar
            </button>
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              {showForm ? 'Cancelar' : 'Nuevo Rol'}
            </button>
          </div>
        </div>

        {/* Formulario para crear rol */}
        {showForm && (
          <RoleForm 
            onSubmit={handleCreateRole}
            onCancel={() => setShowForm(false)}
            loading={loading}
            className="mb-6"
          />
        )}

        {/* Lista de roles */}
        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
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
        ) : roles.length === 0 && !loading && !showForm ? (
          <EmptyState
            title="No hay roles disponibles"
            message="No se encontraron roles en el sistema. Crea el primer rol para comenzar."
          />
        ) : !loading && !showForm && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Lista de Roles ({roles.length})
              </h3>
            </div>
            
            <ScrollableTable
              columns={[
                { key: 'id', label: 'ID', width: '80px' },
                { key: 'name', label: 'Nombre', width: '150px' },
                { key: 'description', label: 'Descripción' },
                { key: 'status', label: 'Estado', width: '100px', align: 'center' },
                { key: 'created', label: 'Creado', width: '150px' },
                { key: 'updated', label: 'Actualizado', width: '150px' }
              ]}
              isLoading={loading && !showForm}
              loadingMessage="Cargando roles..."
            >
              {roles.map((rol) => (
                <TableRow key={rol.id_rol}>
                  <TableCell className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                    {rol.id_rol}
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap">
                    {rol.name}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={rol.description}>
                      {rol.description || 'Sin descripción'}
                    </div>
                  </TableCell>
                  <TableCell align="center" className="whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      rol.status === 1 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {rol.status === 1 ? '✅ Activo' : '❌ Inactivo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {formatDate(rol.created_at)}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {formatDate(rol.updated_at)}
                  </TableCell>
                </TableRow>
              ))}
            </ScrollableTable>
          </div>
        )}
      </div>
    </div>
  );
};

export default RolesPage;