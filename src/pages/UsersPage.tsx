import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Users, Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import UserForm from '../components/forms/UserForm';

export function UsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showUserForm, setShowUserForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Función para obtener usuarios del backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/v1/user/public?page=1&limit=100');
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Respuesta del backend (usuarios):', data);
      
      if (data.status === 'success') {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener roles del backend
  const fetchRoles = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/rol/public?page=1&limit=100');
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Respuesta del backend (roles):', data);
      
      if (data.status === 'success') {
        setRoles(data.data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  // Cargar usuarios y roles al montar el componente
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // Función para crear un nuevo usuario
  const createUser = async (userData: any): Promise<boolean> => {
    try {
      setFormLoading(true);
      const response = await fetch('http://localhost:8000/api/v1/user/public', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      console.log('Respuesta del servidor:', result);

      if (response.ok && result.status === 'success') {
        await fetchUsers(); // Recargar la lista de usuarios
        setShowUserForm(false); // Cerrar el formulario
        console.log('Usuario creado exitosamente');
        return true;
      } else {
        // Manejar errores específicos
        if (response.status === 409) {
          console.error('Error: Usuario ya existe');
          alert('Error: El usuario ya existe o hay un conflicto de datos');
        } else if (response.status === 500) {
          console.error('Error del servidor:', result.detail || result.message);
          alert('Error del servidor. Por favor, inténtalo de nuevo más tarde.');
        } else {
          console.error('Error:', result.detail || result.message);
          alert('Error al crear usuario: ' + (result.detail || result.message || 'Error desconocido'));
        }
        return false;
      }
    } catch (error) {
      console.error('Error de red al crear usuario:', error);
      alert('Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.');
      return false;
    } finally {
      setFormLoading(false);
    }
  };

  const filteredUsers = users.filter((user: any) => {
    const matchesSearch = user.user?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.rol_id.toString() === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status.toString() === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

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
        <Button onClick={() => setShowUserForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Usuario
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Filtros y Búsqueda</CardTitle>
          <CardDescription className="text-gray-700 dark:text-gray-300">
            Encuentra usuarios específicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="input"
              >
                <option value="all">Todos los roles</option>
                {roles.map((role: any) => (
                  <option key={role.id_rol} value={role.id_rol.toString()}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input"
              >
                <option value="all">Todos los estados</option>
                <option value="1">Activos</option>
                <option value="0">Inactivos</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario de usuario inline */}
      {showUserForm && (
        <Card className="mb-6">
          <CardContent className="p-0">
            <UserForm
              onSubmit={createUser}
              onCancel={() => setShowUserForm(false)}
              loading={formLoading}
            />
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Usuarios ({filteredUsers.length})</CardTitle>
          <CardDescription className="text-gray-700 dark:text-gray-300">
            Lista de todos los usuarios del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Usuario
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Empleado ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Rol ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Estado
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando usuarios...</span>
                      </div>
                    </td>
                  </tr>
                )}
                
                {!loading && filteredUsers.map((user: any) => (
                  <tr key={user.id_user} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {user.user?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.user}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {user.employee_id || 'Sin asignar'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {user.rol_id}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${user.status === 1 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'}`}>
                        {user.status === 1 ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="secondary" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="danger" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-500 dark:text-gray-400 mx-auto mb-4" />
              <p className="text-gray-700 dark:text-gray-300">
                No se encontraron usuarios con los filtros aplicados
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
