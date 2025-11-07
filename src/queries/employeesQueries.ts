import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthToken } from '@/utils';
import { API_CONFIG, getApiUrl } from '@/config/api';

const API_URL = getApiUrl(API_CONFIG.ENDPOINTS.EMPLOYEES);

// ============================================
// TYPES - Interfaces
// ============================================
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

export interface EmployeeCreate {
  first_name: string;
  last_name: string;
  phone_number?: string | null;
  state: boolean;
  id_type_employee: number;
}

export interface EmployeeUpdate {
  first_name?: string;
  last_name?: string;
  phone_number?: string | null;
  state?: boolean;
  id_type_employee?: number;
}

interface EmployeesApiResponse {
  status: 'success' | 'error';
  data: Employee[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

// ============================================
// QUERY KEYS - Para gestión de caché
// ============================================
export const employeeKeys = {
  all: ['employees'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: (page: number, limit: number) => 
    [...employeeKeys.lists(), { page, limit }] as const,
  details: () => [...employeeKeys.all, 'detail'] as const,
  detail: (id: number) => [...employeeKeys.details(), id] as const,
};

// ============================================
// API FUNCTIONS - Lógica de fetch
// ============================================

/**
 * Obtener lista de empleados con paginación
 */
async function fetchEmployees(page: number = 1, limit: number = 25): Promise<EmployeesApiResponse> {
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
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al obtener empleados');
  }

  return result;
}

/**
 * Crear un nuevo empleado
 */
async function createEmployeeApi(data: EmployeeCreate): Promise<Employee> {
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
    const errorData = await response.json();
    if (response.status === 409) {
      throw new Error('El empleado ya existe');
    }
    if (response.status === 404) {
      throw new Error('El tipo de empleado no existe');
    }
    if (response.status === 400) {
      throw new Error('Datos inválidos');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al crear empleado');
  }

  return result.data;
}

/**
 * Actualizar un empleado existente
 */
async function updateEmployeeApi(id: number, data: EmployeeUpdate): Promise<Employee> {
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
    const errorData = await response.json();
    if (response.status === 404) {
      throw new Error('El empleado no existe');
    }
    if (response.status === 400) {
      throw new Error('Datos inválidos');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al actualizar empleado');
  }

  return result.data;
}

/**
 * Eliminar/Cambiar estado de un empleado
 */
async function deleteEmployeeApi(id: number): Promise<void> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (response.status === 404) {
      throw new Error('El empleado no existe');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al cambiar estado del empleado');
  }
}

// ============================================
// REACT QUERY HOOKS
// ============================================

/**
 * Hook para obtener lista de empleados
 * ✅ Incluye caché automático
 * ✅ Evita dobles peticiones
 * ✅ Maneja paginación
 */
export function useEmployees(page: number = 1, limit: number = 25) {
  return useQuery({
    queryKey: employeeKeys.list(page, limit),
    queryFn: () => fetchEmployees(page, limit),
    staleTime: 1000 * 60 * 2, // 2 minutos frescos
    placeholderData: (previousData) => previousData, // Mantiene datos anteriores mientras carga
  });
}

/**
 * Hook para crear empleado
 * ✅ Invalida caché automáticamente después de crear
 * ✅ Refresca lista de empleados
 */
export function useCreateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createEmployeeApi,
    onSuccess: () => {
      // Invalida todas las listas de empleados para forzar refetch
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
}

/**
 * Hook para actualizar empleado
 * ✅ Invalida caché después de actualizar
 */
export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EmployeeUpdate }) => 
      updateEmployeeApi(id, data),
    onSuccess: () => {
      // Invalida listas de empleados
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
}

/**
 * Hook para eliminar/cambiar estado de empleado
 * ✅ Invalida caché después de eliminar
 */
export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteEmployeeApi,
    onSuccess: () => {
      // Invalida listas de empleados
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
}

