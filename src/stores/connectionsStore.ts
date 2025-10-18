import { create } from 'zustand';
import { Connection, ConnectionBase, ConnectionCreate } from '../types';
import { getAuthToken } from '../utils';

const API_URL = 'http://localhost:8000/api/v1/connections';

interface ConnectionsState {
  connections: Connection[];
  loading: boolean;
  error: string | null;
  
  fetchConnections: (page?: number, limit?: number) => Promise<void>;
  createConnection: (connection: ConnectionCreate) => Promise<boolean>;
  updateConnection: (id: number, connection: Partial<ConnectionBase>) => Promise<boolean>;
  deleteConnection: (id: number) => Promise<boolean>;
  clearError: () => void;
}

export const useConnectionsStore = create<ConnectionsState>((set) => ({
  connections: [],
  loading: false,
  error: null,

  fetchConnections: async (page = 1, limit = 100) => {
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
        throw new Error(errorData.detail || 'Error al obtener las conexiones');
      }

      const data = await response.json();
      
      set({ 
        connections: Array.isArray(data) ? data : (data.data || []),
        loading: false 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      set({ error: errorMessage, loading: false });
    }
  },

  createConnection: async (connectionData: ConnectionCreate) => {
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
        body: JSON.stringify(connectionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 409) {
          throw new Error('Ya existe una conexión con estas coordenadas');
        }
        
        if (response.status === 400) {
          throw new Error(errorData.detail || 'Datos de conexión inválidos');
        }

        throw new Error(errorData.detail || 'Error al crear la conexión');
      }

      const data = await response.json();
      const newConnection = Array.isArray(data) ? data[0] : (data.data || data);
      
      set((state) => ({
        connections: [newConnection, ...state.connections],
        loading: false,
      }));

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      set({ error: errorMessage, loading: false });
      return false;
    }
  },

  updateConnection: async (id: number, connectionData: Partial<ConnectionBase>) => {
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
        body: JSON.stringify(connectionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 404) {
          throw new Error('Conexión no encontrada');
        }

        throw new Error(errorData.detail || 'Error al actualizar la conexión');
      }

      const data = await response.json();
      const updatedConnection = Array.isArray(data) ? data[0] : (data.data || data);

      set((state) => ({
        connections: state.connections.map((conn) =>
          conn.id_connection === id ? updatedConnection : conn
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

  deleteConnection: async (id: number) => {
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
          throw new Error('Conexión no encontrada');
        }

        throw new Error(errorData.detail || 'Error al cambiar estado de la conexión');
      }

      // Toggle del estado local
      set((state) => ({
        connections: state.connections.map((conn) =>
          conn.id_connection === id ? { ...conn, state: !conn.state } : conn
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
