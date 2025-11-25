import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthToken } from '@/utils';
import { API_CONFIG, getApiUrl } from '@/config/api';
import { InterventionStatus } from '@/types';

const API_URL = getApiUrl(API_CONFIG.ENDPOINTS.INTERVENTIONS);

// ============================================
// TYPES - Interfaces
// ============================================
export interface Intervention {
  id_interventions: number;
  description: string;
  start_date: string;
  end_date: string;
  status: InterventionStatus;
  active: boolean;
  photography?: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface InterventionCreate {
  description: string;
  start_date: string;
  end_date: string;
  status?: InterventionStatus;
  active: boolean;
  photography?: string[] | null;
  id_tank?: number | null;
  id_pipes?: number | null;
  id_connection?: number | null;
}

export interface InterventionUpdate {
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: InterventionStatus;
  active?: boolean;
  photography?: string[] | null;
}

interface InterventionsPagination {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
}

interface InterventionsApiEnvelope {
  status: 'success' | 'error';
  message?: string;
  data?: {
    items?: Intervention[];
    pagination?: Partial<InterventionsPagination>;
  };
}

export interface InterventionsQueryResult {
  status: 'success' | 'error';
  message?: string;
  items: Intervention[];
  pagination: InterventionsPagination;
}

// ============================================
// QUERY KEYS - Para gestión de caché
// ============================================
export const interventionKeys = {
  all: ['interventions'] as const,
  lists: () => [...interventionKeys.all, 'list'] as const,
  list: (page: number, limit: number, search?: string, status?: InterventionStatus) => 
    [...interventionKeys.lists(), { page, limit, search: search || '', status: status || '' }] as const,
  details: () => [...interventionKeys.all, 'detail'] as const,
  detail: (id: number) => [...interventionKeys.details(), id] as const,
};

// ============================================
// API FUNCTIONS - Lógica de fetch
// ============================================

function normalizePagination(pagination: Partial<InterventionsPagination> | undefined, fallbackLimit: number): InterventionsPagination {
  return {
    page: pagination?.page ?? 1,
    limit: pagination?.limit ?? fallbackLimit,
    total_items: pagination?.total_items ?? 0,
    total_pages: pagination?.total_pages ?? 1,
    next_page: pagination?.next_page ?? null,
    prev_page: pagination?.prev_page ?? null,
  };
}

async function fetchInterventions(page: number = 1, limit: number = 25, search?: string, status?: InterventionStatus): Promise<InterventionsQueryResult> {
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
  
  // Agregar status solo si existe
  if (status) {
    params.append('status', status);
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

  const result: InterventionsApiEnvelope = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al obtener las intervenciones');
  }

  const rawItems = Array.isArray(result.data?.items) ? result.data.items : [];
  const items: Intervention[] = rawItems;

  return {
    status: result.status,
    message: result.message,
    items,
    pagination: normalizePagination(result.data?.pagination, limit),
  };
}

async function createInterventionApi(data: InterventionCreate): Promise<Intervention> {
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
    if (response.status === 400) {
      throw new Error('Datos inválidos');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al crear la intervención');
  }

  return result.data;
}

async function updateInterventionApi(id: number, data: InterventionUpdate): Promise<Intervention> {
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
      throw new Error('La intervención no existe');
    }
    if (response.status === 400) {
      throw new Error('Datos inválidos');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al actualizar la intervención');
  }

  return result.data;
}

async function deleteInterventionApi(id: number): Promise<void> {
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
      throw new Error('La intervención no existe');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al cambiar estado de la intervención');
  }
}

// ============================================
// REACT QUERY HOOKS
// ============================================

export function useInterventions(page: number = 1, limit: number = 25, search?: string, status?: InterventionStatus, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: interventionKeys.list(page, limit, search, status),
    queryFn: () => fetchInterventions(page, limit, search, status),
    staleTime: 1000 * 60 * 2, // 2 minutos frescos
    placeholderData: (previousData) => previousData, // Mantiene datos anteriores mientras carga
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
}

export function useCreateIntervention() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createInterventionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interventionKeys.lists() });
    },
  });
}

export function useUpdateIntervention() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: InterventionUpdate }) => 
      updateInterventionApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interventionKeys.lists() });
    },
  });
}

export function useDeleteIntervention() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteInterventionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interventionKeys.lists() });
    },
  });
}

