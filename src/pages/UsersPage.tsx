import { useState, useEffect } from 'react';
import { Search, Users } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useDebounce } from '@/hooks/useDebounce';
import { 
  useUsers, 
  useCreateUser, 
  useUpdateUser,
  useDeleteUser,
  type User,
  type UserCreate,
  type UserUpdate 
} from '@/queries/usersQueries';
import { useRoles, type Rol } from '@/queries/rolesQueries';
import UserForm from '@/components/forms/UserForm';
import ActionButtons from '@/components/ui/ActionButtons';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { ScrollableTable, TableRow, TableCell, EmptyState, Pagination, StatsCards, PageHeader, SearchBar, StatCard } from '@/components/ui';

export function UsersPage() {
  const { showSuccess, showError } = useNotifications();
  
  // Estado local de UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({ isOpen: false, user: null });

  // Debounce del término de búsqueda para optimizar peticiones (300ms)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Resetear página a 1 cuando cambia el término de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // ✅ QUERY - Obtener usuarios con TanStack Query (búsqueda en backend)
  // Nota: Los filtros de rol y estado aún se manejan en el frontend
  const { 
    data: usersData,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useUsers(currentPage, pageSize, debouncedSearchTerm || undefined);

  // Nota: El backend limita a 100 items por página, usamos el máximo permitido
  const { data: rolesData } = useRoles(1, 100);
  const roles = rolesData?.items || [];

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const users = usersData?.items || [];
  const pagination = usersData?.pagination || { 
    page: 1, 
    limit: pageSize, 
    total_items: 0, 
    total_pages: 1,
    next_page: null,
    prev_page: null,
  };

  const handleCreateUser = async (userData: any) => {
    try {
      const createData: UserCreate = {
        user: userData.user,
        email: userData.email,
        password_hash: userData.password_hash || userData.password || '',
        employee_id: userData.employee_id || null,
        rol_id: userData.rol_id,
        status: userData.status === 1 || userData.status === true,
      };
      await createMutation.mutateAsync(createData);
      setShowForm(false);
      showSuccess('Usuario creado exitosamente', 'El nuevo usuario ha sido registrado correctamente en el sistema');
      return true;
    } catch (error: any) {
      showError('Error', error.message || 'Error al crear usuario');
      return false;
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleUpdateUser = async (userData: any) => {
    if (!editingUser) return false;
    
    try {
      const updateData: UserUpdate = {
        user: userData.user,
        email: userData.email,
        password: userData.password || userData.password_hash || undefined,
        employee_id: userData.employee_id || null,
        rol_id: userData.rol_id,
        status: userData.status === 1 || userData.status === true,
      };
      
      if (!updateData.password) {
        delete updateData.password;
      }
      
      await updateMutation.mutateAsync({
        id: editingUser.id_user,
        data: updateData
      });
      setShowForm(false);
      setEditingUser(null);
      showSuccess('Usuario actualizado exitosamente', 'Los datos del usuario han sido actualizados correctamente');
      return true;
    } catch (error: any) {
      showError('Error', error.message || 'Error al actualizar usuario');
      return false;
    }
  };

  const handleToggleStatus = (user: User) => {
    setConfirmDialog({
      isOpen: true,
      user,
    });
  };

  const confirmToggleStatus = async () => {
    if (!confirmDialog.user) return;
    
    try {
      await deleteMutation.mutateAsync(confirmDialog.user.id_user);
      const newStatus = !confirmDialog.user.status;
      showSuccess(
        `Usuario ${newStatus ? 'activado' : 'desactivado'} exitosamente`,
        `El estado de ${confirmDialog.user.user} ha sido actualizado correctamente`
      );
    } catch (error: any) {
      showError('Error', error.message || 'Error al cambiar estado del usuario');
    } finally {
      setConfirmDialog({ isOpen: false, user: null });
    }
  };

  const cancelToggleStatus = () => {
    setConfirmDialog({ isOpen: false, user: null });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const handleSubmitForm = editingUser ? handleUpdateUser : handleCreateUser;

  // Los datos ya vienen filtrados del backend por búsqueda de texto
  // Aplicamos filtros locales solo para rol y estado (si están implementados en el backend, se pueden mover)
  const filteredUsers = users.filter(user => {
    // Filtro de rol
    if (selectedRole !== 'all' && user.rol_id.toString() !== selectedRole) {
      return false;
    }
    
    // Filtro de estado
    if (selectedStatus !== 'all') {
      const statusMatch = selectedStatus === '1' ? user.status === true : user.status === false;
      if (!statusMatch) return false;
    }
    
    return true;
  });

  const totalUsers = pagination.total_items;
  const hasSearch = debouncedSearchTerm.trim().length > 0 || selectedRole !== 'all' || selectedStatus !== 'all';

  const getRoleName = (rol_id: number) => {
    const rol = roles.find((r: Rol) => r.id_rol === rol_id);
    return rol ? rol.name : 'Sin rol';
  };

  const getRoleBadgeColor = (rol_id: number) => {
    const rol = roles.find((r: Rol) => r.id_rol === rol_id);
    const roleName = rol ? rol.name.toLowerCase() : '';
    if (roleName.includes('admin')) return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    if (roleName.includes('supervisor')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
    if (roleName.includes('editor')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
    if (roleName.includes('user') || roleName.includes('usuario')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    if (roleName.includes('viewer') || roleName.includes('visualizador')) return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
  };

  const getStatusBadgeColor = (status: boolean) => {
    return status === true
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
  };

  const formatRegistrationDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats: StatCard[] = [
    {
      label: 'Total Usuarios',
      value: totalUsers,
      icon: Users,
      iconColor: 'text-blue-600 dark:text-blue-500',
    },
    ...(hasSearch ? [{
      label: 'Resultados Búsqueda',
      value: totalUsers,
      icon: Search,
      iconColor: 'text-purple-600 dark:text-purple-500',
    }] : []),
  ];

  const handleRefresh = () => {
    refetch();
    showSuccess('Actualizado', 'Lista de usuarios actualizada');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <PageHeader
          title="Gestión de Usuarios"
          subtitle="Administra los usuarios del sistema y sus permisos"
          icon={Users}
          onRefresh={handleRefresh}
          onAdd={() => {
            if (showForm) {
              handleCancelForm();
            } else {
              setShowForm(true);
            }
          }}
          addLabel={editingUser ? 'Editar Usuario' : 'Agregar Usuario'}
          isRefreshing={isFetching}
          showForm={showForm}
        />

        {/* Formulario para crear/editar usuario */}
        {showForm && (
          <UserForm 
            onSubmit={handleSubmitForm}
            onCancel={handleCancelForm}
            loading={createMutation.isPending || updateMutation.isPending}
            className="mb-6"
            initialData={editingUser ? {
              user: editingUser.user,
              email: editingUser.email,
              employee_id: editingUser.employee_id || undefined,
              rol_id: editingUser.rol_id,
              status: editingUser.status ? 1 : 0
            } : null}
            isEdit={!!editingUser}
          />
        )}

        {!showForm && (
          <>
            <StatsCards stats={stats} />

            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg mb-6 p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <SearchBar
                  placeholder="Buscar usuarios por nombre o email..."
                  value={searchTerm}
                  onChange={setSearchTerm}
                />

                <div className="flex items-center space-x-2">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                    disabled={isLoading}
                  >
                    <option value="all">Todos los roles</option>
                    {roles.filter((r: Rol) => r.status === true).map((role: Rol) => (
                      <option key={role.id_rol} value={role.id_rol}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="1">Activos</option>
                    <option value="0">Inactivos</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}

        {!showForm && (
          <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
            <div className="p-6">
              {isLoading && users.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Cargando usuarios...</p>
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
                        Error al cargar los usuarios
                      </h3>
                      <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                        <p>{error instanceof Error ? error.message : 'Error desconocido'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <EmptyState
                  icon={<Users className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />}
                  title="No hay usuarios disponibles"
                  message={searchTerm || selectedRole !== 'all' || selectedStatus !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'No se encontraron usuarios en el sistema.'
                  }
                />
              ) : (
                <>
                  <ScrollableTable
                    columns={[
                      { key: 'user', label: 'Usuario', width: '250px' },
                      { key: 'role', label: 'Rol', width: '120px', align: 'center' },
                      { key: 'status', label: 'Estado', width: '120px', align: 'center' },
                      { key: 'date', label: 'Fecha de registro', width: '150px' },
                      { key: 'actions', label: 'Acciones', width: '100px', align: 'right' }
                    ]}
                    isLoading={isFetching}
                    loadingMessage="Actualizando usuarios..."
                    enablePagination={false}
                  >
                    {filteredUsers.map((user) => (
                    <TableRow key={user.id_user}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                              <span className="text-sm font-medium text-white">
                                {user.user.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {user.user}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell align="center" className="whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.rol_id)}`}>
                          {getRoleName(user.rol_id)}
                        </span>
                      </TableCell>
                      <TableCell align="center" className="whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(user.status)}`}>
                          {user.status === true ? '✅ Activo' : '❌ Inactivo'}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {formatRegistrationDate(user.created_at)}
                      </TableCell>
                      <TableCell align="right" className="whitespace-nowrap">
                        <ActionButtons
                          onEdit={() => handleEditUser(user)}
                          onToggleStatus={() => handleToggleStatus(user)}
                          isActive={user.status === true}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  </ScrollableTable>
                  
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

        {/* Diálogo de confirmación para cambio de estado */}
        <ConfirmationDialog
          isOpen={confirmDialog.isOpen}
          onClose={cancelToggleStatus}
          onConfirm={confirmToggleStatus}
          title={confirmDialog.user?.status === true ? 'Desactivar Usuario' : 'Activar Usuario'}
          message={`¿Estás seguro de ${confirmDialog.user?.status === true ? 'desactivar' : 'activar'} a ${confirmDialog.user?.user}?`}
          confirmText={confirmDialog.user?.status === true ? 'Desactivar' : 'Activar'}
          cancelText="Cancelar"
          variant={confirmDialog.user?.status === true ? 'danger' : 'info'}
          loading={deleteMutation.isPending}
        />
      </div>
    </div>
  );
}
