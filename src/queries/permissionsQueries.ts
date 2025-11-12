import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthToken } from '@/utils';
import { API_CONFIG, getApiUrl } from '@/config/api';

const API_URL = getApiUrl(API_CONFIG.ENDPOINTS.PERMISSIONS);

// ============================================
// TYPES - Interfaces
// ============================================
export interface Permission {
  id_permissions: number;
  name: string;
  description?: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface PermissionCreate {
  name: string;
  description?: string | null;
  status: boolean;
}

export interface PermissionUpdate {
  name?: string;
  description?: string | null;
  status?: boolean;
}

interface PermissionsPagination {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
}

interface PermissionsApiEnvelope {
  status: 'success' | 'error';
  message?: string;
  data?: {
    items?: Permission[];
    pagination?: Partial<PermissionsPagination>;
  };
}

export interface PermissionsQueryResult {
  status: 'success' | 'error';
  message?: string;
  items: Permission[];
  pagination: PermissionsPagination;
}

// ============================================
// QUERY KEYS - Para gestión de caché
// ============================================
export const permissionKeys = {
  all: ['permissions'] as const,
  lists: () => [...permissionKeys.all, 'list'] as const,
  list: (page: number, limit: number) => 
    [...permissionKeys.lists(), { page, limit }] as const,
  details: () => [...permissionKeys.all, 'detail'] as const,
  detail: (id: number) => [...permissionKeys.details(), id] as const,
};

// ============================================
// API FUNCTIONS - Lógica de fetch
// ============================================

function normalizePagination(pagination: Partial<PermissionsPagination> | undefined, fallbackLimit: number): PermissionsPagination {
  return {
    page: pagination?.page ?? 1,
    limit: pagination?.limit ?? fallbackLimit,
    total_items: pagination?.total_items ?? 0,
    total_pages: pagination?.total_pages ?? 1,
    next_page: pagination?.next_page ?? null,
    prev_page: pagination?.prev_page ?? null,
  };
}

async function fetchPermissions(page: number = 1, limit: number = 25): Promise<PermissionsQueryResult> {
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

  const result: PermissionsApiEnvelope = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al obtener los permisos');
  }

  const rawItems = Array.isArray(result.data?.items) ? result.data.items : [];
  const items: Permission[] = rawItems;

  return {
    status: result.status,
    message: result.message,
    items,
    pagination: normalizePagination(result.data?.pagination, limit),
  };
}

async function createPermissionApi(data: PermissionCreate): Promise<Permission> {
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
      throw new Error('Ya existe un permiso con ese nombre');
    }
    if (response.status === 400) {
      throw new Error('Datos inválidos');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al crear el permiso');
  }

  return result.data;
}

async function updatePermissionApi(id: number, data: PermissionUpdate): Promise<Permission> {
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
      throw new Error('El permiso no existe');
    }
    if (response.status === 400) {
      throw new Error('Datos inválidos');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al actualizar el permiso');
  }

  return result.data;
}

async function deletePermissionApi(id: number): Promise<void> {
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
      throw new Error('El permiso no existe');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al cambiar estado del permiso');
  }
}

// ============================================
// REACT QUERY HOOKS
// ============================================

export function usePermissions(page: number = 1, limit: number = 25) {
  return useQuery({
    queryKey: permissionKeys.list(page, limit),
    queryFn: () => fetchPermissions(page, limit),
    staleTime: 1000 * 60 * 2, // 2 minutos frescos
    placeholderData: (previousData) => previousData, // Mantiene datos anteriores mientras carga
  });
}

export function useCreatePermission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createPermissionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() });
    },
  });
}

export function useUpdatePermission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PermissionUpdate }) => 
      updatePermissionApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() });
    },
  });
}

export function useDeletePermission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deletePermissionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() });
    },
  });
}

