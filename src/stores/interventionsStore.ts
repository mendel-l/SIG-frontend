import { create } from 'zustand';
import { getAuthToken } from '../utils';
import { Intervention, InterventionBase, InterventionCreate } from '../types';
import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.API_BASE_URL;

// Estado del store
interface InterventionsState {
  interventions: Intervention[];
  loading: boolean;
  error: string | null;
  
  // Acciones
  fetchInterventions: (page?: number, limit?: number) => Promise<void>;
  createIntervention: (interventionData: InterventionCreate) => Promise<boolean>;
  updateIntervention: (id: number, interventionData: Partial<InterventionBase>) => Promise<boolean>;
  deleteIntervention: (id: number) => Promise<boolean>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// Store con Zustand
export const useInterventionsStore = create<InterventionsState>((set, get) => ({
  interventions: [],
  loading: false,
  error: null,

  // Obtener intervenciones
  fetchInterventions: async (page = 1, limit = 10000) => {
    set({ loading: true, error: null });
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/interventions?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === 'success' && Array.isArray(data.data)) {
        const mappedInterventions: Intervention[] = data.data.map((intervention: any) => ({
          id_interventions: intervention.id_interventions,
          description: intervention.description || '',
          start_date: intervention.start_date || '',
          end_date: intervention.end_date || '',
          status: intervention.status ?? true,
          photography: intervention.photography || [],
          created_at: intervention.created_at || '',
          updated_at: intervention.updated_at || ''
        }));

        set({ interventions: mappedInterventions, loading: false });
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener intervenciones';
      set({ error: errorMessage, loading: false });
      console.error('Error fetching interventions:', error);
    }
  },

  // Crear intervención
  createIntervention: async (interventionData: InterventionCreate): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/interventions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(interventionData),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('Ya existe una intervención idéntica');
        }
        if (response.status === 404) {
          throw new Error('La entidad asociada no existe');
        }
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Debe proporcionar exactamente una entidad');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        // Recargar la lista de intervenciones
        await get().fetchInterventions();
        set({ loading: false });
        return true;
      } else {
        throw new Error(data.message || 'Error al crear la intervención');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al crear intervención';
      set({ error: errorMessage, loading: false });
      console.error('Error creating intervention:', error);
      return false;
    }
  },

  // Actualizar intervención
  updateIntervention: async (id: number, interventionData: Partial<InterventionBase>): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/interventions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(interventionData),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Intervención no encontrada');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        // Recargar la lista de intervenciones
        await get().fetchInterventions();
        set({ loading: false });
        return true;
      } else {
        throw new Error(data.message || 'Error al actualizar la intervención');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al actualizar intervención';
      set({ error: errorMessage, loading: false });
      console.error('Error updating intervention:', error);
      return false;
    }
  },

  // Eliminar/Toggle intervención (activa/desactiva)
  deleteIntervention: async (id: number): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/interventions/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Intervención no encontrada');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        // Recargar la lista de intervenciones
        await get().fetchInterventions();
        set({ loading: false });
        return true;
      } else {
        throw new Error(data.message || 'Error al cambiar estado de la intervención');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cambiar estado';
      set({ error: errorMessage, loading: false });
      console.error('Error toggling intervention:', error);
      return false;
    }
  },

  // Limpiar error
  clearError: () => set({ error: null }),

  // Establecer loading
  setLoading: (loading: boolean) => set({ loading }),
}));
