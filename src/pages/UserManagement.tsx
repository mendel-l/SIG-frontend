import { useMemo, useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Select,
  LoadingSpinner
} from '@/components/ui';
import UserForm from '@/components/forms/UserForm';
import { useUsers, type User, type UserBase, type UserUpdate } from '@/hooks/useUsers';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';

export function UserManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const {
    users,
    loading,
    createUser,
    updateUser,
    toggleUserStatus,
  } = useUsers();

  // Manejar creación de usuario
  const handleCreateUser = async (userData: UserBase) => {
    const success = await createUser(userData);
    if (success) {
      setShowForm(false);
    }
    return success;
  };

  // Manejar actualización de usuario
  const handleUpdateUser = async (userData: UserUpdate) => {
    if (!editingUser) {
      return false;
    }

    const success = await updateUser(editingUser.id, userData);

    if (success) {
      setEditingUser(null);
    }

    return success;
  };

  const handleToggleUserStatus = async (userId: string) => {
    if (window.confirm('¿Deseas cambiar el estado de este usuario?')) {
      await toggleUserStatus(userId);
    }
  };

  // Filtrar y buscar usuarios localmente
  const displayUsers = useMemo<User[]>(() => {
    const roleFiltered = selectedRole === 'all'
      ? users
      : users.filter((user) => user.role === selectedRole);

    const trimmedSearch = searchTerm.trim().toLowerCase();
    if (!trimmedSearch) {
      return roleFiltered;
    }

    return roleFiltered.filter((user) => {
      const nameMatch = user.name?.toLowerCase().includes(trimmedSearch);
      const emailMatch = user.email?.toLowerCase().includes(trimmedSearch);
      return nameMatch || emailMatch;
    });
  }, [users, selectedRole, searchTerm]);

  // Obtener etiqueta del rol
  const getRoleLabel = (role: string) => {
    const roles = {
      admin: 'Administrador',
      user: 'Usuario',
      viewer: 'Visualizador',
    };
    return roles[role as keyof typeof roles] || role;
  };

  // Obtener etiqueta del departamento
  const getDepartmentLabel = (dept: string) => {
    const departments = {
      it: 'Tecnología',
      hr: 'Recursos Humanos',
      finance: 'Finanzas',
      operations: 'Operaciones',
      marketing: 'Marketing',
    };
    return departments[dept as keyof typeof departments] || dept;
  };

  const roleOptions = [
    { value: 'all', label: 'Todos los roles' },
    { value: 'admin', label: 'Administradores' },
    { value: 'user', label: 'Usuarios' },
    { value: 'viewer', label: 'Visualizadores' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Administra los usuarios del sistema
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Formulario de Usuario */}
      {showForm && (
        <UserForm
          onSubmit={handleCreateUser}
          isEdit={false}
        />
      )}

      {editingUser && (
        <UserForm
          onSubmit={handleUpdateUser}
          initialData={editingUser}
          isEdit={true}
        />
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Buscar usuarios"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
            
            <Select
              label="Filtrar por rol"
              placeholder="Selecciona un rol"
              options={roleOptions}
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios ({displayUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : displayUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || selectedRole !== 'all' 
                  ? 'No se encontraron usuarios con los filtros aplicados'
                  : 'No hay usuarios registrados'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Usuario
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Rol
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Departamento
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Estado
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                            : user.role === 'user'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                        }`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {getDepartmentLabel(user.department ?? '')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                        }`}>
                          {user.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setEditingUser(user)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleToggleUserStatus(user.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
