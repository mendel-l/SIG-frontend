import { useState, useEffect } from 'react';
import { Rol, RolBase } from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1'; // URL correcta con prefijo v1

export const useRoles = () => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async (page: number = 1, limit: number = 10) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/rol/public?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: any = await response.json();
      
      console.log('Respuesta del backend:', data); // Para debug
      
      if (data.status === 'success') {
        setRoles(data.data);
      } else {
        setError(data.message || 'Error al obtener los roles');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching roles:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getRolesSync = () => {
    fetchRoles();
  };

  const refreshRoles = () => {
    fetchRoles();
  };

  const createRole = async (roleData: RolBase): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/rol/public`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roleData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: any = await response.json();
      
      console.log('Respuesta del backend (crear):', data); // Para debug
      
      if (data.status === 'success') {
        // Refrescar la lista de roles después de crear uno nuevo
        await fetchRoles();
        return true;
      } else {
        setError(data.message || 'Error al crear el rol');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error creating role:', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar roles automáticamente al montar el componente
  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    loading,
    error,
    fetchRoles,
    getRolesSync,
    refreshRoles,
    createRole,
  };
};