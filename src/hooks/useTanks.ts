import { useState, useEffect } from 'react';
import { getAuthToken } from '../utils';
import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.API_BASE_URL;

// Tipos de datos del frontend
export interface Tank {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  connections: string;
  photos: string[];
  state: boolean;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface TankBase {
  name: string;
  latitude: number;
  longitude: number;
  connections: string;
  photos: string[];
  state: boolean;
}

export const useTanks = () => {
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTanks = async (page: number = 1, limit: number = 10000) => {
    setLoading(true);
    setError(null);

    try {
      // Obtener el token del sessionStorage
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/tank?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: any = await response.json();

      if (data.status === 'success' && Array.isArray(data.data)) {
        // Mapear los datos del backend al formato del frontend
        const mappedTanks: Tank[] = data.data.map((tank: any) => {
          // Manejar diferentes formatos de fotos del backend
          let photos: string[] = [];
          if (tank.photography && Array.isArray(tank.photography)) {
            photos = tank.photography; // ← Campo correcto del backend
          } else if (tank.photography && typeof tank.photography === 'string') {
            photos = [tank.photography];
          } else if (tank.photos && Array.isArray(tank.photos)) {
            photos = tank.photos; // Fallback por compatibilidad
          }

          // Debug: Log de fotos recibidas
          if (photos.length > 0) {
            console.log(`📥 Tanque "${tank.name}" tiene ${photos.length} fotos`);
          }

          // Determinar el estado correctamente
          const isActive = tank.state === true || tank.state === 1 || tank.state === "true" || tank.state === "1";

          return {
            id: tank.id_tank?.toString() || '',
            name: tank.name || '',
            latitude: tank.latitude || 0.0,
            longitude: tank.longitude || 0.0,
            connections: tank.connections || '',
            photos: photos,
            state: isActive,
            status: isActive ? 'active' : 'inactive',
            createdAt: tank.created_at || '',
            updatedAt: tank.updated_at || ''
          };
        });

        setTanks(mappedTanks);
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al obtener tanques';
      setError(errorMessage);
      console.error('Error fetching tanks:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTank = async (tankData: TankBase): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();

      // Validar tamaño de imágenes optimizadas
      const photoSizes = tankData.photos.map(photo => {
        const base64Length = photo.length - (photo.indexOf(',') + 1);
        return Math.round((base64Length * 3) / 4); // Tamaño en bytes
      });
      
      const totalSize = photoSizes.reduce((sum, size) => sum + size, 0);
      const totalSizeMB = totalSize / (1024 * 1024);
      
      console.log(`📊 Métricas de fotos para tanque "${tankData.name}":
        - Cantidad: ${tankData.photos.length}
        - Tamaños individuales: ${photoSizes.map(s => `${(s/1024).toFixed(1)}KB`).join(', ')}
        - Tamaño total: ${totalSizeMB.toFixed(2)}MB`);
      
      // Advertir si el tamaño total es muy grande (>5MB)
      if (totalSizeMB > 5) {
        console.warn(`⚠️ Tamaño total de fotos muy grande: ${totalSizeMB.toFixed(2)}MB. Considera reducir la calidad.`);
      }

      // Enviar todas las fotos al backend (mapear photos -> photography)
      const backendData = {
        name: tankData.name,
        latitude: tankData.latitude,
        longitude: tankData.longitude,
        connections: tankData.connections,
        photography: tankData.photos, // ← Campo correcto que espera el backend
        state: tankData.state,
      };

      // Debug: Log de lo que se está enviando
      console.log(`🚀 Frontend enviando tanque:`, {
        name: backendData.name,
        coordinates: `${backendData.latitude}, ${backendData.longitude}`,
        photosCount: backendData.photography.length,
        firstPhotoPreview: backendData.photography[0] ? `${backendData.photography[0].substring(0, 30)}...` : 'No photos'
      });

      const response = await fetch(`${API_BASE_URL}/tank`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('El tanque ya existe');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        // Recargar la lista de tanques
        await fetchTanks();
        return true;
      } else {
        throw new Error(data.message || 'Error al crear el tanque');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear tanque';
      setError(errorMessage);
      console.error('Error creating tank:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateTank = async (id: string, tankData: Partial<TankBase>): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();

      // Mapear datos del frontend al formato del backend
      const backendData: any = {};
      
      if (tankData.name !== undefined) backendData.name = tankData.name;
      if (tankData.latitude !== undefined) backendData.latitude = tankData.latitude;
      if (tankData.longitude !== undefined) backendData.longitude = tankData.longitude;
      if (tankData.connections !== undefined) backendData.connections = tankData.connections;
      if (tankData.photos !== undefined) backendData.photography = tankData.photos; // Campo correcto del backend
      if (tankData.state !== undefined) backendData.state = tankData.state;

      console.log(`🔄 Actualizando tanque ${id}:`, backendData);

      const response = await fetch(`${API_BASE_URL}/tank/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Tanque no encontrado');
        }
        if (response.status === 409) {
          throw new Error('El nombre del tanque ya existe');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        // Recargar la lista de tanques
        await fetchTanks();
        return true;
      } else {
        throw new Error(data.message || 'Error al actualizar el tanque');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al actualizar tanque';
      setError(errorMessage);
      console.error('Error updating tank:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleTankStatus = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();

      console.log(`🔄 Cambiando estado del tanque ${id}`);

      const response = await fetch(`${API_BASE_URL}/tank/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Tanque no encontrado');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        // Recargar la lista de tanques
        await fetchTanks();
        return true;
      } else {
        throw new Error(data.message || 'Error al cambiar estado del tanque');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cambiar estado del tanque';
      setError(errorMessage);
      console.error('Error toggling tank status:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const refreshTanks = () => {
    fetchTanks();
  };

  // Cargar tanques al montar el hook
  useEffect(() => {
    fetchTanks();
  }, []);

  return {
    tanks,
    loading,
    error,
    createTank,
    updateTank,
    toggleTankStatus,
    refreshTanks,
    fetchTanks
  };
};