import { useQuery } from '@tanstack/react-query';
import { API_CONFIG, getApiUrl, getAuthHeaders } from '@/config/api';

// Interfaces para las estadísticas del dashboard
export interface RecentActivity {
  log_id: number;
  user: string;
  action: string;
  entity: string;
  description: string;
  created_at: string;
}

export interface InterventionsByEntity {
  tanks: number;
  pipes: number;
  connections: number;
}

export interface DashboardStats {
  users: {
    active: number;
  };
  employees: {
    active: number;
  };
  infrastructure: {
    tanks: { active: number };
    pipes: { active: number };
    connections: { active: number };
  };
  interventions: {
    active: number;
    by_entity: InterventionsByEntity;
  };
  recent_activity: RecentActivity[];
}

// Hook para obtener estadísticas del dashboard
export const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.DASHBOARD.STATS),
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Error al obtener estadísticas del dashboard');
      }

      return response.json();
    },
    // Caché de 5 minutos en el frontend (igual que el backend)
    staleTime: 5 * 60 * 1000,
    // Mantener datos en caché por 10 minutos
    gcTime: 10 * 60 * 1000,
    // Reintentar una vez si falla
    retry: 1,
    // Refetch al volver a la ventana
    refetchOnWindowFocus: true,
  });
};

