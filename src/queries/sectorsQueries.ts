import { useQuery } from '@tanstack/react-query';
import { getAuthToken } from '@/utils';
import { API_CONFIG } from '@/config/api';
import { Sector } from '@/types';

const API_URL = `${API_CONFIG.API_BASE_URL}/sector`;

interface SectorsResponse {
  status: 'success' | 'error';
  message?: string;
  data?: {
    items?: Sector[];
    pagination?: any;
  };
}

async function fetchSectors(page: number = 1, limit: number = 100): Promise<Sector[]> {
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

  const result: SectorsResponse = await response.json();
  
  if (result.status !== 'success') {
    throw new Error(result.message || 'Error al obtener los sectores');
  }

  return result.data?.items || [];
}

export function useSectors(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['sectors'],
    queryFn: () => fetchSectors(),
    staleTime: 1000 * 60 * 10, // 10 minutos
    enabled: options?.enabled !== false,
  });
}

