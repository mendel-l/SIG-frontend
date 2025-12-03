import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthToken } from '@/utils';
import { API_CONFIG, getApiUrl } from '@/config/api';
import { Bomb, BombCreate, BombUpdate } from '@/types';

const API_URL = getApiUrl(API_CONFIG.ENDPOINTS.BOMBS);

// ============================================
// INTERFACES - Tipos internos
// ============================================

interface BombsPagination {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
}

interface BombsApiEnvelope {
  status: 'success' | 'error';
  message?: string;
  data?: {
    items?: any[];
    pagination?: Partial<BombsPagination>;
  };
}

export interface BombsQueryResult {
  status: 'success' | 'error';
  message?: string;
  items: Bomb[];
  pagination: BombsPagination;
}

// ============================================
// QUERY KEYS - Para gestión de caché
// ============================================
export const bombKeys = {
  all: ['bombs'] as const,
  lists: () => [...bombKeys.all, 'list'] as const,
  list: (page: number, limit: number, search?: string) => 
    [...bombKeys.lists(), { page, limit, search: search || '' }] as const,
  details: () => [...bombKeys.all, 'detail'] as const,
  detail: (id: number) => [...bombKeys.details(), id] as const,
};

// ============================================
// API FUNCTIONS - Lógica de fetch
// ============================================

function normalizePagination(pagination: Partial<BombsPagination> | undefined, fallbackLimit: number): BombsPagination {
  return {
    page: pagination?.page ?? 1,
    limit: pagination?.limit ?? fallbackLimit,
    total_items: pagination?.total_items ?? 0,
    total_pages: pagination?.total_pages ?? 1,
    next_page: pagination?.next_page ?? null,
    prev_page: pagination?.prev_page ?? null,
  };
}

async function fetchBombs(page: number = 1, limit: number = 25, search?: string): Promise<BombsQueryResult> {
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
    // Si es un 404, probablemente no hay datos registrados
    if (response.status === 404) {
      throw new Error('NO_DATA');
    }
    // Intentar obtener el mensaje de error del cuerpo de la respuesta
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        errorMessage = Array.isArray(errorData.detail) 
          ? errorData.detail.map((e: any) => e.msg || e.loc?.join('.') || JSON.stringify(e)).join(', ')
          : errorData.detail;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // Si no se puede parsear el JSON, usar el mensaje por defecto
    }
    throw new Error(errorMessage);
  }

  const result: BombsApiEnvelope = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al obtener las bombas');
  }

  const rawItems = Array.isArray(result.data?.items) ? result.data.items : [];
  const items: Bomb[] = rawItems.map((bomb: any) => {
    // Mapear campos del backend al formato del frontend
    const mappedBomb: Bomb = {
      id_bombs: bomb.id_bombs || bomb.id,
      name: bomb.name || '',
      latitude: bomb.latitude || 0,
      longitude: bomb.longitude || 0,
      connections: bomb.connections || null,
      photography: Array.isArray(bomb.photography) ? bomb.photography : [],
      sector_id: bomb.sector_id || null,
      active: bomb.active === true || bomb.active === 1,
      created_at: bomb.created_at || '',
      updated_at: bomb.updated_at || '',
    };
    return mappedBomb;
  });

  return {
    status: result.status,
    message: result.message,
    items,
    pagination: normalizePagination(result.data?.pagination, limit),
  };
}

async function createBombApi(data: BombCreate): Promise<Bomb> {
  const token = getAuthToken();
  
  const backendData: any = {
    name: data.name,
    latitude: data.latitude,
    longitude: data.longitude,
    connections: data.connections || null,
    photography: data.photography || [],
    sector_id: data.sector_id,
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
      throw new Error('Ya existe una bomba con ese nombre');
    }
    if (response.status === 400) {
      throw new Error('Datos inválidos');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al crear la bomba');
  }

  // Mapear respuesta del backend
  const bomb = result.data;
  return {
    id_bombs: bomb.id_bombs || bomb.id,
    name: bomb.name,
    latitude: bomb.latitude,
    longitude: bomb.longitude,
    connections: bomb.connections || null,
    photography: Array.isArray(bomb.photography) ? bomb.photography : [],
    sector_id: bomb.sector_id || null,
    active: bomb.active === true || bomb.active === 1,
    created_at: bomb.created_at || '',
    updated_at: bomb.updated_at || '',
  };
}

async function updateBombApi(id: number, data: BombUpdate): Promise<Bomb> {
  const token = getAuthToken();
  
  const backendData: any = {};
  if (data.name !== undefined) backendData.name = data.name;
  if (data.latitude !== undefined) backendData.latitude = data.latitude;
  if (data.longitude !== undefined) backendData.longitude = data.longitude;
  if (data.connections !== undefined) backendData.connections = data.connections;
  if (data.photography !== undefined) backendData.photography = data.photography || [];
  if (data.sector_id !== undefined) backendData.sector_id = data.sector_id;
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
      throw new Error('La bomba no existe');
    }
    if (response.status === 400) {
      throw new Error('Datos inválidos');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al actualizar la bomba');
  }

  // Mapear respuesta del backend
  const bomb = result.data;
  return {
    id_bombs: bomb.id_bombs || bomb.id,
    name: bomb.name,
    latitude: bomb.latitude,
    longitude: bomb.longitude,
    connections: bomb.connections || null,
    photography: Array.isArray(bomb.photography) ? bomb.photography : [],
    sector_id: bomb.sector_id || null,
    active: bomb.active === true || bomb.active === 1,
    created_at: bomb.created_at || '',
    updated_at: bomb.updated_at || '',
  };
}

async function deleteBombApi(id: number): Promise<void> {
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
      throw new Error('La bomba no existe');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al cambiar estado de la bomba');
  }
}

// ============================================
// REACT QUERY HOOKS
// ============================================

export function useBombs(
  page: number = 1, 
  limit: number = 25, 
  search?: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: bombKeys.list(page, limit, search),
    queryFn: () => fetchBombs(page, limit, search),
    staleTime: 1000 * 60 * 2, // 2 minutos frescos
    placeholderData: (previousData) => previousData, // Mantiene datos anteriores mientras carga
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
}

export function useCreateBomb() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createBombApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bombKeys.lists() });
    },
  });
}

export function useUpdateBomb() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BombUpdate }) => 
      updateBombApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bombKeys.lists() });
    },
  });
}

export function useDeleteBomb() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteBombApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bombKeys.lists() });
    },
  });
}

