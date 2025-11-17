import { useEffect, useRef, useState, useCallback } from 'react';
import { Target, AlertCircle, Undo2, Trash2 } from 'lucide-react';
import { MAPBOX_TOKEN, PALESTINA_COORDS, INITIAL_ZOOM } from '@/config/mapbox';

// Declaración de tipos para Mapbox
declare global {
  interface Window {
    mapboxgl: any;
  }
}

interface MapboxLocationPickerProps {
  latitude?: number;
  longitude?: number;
  coordinates?: [number, number][];
  onLocationChange?: (lat: number, lng: number) => void;
  onCoordinatesChange?: (coords: [number, number][]) => void;
  mode?: 'point' | 'path';
  className?: string;
  disabled?: boolean;
}

export default function MapboxLocationPicker({
  latitude = 0,
  longitude = 0,
  coordinates = [],
  onLocationChange,
  onCoordinatesChange,
  mode = 'point',
  className = '',
  disabled = false
}: MapboxLocationPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const marker = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const hasUserInteracted = useRef<boolean>(false);
  const lastInitialLat = useRef<number | null>(null);
  const lastInitialLng = useRef<number | null>(null);

  const isPathMode = mode === 'path';

  // Obtener ubicación actual
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocalización no está disponible en tu navegador');
      return;
    }

    setIsLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        if (onLocationChange) {
          onLocationChange(lat, lng);
        }
        if (map.current) {
          map.current.flyTo({ center: [lng, lat], zoom: 16 });
        }
        setIsLoading(false);
      },
      () => {
        setError('No se pudo obtener tu ubicación. Por favor, selecciona un punto en el mapa.');
        setIsLoading(false);
      }
    );
  }, [onLocationChange]);

  // Inicializar mapa
  useEffect(() => {
    const initializeMap = () => {
      if (!mapContainer.current || map.current) {
        return;
      }

      if (!window.mapboxgl) {
        console.error('⚠️ Mapbox GL JS no está disponible');
        setError('Mapbox no está disponible. Por favor, recarga la página.');
        return;
      }

      // Configurar token
      window.mapboxgl.accessToken = MAPBOX_TOKEN;

      // Determinar centro inicial
      const center: [number, number] = 
        (latitude !== 0 && longitude !== 0) 
          ? [longitude, latitude]
          : (coordinates.length > 0 && coordinates[0])
          ? [coordinates[0][1], coordinates[0][0]]
          : PALESTINA_COORDS;

      // Inicializar mapa
      map.current = new window.mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/standard',
        center: center,
        zoom: INITIAL_ZOOM,
      });

      // Agregar controles de navegación
      map.current.addControl(new window.mapboxgl.NavigationControl(), 'top-right');

      // Evento cuando el mapa está listo
      map.current.on('load', () => {
        setMapLoaded(true);
      });

      // Manejo de errores
      map.current.on('error', (e: any) => {
        console.error('❌ Error en el mapa:', e);
        setError('Error al cargar el mapa');
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
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!map.current) {
          setError('Mapbox no se pudo cargar. Por favor, recarga la página.');
        }
      }, 10000);
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Actualizar marcador de punto único
  useEffect(() => {
    if (!mapLoaded || !map.current || isPathMode) return;

    // Remover marcador anterior
    if (marker.current) {
      marker.current.remove();
      marker.current = null;
    }

    // Agregar nuevo marcador si hay coordenadas
    if (latitude !== 0 && longitude !== 0) {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.innerHTML = `
        <div style="
          width: 30px;
          height: 30px;
          background-color: #3b82f6;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
        "></div>
      `;

      marker.current = new window.mapboxgl.Marker({ element: el })
        .setLngLat([longitude, latitude])
        .addTo(map.current);
    }
  }, [mapLoaded, latitude, longitude, isPathMode]);

  // Actualizar marcadores de ruta
  useEffect(() => {
    if (!mapLoaded || !map.current || !isPathMode) return;

    // Limpiar marcadores anteriores
    markers.current.forEach(m => m.remove());
    markers.current = [];

    // Agregar marcadores para cada punto
    coordinates.forEach(([lat, lng], index) => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.innerHTML = `
        <div style="
          width: 30px;
          height: 30px;
          background-color: #3b82f6;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
        ">${index + 1}</div>
      `;

      const m = new window.mapboxgl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map.current);
      
      markers.current.push(m);
    });

    // Actualizar línea si hay 2 o más puntos
    if (coordinates.length >= 2 && map.current.getSource('route-line')) {
      const coords = coordinates.map(([lat, lng]) => [lng, lat]);
      map.current.getSource('route-line').setData({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coords,
        },
      });
    } else if (coordinates.length >= 2) {
      // Crear fuente y capa de línea
      map.current.addSource('route-line', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: coordinates.map(([lat, lng]) => [lng, lat]),
          },
        },
      });

      map.current.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route-line',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 4,
        },
      });
    } else if (map.current.getLayer('route-line')) {
      map.current.removeLayer('route-line');
      map.current.removeSource('route-line');
    }
  }, [mapLoaded, coordinates, isPathMode]);

  // Manejar clicks en el mapa
  useEffect(() => {
    if (!mapLoaded || !map.current || disabled) return;

    const handleMapClick = (e: any) => {
      const { lng, lat } = e.lngLat;

      if (isPathMode) {
        // Modo ruta: agregar punto (máximo 2)
        hasUserInteracted.current = true;
        if (onCoordinatesChange) {
          if (coordinates.length >= 2) {
            return; // No permitir más de 2 puntos
          }
          const updated: [number, number][] = [
            ...coordinates,
            [lat, lng] as [number, number],
          ];
          onCoordinatesChange(updated);
        }
      } else {
        // Modo punto único
        hasUserInteracted.current = true;
        if (onLocationChange) {
          onLocationChange(lat, lng);
        }
      }
    };

    map.current.on('click', handleMapClick);

    return () => {
      if (map.current) {
        map.current.off('click', handleMapClick);
      }
    };
  }, [mapLoaded, isPathMode, onLocationChange, onCoordinatesChange, coordinates, disabled]);

  // Centrar mapa solo cuando se cargan coordenadas iniciales (modo edición) y el usuario no ha interactuado
  useEffect(() => {
    if (!mapLoaded || !map.current || hasUserInteracted.current) return;

    // Detectar si las coordenadas iniciales cambiaron (se abrió el formulario en modo edición)
    const initialCoordsChanged = 
      (!isPathMode && 
       latitude !== 0 && 
       longitude !== 0 && 
       (lastInitialLat.current !== latitude || lastInitialLng.current !== longitude));

    if (initialCoordsChanged) {
      lastInitialLat.current = latitude;
      lastInitialLng.current = longitude;
      map.current.flyTo({ center: [longitude, latitude], zoom: 16 });
    } else if (isPathMode && coordinates.length > 0 && !hasUserInteracted.current) {
      const [lat, lng] = coordinates[0];
      map.current.flyTo({ center: [lng, lat], zoom: 16 });
    }
  }, [mapLoaded, latitude, longitude, coordinates, isPathMode]);

  // Resetear flag de interacción cuando cambian las coordenadas iniciales (nuevo formulario)
  useEffect(() => {
    if (!isPathMode && latitude === 0 && longitude === 0) {
      hasUserInteracted.current = false;
      lastInitialLat.current = null;
      lastInitialLng.current = null;
    }
  }, [latitude, longitude, isPathMode]);

  const handleUndo = () => {
    if (isPathMode && coordinates.length > 0 && onCoordinatesChange) {
      const updated = coordinates.slice(0, -1);
      onCoordinatesChange(updated);
    }
  };

  const handleClear = () => {
    if (isPathMode && onCoordinatesChange) {
      onCoordinatesChange([]);
    } else if (!isPathMode && onLocationChange) {
      onLocationChange(0, 0);
    }
  };

  const formatCoordinate = (coord: number) => {
    return coord.toFixed(6);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Controles */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={isLoading || disabled}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Target className="h-3.5 w-3.5" />
            {isLoading ? 'Obteniendo...' : 'Mi ubicación'}
          </button>

          {isPathMode && (
            <>
              <button
                type="button"
                onClick={handleUndo}
                disabled={coordinates.length === 0 || disabled}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Undo2 className="h-3.5 w-3.5" />
                Deshacer
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={coordinates.length === 0 || disabled}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Limpiar
              </button>
            </>
          )}
        </div>

        {!isPathMode && latitude !== 0 && longitude !== 0 && (
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Lat: {formatCoordinate(latitude)}, Lng: {formatCoordinate(longitude)}
          </div>
        )}

        {isPathMode && (
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {coordinates.length}/2 puntos
          </div>
        )}
      </div>

      {/* Mensajes de error o estado */}
      {error && (
        <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
          <p className="text-xs text-yellow-800 dark:text-yellow-300">{error}</p>
        </div>
      )}

      {/* Mapa */}
      <div className="relative w-full rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600" style={{ height: '400px' }}>
        <div
          ref={mapContainer}
          className="w-full h-full"
          style={{ minHeight: '400px' }}
        />
        
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-500 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Cargando mapa...</p>
            </div>
          </div>
        )}
      </div>

      {/* Instrucciones */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {isPathMode
          ? `💡 Haz clic en el mapa para agregar puntos a la ruta. Debes tener exactamente 2 puntos (${coordinates.length}/2). ${coordinates.length >= 2 ? 'Ya tienes 2 puntos, no puedes agregar más.' : ''}`
          : '💡 Haz clic en cualquier punto del mapa para establecer la ubicación.'}
      </p>
    </div>
  );
}

