import { create } from 'zustand';
import { getAuthToken } from '../utils';
import { Permission, PermissionBase } from '../types';
import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.API_BASE_URL;

// Estado del store
interface PermissionsState {
  permissions: Permission[];
  loading: boolean;
  error: string | null;
  
  // Acciones
  fetchPermissions: (page?: number, limit?: number) => Promise<void>;
  createPermission: (permissionData: PermissionBase) => Promise<boolean>;
  updatePermission: (id: string, permissionData: Partial<PermissionBase>) => Promise<boolean>;
  deletePermission: (id: string) => Promise<boolean>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// Store con Zustand
export const usePermissionsStore = create<PermissionsState>((set, get) => ({
  permissions: [],
  loading: false,
  error: null,

  // Obtener permisos
  fetchPermissions: async (page = 1, limit = 100) => {
    set({ loading: true, error: null });
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/premissions?page=${page}&limit=${limit}`, {
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

      if (data.status === 'success' && Array.isArray(data.data)) {
        const mappedPermissions: Permission[] = data.data.map((permission: any) => ({
          id: permission.id_permissions?.toString() || '',
          name: permission.name || '',
          description: permission.description || '',
          status: permission.status ?? true,
          createdAt: permission.created_at || '',
          updatedAt: permission.updated_at || ''
        }));

        set({ permissions: mappedPermissions, loading: false });
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener permisos';
      set({ error: errorMessage, loading: false });
      console.error('Error fetching permissions:', error);
    }
  },

  // Crear permiso
  createPermission: async (permissionData: PermissionBase): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/premissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(permissionData),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('El permiso ya existe');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        // Recargar la lista de permisos
        await get().fetchPermissions();
        set({ loading: false });
        return true;
      } else {
        throw new Error(data.message || 'Error al crear el permiso');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al crear permiso';
      set({ error: errorMessage, loading: false });
      console.error('Error creating permission:', error);
      return false;
    }
  },

  // Actualizar permiso
  updatePermission: async (id: string, permissionData: Partial<PermissionBase>): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/premissions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(permissionData),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Permiso no encontrado');
        }
        if (response.status === 409) {
          throw new Error('El nombre del permiso ya existe');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        // Recargar la lista de permisos
        await get().fetchPermissions();
        set({ loading: false });
        return true;
      } else {
        throw new Error(data.message || 'Error al actualizar el permiso');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al actualizar permiso';
      set({ error: errorMessage, loading: false });
      console.error('Error updating permission:', error);
      return false;
    }
  },

  // Eliminar/Toggle permiso (activa/desactiva)
  deletePermission: async (id: string): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/premissions/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Permiso no encontrado');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        // Recargar la lista de permisos
        await get().fetchPermissions();
        set({ loading: false });
        return true;
      } else {
        throw new Error(data.message || 'Error al eliminar el permiso');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al eliminar permiso';
      set({ error: errorMessage, loading: false });
      console.error('Error deleting permission:', error);
      return false;
    }
  },

  // Limpiar error
  clearError: () => set({ error: null }),

  // Establecer loading
  setLoading: (loading: boolean) => set({ loading }),
}));