import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { apiService } from '@/services/api';

export interface Log {
  log_id: number;
  user_id: number;
  action: string;
  entity?: string;
  entity_id?: number;
  description?: string;
  created_at: string;
}

export interface LogSummary {
  entity: string;
  date_range: {
    start: string;
    finish: string;
  };
  total_logs: number;
  actions_summary: Array<{
    action: string;
    count: number;
  }>;
}

interface LogsState {
  // Estado
  logs: Log[];
  summary: LogSummary | null;
  availableEntities: string[];
  isLoading: boolean;
  error: string | null;
  lastFetchParams: {
    dateStart: string;
    dateEnd: string;
    entity: string;
  } | null;

  // Acciones
  fetchLogs: (dateStart: string, dateEnd: string, entity: string) => Promise<void>;
  fetchSummary: (dateStart: string, dateEnd: string, entity: string) => Promise<void>;
  fetchAvailableEntities: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useLogsStore = create<LogsState>()(
  devtools(
    (set, get) => ({
      // Estado inicial
      logs: [],
      summary: null,
      availableEntities: ['users'],
      isLoading: false,
      error: null,
      lastFetchParams: null,

      // Acciones
      fetchLogs: async (dateStart: string, dateEnd: string, entity: string) => {
        const currentState = get();
        
        // Evitar llamadas duplicadas
        if (currentState.isLoading) return;
        
        // Verificar si ya tenemos los datos para estos parámetros
        if (currentState.lastFetchParams &&
            currentState.lastFetchParams.dateStart === dateStart &&
            currentState.lastFetchParams.dateEnd === dateEnd &&
            currentState.lastFetchParams.entity === entity &&
            currentState.logs.length > 0) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await apiService.getLogsDetail(dateStart, dateEnd, entity);
          console.log('📋 Response getLogsDetail:', response);
          console.log('📋 Response.data:', response.data);
          
          // Debug: verificar formato de fechas
          if (response.data && response.data.length > 0) {
            console.log('📅 Primer log fecha:', response.data[0].created_at, typeof response.data[0].created_at);
          }
          
          set({
            logs: response.data || [],
            lastFetchParams: { dateStart, dateEnd, entity },
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          console.error('❌ Error fetching logs:', error);
          set({
            error: error.message || 'Error al cargar logs',
            isLoading: false
          });
          throw error;
        }
      },

      fetchSummary: async (dateStart: string, dateEnd: string, entity: string) => {
        const currentState = get();
        
        // Evitar llamadas duplicadas
        if (currentState.isLoading) return;

        set({ isLoading: true, error: null });

        try {
          const response = await apiService.getLogsSummary(dateStart, dateEnd, entity);
          console.log('📊 Response getLogsSummary:', response);
          console.log('📊 Response.data:', response.data);
          
          set({
            summary: response.data || null,
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          console.error('❌ Error fetching summary:', error);
          set({
            error: error.message || 'Error al cargar resumen',
            isLoading: false
          });
          throw error;
        }
      },

      fetchAvailableEntities: async () => {
        const currentState = get();
        
        // Solo cargar si no tenemos entities
        if (currentState.availableEntities.length > 1) return;

        try {
          const response = await apiService.getAvailableEntities();
          console.log('📦 Response entities:', response);
          
          // El backend devuelve { entities: [...] }, no un array directo
          const entities = response.data?.entities || response.data || [];
          console.log('📦 Entities parseadas:', entities);
          
          set({
            availableEntities: Array.isArray(entities) && entities.length > 0 ? entities : ['users'],
            error: null
          });
        } catch (error: any) {
          console.error('❌ Error fetching entities:', error);
          set({
            availableEntities: ['users', 'employees', 'tanks', 'roles']
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set({
          logs: [],
          summary: null,
          availableEntities: ['users'],
          isLoading: false,
          error: null,
          lastFetchParams: null
        });
      }
    }),
    {
      name: 'logs-store',
    }
  )
);
