import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthToken } from '@/utils';
import { API_CONFIG, getApiUrl } from '@/config/api';

const API_URL = getApiUrl(API_CONFIG.ENDPOINTS.PIPES);

// ============================================
// TYPES - Interfaces
// ============================================
export interface Pipe {
  id_pipes: number;
  material: string;
  diameter: number;
  status: boolean;
  size: number;
  installation_date: string;
  latitude?: number | null;
  longitude?: number | null;
  coordinates?: [number, number][];
  observations?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PipeCreate {
  material: string;
  diameter: number;
  status: boolean;
  size: number;
  installation_date: string;
  coordinates: [number, number][];
  observations?: string | null;
  tank_ids?: number[];
}

export interface PipeUpdate {
  material?: string;
  diameter?: number;
  status?: boolean;
  size?: number;
  installation_date?: string;
  coordinates?: [number, number][];
  observations?: string | null;
  tank_ids?: number[];
}

interface PipesPagination {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
}

interface PipesApiEnvelope {
  status: 'success' | 'error';
  message?: string;
  data?: {
    items?: Pipe[];
    pagination?: Partial<PipesPagination>;
  };
}

export interface PipesQueryResult {
  status: 'success' | 'error';
  message?: string;
  items: Pipe[];
  pagination: PipesPagination;
}

// ============================================
// QUERY KEYS - Para gestión de caché
// ============================================
export const pipeKeys = {
  all: ['pipes'] as const,
  lists: () => [...pipeKeys.all, 'list'] as const,
  list: (page: number, limit: number, search?: string) => 
    [...pipeKeys.lists(), { page, limit, search: search || '' }] as const,
  details: () => [...pipeKeys.all, 'detail'] as const,
  detail: (id: number) => [...pipeKeys.details(), id] as const,
};

// ============================================
// API FUNCTIONS - Lógica de fetch
// ============================================

function normalizePagination(pagination: Partial<PipesPagination> | undefined, fallbackLimit: number): PipesPagination {
  return {
    page: pagination?.page ?? 1,
    limit: pagination?.limit ?? fallbackLimit,
    total_items: pagination?.total_items ?? 0,
    total_pages: pagination?.total_pages ?? 1,
    next_page: pagination?.next_page ?? null,
    prev_page: pagination?.prev_page ?? null,
  };
}

async function fetchPipes(page: number = 1, limit: number = 25, search?: string): Promise<PipesQueryResult> {
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

  const result: PipesApiEnvelope = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al obtener las tuberías');
  }

  const rawItems = Array.isArray(result.data?.items) ? result.data.items : [];
  
  // Mapear y asegurar que status sea boolean y exponer lat/lon
  const items: Pipe[] = rawItems.map((pipe: any) => {
    const firstCoord = Array.isArray(pipe.coordinates) && pipe.coordinates.length > 0
      ? pipe.coordinates[0]
      : null;
    const [lonRaw, latRaw] = Array.isArray(firstCoord) ? firstCoord : [null, null];
    const lon = typeof lonRaw === 'number'
      ? lonRaw
      : typeof lonRaw === 'string'
      ? parseFloat(lonRaw)
      : null;
    const lat = typeof latRaw === 'number'
      ? latRaw
      : typeof latRaw === 'string'
      ? parseFloat(latRaw)
      : null;
    
    return {
      ...pipe,
      status: pipe.status === true || pipe.status === 1,
      longitude: Number.isFinite(lon) ? lon : null,
      latitude: Number.isFinite(lat) ? lat : null,
    };
  });

  return {
    status: result.status,
    message: result.message,
    items,
    pagination: normalizePagination(result.data?.pagination, limit),
  };
}

async function createPipeApi(data: PipeCreate): Promise<Pipe> {
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
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 409) {
      throw new Error('Ya existe una tubería con esas características');
    }
    if (response.status === 400 || response.status === 422) {
      const errorMessage = errorData.detail || errorData.message || 'Datos inválidos';
      throw new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
    }
    throw new Error(errorData.message || errorData.detail || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al crear la tubería');
  }

  return result.data;
}

async function updatePipeApi(id: number, data: PipeUpdate): Promise<Pipe> {
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
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 404) {
      throw new Error('La tubería no existe');
    }
    if (response.status === 400 || response.status === 422) {
      const errorMessage = errorData.detail || errorData.message || 'Datos inválidos';
      throw new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
    }
    throw new Error(errorData.message || errorData.detail || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al actualizar la tubería');
  }

  return result.data;
}

async function deletePipeApi(id: number): Promise<void> {
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
      throw new Error('La tubería no existe');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al cambiar estado de la tubería');
  }
}

// ============================================
// REACT QUERY HOOKS
// ============================================

export function usePipes(
  page: number = 1, 
  limit: number = 25, 
  search?: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: pipeKeys.list(page, limit, search),
    queryFn: () => fetchPipes(page, limit, search),
    staleTime: 1000 * 60 * 2, // 2 minutos frescos
    placeholderData: (previousData) => previousData, // Mantiene datos anteriores mientras carga
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
}

export function useCreatePipe() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createPipeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pipeKeys.lists() });
    },
  });
}

export function useUpdatePipe() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PipeUpdate }) => 
      updatePipeApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pipeKeys.lists() });
    },
  });
}

export function useDeletePipe() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deletePipeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pipeKeys.lists() });
    },
  });
}

