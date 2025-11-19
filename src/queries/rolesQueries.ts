import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthToken } from '@/utils';
import { API_CONFIG, getApiUrl } from '@/config/api';

const API_URL = getApiUrl(API_CONFIG.ENDPOINTS.ROLES);

// ============================================
// TYPES - Interfaces
// ============================================
export interface Rol {
  id_rol: number;
  name: string;
  description?: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface RolCreate {
  name: string;
  description?: string | null;
  status: boolean;
  permission_ids?: number[];
}

export interface RolUpdate {
  name?: string;
  description?: string | null;
  status?: boolean;
  permission_ids?: number[];
}

export interface Permission {
  id_permissions: number;
  name: string;
  description: string;
  status: boolean;
}

export interface GroupedPermissions {
  [category: string]: Permission[];
}

interface RolesPagination {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
}

interface RolesApiEnvelope {
  status: 'success' | 'error';
  message?: string;
  data?: {
    items?: Rol[];
    pagination?: Partial<RolesPagination>;
  };
}

export interface RolesQueryResult {
  status: 'success' | 'error';
  message?: string;
  items: Rol[];
  pagination: RolesPagination;
}

// ============================================
// QUERY KEYS - Para gestión de caché
// ============================================
export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (page: number, limit: number, search?: string) => 
    [...roleKeys.lists(), { page, limit, search: search || '' }] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (id: number) => [...roleKeys.details(), id] as const,
};

// ============================================
// API FUNCTIONS - Lógica de fetch
// ============================================

function normalizePagination(pagination: Partial<RolesPagination> | undefined, fallbackLimit: number): RolesPagination {
  return {
    page: pagination?.page ?? 1,
    limit: pagination?.limit ?? fallbackLimit,
    total_items: pagination?.total_items ?? 0,
    total_pages: pagination?.total_pages ?? 1,
    next_page: pagination?.next_page ?? null,
    prev_page: pagination?.prev_page ?? null,
  };
}

async function fetchRoles(page: number = 1, limit: number = 25, search?: string): Promise<RolesQueryResult> {
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

  const result: RolesApiEnvelope = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al obtener los roles');
  }

  const rawItems = Array.isArray(result.data?.items) ? result.data.items : [];
  const items: Rol[] = rawItems;

  return {
    status: result.status,
    message: result.message,
    items,
    pagination: normalizePagination(result.data?.pagination, limit),
  };
}

async function createRoleApi(data: RolCreate): Promise<Rol> {
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
      throw new Error('Ya existe un rol con ese nombre');
    }
    if (response.status === 400) {
      throw new Error('Datos inválidos');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al crear el rol');
  }

  return result.data;
}

// ============================================
// REACT QUERY HOOKS
// ============================================

export function useRoles(page: number = 1, limit: number = 25, search?: string) {
  return useQuery({
    queryKey: roleKeys.list(page, limit, search),
    queryFn: () => fetchRoles(page, limit, search),
    staleTime: 1000 * 60 * 2, // 2 minutos frescos
    placeholderData: (previousData) => previousData, // Mantiene datos anteriores mientras carga
  });
}

async function updateRoleApi(id: number, data: RolUpdate): Promise<Rol> {
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
    if (response.status === 409) {
      throw new Error('Ya existe un rol con ese nombre');
    }
    if (response.status === 404) {
      throw new Error('El rol no existe');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al actualizar el rol');
  }

  return result.data;
}

async function fetchGroupedPermissions(): Promise<GroupedPermissions> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/permissions/grouped`, {
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
    throw new Error(result.message || 'Error al obtener los permisos');
  }

  return result.data;
}

async function fetchRoleById(id: number): Promise<Rol & { permission_ids: number[]; permissions: Permission[] }> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/${id}`, {
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
    throw new Error(result.message || 'Error al obtener el rol');
  }

  return result.data;
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createRoleApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RolUpdate }) => updateRoleApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
    },
  });
}

export function useGroupedPermissions() {
  return useQuery({
    queryKey: ['permissions', 'grouped'],
    queryFn: fetchGroupedPermissions,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useRole(id: number | null) {
  return useQuery({
    queryKey: roleKeys.detail(id!),
    queryFn: () => fetchRoleById(id!),
    enabled: !!id,
  });
}

