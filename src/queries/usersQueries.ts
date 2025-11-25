import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthToken } from '@/utils';
import { API_CONFIG, getApiUrl } from '@/config/api';

const API_URL = getApiUrl(API_CONFIG.ENDPOINTS.USERS);

// ============================================
// TYPES - Interfaces
// ============================================
export interface User {
  id_user: number;
  user: string;
  email: string;
  employee_id?: number | null;
  rol_id: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  user: string;
  email: string;
  password_hash: string;
  employee_id?: number | null;
  rol_id: number;
  active: boolean;
}

export interface UserUpdate {
  user?: string;
  email?: string;
  password?: string;
  employee_id?: number | null;
  rol_id?: number;
  active?: boolean;
}

interface UsersPagination {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
}

interface UsersApiEnvelope {
  status: 'success' | 'error';
  message?: string;
  data?: {
    items?: User[];
    pagination?: Partial<UsersPagination>;
  };
}

export interface UsersQueryResult {
  status: 'success' | 'error';
  message?: string;
  items: User[];
  pagination: UsersPagination;
}

// ============================================
// QUERY KEYS - Para gestión de caché
// ============================================
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (page: number, limit: number, search?: string) => 
    [...userKeys.lists(), { page, limit, search: search || '' }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

// ============================================
// API FUNCTIONS - Lógica de fetch
// ============================================

function normalizePagination(pagination: Partial<UsersPagination> | undefined, fallbackLimit: number): UsersPagination {
  return {
    page: pagination?.page ?? 1,
    limit: pagination?.limit ?? fallbackLimit,
    total_items: pagination?.total_items ?? 0,
    total_pages: pagination?.total_pages ?? 1,
    next_page: pagination?.next_page ?? null,
    prev_page: pagination?.prev_page ?? null,
  };
}

async function fetchUsers(page: number = 1, limit: number = 25, search?: string): Promise<UsersQueryResult> {
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

  const result: UsersApiEnvelope = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al obtener los usuarios');
  }

  const rawItems = Array.isArray(result.data?.items) ? result.data.items : [];
  const items: User[] = rawItems;

  return {
    status: result.status,
    message: result.message,
    items,
    pagination: normalizePagination(result.data?.pagination, limit),
  };
}

async function createUserApi(data: UserCreate): Promise<User> {
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
      throw new Error('Ya existe un usuario con ese nombre o email');
    }
    if (response.status === 400) {
      throw new Error('Datos inválidos');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al crear el usuario');
  }

  return result.data;
}

async function updateUserApi(id: number, data: UserUpdate): Promise<User> {
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
      throw new Error('El usuario no existe');
    }
    if (response.status === 400) {
      throw new Error('Datos inválidos');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al actualizar el usuario');
  }

  return result.data;
}

async function deleteUserApi(id: number): Promise<void> {
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
      throw new Error('El usuario no existe');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al cambiar estado del usuario');
  }
}

// ============================================
// REACT QUERY HOOKS
// ============================================

export function useUsers(page: number = 1, limit: number = 25, search?: string) {
  return useQuery({
    queryKey: userKeys.list(page, limit, search),
    queryFn: () => fetchUsers(page, limit, search),
    staleTime: 1000 * 60 * 2, // 2 minutos frescos
    placeholderData: (previousData) => previousData, // Mantiene datos anteriores mientras carga
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserUpdate }) => 
      updateUserApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

