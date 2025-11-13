import { useState, useEffect } from 'react';
import { Shield, Search } from 'lucide-react';
import PermissionForm from '../components/forms/PermissionForm';
import { useNotifications } from '../hooks/useNotifications';
import { useDebounce } from '../hooks/useDebounce';
import { 
  usePermissions, 
  useCreatePermission, 
  useUpdatePermission,
  useDeletePermission,
  type Permission,
  type PermissionCreate,
  type PermissionUpdate 
} from '../queries/permissionsQueries';
import { ScrollableTable, TableRow, TableCell, EmptyState, Pagination, StatsCards, PageHeader, SearchBar, StatCard } from '../components/ui';
import ActionButtons from '../components/ui/ActionButtons';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';

export function PermissionsPage() {
  const { showSuccess, showError } = useNotifications();
  
  // Estado local de UI
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    isOpen: boolean;
    permission: Permission | null;
  }>({
    isOpen: false,
    permission: null,
  });

  // Debounce del término de búsqueda para optimizar peticiones (300ms)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Resetear página a 1 cuando cambia el término de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // ✅ QUERY - Obtener permisos con TanStack Query (búsqueda en backend)
  const { 
    data: permissionsData,
    isLoading,
    error,
    isFetching,
    refetch,
  } = usePermissions(currentPage, pageSize, debouncedSearchTerm || undefined);

  // ✅ MUTATIONS - Acciones
  const createMutation = useCreatePermission();
  const updateMutation = useUpdatePermission();
  const deleteMutation = useDeletePermission();

  // Extraer datos y paginación
  const permissions = permissionsData?.items || [];
  const pagination = permissionsData?.pagination || { 
    page: 1, 
    limit: pageSize, 
    total_items: 0, 
    total_pages: 1,
    next_page: null,
    prev_page: null,
  };

  const handleCreatePermission = async (data: any) => {
    try {
      // Convertir status de number (1/0) a boolean
      const createData: PermissionCreate = {
        name: data.name,
        description: data.description || null,
        status: data.status === 1 || data.status === true,
      };
      await createMutation.mutateAsync(createData);
      setShowForm(false);
      showSuccess('Permiso creado exitosamente', 'El nuevo permiso ha sido registrado correctamente en el sistema');
      return true;
    } catch (error: any) {
      showError('Error', error.message || 'Error al crear permiso');
      return false;
    }
  };

  const handleUpdatePermission = async (data: any) => {
    if (!editingPermission) return false;
    
    try {
      // Convertir status de number (1/0) a boolean
      const updateData: PermissionUpdate = {
        name: data.name,
        description: data.description || null,
        status: data.status === 1 || data.status === true,
      };
      await updateMutation.mutateAsync({
        id: editingPermission.id_permissions,
        data: updateData
      });
      setShowForm(false);
      setEditingPermission(null);
      showSuccess('Permiso actualizado', 'Los cambios han sido guardados correctamente');
      return true;
    } catch (error: any) {
      showError('Error', error.message || 'Error al actualizar permiso');
      return false;
    }
  };

  const handleEditPermission = (permission: Permission) => {
    setEditingPermission(permission);
    setShowForm(true);
  };

  const handleToggleStatus = (permission: Permission) => {
    setConfirmAction({
      isOpen: true,
      permission,
    });
  };

  const confirmToggleStatus = async () => {
    if (!confirmAction.permission) return;
    
    try {
      await deleteMutation.mutateAsync(confirmAction.permission.id_permissions);
      const newStatus = !confirmAction.permission.status;
      showSuccess(
        `Permiso ${newStatus ? 'activado' : 'desactivado'}`,
        `El permiso "${confirmAction.permission.name}" ha sido ${newStatus ? 'activado' : 'desactivado'} correctamente`
      );
    } catch (error: any) {
      showError('Error', error.message || 'Error al cambiar estado del permiso');
    } finally {
      setConfirmAction({ isOpen: false, permission: null });
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPermission(null);
  };

  const handleRefresh = () => {
    refetch();
    showSuccess('Actualizado', 'Lista de permisos actualizada');
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

  // Los datos ya vienen filtrados del backend, no necesitamos filtrado local
  const totalPermissions = pagination.total_items;
  const hasSearch = debouncedSearchTerm.trim().length > 0;

  const stats: StatCard[] = [
    {
      label: 'Total Permisos',
      value: totalPermissions,
      icon: Shield,
      iconColor: 'text-blue-600 dark:text-blue-500',
    },
    ...(hasSearch ? [{
      label: 'Resultados Búsqueda',
      value: totalPermissions,
      icon: Search,
      iconColor: 'text-purple-600 dark:text-purple-500',
    }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <PageHeader
          title="Permisos del Sistema"
          subtitle="Administra los permisos de acceso y control del sistema"
          icon={Shield}
          onRefresh={handleRefresh}
          onAdd={() => {
            if (showForm) {
              handleCancelForm();
            } else {
              setShowForm(true);
            }
          }}
          addLabel={editingPermission ? 'Editar Permiso' : 'Nuevo Permiso'}
          isRefreshing={isFetching}
          showForm={showForm}
        />

        {/* Formulario para crear/editar permiso */}
        {showForm && (
          <PermissionForm 
            onSubmit={editingPermission ? handleUpdatePermission : handleCreatePermission}
            onCancel={handleCancelForm}
            loading={createMutation.isPending || updateMutation.isPending}
            className="mb-6"
            initialData={editingPermission ? {
              name: editingPermission.name,
              description: editingPermission.description || '',
              status: editingPermission.status
            } : undefined}
            isEdit={!!editingPermission}
          />
        )}

        {/* Estadísticas y Búsqueda - Solo cuando NO hay formulario */}
        {!showForm && (
          <>
            {/* Stats Cards */}
            <StatsCards stats={stats} />

            {/* Búsqueda */}
            <SearchBar
              placeholder="Buscar permisos por nombre o descripción..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </>
        )}

        {/* Lista de permisos - Solo mostrar cuando no está el formulario */}
        {!showForm && (
          <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
            <div className="p-6">
              {isLoading && permissions.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 dark:border-green-500 mx-auto"></div>
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Cargando permisos...</p>
                  </div>
                </div>
              ) : error ? (
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
                        <p>{error instanceof Error ? error.message : 'Error desconocido'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : permissions.length === 0 ? (
                <EmptyState
                  icon={<Shield className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />}
                  title={debouncedSearchTerm ? "No se encontraron permisos" : "No hay permisos disponibles"}
                  message={debouncedSearchTerm 
                    ? 'No se encontraron permisos con los criterios de búsqueda'
                    : "Comienza creando tu primer permiso"
                  }
                />
              ) : (
                <>
                  <ScrollableTable
                    columns={[
                      { key: 'id', label: 'ID', width: '80px' },
                      { key: 'name', label: 'Nombre', width: '250px' },
                      { key: 'description', label: 'Descripción' },
                      { key: 'created', label: 'Creado', width: '180px' },
                      { key: 'updated', label: 'Actualizado', width: '180px' },
                      { key: 'actions', label: 'Acciones', width: '120px' }
                    ]}
                    isLoading={isFetching}
                    loadingMessage="Actualizando permisos..."
                    enablePagination={false}
                  >
                    {permissions.map((permission) => (
                      <TableRow key={permission.id_permissions}>
                        <TableCell className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                          #{permission.id_permissions}
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
                            {permission.description || 'Sin descripción'}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          {formatDate(permission.created_at)}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          {formatDate(permission.updated_at)}
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
                  
                  {/* Paginación del backend - Mostrar siempre si hay datos */}
                  {!isLoading && !error && pagination.total_items > 0 && (
                    <div className="mt-4">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.total_pages}
                        totalItems={pagination.total_items}
                        pageSize={pageSize}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={(newSize) => {
                          setPageSize(newSize);
                          setCurrentPage(1);
                        }}
                        isLoading={isFetching}
                        pageSizeOptions={[10, 25, 50, 100]}
                        showPageSizeSelector={true}
                        showPageInfo={true}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
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
          onClose={() => setConfirmAction({ isOpen: false, permission: null })}
          loading={deleteMutation.isPending}
        />
      </div>
    </div>
  );
}
