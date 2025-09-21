import { useState, useEffect } from 'react';
import { useNotifications } from './useNotifications';

// Tipos de datos
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
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos mock
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'Juan Pérez',
          email: 'juan.perez@empresa.com',
          role: 'admin',
          department: 'it',
          status: 'active',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          name: 'María García',
          email: 'maria.garcia@empresa.com',
          role: 'user',
          department: 'hr',
          status: 'active',
          createdAt: '2024-01-16T14:30:00Z',
          updatedAt: '2024-01-16T14:30:00Z',
        },
      ];
      
      setUsers(mockUsers);
    } catch (err) {
      setError('Error al cargar usuarios');
      showError('Error al cargar usuarios', 'No se pudieron obtener los datos de los usuarios');
    } finally {
      setLoading(false);
    }
  };

  // Crear usuario
  const createUser = async (userData: CreateUserData): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        department: userData.department,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setUsers(prev => [...prev, newUser]);
      showSuccess('Usuario creado exitosamente', `${newUser.name} ha sido agregado al sistema`);
    } catch (err) {
      setError('Error al crear usuario');
      showError('Error al crear usuario', 'No se pudo completar la operación');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar usuario
  const updateUser = async (userData: UpdateUserData): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prev => prev.map(user => 
        user.id === userData.id 
          ? { ...user, ...userData, updatedAt: new Date().toISOString() }
          : user
      ));
      
      showSuccess('Usuario actualizado exitosamente', 'Los cambios se han guardado correctamente');
    } catch (err) {
      setError('Error al actualizar usuario');
      showError('Error al actualizar usuario', 'No se pudieron guardar los cambios');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario
  const deleteUser = async (userId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prev => prev.filter(user => user.id !== userId));
      showSuccess('Usuario eliminado exitosamente', 'El usuario ha sido removido del sistema');
    } catch (err) {
      setError('Error al eliminar usuario');
      showError('Error al eliminar usuario', 'No se pudo completar la eliminación');
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
