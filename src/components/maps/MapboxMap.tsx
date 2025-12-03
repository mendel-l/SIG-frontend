import { useEffect, useRef, useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { MAPBOX_TOKEN, PALESTINA_COORDS, INITIAL_ZOOM } from '@/config/mapbox';
import TankPopupContent from './TankPopupContent';
import ConnectionPopupContent from './ConnectionPopupContent';
import PipePopupContent from './PipePopupContent';
import TankMarker from '@/components/icons/TankMarker';
import type { MapPipe, MapConnection, MapBomb } from '@/queries/mapQueries';

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
      padding: 0 !important;
      margin: 0 !important;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      max-width: 250px;
      width: auto;
      overflow: hidden;
    }

    .tank-popup .mapboxgl-popup-content > div {
      margin-left: 0 !important;
      margin-right: 0 !important;
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
  active: boolean;
  photos: string[];
  connectionsSummary: string;
  pipes?: MapPipe[];
}

interface MapboxMapProps {
  className?: string;
  tanks?: Tank[];
  bombs?: MapBomb[];
  isLoading?: boolean;
  showPipes?: boolean;
  showConnections?: boolean;
  onPipeClick?: (pipeId: number) => void;
  onConnectionClick?: (connectionId: number) => void;
}

export default function MapboxMap({ 
  className = '', 
  tanks = [],
  bombs = [],
  isLoading = false, 
  showPipes = true, 
  showConnections = true,
  onPipeClick,
  onConnectionClick
}: MapboxMapProps) {
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
          // Normalizar el material para comparación (mayúsculas)
          const normalizedMaterial = (pipe.material || '').toUpperCase().trim();
          
          features.push({
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: coords,
            },
            properties: {
              id: pipe.id,
              material: normalizedMaterial, // Guardar material normalizado
              materialOriginal: pipe.material, // Guardar original para mostrar
              active: pipe.active,
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
    // Agrupar conexiones por ID para incluir todas las tuberías asociadas
    const connectionMap = new Map<number, any>();
    
    tanks.forEach((tank) => {
      (tank.pipes || []).forEach((pipe) => {
        (pipe.connections || []).forEach((connection: MapConnection) => {
          if (
            typeof connection.longitude === 'number' &&
            typeof connection.latitude === 'number' &&
            !Number.isNaN(connection.longitude) &&
            !Number.isNaN(connection.latitude)
          ) {
            const connId = connection.id;
            
            if (!connectionMap.has(connId)) {
              // Primera vez que vemos esta conexión
              connectionMap.set(connId, {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [connection.longitude, connection.latitude],
                },
                properties: {
                  id: connId,
                  material: connection.material || '',
                  pressureNominal: connection.pressureNominal || '',
                  connectionType: connection.connectionType || '',
                  depth: connection.depth || 0,
                  installedBy: connection.installedBy || '',
                  active: connection.active,
                  latitude: connection.latitude,
                  longitude: connection.longitude,
                  pipesJson: '[]', // Inicializar como string JSON
                },
              });
            }
            
            // Agregar información de la tubería asociada
            const feature = connectionMap.get(connId);
            let pipesArray = [];
            try {
              pipesArray = JSON.parse(feature.properties.pipesJson || '[]');
            } catch {
              pipesArray = [];
            }
            
            // Verificar si la tubería ya está en la lista
            if (!pipesArray.find((p: any) => p.id === pipe.id)) {
              pipesArray.push({
                id: pipe.id,
                material: pipe.material,
                diameter: pipe.diameter,
                active: pipe.active,
                size: pipe.size,
              });
            }
            
            feature.properties.pipesJson = JSON.stringify(pipesArray);
          }
        });
      });
    });
    
    return {
      type: 'FeatureCollection',
      features: Array.from(connectionMap.values()),
    };
  }, [tanks, bombs]);

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

  // Actualizar marcadores cuando se carguen los tanques y bombas
  useEffect(() => {
    if (!mapLoaded || !map.current || isLoading) {
      return;
    }

    // Limpiar marcadores anteriores
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Crear marcadores para cada tanque
    (tanks || []).forEach((tank: Tank) => {
      const { latitude, longitude, active } = tank;

      // Crear elemento HTML para el marcador usando React
      const el = document.createElement('div');
      const markerRoot = createRoot(el);
      markerRoot.render(<TankMarker active={active} />);

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

    // Crear marcadores para cada bomba
    (bombs || []).forEach((bomb: MapBomb) => {
      const { latitude, longitude, active, name, photos, connections } = bomb;

      // Crear elemento HTML para el marcador de bomba
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.innerHTML = `
        <div class="w-10 h-10 rounded-full flex items-center justify-center ${
          active ? 'bg-yellow-600' : 'bg-gray-400'
        }">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      `;

      // Crear contenido del popup para bomba
      const popupContent = document.createElement('div');
      popupContent.className = 'p-3 w-56';
      popupContent.innerHTML = `
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2 text-sm">${name}</h3>
        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">
          <strong>Coordenadas:</strong> ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
        </p>
        ${connections ? `<p class="text-xs text-gray-600 dark:text-gray-400 mb-1"><strong>Conexiones:</strong> ${connections}</p>` : ''}
        <p class="text-xs ${active ? 'text-green-600' : 'text-gray-500'}">
          ${active ? 'Activa' : 'Inactiva'}
        </p>
        ${photos && photos.length > 0 ? `<p class="text-xs text-gray-500 mt-2">${photos.length} foto(s)</p>` : ''}
      `;

      // Crear popup
      const popup = new window.mapboxgl.Popup({ offset: 25, className: 'tank-popup' })
        .setDOMContent(popupContent);

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
            // Si está inactivo, mostrar en gris
            ['==', ['get', 'active'], false],
            '#9ca3af',
            // Colores según material (comparación con material normalizado en mayúsculas)
            ['==', ['get', 'material'], 'PVC'],
            '#3b82f6', // Azul para PVC
            ['==', ['get', 'material'], 'POLIETILENO'],
            '#10b981', // Verde para Polietileno
            ['==', ['get', 'material'], 'HIERRO GALVANIZADO'],
            '#f59e0b', // Amarillo/Naranja para Hierro Galvanizado
            ['==', ['get', 'material'], 'ACERO'],
            '#ef4444', // Rojo para Acero
            ['==', ['get', 'material'], 'COBRE'],
            '#8b5cf6', // Púrpura para Cobre
            ['==', ['get', 'material'], 'CONCRETO'],
            '#6b7280', // Gris para Concreto
            ['==', ['get', 'material'], 'ASBESTO'],
            '#dc2626', // Rojo oscuro para Asbesto
            // Color por defecto (verde) si no coincide con ningún material
            '#10b981',
          ],
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 4,
            15, 8,
            18, 12,
          ],
        },
      },
      pipesGeoJson,
      showPipes
    );

    // Agregar eventos de click en las tuberías para mostrar popup
    // Usar setTimeout para asegurar que la capa esté completamente cargada
    if (showPipes && map.current) {
      setTimeout(() => {
        if (map.current && map.current.getLayer('pipes-layer')) {
          // Remover listeners anteriores si existen
          map.current.off('click', 'pipes-layer');
          map.current.off('mouseenter', 'pipes-layer');
          map.current.off('mouseleave', 'pipes-layer');

          map.current.on('click', 'pipes-layer', (e: any) => {
            e.preventDefault();
            const feature = e.features && e.features[0];
            if (feature && feature.properties) {
              const props = feature.properties;
              
              const pipe = {
                id: props.id,
                material: props.materialOriginal || props.material || '',
                diameter: props.diameter,
                active: props.active,
                size: props.size,
                tankName: props.tankName || '',
              };

              const popupContainer = document.createElement('div');
              const root = createRoot(popupContainer);
              root.render(<PipePopupContent pipe={pipe} onEdit={onPipeClick} />);

              new window.mapboxgl.Popup({ offset: 25, className: 'tank-popup', closeOnClick: true })
                .setLngLat(e.lngLat)
                .setDOMContent(popupContainer)
                .addTo(map.current);
            }
          });

          // Cambiar cursor al pasar sobre tuberías
          map.current.on('mouseenter', 'pipes-layer', () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = 'pointer';
            }
          });

          map.current.on('mouseleave', 'pipes-layer', () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = '';
            }
          });
        }
      }, 100);
    }

    ensureLayer(
      connectionSourceId.current,
      'connections-layer',
      {
        id: 'connections-layer',
        type: 'circle',
        source: connectionSourceId.current,
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 6,
            15, 10,
            18, 14,
          ],
          'circle-color': [
            'case',
            ['==', ['get', 'active'], true],
            '#3b82f6',
            '#f97316',
          ],
          'circle-opacity': 0.9,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2,
        },
      },
      connectionsGeoJson,
      showConnections
    );

    // Agregar eventos de click en las conexiones para mostrar popup
    // Usar setTimeout para asegurar que la capa esté completamente cargada
    if (showConnections && map.current) {
      setTimeout(() => {
        if (map.current && map.current.getLayer('connections-layer')) {
          // Remover listeners anteriores si existen
          map.current.off('click', 'connections-layer');
          map.current.off('mouseenter', 'connections-layer');
          map.current.off('mouseleave', 'connections-layer');

          map.current.on('click', 'connections-layer', (e: any) => {
            e.preventDefault();
            const feature = e.features && e.features[0];
            if (feature && feature.properties) {
              const props = feature.properties;
              
              let pipes = [];
              try {
                pipes = JSON.parse(props.pipesJson || '[]');
              } catch {
                pipes = [];
              }
              
              const connection = {
                id: props.id,
                latitude: props.latitude,
                longitude: props.longitude,
                material: props.material || '',
                pressureNominal: props.pressureNominal || '',
                connectionType: props.connectionType || '',
                depth: props.depth || undefined,
                installedBy: props.installedBy || '',
                active: props.active,
                pipes: pipes,
              };

              const popupContainer = document.createElement('div');
              const root = createRoot(popupContainer);
              root.render(<ConnectionPopupContent connection={connection} onEdit={onConnectionClick} />);

              new window.mapboxgl.Popup({ offset: 25, className: 'tank-popup', closeOnClick: true })
                .setLngLat(e.lngLat)
                .setDOMContent(popupContainer)
                .addTo(map.current);
            }
          });

          // Cambiar cursor al pasar sobre conexiones
          map.current.on('mouseenter', 'connections-layer', () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = 'pointer';
            }
          });

          map.current.on('mouseleave', 'connections-layer', () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = '';
            }
          });
        }
      }, 100);
    }
  }, [mapLoaded, tanks, bombs, isLoading, pipesGeoJson, connectionsGeoJson, showPipes, showConnections]);

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

