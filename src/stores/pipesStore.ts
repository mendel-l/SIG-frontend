import { create } from 'zustand';
import { getAuthToken } from '../utils';
import { Pipe, PipeBase } from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Estado del store
interface PipesState {
  pipes: Pipe[];
  loading: boolean;
  error: string | null;
  
  // Acciones
  fetchPipes: (page?: number, limit?: number) => Promise<void>;
  createPipe: (pipeData: PipeBase) => Promise<boolean>;
  updatePipe: (id: string, pipeData: Partial<PipeBase>) => Promise<boolean>;
  togglePipeStatus: (id: string) => Promise<boolean>;
  deletePipe: (id: string) => Promise<boolean>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// Store con Zustand
export const usePipesStore = create<PipesState>((set, get) => ({
  pipes: [],
  loading: false,
  error: null,

  // Obtener tuberías (simulado - backend no implementado)
  fetchPipes: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    
    try {
      // Simular datos mientras no hay backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay
      
      const mockPipes: Pipe[] = [
        {
          id: '1',
          material: 'PVC',
          diameter: 150,
          length: 250.5,
          status: true,
          installationDate: '2024-01-15',
          location: 'Calle Principal - Sector Norte',
          observations: 'Tubería en buen estado, instalada recientemente',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          material: 'Hierro Galvanizado',
          diameter: 200,
          length: 180.0,
          status: false,
          installationDate: '2020-06-20',
          location: 'Avenida Central - Zona Comercial',
          observations: 'Requiere mantenimiento, presenta pequeñas fugas',
          createdAt: '2020-06-20T14:15:00Z',
          updatedAt: '2024-03-10T09:45:00Z'
        },
        {
          id: '3',
          material: 'Polietileno',
          diameter: 100,
          length: 320.8,
          status: true,
          installationDate: '2023-08-12',
          location: 'Barrio Residencial - Sector Sur',
          observations: 'Nueva instalación, material resistente a la corrosión',
          createdAt: '2023-08-12T16:20:00Z',
          updatedAt: '2023-08-12T16:20:00Z'
        }
      ];

      set({ pipes: mockPipes, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener tuberías';
      set({ error: errorMessage, loading: false });
      console.error('Error fetching pipes:', error);
    }
  },

  // Crear tubería (simulado - backend no implementado)
  createPipe: async (pipeData: PipeBase): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simular validación de duplicados
      const pipes = get().pipes;
      const exists = pipes.some(pipe => 
        pipe.location.toLowerCase() === pipeData.location.toLowerCase()
      );
      
      if (exists) {
        throw new Error('Ya existe una tubería en esta ubicación');
      }
      
      // Crear nueva tubería con datos mock
      const newPipe: Pipe = {
        id: (pipes.length + 1).toString(),
        material: pipeData.material,
        diameter: pipeData.diameter,
        length: pipeData.length,
        status: pipeData.status,
        installationDate: pipeData.installationDate,
        location: pipeData.location,
        observations: pipeData.observations || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Actualizar estado
      set(state => ({ 
        pipes: [...state.pipes, newPipe], 
        loading: false 
      }));
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al crear tubería';
      set({ error: errorMessage, loading: false });
      console.error('Error creating pipe:', error);
      return false;
    }
  },

  // Actualizar tubería (simulado - backend no implementado)
  updatePipe: async (id: string, pipeData: Partial<PipeBase>): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const pipes = get().pipes;
      const pipeIndex = pipes.findIndex(p => p.id === id);
      
      if (pipeIndex === -1) {
        throw new Error('Tubería no encontrada');
      }
      
      // Verificar ubicación duplicada (excluyendo la actual)
      if (pipeData.location) {
        const locationExists = pipes.some((pipe, index) => 
          index !== pipeIndex && 
          pipe.location.toLowerCase() === pipeData.location!.toLowerCase()
        );
        
        if (locationExists) {
          throw new Error('Ya existe una tubería en esta ubicación');
        }
      }
      
      // Actualizar tubería
      const updatedPipes = [...pipes];
      updatedPipes[pipeIndex] = {
        ...updatedPipes[pipeIndex],
        ...pipeData,
        updatedAt: new Date().toISOString()
      };
      
      set({ pipes: updatedPipes, loading: false });
      return true;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al actualizar tubería';
      set({ error: errorMessage, loading: false });
      console.error('Error updating pipe:', error);
      return false;
    }
  },

  // Toggle estado de tubería (simulado)
  togglePipeStatus: async (id: string): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const pipes = get().pipes;
      const pipeIndex = pipes.findIndex(p => p.id === id);
      
      if (pipeIndex === -1) {
        throw new Error('Tubería no encontrada');
      }
      
      const updatedPipes = [...pipes];
      updatedPipes[pipeIndex] = {
        ...updatedPipes[pipeIndex],
        status: !updatedPipes[pipeIndex].status,
        updatedAt: new Date().toISOString()
      };
      
      set({ pipes: updatedPipes, loading: false });
      return true;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cambiar estado de tubería';
      set({ error: errorMessage, loading: false });
      console.error('Error toggling pipe status:', error);
      return false;
    }
  },

  // Eliminar tubería (simulado)
  deletePipe: async (id: string): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const pipes = get().pipes;
      const pipeExists = pipes.find(p => p.id === id);
      
      if (!pipeExists) {
        throw new Error('Tubería no encontrada');
      }
      
      // Remover de la lista
      const updatedPipes = pipes.filter(p => p.id !== id);
      
      set({ pipes: updatedPipes, loading: false });
      return true;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al eliminar tubería';
      set({ error: errorMessage, loading: false });
      console.error('Error deleting pipe:', error);
      return false;
    }
  },

  // Limpiar error
  clearError: () => set({ error: null }),

  // Establecer loading
  setLoading: (loading: boolean) => set({ loading }),
}));