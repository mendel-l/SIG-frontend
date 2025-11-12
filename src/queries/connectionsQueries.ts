import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthToken } from '@/utils';
import { API_CONFIG, getApiUrl } from '@/config/api';
import { Connection, ConnectionBase, ConnectionCreate } from '@/types';

const API_URL = getApiUrl(API_CONFIG.ENDPOINTS.CONNECTIONS);

// ============================================
// TYPES - Interfaces
// ============================================
export interface ConnectionListItem extends Connection {
  id: number;
  fullName?: string;
}

interface ConnectionsApiEnvelope {
  status: 'success' | 'error';
  message?: string;
  data?: {
    items: Connection[];
    pagination: {
      page: number;
      limit: number;
      total_items: number;
      total_pages: number;
      next_page: number | null;
      prev_page: number | null;
    };
  };
}

interface ConnectionsPagination {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
}

export interface ConnectionsQueryResult {
  status: 'success' | 'error';
  message?: string;
  items: ConnectionListItem[];
  pagination: ConnectionsPagination;
}

// ============================================
// QUERY KEYS - Para gestión de caché
// ============================================
export const connectionKeys = {
  all: ['connections'] as const,
  lists: () => [...connectionKeys.all, 'list'] as const,
  list: (page: number, limit: number) => 
    [...connectionKeys.lists(), { page, limit }] as const,
  details: () => [...connectionKeys.details(), 'detail'] as const,
  detail: (id: number) => [...connectionKeys.details(), id] as const,
};

// ============================================
// API FUNCTIONS - Lógica de fetch
// ============================================

function normalizePagination(pagination: Partial<ConnectionsPagination> | undefined, fallbackLimit: number): ConnectionsPagination {
  return {
    page: pagination?.page ?? 1,
    limit: pagination?.limit ?? fallbackLimit,
    total_items: pagination?.total_items ?? 0,
    total_pages: pagination?.total_pages ?? 1,
    next_page: pagination?.next_page ?? null,
    prev_page: pagination?.prev_page ?? null,
  };
}

async function fetchConnections(page: number = 1, limit: number = 25): Promise<ConnectionsQueryResult> {
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

  const result: ConnectionsApiEnvelope = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al obtener las conexiones');
  }

  const rawItems = Array.isArray(result.data?.items) ? result.data.items : [];
  const items: ConnectionListItem[] = rawItems.map((connection) => ({
    ...connection,
    id: connection.id_connection,
  }));

  return {
    status: result.status,
    message: result.message,
    items,
    pagination: normalizePagination(result.data?.pagination, limit),
  };
}

async function createConnectionApi(data: ConnectionCreate): Promise<Connection> {
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
      throw new Error('Ya existe una conexión con estas coordenadas');
    }
    if (response.status === 404) {
      throw new Error('La entidad asociada no existe');
    }
    if (response.status === 400) {
      throw new Error('Datos inválidos');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al crear la conexión');
  }

  return result.data;
}

async function updateConnectionApi(id: number, data: Partial<ConnectionBase>): Promise<Connection> {
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
      throw new Error('La conexión no existe');
    }
    if (response.status === 400) {
      throw new Error('Datos inválidos');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al actualizar la conexión');
  }

  return result.data;
}

async function deleteConnectionApi(id: number): Promise<void> {
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
      throw new Error('La conexión no existe');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al cambiar estado de la conexión');
  }
}

// ============================================
// REACT QUERY HOOKS
// ============================================

export function useConnections(page: number = 1, limit: number = 25) {
  return useQuery({
    queryKey: connectionKeys.list(page, limit),
    queryFn: () => fetchConnections(page, limit),
    staleTime: 1000 * 60 * 2, // 2 minutos frescos
    placeholderData: (previousData) => previousData, // Mantiene datos anteriores mientras carga
  });
}

export function useCreateConnection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createConnectionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectionKeys.lists() });
    },
  });
}

export function useUpdateConnection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ConnectionBase> }) => 
      updateConnectionApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectionKeys.lists() });
    },
  });
}

export function useDeleteConnection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteConnectionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectionKeys.lists() });
    },
  });
}

