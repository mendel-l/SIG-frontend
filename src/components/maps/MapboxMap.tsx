import { useEffect, useRef, useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { MAPBOX_TOKEN, PALESTINA_COORDS, INITIAL_ZOOM } from '@/config/mapbox';
import TankPopupContent from './TankPopupContent';
import TankMarker from '@/components/icons/TankMarker';
import type { MapPipe, MapConnection } from '@/queries/mapQueries';

// Declaración de tipos para Mapbox
declare global {
  interface Window {
    mapboxgl: any;
  }
}

// Agregar estilos globales aquí
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .custom-marker {
      cursor: pointer;
      transition: transform 0.2s;
    }

    .custom-marker:hover {
      transform: scale(1.2);
    }

    .tank-popup .mapboxgl-popup-content {
      background: white;
      border-radius: 8px;
      padding: 0;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      max-width: 250px;
      width: auto;
      overflow: hidden;
    }

    .dark .tank-popup .mapboxgl-popup-content {
      background: #1f2937;
    }

    .tank-popup-content {
      overflow-wrap: break-word;
      word-wrap: break-word;
    }

    .mapboxgl-popup-tip {
      border-top-color: white;
    }

    .dark .mapboxgl-popup-tip {
      border-top-color: #1f2937;
    }

    .mapboxgl-ctrl-group {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .dark .mapboxgl-ctrl-group {
      background: #374151;
    }
  `;
  document.head.appendChild(style);
}

interface Tank {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  state: boolean;
  photos: string[];
  connectionsSummary: string;
  pipes?: MapPipe[];
}

interface MapboxMapProps {
  className?: string;
  tanks?: Tank[];
  isLoading?: boolean;
  showPipes?: boolean;
  showConnections?: boolean;
}

export default function MapboxMap({ className = '', tanks = [], isLoading = false, showPipes = true, showConnections = true }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const pipeSourceId = useRef('pipes-source');
  const connectionSourceId = useRef('connections-source');
  const [mapLoaded, setMapLoaded] = useState(false);

  const pipesGeoJson = useMemo(() => {
    const features: any[] = [];
    tanks.forEach((tank) => {
      (tank.pipes || []).forEach((pipe) => {
        const coords = (pipe.coordinates || [])
          .map((point) => [point.longitude, point.latitude])
          .filter((coord) => coord.every((value) => typeof value === 'number' && !Number.isNaN(value)));

        if (coords.length >= 2) {
          features.push({
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: coords,
            },
            properties: {
              id: pipe.id,
              material: pipe.material,
              status: pipe.status,
              diameter: pipe.diameter,
              size: pipe.size,
              tankName: tank.name,
            },
          });
        }
      });
    });
    return {
      type: 'FeatureCollection',
      features,
    };
  }, [tanks]);

  const connectionsGeoJson = useMemo(() => {
    const features: any[] = [];
    tanks.forEach((tank) => {
      (tank.pipes || []).forEach((pipe) => {
        (pipe.connections || []).forEach((connection: MapConnection) => {
          if (
            typeof connection.longitude === 'number' &&
            typeof connection.latitude === 'number' &&
            !Number.isNaN(connection.longitude) &&
            !Number.isNaN(connection.latitude)
          ) {
            features.push({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [connection.longitude, connection.latitude],
              },
              properties: {
                id: connection.id,
                material: connection.material,
                pressureNominal: connection.pressureNominal,
                connectionType: connection.connectionType,
                installedBy: connection.installedBy,
                state: connection.state,
                tankName: tank.name,
                pipeId: pipe.id,
              },
            });
          }
        });
      });
    });
    return {
      type: 'FeatureCollection',
      features,
    };
  }, [tanks]);

  useEffect(() => {
    if (isLoading) {
      // Si está cargando, evita modificar marcadores
      return;
    }
  }, [isLoading]);

  useEffect(() => {
    // Esperar a que Mapbox GL JS esté cargado desde el CDN
    const initializeMap = () => {
      if (!mapContainer.current || map.current) {
        return;
      }

      if (!window.mapboxgl) {
        console.error('⚠️ Mapbox GL JS no está disponible');
        return;
      }

      // Configurar token
      window.mapboxgl.accessToken = MAPBOX_TOKEN;
      
      console.log('🗺️ Inicializando mapa de Mapbox...');
      console.log('📍 Centro:', PALESTINA_COORDS);
      console.log('🎫 Token configurado');

      // Inicializar mapa
      map.current = new window.mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/standard', // Estilo 3D
        center: PALESTINA_COORDS,
        zoom: INITIAL_ZOOM,
        pitch: 45, // Inclinación para ver relieve
        bearing: 0, // Rotación
      });

      // Agregar controles de navegación
      map.current.addControl(new window.mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new window.mapboxgl.FullscreenControl(), 'top-right');

      // Evento cuando el mapa está listo
      map.current.on('load', () => {
        console.log('✅ Mapa cargado correctamente');
        setMapLoaded(true);
      });

      // Manejo de errores
      map.current.on('error', (e: any) => {
        console.error('❌ Error en el mapa:', e);
      });
    };

    // Intentar inicializar inmediatamente
    if (window.mapboxgl) {
      initializeMap();
    } else {
      // Si no está cargado, esperar
      const checkInterval = setInterval(() => {
        if (window.mapboxgl) {
          clearInterval(checkInterval);
          initializeMap();
        }
      }, 100);

      // Limpiar después de 10 segundos
      setTimeout(() => clearInterval(checkInterval), 10000);
    }

    // Cleanup
    return () => {
      if (map.current) {
        console.log('🗑️ Limpiando mapa...');
        if (map.current.getLayer('pipes-layer')) {
          map.current.removeLayer('pipes-layer');
        }
        if (map.current.getSource(pipeSourceId.current)) {
          map.current.removeSource(pipeSourceId.current);
        }
        if (map.current.getLayer('connections-layer')) {
          map.current.removeLayer('connections-layer');
        }
        if (map.current.getSource(connectionSourceId.current)) {
          map.current.removeSource(connectionSourceId.current);
        }
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Actualizar marcadores cuando se carguen los tanques
  useEffect(() => {
    if (!mapLoaded || !map.current || !tanks || tanks.length === 0 || isLoading) {
      return;
    }

    // Limpiar marcadores anteriores
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Crear marcadores para cada tanque
    tanks.forEach((tank: Tank) => {
      const { latitude, longitude, state } = tank;

      // Crear elemento HTML para el marcador usando React
      const el = document.createElement('div');
      const markerRoot = createRoot(el);
      markerRoot.render(<TankMarker state={state} />);

      // Crear contenedor para el popup con React
      const popupContainer = document.createElement('div');
      const root = createRoot(popupContainer);
      root.render(<TankPopupContent tank={tank} />);

      // Crear popup con componente React
      const popup = new window.mapboxgl.Popup({ offset: 25, className: 'tank-popup' })
        .setDOMContent(popupContainer);

      // Crear marcador
      const marker = new window.mapboxgl.Marker({
        element: el,
        anchor: 'bottom',
      })
        .setLngLat([longitude, latitude])
        .setPopup(popup)
        .addTo(map.current);

      markersRef.current.push(marker);
    });

    // Actualizar capas de tuberías
    const ensureLayer = (
      sourceId: string,
      layerId: string,
      layerConfig: any,
      data: any,
      visible: boolean
    ) => {
      if (!map.current) return;

      const existingSource = map.current.getSource(sourceId);
      if (existingSource) {
        existingSource.setData(data);
      } else {
        map.current.addSource(sourceId, { type: 'geojson', data });
      }

      const hasLayer = map.current.getLayer(layerId);
      if (!hasLayer) {
        map.current.addLayer(layerConfig);
      }

      map.current.setLayoutProperty(
        layerId,
        'visibility',
        visible ? 'visible' : 'none'
      );
    };

    ensureLayer(
      pipeSourceId.current,
      'pipes-layer',
      {
        id: 'pipes-layer',
        type: 'line',
        source: pipeSourceId.current,
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': [
            'case',
            ['==', ['get', 'status'], true],
            '#10b981',
            '#ef4444',
          ],
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 2,
            15, 5,
          ],
        },
      },
      pipesGeoJson,
      showPipes
    );

    ensureLayer(
      connectionSourceId.current,
      'connections-layer',
      {
        id: 'connections-layer',
        type: 'circle',
        source: connectionSourceId.current,
        paint: {
          'circle-radius': 4,
          'circle-color': [
            'case',
            ['==', ['get', 'state'], true],
            '#3b82f6',
            '#f97316',
          ],
          'circle-opacity': 0.8,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 1,
        },
      },
      connectionsGeoJson,
      showConnections
    );
  }, [mapLoaded, tanks, isLoading, pipesGeoJson, connectionsGeoJson, showPipes, showConnections]);

  return (
    <div className={`relative ${className}`}>
      {/* Contenedor del mapa */}
      <div
        ref={mapContainer}
        className="w-full h-full rounded-lg"
        style={{ minHeight: '600px' }}
      />
    </div>
  );
}

