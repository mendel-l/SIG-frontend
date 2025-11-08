import { create } from 'zustand';
import { getAuthToken } from '../utils';
import { API_CONFIG, getApiUrl } from '../config/api';

const API_URL = getApiUrl(API_CONFIG.ENDPOINTS.EMPLOYEES);

// Interfaces
export interface Employee {
  id_employee: number;
  id_type_employee: number;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  state: boolean;
  created_at: string;
  updated_at: string;
  type_employee?: {
    id_type_employee: number;
    name: string;
  };
}

export interface EmployeeBase {
  first_name: string;
  last_name: string;
  phone_number?: string | null;
  state: boolean;
  id_type_employee: number;
}

export interface EmployeeCreate extends EmployeeBase {}

export interface EmployeeUpdate {
  first_name?: string;
  last_name?: string;
  phone_number?: string | null;
  state?: boolean;
  id_type_employee?: number;
}

interface EmployeesState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  fetchEmployees: (page?: number, limit?: number) => Promise<void>;
  createEmployee: (data: EmployeeCreate) => Promise<boolean>;
  updateEmployee: (id: number, data: EmployeeUpdate) => Promise<boolean>;
  deleteEmployee: (id: number) => Promise<boolean>;
  clearError: () => void;
}

export const useEmployeesStore = create<EmployeesState>((set, get) => ({
  employees: [],
  loading: false,
  error: null,

  fetchEmployees: async (page = 1, limit = 10000) => {
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
        set({ employees: result.data, loading: false });
      } else {
        throw new Error(result.message || 'Error al obtener empleados');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      set({ error: errorMessage, loading: false });
      console.error('Error fetching employees:', error);
    }
  },

  createEmployee: async (data: EmployeeCreate) => {
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
        if (response.status === 409) {
          throw new Error('El empleado ya existe');
        }
        if (response.status === 404) {
          throw new Error('El tipo de empleado no existe');
        }
        if (response.status === 400) {
          throw new Error('Datos inválidos');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        await get().fetchEmployees();
        set({ loading: false });
        return true;
      } else {
        throw new Error(result.message || 'Error al crear empleado');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      set({ error: errorMessage, loading: false });
      console.error('Error creating employee:', error);
      return false;
    }
  },

  updateEmployee: async (id: number, data: EmployeeUpdate) => {
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
        if (response.status === 404) {
          throw new Error('El empleado no existe');
        }
        if (response.status === 400) {
          throw new Error('Datos inválidos');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        await get().fetchEmployees();
        set({ loading: false });
        return true;
      } else {
        throw new Error(result.message || 'Error al actualizar empleado');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      set({ error: errorMessage, loading: false });
      console.error('Error updating employee:', error);
      return false;
    }
  },

  deleteEmployee: async (id: number) => {
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
          throw new Error('El empleado no existe');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        await get().fetchEmployees();
        set({ loading: false });
        return true;
      } else {
        throw new Error(result.message || 'Error al cambiar estado del empleado');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      set({ error: errorMessage, loading: false });
      console.error('Error deleting employee:', error);
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
