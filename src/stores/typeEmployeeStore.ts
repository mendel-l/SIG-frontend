import { create } from 'zustand';
import { getAuthToken } from '../utils';
import { TypeEmployee, TypeEmployeeBase } from '../types';
import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.API_BASE_URL;

// Estado del store
interface TypeEmployeeState {
  typeEmployees: TypeEmployee[];
  loading: boolean;
  error: string | null;
  
  // Acciones
  fetchTypeEmployees: (page?: number, limit?: number) => Promise<void>;
  createTypeEmployee: (data: TypeEmployeeBase) => Promise<boolean>;
  updateTypeEmployee: (id: number, data: Partial<TypeEmployeeBase>) => Promise<boolean>;
  deleteTypeEmployee: (id: number) => Promise<boolean>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// Store con Zustand
export const useTypeEmployeeStore = create<TypeEmployeeState>((set, get) => ({
  typeEmployees: [],
  loading: false,
  error: null,

  // Obtener tipos de empleado
  fetchTypeEmployees: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/type_employee?page=${page}&limit=${limit}`, {
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
      const items = Array.isArray(data?.data?.items) ? data.data.items : Array.isArray(data?.data) ? data.data : [];
      
      if (data.status === 'success') {
        set({ typeEmployees: items, loading: false });
      } else {
        throw new Error(data.message || 'Error al obtener los tipos de empleado');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener tipos de empleado';
      set({ error: errorMessage, loading: false });
      console.error('Error fetching type employees:', error);
    }
  },

  // Crear tipo de empleado
  createTypeEmployee: async (data: TypeEmployeeBase): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/type_employee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          ...data,
          state: data.state !== undefined ? data.state : true
        }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('El tipo de empleado ya existe');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      
      if (responseData.status === 'success') {
        // Recargar la lista
        await get().fetchTypeEmployees();
        set({ loading: false });
        return true;
      } else {
        throw new Error(responseData.message || 'Error al crear el tipo de empleado');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al crear tipo de empleado';
      set({ error: errorMessage, loading: false });
      console.error('Error creating type employee:', error);
      return false;
    }
  },

  // Actualizar tipo de empleado
  updateTypeEmployee: async (id: number, data: Partial<TypeEmployeeBase>): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/type_employee/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Tipo de empleado no encontrado');
        }
        if (response.status === 409) {
          throw new Error('El nombre del tipo de empleado ya existe');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();

      if (responseData.status === 'success') {
        // Recargar la lista
        await get().fetchTypeEmployees();
        set({ loading: false });
        return true;
      } else {
        throw new Error(responseData.message || 'Error al actualizar el tipo de empleado');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al actualizar tipo de empleado';
      set({ error: errorMessage, loading: false });
      console.error('Error updating type employee:', error);
      return false;
    }
  },

  // Eliminar tipo de empleado (toggle state)
  deleteTypeEmployee: async (id: number): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/type_employee/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Tipo de empleado no encontrado');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();

      if (responseData.status === 'success') {
        // Recargar la lista
        await get().fetchTypeEmployees();
        set({ loading: false });
        return true;
      } else {
        throw new Error(responseData.message || 'Error al eliminar el tipo de empleado');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al eliminar tipo de empleado';
      set({ error: errorMessage, loading: false });
      console.error('Error deleting type employee:', error);
      return false;
    }
  },

  // Limpiar error
  clearError: () => set({ error: null }),

  // Establecer loading
  setLoading: (loading: boolean) => set({ loading }),
}));
