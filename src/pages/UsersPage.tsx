import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { useRoles } from '@/hooks/useRoles';
import { useNotifications } from '@/hooks/useNotifications';
import UserForm from '@/components/forms/UserForm';
import ActionButtons from '@/components/ui/ActionButtons';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { ScrollableTable, TableRow, TableCell, EmptyState } from '@/components/ui';

export function UsersPage() {
  const { users, loading, error, createUser, updateUser, toggleUserStatus, refreshUsers, updateUserRoles } = useUsers();
  const { roles, loading: rolesLoading } = useRoles();
  const { showSuccess } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    user: any | null;
    loading: boolean;
  }>({ isOpen: false, user: null, loading: false });

  const handleCreateUser = async (userData: any) => {
    const success = await createUser(userData);
    if (success) {
      setShowForm(false); // Ocultar el formulario después de crear exitosamente
      showSuccess('Usuario creado exitosamente', 'El nuevo usuario ha sido registrado correctamente en el sistema');
    }
    return success;
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleUpdateUser = async (userData: any) => {
    if (!editingUser) return false;
    
    const success = await updateUser(editingUser.id, userData);
    
    if (success) {
      setShowForm(false);
      setEditingUser(null);
      showSuccess('Usuario actualizado exitosamente', 'Los datos del usuario han sido actualizados correctamente');
    }
    return success;
  };

  const handleToggleStatus = (user: any) => {
    setConfirmDialog({
      isOpen: true,
      user,
      loading: false,
    });
  };

  const confirmToggleStatus = async () => {
    if (!confirmDialog.user) return;
    
    setConfirmDialog(prev => ({ ...prev, loading: true }));
    
    const success = await toggleUserStatus(confirmDialog.user.id);
    
    if (success) {
      showSuccess(
        `Usuario ${confirmDialog.user.status === 'active' ? 'desactivado' : 'activado'} exitosamente`,
        `El estado de ${confirmDialog.user.name} ha sido actualizado correctamente`
      );
    }
    
    setConfirmDialog({ isOpen: false, user: null, loading: false });
  };

  const cancelToggleStatus = () => {
    setConfirmDialog({ isOpen: false, user: null, loading: false });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const handleSubmitForm = editingUser ? handleUpdateUser : handleCreateUser;

  // Efecto para actualizar los nombres de roles cuando se cargan los roles
  useEffect(() => {
    if (roles.length > 0 && users.length > 0) {
      updateUserRoles(roles);
    }
  }, [roles, users.length, updateUserRoles]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadgeColor = (role: string) => {
    // Colores basados en el nombre del rol
    const roleName = role.toLowerCase();
    if (roleName.includes('admin')) return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    if (roleName.includes('supervisor')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
    if (roleName.includes('editor')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
    if (roleName.includes('user') || roleName.includes('usuario')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    if (roleName.includes('viewer') || roleName.includes('visualizador')) return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    // Color por defecto para roles personalizados
    return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:truncate sm:text-3xl sm:tracking-tight">
              Gestión de Usuarios
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Administra los usuarios del sistema y sus permisos
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
              {showForm ? 'Cancelar' : editingUser ? 'Editar Usuario' : 'Agregar Usuario'}
            </button>
          </div>
        </div>

        {/* Formulario para crear/editar usuario */}
        {showForm && (
          <UserForm 
            onSubmit={handleSubmitForm}
            onCancel={handleCancelForm}
            loading={loading}
            className="mb-6"
            initialData={editingUser ? {
              user: editingUser.name,
              email: editingUser.email,
              employee_id: undefined, // TODO: Obtener del backend
              rol_id: editingUser.rolId,
              status: editingUser.status === 'active' ? 1 : 0
            } : null}
            isEdit={!!editingUser}
          />
        )}

        {/* Filters - Solo mostrar cuando no está el formulario */}
        {!showForm && (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border-0 mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                Filtros y Búsqueda
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Encuentra usuarios específicos
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                />
              </div>

              {/* Role Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                  disabled={rolesLoading}
                >
                  <option value="all">Todos los roles</option>
                  {roles.map((role) => (
                    <option key={role.id_rol} value={role.name}>
                      {role.name} {role.status === 1 ? '✅' : '❌'}
                    </option>
                  ))}
                </select>
                {rolesLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                )}
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Users Table - Solo mostrar cuando no está el formulario */}
        {!showForm && (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border-0">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Lista de Usuarios ({filteredUsers.length})
                </h3>
              </div>
              <button
                onClick={refreshUsers}
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
                <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando usuarios...</span>
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
                      Error al cargar los usuarios
                    </h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                      <p>{error}</p>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded text-sm font-medium text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/40"
                      >
                        Reintentar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <EmptyState
                icon={
                  <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                }
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
                  isLoading={loading}
                  loadingMessage="Cargando usuarios..."
                >
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                              <span className="text-sm font-medium text-white">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell align="center" className="whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getRoleBadgeColor(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell align="center" className="whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusBadgeColor(user.status)}`}>
                          {user.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {formatRegistrationDate(user.createdAt)}
                      </TableCell>
                      <TableCell align="right" className="whitespace-nowrap">
                        <ActionButtons
                          onEdit={() => handleEditUser(user)}
                          onToggleStatus={() => handleToggleStatus(user)}
                          isActive={user.status === 'active'}
                          loading={loading}
                          showEdit={true}
                          showToggleStatus={true}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </ScrollableTable>
                
                {filteredUsers.length > 0 && (
                  <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    Mostrando {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''}
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
          title={confirmDialog.user?.status === 'active' ? 'Desactivar Usuario' : 'Activar Usuario'}
          message={`¿Estás seguro de ${confirmDialog.user?.status === 'active' ? 'desactivar' : 'activar'} a ${confirmDialog.user?.name}?`}
          confirmText={confirmDialog.user?.status === 'active' ? 'Desactivar' : 'Activar'}
          cancelText="Cancelar"
          variant={confirmDialog.user?.status === 'active' ? 'danger' : 'info'}
          loading={confirmDialog.loading}
        />
      </div>
    </div>
  );
}
