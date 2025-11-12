import { create } from 'zustand';
import { getAuthToken } from '../utils';
import { Rol, RolBase } from '../types';
import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.API_BASE_URL;

// Estado del store
interface RolesState {
  roles: Rol[];
  loading: boolean;
  error: string | null;
  
  // Acciones
  fetchRoles: (page?: number, limit?: number) => Promise<void>;
  createRole: (roleData: RolBase) => Promise<boolean>;
  updateRole: (id: number, roleData: Partial<RolBase>) => Promise<boolean>;
  deleteRole: (id: number) => Promise<boolean>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// Store con Zustand
export const useRolesStore = create<RolesState>((set, get) => ({
  roles: [],
  loading: false,
  error: null,

  // Obtener roles
  fetchRoles: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/rol?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const items = Array.isArray(data?.data?.items) ? data.data.items : [];
      
      if (data.status === 'success') {
        set({ roles: items, loading: false });
      } else {
        throw new Error(data.message || 'Error al obtener los roles');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener roles';
      set({ error: errorMessage, loading: false });
      console.error('Error fetching roles:', error);
    }
  },

  // Crear rol
  createRole: async (roleData: RolBase): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/rol`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(roleData),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('El rol ya existe');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        // Recargar la lista de roles
        await get().fetchRoles();
        set({ loading: false });
        return true;
      } else {
        throw new Error(data.message || 'Error al crear el rol');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al crear rol';
      set({ error: errorMessage, loading: false });
      console.error('Error creating role:', error);
      return false;
    }
  },

  // Actualizar rol (necesita implementarse en backend)
  updateRole: async (id: number, roleData: Partial<RolBase>): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/rol/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(roleData),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Rol no encontrado');
        }
        if (response.status === 409) {
          throw new Error('El nombre del rol ya existe');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        // Recargar la lista de roles
        await get().fetchRoles();
        set({ loading: false });
        return true;
      } else {
        throw new Error(data.message || 'Error al actualizar el rol');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al actualizar rol';
      set({ error: errorMessage, loading: false });
      console.error('Error updating role:', error);
      return false;
    }
  },

  // Eliminar/Toggle rol (necesita implementarse en backend)
  deleteRole: async (id: number): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/rol/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Rol no encontrado');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        // Recargar la lista de roles
        await get().fetchRoles();
        set({ loading: false });
        return true;
      } else {
        throw new Error(data.message || 'Error al eliminar el rol');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al eliminar rol';
      set({ error: errorMessage, loading: false });
      console.error('Error deleting role:', error);
      return false;
    }
  },

  // Limpiar error
  clearError: () => set({ error: null }),

  // Establecer loading
  setLoading: (loading: boolean) => set({ loading }),
}));
