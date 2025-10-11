import { useState, useEffect } from 'react';
import { Search, Shield } from 'lucide-react';
import { usePermissionsStore } from '@/stores/permissionsStore';
import { useNotifications } from '@/hooks/useNotifications';
import PermissionForm from '@/components/forms/PermissionForm';
import ActionButtons from '@/components/ui/ActionButtons';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import UnderDevelopmentModal from '@/components/ui/UnderDevelopmentModal';
import { ScrollableTable, TableRow, TableCell, EmptyState } from '@/components/ui';

export function PermissionsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingPermission, setEditingPermission] = useState<any>(null);
  const [showDevelopmentModal, setShowDevelopmentModal] = useState(false);
  const [developmentFeature, setDevelopmentFeature] = useState('');
  const [confirmAction, setConfirmAction] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    show: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });
  
  // Zustand store
  const {
    permissions,
    loading,
    error,
    fetchPermissions,
    createPermission,
    clearError
  } = usePermissionsStore();
  
  const { showSuccess } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar permisos al montar el componente
  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  // Limpiar error cuando se desmonte
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleCreatePermission = async (permissionData: any) => {
    const success = await createPermission(permissionData);
    if (success) {
      setShowForm(false);
      showSuccess('Permiso creado exitosamente', 'El permiso ha sido registrado en el sistema.');
    }
    return success;
  };

  const handleFormSubmit = async (permissionData: any) => {
    if (editingPermission) {
      // Mostrar modal de desarrollo para edición
      setDevelopmentFeature(`la edición de permisos`);
      setShowDevelopmentModal(true);
      return false;
    } else {
      return await handleCreatePermission(permissionData);
    }
  };

  const handleEdit = (permission: any) => {
    setDevelopmentFeature(`la edición del permiso "${permission.name}"`);
    setShowDevelopmentModal(true);
  };

  const handleDelete = (permission: any) => {
    setDevelopmentFeature(`la eliminación del permiso "${permission.name}"`);
    setShowDevelopmentModal(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPermission(null);
  };

  const handleRefresh = () => {
    fetchPermissions();
  };

  const filteredPermissions = permissions.filter(permission => 
    permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:truncate sm:text-3xl sm:tracking-tight">
              Gestión de Permisos
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Administra los permisos del sistema y controla el acceso a funcionalidades
            </p>
          </div>
          
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <svg className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              Exportar
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
              className="ml-3 inline-flex items-center rounded-md bg-blue-500 dark:bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 dark:hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:focus-visible:outline-blue-600"
            >
              <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              {showForm ? 'Cancelar' : editingPermission ? 'Editar Permiso' : 'Agregar Permiso'}
            </button>
          </div>
        </div>

        {/* Formulario para crear/editar permiso */}
        {showForm && (
          <PermissionForm 
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
            loading={loading}
            className="mb-6"
            initialData={editingPermission ? {
              name: editingPermission.name,
              description: editingPermission.description
            } : null}
            isEdit={!!editingPermission}
          />
        )}

        {/* Filtros - Solo mostrar cuando NO hay formulario */}
        {!showForm && (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border-0 mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                  Filtros y Búsqueda
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Encuentra permisos específicos
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Buscar permisos por nombre o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Permissions Table - Solo mostrar cuando NO hay formulario */}
        {!showForm && (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border-0">
            <div className="px-6 py-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Lista de Permisos ({filteredPermissions.length})
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Las funciones de edición y eliminación están en desarrollo
                  </p>
                </div>
                <button
                  onClick={handleRefresh}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                >
                  <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Actualizar
                </button>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando permisos...</span>
                </div>
              ) : error ? (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400 dark:text-red-500" viewBox="0 0 20 20" fill="currentColor">
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
                          className="bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded text-sm font-medium text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/40"
                        >
                          Reintentar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : filteredPermissions.length === 0 ? (
                <EmptyState
                  icon={
                    <Shield className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                  }
                  title="No hay permisos disponibles"
                  message={searchTerm
                    ? 'No se encontraron permisos que coincidan con la búsqueda'
                    : 'No se encontraron permisos en el sistema.'
                  }
                />
              ) : (
                <ScrollableTable
                  columns={[
                    { key: 'permission', label: 'Permiso', width: '250px' },
                    { key: 'description', label: 'Descripción', width: '300px' },
                    { key: 'created', label: 'Fecha de creación', width: '180px' },
                    { key: 'updated', label: 'Última modificación', width: '180px' },
                    { key: 'actions', label: 'Acciones', width: '120px', align: 'right' }
                  ]}
                  isLoading={loading}
                  loadingMessage="Cargando permisos..."
                >
                  {filteredPermissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center">
                              <Shield className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {permission.name}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {permission.description}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-gray-500 dark:text-gray-400">
                        {formatDate(permission.createdAt)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-gray-500 dark:text-gray-400">
                        {formatDate(permission.updatedAt)}
                      </TableCell>
                      <TableCell align="right" className="whitespace-nowrap">
                        <ActionButtons
                          onEdit={() => handleEdit(permission)}
                          onToggleStatus={() => handleDelete(permission)}
                          isActive={true}
                          loading={loading}
                          showToggleStatus={true}
                          showEdit={true}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </ScrollableTable>
              )}
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={confirmAction.show}
          title={confirmAction.title}
          message={confirmAction.message}
          onConfirm={confirmAction.onConfirm}
          onClose={() => setConfirmAction(prev => ({ ...prev, show: false }))}
          variant="danger"
        />

        {/* Under Development Modal */}
        <UnderDevelopmentModal
          isOpen={showDevelopmentModal}
          onClose={() => setShowDevelopmentModal(false)}
          feature={developmentFeature}
          title="Funcionalidad en Desarrollo"
          message={`${developmentFeature} está siendo implementada en el backend y no está disponible por el momento. Nuestro equipo está trabajando para tenerla lista pronto.`}
        />
      </div>
    </div>
  );
}