import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthToken } from '@/utils';
import { API_CONFIG, getApiUrl } from '@/config/api';

const API_URL = getApiUrl(API_CONFIG.ENDPOINTS.TANKS);

// ============================================
// TYPES - Interfaces
// ============================================
export interface Tank {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  connections?: string | null;
  photos?: string[] | null;
  photography?: string[] | null; // Campo del backend
  active: boolean;
  status?: 'active' | 'inactive'; // Campo calculado para compatibilidad
  created_at: string;
  updated_at: string;
  createdAt?: string; // Alias para compatibilidad
  updatedAt?: string; // Alias para compatibilidad
}

export interface TankCreate {
  name: string;
  latitude: number;
  longitude: number;
  connections?: string | null;
  photography?: string[] | null; // Backend espera 'photography'
  photos?: string[] | null; // Alias para compatibilidad
  active: boolean;
}

export interface TankUpdate {
  name?: string;
  latitude?: number;
  longitude?: number;
  connections?: string | null;
  photography?: string[] | null; // Backend espera 'photography'
  photos?: string[] | null; // Alias para compatibilidad
  state?: boolean;
}

interface TanksPagination {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
}

interface TanksApiEnvelope {
  status: 'success' | 'error';
  message?: string;
  data?: {
    items?: Tank[];
    pagination?: Partial<TanksPagination>;
  };
}

export interface TanksQueryResult {
  status: 'success' | 'error';
  message?: string;
  items: Tank[];
  pagination: TanksPagination;
}

// ============================================
// QUERY KEYS - Para gestión de caché
// ============================================
export const tankKeys = {
  all: ['tanks'] as const,
  lists: () => [...tankKeys.all, 'list'] as const,
  list: (page: number, limit: number, search?: string) => 
    [...tankKeys.lists(), { page, limit, search: search || '' }] as const,
  details: () => [...tankKeys.all, 'detail'] as const,
  detail: (id: number) => [...tankKeys.details(), id] as const,
};

// ============================================
// API FUNCTIONS - Lógica de fetch
// ============================================

function normalizePagination(pagination: Partial<TanksPagination> | undefined, fallbackLimit: number): TanksPagination {
  return {
    page: pagination?.page ?? 1,
    limit: pagination?.limit ?? fallbackLimit,
    total_items: pagination?.total_items ?? 0,
    total_pages: pagination?.total_pages ?? 1,
    next_page: pagination?.next_page ?? null,
    prev_page: pagination?.prev_page ?? null,
  };
}

async function fetchTanks(page: number = 1, limit: number = 25, search?: string): Promise<TanksQueryResult> {
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

  const result: TanksApiEnvelope = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al obtener los tanques');
  }

  const rawItems = Array.isArray(result.data?.items) ? result.data.items : [];
  const items: Tank[] = rawItems.map((tank: any) => {
    // Mapear campos del backend al formato del frontend
    const mappedTank: Tank = {
      id: tank.id_tank || tank.id,
      name: tank.name || '',
      latitude: tank.latitude || 0,
      longitude: tank.longitude || 0,
      connections: tank.connections || null,
      photos: Array.isArray(tank.photography) ? tank.photography : (tank.photos || []),
      photography: Array.isArray(tank.photography) ? tank.photography : [],
      active: tank.active === true || tank.active === 1,
      status: (tank.active === true || tank.active === 1) ? 'active' : 'inactive',
      created_at: tank.created_at || '',
      updated_at: tank.updated_at || '',
      createdAt: tank.created_at || tank.createdAt || '',
      updatedAt: tank.updated_at || tank.updatedAt || '',
    };
    return mappedTank;
  });

  return {
    status: result.status,
    message: result.message,
    items,
    pagination: normalizePagination(result.data?.pagination, limit),
  };
}

async function createTankApi(data: TankCreate): Promise<Tank> {
  const token = getAuthToken();
  
  // Mapear 'photos' a 'photography' para el backend
  const backendData: any = {
    name: data.name,
    latitude: data.latitude,
    longitude: data.longitude,
    connections: data.connections || null,
    photography: data.photography || data.photos || [],
    active: data.active,
  };
  
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(backendData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (response.status === 409) {
      throw new Error('Ya existe un tanque con ese nombre');
    }
    if (response.status === 400) {
      throw new Error('Datos inválidos');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al crear el tanque');
  }

  // Mapear respuesta del backend
  const tank = result.data;
  return {
    id: tank.id_tank || tank.id,
    name: tank.name,
    latitude: tank.latitude,
    longitude: tank.longitude,
    connections: tank.connections || null,
    photos: Array.isArray(tank.photography) ? tank.photography : [],
    photography: Array.isArray(tank.photography) ? tank.photography : [],
    state: tank.state === true || tank.state === 1,
    status: (tank.state === true || tank.state === 1) ? 'active' : 'inactive',
    created_at: tank.created_at || '',
    updated_at: tank.updated_at || '',
    createdAt: tank.created_at || '',
    updatedAt: tank.updated_at || '',
  };
}

async function updateTankApi(id: number, data: TankUpdate): Promise<Tank> {
  const token = getAuthToken();
  
  // Mapear 'photos' a 'photography' para el backend
  const backendData: any = {};
  if (data.name !== undefined) backendData.name = data.name;
  if (data.latitude !== undefined) backendData.latitude = data.latitude;
  if (data.longitude !== undefined) backendData.longitude = data.longitude;
  if (data.connections !== undefined) backendData.connections = data.connections;
  if (data.photography !== undefined || data.photos !== undefined) {
    backendData.photography = data.photography || data.photos || [];
  }
  if (data.active !== undefined) backendData.active = data.active;
  
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(backendData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (response.status === 404) {
      throw new Error('El tanque no existe');
    }
    if (response.status === 400) {
      throw new Error('Datos inválidos');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al actualizar el tanque');
  }

  // Mapear respuesta del backend
  const tank = result.data;
  return {
    id: tank.id_tank || tank.id,
    name: tank.name,
    latitude: tank.latitude,
    longitude: tank.longitude,
    connections: tank.connections || null,
    photos: Array.isArray(tank.photography) ? tank.photography : [],
    photography: Array.isArray(tank.photography) ? tank.photography : [],
    state: tank.state === true || tank.state === 1,
    status: (tank.state === true || tank.state === 1) ? 'active' : 'inactive',
    created_at: tank.created_at || '',
    updated_at: tank.updated_at || '',
    createdAt: tank.created_at || '',
    updatedAt: tank.updated_at || '',
  };
}

async function deleteTankApi(id: number): Promise<void> {
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
      throw new Error('El tanque no existe');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al cambiar estado del tanque');
  }
}

// ============================================
// REACT QUERY HOOKS
// ============================================

export function useTanks(
  page: number = 1, 
  limit: number = 25, 
  search?: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: tankKeys.list(page, limit, search),
    queryFn: () => fetchTanks(page, limit, search),
    staleTime: 1000 * 60 * 2, // 2 minutos frescos
    placeholderData: (previousData) => previousData, // Mantiene datos anteriores mientras carga
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
}

export function useCreateTank() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createTankApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tankKeys.lists() });
    },
  });
}

export function useUpdateTank() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TankUpdate }) => 
      updateTankApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tankKeys.lists() });
    },
  });
}

export function useDeleteTank() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteTankApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tankKeys.lists() });
    },
  });
}

