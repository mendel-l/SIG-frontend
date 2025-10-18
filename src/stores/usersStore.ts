import { create } from 'zustand';
import { getAuthToken } from '../utils';

const API_URL = 'http://localhost:8000/api/v1/user';

// Interfaces
export interface User {
  id_user: number;
  user: string;
  email: string;
  employee_id: number;
  rol_id: number;
  status: number; // 1: activo, 0: inactivo
  created_at: string;
  updated_at: string;
  employee?: {
    id_employee: number;
    first_name: string;
    last_name: string;
  };
  rol?: {
    id_rol: number;
    name: string;
  };
}

export interface UserBase {
  user: string;
  password_hash: string;
  email: string;
  employee_id: number;
  rol_id: number;
  status: number;
}

export interface UserCreate extends UserBase {}

export interface UserUpdate {
  user?: string;
  password?: string;
  email?: string;
  employee_id?: number;
  rol_id?: number;
  status?: number;
}

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: (page?: number, limit?: number) => Promise<void>;
  createUser: (data: UserCreate) => Promise<boolean>;
  updateUser: (id: number, data: UserUpdate) => Promise<boolean>;
  deleteUser: (id: number) => Promise<boolean>;
  clearError: () => void;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async (page = 1, limit = 100) => {
    set({ loading: true, error: null });
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        set({ users: result.data, loading: false });
      } else {
        throw new Error(result.message || 'Error al obtener usuarios');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      set({ error: errorMessage, loading: false });
      console.error('Error fetching users:', error);
    }
  },

  createUser: async (data: UserCreate) => {
    set({ loading: true, error: null });
    try {
      const token = getAuthToken();
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // Intentar obtener el mensaje de error del servidor
        const errorData = await response.json().catch(() => null);
        
        if (response.status === 409) {
          const message = errorData?.detail?.message || 'El usuario o email ya existe';
          throw new Error(message);
        }
        if (response.status === 400) {
          const message = errorData?.detail || 'Datos inválidos';
          throw new Error(message);
        }
        if (response.status === 500) {
          const message = errorData?.detail || 'Error interno del servidor';
          throw new Error(`Error del servidor: ${message}`);
        }
        
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        await get().fetchUsers();
        set({ loading: false });
        return true;
      } else {
        throw new Error(result.message || 'Error al crear usuario');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      set({ error: errorMessage, loading: false });
      console.error('Error creating user:', error);
      return false;
    }
  },

  updateUser: async (id: number, data: UserUpdate) => {
    set({ loading: true, error: null });
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('El usuario o email ya existe');
        }
        if (response.status === 404) {
          throw new Error('El usuario no existe');
        }
        if (response.status === 400) {
          throw new Error('Datos inválidos');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        await get().fetchUsers();
        set({ loading: false });
        return true;
      } else {
        throw new Error(result.message || 'Error al actualizar usuario');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      set({ error: errorMessage, loading: false });
      console.error('Error updating user:', error);
      return false;
    }
  },

  deleteUser: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('El usuario no existe');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        await get().fetchUsers();
        set({ loading: false });
        return true;
      } else {
        throw new Error(result.message || 'Error al cambiar estado del usuario');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      set({ error: errorMessage, loading: false });
      console.error('Error deleting user:', error);
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
