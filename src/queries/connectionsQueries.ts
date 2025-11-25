import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthToken } from '@/utils';
import { API_CONFIG, getApiUrl } from '@/config/api';
import { Connection, ConnectionBase, ConnectionCreate, ConnectionStatus } from '@/types';

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
  list: (page: number, limit: number, search?: string, status?: ConnectionStatus) => 
    [...connectionKeys.lists(), { page, limit, search: search || '', status: status || '' }] as const,
  details: () => [...connectionKeys.all, 'details'] as const,
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

async function fetchConnections(page: number = 1, limit: number = 25, search?: string, status?: ConnectionStatus): Promise<ConnectionsQueryResult> {
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

export function useConnections(
  page: number = 1, 
  limit: number = 25, 
  search?: string,
  status?: ConnectionStatus,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: connectionKeys.list(page, limit, search, status),
    queryFn: () => fetchConnections(page, limit, search, status),
    staleTime: 1000 * 60 * 2,
    placeholderData: (previousData) => previousData,
    enabled: options?.enabled !== undefined ? options.enabled : true,
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
      queryClient.invalidateQueries({ queryKey: ['map', 'tanks'] });
    },
  });
}

async function fetchConnectionById(id: number): Promise<Connection> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 404) {
      throw new Error('La conexión no existe');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al obtener la conexión');
  }

  return {
    ...result.data,
    id: result.data.id_connection,
  };
}

export function useConnection(id: number | null) {
  return useQuery({
    queryKey: connectionKeys.detail(id!),
    queryFn: () => fetchConnectionById(id!),
    enabled: id !== null && id > 0,
    staleTime: 1000 * 60 * 2,
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

