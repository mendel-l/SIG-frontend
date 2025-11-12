import { useState, useEffect } from 'react';
import { Shield, Plus, RefreshCw } from 'lucide-react';
import PermissionForm from '../components/forms/PermissionForm';
import { usePermissionsStore } from '../stores/permissionsStore';
import { useNotifications } from '../hooks/useNotifications';
import { ScrollableTable, TableRow, TableCell, EmptyState } from '../components/ui';
import ActionButtons from '../components/ui/ActionButtons';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import { Permission, PermissionBase } from '../types';

export function PermissionsPage() {
  const { permissions, loading, error, fetchPermissions, createPermission, updatePermission, deletePermission, clearError } = usePermissionsStore();
  const { showSuccess, showError } = useNotifications();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  
  // Estado para confirmación de toggle
  const [confirmAction, setConfirmAction] = useState<{
    isOpen: boolean;
    permission: Permission | null;
    action: 'toggle';
  }>({
    isOpen: false,
    permission: null,
    action: 'toggle'
  });
  const [isConfirming, setIsConfirming] = useState(false);

  // Cargar permisos al montar el componente
  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  // Mostrar errores como notificación
  useEffect(() => {
    if (error) {
      showError('Error', error);
      clearError();
    }
  }, [error, showError, clearError]);

  const handleCreatePermission = async (data: PermissionBase) => {
    const success = await createPermission(data);
    if (success) {
      setShowForm(false);
      showSuccess('Permiso creado exitosamente', 'El nuevo permiso ha sido registrado correctamente en el sistema');
    }
    return success;
  };

  const handleUpdatePermission = async (data: PermissionBase) => {
    if (!editingPermission) return false;
    
    const success = await updatePermission(editingPermission.id, data);
    if (success) {
      setShowForm(false);
      setEditingPermission(null);
      showSuccess('Permiso actualizado', 'Los cambios han sido guardados correctamente');
    }
    return success;
  };

  const handleEditPermission = (permission: Permission) => {
    setEditingPermission(permission);
    setShowForm(true);
  };

  const handleToggleStatus = (permission: Permission) => {
    setConfirmAction({
      isOpen: true,
      permission,
      action: 'toggle'
    });
  };

  const confirmToggleStatus = async () => {
    if (!confirmAction.permission) return;

    setIsConfirming(true);
    const success = await deletePermission(confirmAction.permission.id);
    
    if (success) {
      const newStatus = !confirmAction.permission.status;
      showSuccess(
        `Permiso ${newStatus ? 'activado' : 'desactivado'}`,
        `El permiso "${confirmAction.permission.name}" ha sido ${newStatus ? 'activado' : 'desactivado'} correctamente`
      );
    }
    
    setIsConfirming(false);
    setConfirmAction({ isOpen: false, permission: null, action: 'toggle' });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPermission(null);
  };

  const handleRefresh = () => {
    fetchPermissions();
    showSuccess('Lista actualizada', 'Los permisos han sido actualizados correctamente');
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

  // Filtrar permisos por búsqueda
  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Contar permisos activos
  const activePermissionsCount = permissions.filter(p => p.status).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header con estadísticas */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white">
                    Permisos del Sistema
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Administra los permisos de acceso y control del sistema
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`-ml-0.5 mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (showForm) {
                    handleCancelForm();
                  } else {
                    setShowForm(true);
                  }
                }}
                disabled={loading}
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="-ml-0.5 mr-1.5 h-5 w-5" />
                {showForm ? 'Cancelar' : 'Nuevo Permiso'}
              </button>
            </div>
          </div>

          {/* Estadísticas rápidas - Solo mostrar cuando no está el formulario */}
          {!showForm && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Permisos</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                    {permissions.length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Permisos Activos</p>
                  <p className="text-2xl font-semibold text-green-600 dark:text-green-400 mt-1">
                    {activePermissionsCount}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resultados Búsqueda</p>
                  <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mt-1">
                    {filteredPermissions.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Formulario para crear/editar permiso */}
        {showForm && (
          <PermissionForm 
            onSubmit={editingPermission ? handleUpdatePermission : handleCreatePermission}
            onCancel={handleCancelForm}
            loading={loading}
            className="mb-6"
            initialData={editingPermission ? {
              name: editingPermission.name,
              description: editingPermission.description,
              status: editingPermission.status
            } : undefined}
            isEdit={!!editingPermission}
          />
        )}

        {/* Barra de búsqueda - Solo mostrar cuando no está el formulario */}
        {!showForm && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6 border border-gray-200 dark:border-gray-700 p-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar permisos por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        )}

        {/* Lista de permisos - Solo mostrar cuando no está el formulario */}
        {!showForm && error && !loading ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                  Error al cargar los permisos
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
        ) : !showForm && filteredPermissions.length === 0 && !loading ? (
          <EmptyState
            title={searchTerm ? "No se encontraron permisos" : "No hay permisos disponibles"}
            message={searchTerm 
              ? `No se encontraron permisos que coincidan con "${searchTerm}"`
              : "No se encontraron permisos en el sistema. Crea el primer permiso para comenzar."
            }
          />
        ) : !showForm && !loading && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Lista de Permisos ({filteredPermissions.length})
              </h3>
            </div>
            
            <ScrollableTable
              columns={[
                { key: 'id', label: 'ID', width: '80px' },
                { key: 'name', label: 'Nombre', width: '250px' },
                { key: 'description', label: 'Descripción' },
                { key: 'status', label: 'Estado', width: '120px' },
                { key: 'created', label: 'Creado', width: '180px' },
                { key: 'updated', label: 'Actualizado', width: '180px' },
                { key: 'actions', label: 'Acciones', width: '120px' }
              ]}
              isLoading={loading}
              loadingMessage="Cargando permisos..."
              enablePagination={true}
              defaultPageSize={25}
              pageSizeOptions={[10, 25, 50, 100]}
            >
              {filteredPermissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                    #{permission.id}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          permission.status 
                            ? 'bg-green-600 dark:bg-green-500' 
                            : 'bg-gray-400 dark:bg-gray-600'
                        }`}>
                          <Shield className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {permission.name}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md text-sm text-gray-900 dark:text-gray-100">
                      {permission.description}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      permission.status 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {permission.status ? '✅ Activo' : '❌ Inactivo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {formatDate(permission.createdAt)}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {formatDate(permission.updatedAt)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <ActionButtons
                      onEdit={() => handleEditPermission(permission)}
                      onToggleStatus={() => handleToggleStatus(permission)}
                      isActive={permission.status}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </ScrollableTable>
          </div>
        )}

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={confirmAction.isOpen}
          title={confirmAction.permission?.status ? 'Desactivar Permiso' : 'Activar Permiso'}
          message={
            confirmAction.permission?.status
              ? `¿Estás seguro de que deseas desactivar el permiso "${confirmAction.permission?.name}"? Los roles que tienen este permiso no podrán usarlo hasta que lo reactives.`
              : `¿Estás seguro de que deseas activar el permiso "${confirmAction.permission?.name}"?`
          }
          variant={confirmAction.permission?.status ? 'danger' : 'info'}
          onConfirm={confirmToggleStatus}
          onClose={() => setConfirmAction({ isOpen: false, permission: null, action: 'toggle' })}
          loading={isConfirming}
        />
      </div>
    </div>
  );
}
