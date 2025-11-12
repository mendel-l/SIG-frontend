import { create } from 'zustand';
import { getAuthToken } from '../utils';
import { API_CONFIG, getApiUrl } from '../config/api';

const API_URL = getApiUrl(API_CONFIG.ENDPOINTS.PIPES);

interface Pipe {
  id_pipes: number;
  material: string;
  diameter: number;
  status: boolean;
  size: number;
  installation_date: string;
  latitude: number;
  longitude: number;
  observations: string;
  created_at: string;
  updated_at: string;
  tanks?: Array<{ id_tank: number; name: string }>;
}

interface PipeBase {
  material: string;
  diameter: number;
  status: boolean;
  size: number;
  installation_date: string;
  latitude: number;
  longitude: number;
  observations?: string;
  tank_ids?: number[];
}

interface PipeCreate extends PipeBase {
  tank_ids?: number[];
}

interface PipesState {
  pipes: Pipe[];
  loading: boolean;
  error: string | null;
  
  fetchPipes: (page?: number, limit?: number) => Promise<void>;
  createPipe: (pipe: PipeCreate) => Promise<boolean>;
  updatePipe: (id: number, pipe: Partial<PipeBase>) => Promise<boolean>;
  deletePipe: (id: number) => Promise<boolean>;
  clearError: () => void;
}

export const usePipesStore = create<PipesState>((set) => ({
  pipes: [],
  loading: false,
  error: null,

  fetchPipes: async (page = 1, limit = 100) => {
    set({ loading: true, error: null });
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al obtener las tuberías');
      }

      const data = await response.json();
      const rawItems = Array.isArray(data?.data?.items) ? data.data.items : Array.isArray(data?.data) ? data.data : [];
      
      set({ 
        pipes: Array.isArray(data) ? data : rawItems,
        loading: false 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      set({ error: errorMessage, loading: false });
    }
  },

  createPipe: async (pipeData: PipeCreate) => {
    set({ loading: true, error: null });
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pipeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 409) {
          throw new Error('Ya existe una tubería con esas características');
        }
        
        if (response.status === 400) {
          throw new Error(errorData.detail || 'Datos de tubería inválidos');
        }

        throw new Error(errorData.detail || 'Error al crear la tubería');
      }

      const data = await response.json();
      const newPipe = Array.isArray(data) ? data[0] : (data.data || data);
      
      set((state) => ({
        pipes: [newPipe, ...state.pipes],
        loading: false,
      }));

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      set({ error: errorMessage, loading: false });
      return false;
    }
  },

  updatePipe: async (id: number, pipeData: Partial<PipeBase>) => {
    set({ loading: true, error: null });
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pipeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 404) {
          throw new Error('Tubería no encontrada');
        }

        throw new Error(errorData.detail || 'Error al actualizar la tubería');
      }

      const data = await response.json();
      const updatedPipe = Array.isArray(data) ? data[0] : (data.data || data);

      set((state) => ({
        pipes: state.pipes.map((pipe) =>
          pipe.id_pipes === id ? updatedPipe : pipe
        ),
        loading: false,
      }));

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      set({ error: errorMessage, loading: false });
      return false;
    }
  },

  deletePipe: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

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
          throw new Error('Tubería no encontrada');
        }

        throw new Error(errorData.detail || 'Error al cambiar estado de la tubería');
      }

      // Toggle del estado local
      set((state) => ({
        pipes: state.pipes.map((pipe) =>
          pipe.id_pipes === id ? { ...pipe, status: !pipe.status } : pipe
        ),
        loading: false,
      }));

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      set({ error: errorMessage, loading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));