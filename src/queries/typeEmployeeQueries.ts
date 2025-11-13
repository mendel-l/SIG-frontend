import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthToken } from '@/utils';
import { API_CONFIG, getApiUrl } from '@/config/api';

const API_URL = getApiUrl(API_CONFIG.ENDPOINTS.TYPE_EMPLOYEE);

// ============================================
// TYPES - Interfaces
// ============================================
export interface TypeEmployee {
  id_type_employee: number;
  name: string;
  description?: string | null;
  state: boolean;
  created_at: string;
  updated_at: string;
}

export interface TypeEmployeeCreate {
  name: string;
  description?: string | null;
  state: boolean;
}

export interface TypeEmployeeUpdate {
  name?: string;
  description?: string | null;
  state?: boolean;
}

interface TypeEmployeesPagination {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
}

interface TypeEmployeesApiEnvelope {
  status: 'success' | 'error';
  message?: string;
  data?: {
    items?: TypeEmployee[];
    pagination?: Partial<TypeEmployeesPagination>;
  };
}

export interface TypeEmployeesQueryResult {
  status: 'success' | 'error';
  message?: string;
  items: TypeEmployee[];
  pagination: TypeEmployeesPagination;
}

// ============================================
// QUERY KEYS - Para gestión de caché
// ============================================
export const typeEmployeeKeys = {
  all: ['typeEmployees'] as const,
  lists: () => [...typeEmployeeKeys.all, 'list'] as const,
  list: (page: number, limit: number, search?: string) => 
    [...typeEmployeeKeys.lists(), { page, limit, search: search || '' }] as const,
  details: () => [...typeEmployeeKeys.all, 'detail'] as const,
  detail: (id: number) => [...typeEmployeeKeys.details(), id] as const,
};

// ============================================
// API FUNCTIONS - Lógica de fetch
// ============================================

function normalizePagination(pagination: Partial<TypeEmployeesPagination> | undefined, fallbackLimit: number): TypeEmployeesPagination {
  return {
    page: pagination?.page ?? 1,
    limit: pagination?.limit ?? fallbackLimit,
    total_items: pagination?.total_items ?? 0,
    total_pages: pagination?.total_pages ?? 1,
    next_page: pagination?.next_page ?? null,
    prev_page: pagination?.prev_page ?? null,
  };
}

async function fetchTypeEmployees(page: number = 1, limit: number = 25, search?: string): Promise<TypeEmployeesQueryResult> {
  const token = getAuthToken();
  
  // Construir URL con parámetros
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  // Agregar search solo si existe y no está vacío
  if (search && search.trim()) {
    params.append('search', search.trim());
  }
  
  const response = await fetch(`${API_URL}?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const result: TypeEmployeesApiEnvelope = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al obtener los tipos de empleado');
  }

  const rawItems = Array.isArray(result.data?.items) ? result.data.items : [];
  const items: TypeEmployee[] = rawItems;

  return {
    status: result.status,
    message: result.message,
    items,
    pagination: normalizePagination(result.data?.pagination, limit),
  };
}

async function createTypeEmployeeApi(data: TypeEmployeeCreate): Promise<TypeEmployee> {
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
      throw new Error('Ya existe un tipo de empleado con ese nombre');
    }
    if (response.status === 400) {
      throw new Error('Datos inválidos');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al crear el tipo de empleado');
  }

  return result.data;
}

async function updateTypeEmployeeApi(id: number, data: TypeEmployeeUpdate): Promise<TypeEmployee> {
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
      throw new Error('El tipo de empleado no existe');
    }
    if (response.status === 400) {
      throw new Error('Datos inválidos');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al actualizar el tipo de empleado');
  }

  return result.data;
}

async function deleteTypeEmployeeApi(id: number): Promise<void> {
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
      throw new Error('El tipo de empleado no existe');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al cambiar estado del tipo de empleado');
  }
}

// ============================================
// REACT QUERY HOOKS
// ============================================

export function useTypeEmployees(page: number = 1, limit: number = 25, search?: string) {
  return useQuery({
    queryKey: typeEmployeeKeys.list(page, limit, search),
    queryFn: () => fetchTypeEmployees(page, limit, search),
    staleTime: 1000 * 60 * 2, // 2 minutos frescos
    placeholderData: (previousData) => previousData, // Mantiene datos anteriores mientras carga
  });
}

export function useCreateTypeEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createTypeEmployeeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeEmployeeKeys.lists() });
    },
  });
}

export function useUpdateTypeEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TypeEmployeeUpdate }) => 
      updateTypeEmployeeApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeEmployeeKeys.lists() });
    },
  });
}

export function useDeleteTypeEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteTypeEmployeeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: typeEmployeeKeys.lists() });
    },
  });
}

