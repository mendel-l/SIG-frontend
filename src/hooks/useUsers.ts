import { useState, useEffect } from 'react';
import { useNotifications } from './useNotifications';
import { apiService, BackendUser, BackendEmployee, BackendRol, handleApiError } from '@/services/api';

// Tipos de datos del frontend
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  department: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  department: string;
}

export interface UpdateUserData extends Partial<CreateUserData> {
  id: string;
}

// Función para convertir usuario del backend al formato del frontend
function mapBackendUserToFrontend(backendUser: BackendUser, employee?: BackendEmployee, role?: BackendRol): User {
  return {
    id: backendUser.id_user.toString(),
    name: employee ? `${employee.first_name} ${employee.last_name}` : backendUser.user,
    email: employee?.email || backendUser.user,
    role: role?.name === 'admin' ? 'admin' : 'user',
    department: 'general', // Por defecto, se puede mejorar después
    status: backendUser.status === 1 ? 'active' : 'inactive',
    createdAt: backendUser.created_at,
    updatedAt: backendUser.updated_at,
  };
}

// Hook personalizado para manejar usuarios
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError, showWarning, showInfo, showLoading, updateLoading } = useNotifications();

  // Cargar usuarios
  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Obtener usuarios del backend
      const backendUsers = await apiService.getUsers();
      
      // Obtener empleados y roles para mapear correctamente
      const employeesResponse = await apiService.getEmployees();
      const rolesResponse = await apiService.getRoles();
      
      const employees = employeesResponse.data || [];
      const roles = rolesResponse.data || [];
      
      // Mapear usuarios del backend al formato del frontend
      const mappedUsers = backendUsers.data.map(backendUser => {
        const employee = employees.find((emp: BackendEmployee) => emp.id_employee === backendUser.employee_id);
        const role = roles.find((r: BackendRol) => r.id_rol === backendUser.rol_id);
        return mapBackendUserToFrontend(backendUser, employee, role);
      });
      
      setUsers(mappedUsers);
    } catch (err: any) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      showError('Error al cargar usuarios', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Crear usuario
  const createUser = async (userData: CreateUserData): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Crear empleado primero
      const employee = await apiService.createEmployee({
        first_name: userData.name.split(' ')[0] || userData.name,
        last_name: userData.name.split(' ').slice(1).join(' ') || '',
        email: userData.email,
      });

      // Obtener rol correspondiente
      const rolesResponse = await apiService.getRoles();
      const roles = rolesResponse.data || [];
      const role = roles.find((r: BackendRol) => r.name === userData.role) || roles[0];

      if (!role) {
        throw new Error('No se encontró el rol especificado');
      }

      // Crear usuario
      const backendUser = await apiService.createUser({
        user: userData.email,
        password_hash: 'password123', // Contraseña por defecto, se puede mejorar
        employee_id: employee.id_employee,
        rol_id: role.id_rol,
        status: 1, // Activo
      });

      const newUser = mapBackendUserToFrontend(backendUser, employee, role);
      
      setUsers(prev => [...prev, newUser]);
      showSuccess('Usuario creado exitosamente', `${newUser.name} ha sido agregado al sistema`);
    } catch (err: any) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      showError('Error al crear usuario', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar usuario (pendiente de implementar en backend)
  const updateUser = async (userData: UpdateUserData): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implementar cuando el backend tenga endpoint de actualización
      showWarning('Función pendiente', 'La actualización de usuarios estará disponible próximamente');
      
      // Por ahora solo actualizar localmente
      setUsers(prev => prev.map(user => 
        user.id === userData.id 
          ? { ...user, ...userData, updatedAt: new Date().toISOString() }
          : user
      ));
      
      showSuccess('Usuario actualizado localmente', 'Los cambios se han guardado en la sesión actual');
    } catch (err: any) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      showError('Error al actualizar usuario', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario (pendiente de implementar en backend)
  const deleteUser = async (userId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implementar cuando el backend tenga endpoint de eliminación
      showWarning('Función pendiente', 'La eliminación de usuarios estará disponible próximamente');
      
      // Por ahora solo eliminar localmente
      setUsers(prev => prev.filter(user => user.id !== userId));
      showSuccess('Usuario eliminado localmente', 'El usuario ha sido removido de la sesión actual');
    } catch (err: any) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      showError('Error al eliminar usuario', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar usuarios
  const searchUsers = (searchTerm: string): User[] => {
    if (!searchTerm.trim()) return users;
    
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Filtrar usuarios por rol
  const filterUsersByRole = (role: string): User[] => {
    if (role === 'all') return users;
    return users.filter(user => user.role === role);
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  return {
    // Estado
    users,
    loading,
    error,
    
    // Acciones
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    filterUsersByRole,
  };
}
