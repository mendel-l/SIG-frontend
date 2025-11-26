import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthToken } from '@/utils';
import { API_CONFIG, getApiUrl } from '@/config/api';

const API_URL = getApiUrl(API_CONFIG.ENDPOINTS.DATA_UPLOAD);

// ============================================
// TYPES - Interfaces
// ============================================
export interface DataUpload {
  siaf: string;
  municipality?: string | null;
  department?: string | null;
  institutional_classification: number;
  report: string;
  date: string;
  hour: string;
  seriereport: string;
  user: string;
  identifier: string;
  taxpayer: string;
  cologne: string;
  cat_service: string;
  cannon: number;
  excess: number;
  total: number;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface DataUploadCreate {
  siaf: string;
  institutional_classification: number;
  report: string;
  date: string;
  hour: string;
  seriereport: string;
  user: string;
  identifier: string;
  taxpayer: string;
  cologne: string;
  cat_service: string;
  cannon: number;
  excess: number;
  total: number;
  status?: boolean;
}

export interface DataUploadUpdate {
  siaf?: string;
  institutional_classification?: number;
  report?: string;
  date?: string;
  hour?: string;
  seriereport?: string;
  user?: string;
  taxpayer?: string;
  cologne?: string;
  cat_service?: string;
  cannon?: number;
  excess?: number;
  total?: number;
  status?: boolean;
}

export interface UploadExcelResponse {
  message: string;
  created_records: number;
  total_processed: number;
  errors: string[];
  filename: string;
}

interface DataUploadPagination {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
}

interface DataUploadApiEnvelope {
  status: 'success' | 'error';
  message?: string;
  data?: {
    items?: DataUpload[];
    pagination?: Partial<DataUploadPagination>;
  };
}

export interface DataUploadQueryResult {
  status: 'success' | 'error';
  message?: string;
  items: DataUpload[];
  pagination: DataUploadPagination;
}

// ============================================
// QUERY KEYS - Para gestión de caché
// ============================================
export const dataUploadKeys = {
  all: ['dataUpload'] as const,
  lists: () => [...dataUploadKeys.all, 'list'] as const,
  list: (page: number, limit: number) => 
    [...dataUploadKeys.lists(), { page, limit }] as const,
  details: () => [...dataUploadKeys.all, 'detail'] as const,
  detail: (id: string) => [...dataUploadKeys.details(), id] as const,
};

// ============================================
// API FUNCTIONS - Lógica de fetch
// ============================================

function normalizePagination(pagination: Partial<DataUploadPagination> | undefined, fallbackLimit: number): DataUploadPagination {
  return {
    page: pagination?.page ?? 1,
    limit: pagination?.limit ?? fallbackLimit,
    total_items: pagination?.total_items ?? 0,
    total_pages: pagination?.total_pages ?? 1,
    next_page: pagination?.next_page ?? null,
    prev_page: pagination?.prev_page ?? null,
  };
}

async function fetchDataUploads(page: number = 1, limit: number = 25): Promise<DataUploadQueryResult> {
  const token = getAuthToken();
  
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  const response = await fetch(`${API_URL}?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const result: DataUploadApiEnvelope = await response.json();
  
  if (result.status !== 'success') {
    // Si el mensaje indica que no hay datos, devolver lista vacía en lugar de error
    const errorMessage = result.message || '';
    if (errorMessage.toLowerCase().includes('no hay') || 
        errorMessage.toLowerCase().includes('no se encontraron') ||
        errorMessage.toLowerCase().includes('disponibles')) {
      return {
        status: 'success' as const,
        message: result.message,
        items: [],
        pagination: normalizePagination({ page, limit, total_items: 0, total_pages: 0 }, limit),
      };
    }
    throw new Error(result.message || 'Error al obtener los registros de data upload');
  }

  const rawItems = Array.isArray(result.data?.items) ? result.data.items : [];
  const items: DataUpload[] = rawItems;

  return {
    status: result.status,
    message: result.message,
    items,
    pagination: normalizePagination(result.data?.pagination, limit),
  };
}

async function getDataUploadByIdApi(identifier: string): Promise<DataUpload> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/${identifier}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (response.status === 404) {
      throw new Error('El registro no existe');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al obtener el registro');
  }

  return result.data;
}

async function uploadExcelApi(file: File): Promise<UploadExcelResponse> {
  const token = getAuthToken();
  
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_URL}/upload-excel`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // No establecer Content-Type, el navegador lo hará automáticamente con el boundary
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (response.status === 400) {
      throw new Error(errorData.message || 'Archivo inválido');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al subir el archivo');
  }

  return result.data;
}

async function updateDataUploadApi(identifier: string, data: DataUploadUpdate): Promise<DataUpload> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/${identifier}`, {
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
      throw new Error('El registro no existe');
    }
    if (response.status === 400) {
      throw new Error('Datos inválidos');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al actualizar el registro');
  }

  return result.data;
}

async function toggleDataUploadStateApi(identifier: string): Promise<void> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/${identifier}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (response.status === 404) {
      throw new Error('El registro no existe');
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al cambiar estado del registro');
  }
}

// ============================================
// REACT QUERY HOOKS
// ============================================

export function useDataUploads(page: number = 1, limit: number = 25, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: dataUploadKeys.list(page, limit),
    queryFn: () => fetchDataUploads(page, limit),
    staleTime: 1000 * 60 * 2, // 2 minutos frescos
    placeholderData: (previousData) => previousData,
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
}

export function useDataUpload(identifier: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: dataUploadKeys.detail(identifier),
    queryFn: () => getDataUploadByIdApi(identifier),
    staleTime: 1000 * 60 * 2,
    enabled: options?.enabled !== undefined ? options.enabled : !!identifier,
  });
}

export function useUploadExcel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: uploadExcelApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dataUploadKeys.lists() });
    },
  });
}

export function useUpdateDataUpload() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ identifier, data }: { identifier: string; data: DataUploadUpdate }) => 
      updateDataUploadApi(identifier, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dataUploadKeys.lists() });
    },
  });
}

export function useToggleDataUploadState() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: toggleDataUploadStateApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dataUploadKeys.lists() });
    },
  });
}

