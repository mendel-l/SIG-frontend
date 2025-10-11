import { useState, useEffect, useCallback } from 'react';
import { getAuthToken } from '../utils';

const API_BASE_URL = 'http://localhost:8000/api/v1'; // URL correcta con prefijo v1

// Tipos de datos del frontend
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  rolId: number; // Agregamos el ID del rol para el mapeo
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface UserBase {
  user: string;
  password_hash: string;
  email: string;
  employee_id?: number;
  rol_id: number;
  status: number;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (page: number = 1, limit: number = 10) => {
    setLoading(true);
    setError(null);

    try {
      // Obtener el token del sessionStorage
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/user?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: any = await response.json();
      
      console.log('Respuesta del backend (usuarios):', data); // Para debug
      
      if (data.status === 'success') {
        // Mapear usuarios del backend al formato del frontend
        const mappedUsers = data.data.map((backendUser: any) => ({
          id: backendUser.id_user.toString(),
          name: backendUser.user,
          email: backendUser.email,
          role: 'Cargando...', // Se actualizará con el nombre real del rol
          rolId: backendUser.rol_id, // Guardamos el ID del rol para mapear después
          status: backendUser.status === 1 ? 'active' : 'inactive',
          createdAt: backendUser.created_at,
          updatedAt: backendUser.updated_at,
        }));
        setUsers(mappedUsers);
      } else {
        setError(data.message || 'Error al obtener los usuarios');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching users:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshUsers = () => {
    fetchUsers();
  };

  // Función para actualizar los nombres de roles basado en los roles cargados
  const updateUserRoles = useCallback((roles: any[]) => {
    setUsers(currentUsers => 
      currentUsers.map(user => ({
        ...user,
        role: roles.find(role => role.id_rol === user.rolId)?.name || 'Sin rol'
      }))
    );
  }, []);

  const createUser = async (userData: UserBase): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Obtener el token del sessionStorage
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: any = await response.json();
      
      console.log('Respuesta del backend (crear usuario):', data); // Para debug
      
      if (data.status === 'success') {
        // Refrescar la lista de usuarios después de crear uno nuevo
        await fetchUsers();
        return true;
      } else {
        setError(data.message || 'Error al crear el usuario');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error creating user:', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar usuarios automáticamente al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    refreshUsers,
    createUser,
    updateUserRoles,
  };
};
