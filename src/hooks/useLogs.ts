import { useEffect, useCallback } from 'react';
import { useLogsStore } from '@/stores/logsStore';
import { useNotifications } from './useNotifications';

interface UseLogsOptions {
  autoFetch?: boolean;
  showNotifications?: boolean;
}

export const useLogs = (options: UseLogsOptions = {}) => {
  const { showNotifications = true } = options;
  
  const {
    logs,
    summary,
    availableEntities,
    isLoading,
    error,
    reset
  } = useLogsStore();

  const { showError } = useNotifications();

  // Función para cargar datos con manejo de errores
  // NO incluimos todas las dependencias para evitar re-creación constante
  const loadLogsData = useCallback(async (
    dateStart: string, 
    dateEnd: string, 
    entity: string
  ) => {
    try {
      console.log('🔄 Cargando logs...', { dateStart, dateEnd, entity });
      const state = useLogsStore.getState();
      state.clearError();
      
      // Cargar logs y summary en paralelo
      await Promise.all([
        state.fetchLogs(dateStart, dateEnd, entity),
        state.fetchSummary(dateStart, dateEnd, entity)
      ]);
      
      console.log('✅ Logs cargados:', {
        logs: useLogsStore.getState().logs,
        summary: useLogsStore.getState().summary
      });
    } catch (error: any) {
      console.error('❌ Error loading logs data:', error);
      if (showNotifications) {
        showError('Error al cargar logs', 'No se pudieron cargar los logs del usuario');
      }
      throw error;
    }
  }, [showNotifications, showError]);

  // Cargar entidades disponibles al montar (solo una vez)
  useEffect(() => {
    useLogsStore.getState().fetchAvailableEntities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mostrar errores como notificaciones
  useEffect(() => {
    if (error && showNotifications) {
      showError('Error en logs', error);
      useLogsStore.getState().clearError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return {
    // Estado
    logs,
    summary,
    availableEntities,
    isLoading,
    error,
    
    // Acciones
    loadLogsData,
    reset
  };
};
