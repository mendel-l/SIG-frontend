import { useQuery } from '@tanstack/react-query';
import { getAuthToken } from '@/utils';
import { API_CONFIG } from '@/config/api';

const API_URL = `${API_CONFIG.API_BASE_URL}/map`;

export interface MapConnection {
  id: number;
  latitude: number;
  longitude: number;
  material: string;
  pressureNominal: string;
  connectionType: string;
  depth?: number;
  installedBy: string;
  state: boolean;
}

export interface MapPipe {
  id: number;
  material: string;
  diameter: number;
  status: boolean;
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
  state: boolean;
  photos: string[];
  connectionsSummary: string;
  pipes: MapPipe[];
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
  state: boolean;
}

interface BackendPipe {
  id_pipes: number;
  material: string;
  diameter: number;
  status: boolean;
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
  state: boolean;
  pipes: BackendPipe[];
}

async function fetchMapData(): Promise<MapTank[]> {
  const token = getAuthToken();

  const response = await fetch(API_URL, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const data: BackendTank[] = await response.json();

  return data.map((tank) => {
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
        state: connection.state,
      }));

      return {
        id: pipe.id_pipes,
        material: pipe.material,
        diameter: Number(pipe.diameter),
        status: pipe.status,
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
      state: tank.state,
      photos: tank.photography || [],
      connectionsSummary,
      pipes,
    };
  });
}

export function useMapData() {
  return useQuery({
    queryKey: ['map', 'tanks'],
    queryFn: fetchMapData,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10,
  });
}
