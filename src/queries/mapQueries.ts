import { useQuery } from '@tanstack/react-query';
import { getAuthToken } from '@/utils';
import { API_CONFIG, getApiUrl } from '@/config/api';

const MAP_API_URL = `${API_CONFIG.API_BASE_URL}/map`;
const BOMBS_API_URL = getApiUrl(API_CONFIG.ENDPOINTS.BOMBS);

export interface MapConnection {
  id: number;
  latitude: number;
  longitude: number;
  material: string;
  pressureNominal: string;
  connectionType: string;
  depth?: number;
  installedBy: string;
  active: boolean;
}

export interface MapPipe {
  id: number;
  material: string;
  diameter: number;
  active: boolean;
  size: number;
  installationDate?: string | null;
  coordinates: Array<{
    latitude: number;
    longitude: number;
  }>;
  observations: string;
  connections: MapConnection[];
}

export interface MapTank {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  active: boolean;
  photos: string[];
  connectionsSummary: string;
  pipes: MapPipe[];
}

export interface MapBomb {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  active: boolean;
  photos: string[];
  connections: string | null;
  type: 'bomb';
}

interface BackendConnection {
  id_connection: number;
  latitude: number;
  longitude: number;
  material: string;
  pressure_nominal: string;
  connection_type: string;
  depth_m: number | null;
  installed_by: string;
  active: boolean;
}

interface BackendPipe {
  id_pipes: number;
  material: string;
  diameter: number;
  active: boolean;
  size: number;
  installation_date?: string | null;
  coordinates: Array<[number, number]>;
  observations: string;
  connections: BackendConnection[];
}

interface BackendTank {
  id_tank: number;
  name: string;
  latitude: number;
  longitude: number;
  photography: string[];
  active: boolean;
  pipes: BackendPipe[];
}

async function fetchBombsForMap(): Promise<MapBomb[]> {
  const token = getAuthToken();

  try {
    const response = await fetch(`${BOMBS_API_URL}?page=1&limit=100`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });

    if (!response.ok) {
      // Si es 404, simplemente retornar array vacío (no hay bombas)
      if (response.status === 404) {
        return [];
      }
      console.error('Error obteniendo bombas para el mapa:', response.statusText);
      return [];
    }

    const result: any = await response.json();
    
    if (result.status !== 'success') {
      return [];
    }

    const bombs = result.data?.items || [];
    
    return bombs
      .filter((bomb: any) => bomb.active === true)
      .map((bomb: any) => ({
        id: `bomb-${bomb.id_bombs}`,
        name: bomb.name,
        latitude: bomb.latitude || 0,
        longitude: bomb.longitude || 0,
        active: bomb.active === true,
        photos: Array.isArray(bomb.photography) ? bomb.photography : [],
        connections: bomb.connections || null,
        type: 'bomb' as const,
      }));
  } catch (error) {
    console.error('Error al obtener bombas para el mapa:', error);
    return [];
  }
}

async function fetchMapData(): Promise<{ tanks: MapTank[]; bombs: MapBomb[] }> {
  const token = getAuthToken();

  // Obtener tanques
  const tanksResponse = await fetch(MAP_API_URL, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });

  let tanks: MapTank[] = [];
  let hasTanksError = false;

  if (tanksResponse.ok) {
    const data: BackendTank[] = await tanksResponse.json();
    
    if (data && data.length > 0) {
      tanks = data.map((tank) => {
        const pipes: MapPipe[] = (tank.pipes || []).map((pipe) => {
          const coordinates = (pipe.coordinates || []).map(([lon, lat]) => ({
            latitude: lat,
            longitude: lon,
          }));

          const connections: MapConnection[] = (pipe.connections || []).map((connection) => ({
            id: connection.id_connection,
            latitude: connection.latitude,
            longitude: connection.longitude,
            material: connection.material,
            pressureNominal: connection.pressure_nominal,
            connectionType: connection.connection_type,
            depth: connection.depth_m ?? undefined,
            installedBy: connection.installed_by,
            active: connection.active,
          }));

          return {
            id: pipe.id_pipes,
            material: pipe.material,
            diameter: Number(pipe.diameter),
            active: pipe.active,
            size: Number(pipe.size),
            installationDate: pipe.installation_date ?? null,
            coordinates,
            observations: pipe.observations,
            connections,
          };
        });

        const totalConnections = pipes.reduce((sum, pipe) => sum + pipe.connections.length, 0);
        const connectionsSummary = `${totalConnections} conexión${totalConnections === 1 ? '' : 'es'} en ${pipes.length} tubería${pipes.length === 1 ? '' : 's'}`;

        return {
          id: tank.id_tank.toString(),
          name: tank.name,
          latitude: tank.latitude,
          longitude: tank.longitude,
          active: tank.active,
          photos: tank.photography || [],
          connectionsSummary,
          pipes,
        };
      });
    }
  } else {
    // Si es un 404, verificar si es porque no hay datos
    if (tanksResponse.status === 404) {
      hasTanksError = true;
    }
  }

  // Obtener bombas
  const bombs = await fetchBombsForMap();

  // Si no hay tanques ni bombas, lanzar error
  if (tanks.length === 0 && bombs.length === 0) {
    if (hasTanksError || tanksResponse.status === 404) {
      throw new Error('NO_DATA');
    }
    throw new Error('NO_DATA');
  }

  return { tanks, bombs };
}

export function useMapData() {
  return useQuery({
    queryKey: ['map', 'data'],
    queryFn: fetchMapData,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10,
  });
}
