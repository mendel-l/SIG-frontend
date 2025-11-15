import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { MapPin, Target, RefreshCw, AlertCircle, Undo2, Trash2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, Polyline } from 'react-leaflet';
import L, { Map as LeafletMap, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet en React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
  latitude?: number;
  longitude?: number;
  coordinates?: [number, number][];
  onLocationChange?: (lat: number, lng: number) => void;
  onCoordinatesChange?: (coords: [number, number][]) => void;
  mode?: 'point' | 'path';
  className?: string;
  disabled?: boolean;
}

// Componente para manejar clicks en el mapa y movimiento automático
function LocationMarker({ position, onLocationChange, shouldMoveMap }: { 
  position: [number, number], 
  onLocationChange: (lat: number, lng: number) => void,
  shouldMoveMap?: boolean
}) {
  const map = useMap();
  
  // Mover el mapa cuando se obtiene una nueva ubicación
  useEffect(() => {
    if (shouldMoveMap && position[0] !== 0 && position[1] !== 0) {
      map.flyTo(position, 16, {
        animate: true,
        duration: 1.5
      });
    }
  }, [map, position, shouldMoveMap]);
  
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationChange(lat, lng);
      // No mover automáticamente cuando el usuario hace click manual
    },
  });

  return position[0] !== 0 && position[1] !== 0 ? (
    <Marker position={position}>
      <Popup>
        <div className="text-center">
          <strong>Ubicación del Tanque</strong><br/>
          Lat: {position[0].toFixed(6)}<br/>
          Lng: {position[1].toFixed(6)}
        </div>
      </Popup>
    </Marker>
  ) : null;
}

export default function LocationPicker({
  latitude = 0,
  longitude = 0,
  coordinates = [],
  onLocationChange,
  onCoordinatesChange,
  mode = 'point',
  className = '',
  disabled = false
}: LocationPickerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [shouldMoveMap, setShouldMoveMap] = useState(false);
  const mapRef = useRef<LeafletMap | null>(null);

  const isPathMode = mode === 'path';
  const latLngCoordinates: [number, number][] = useMemo(() => {
    if (isPathMode) {
      return Array.isArray(coordinates) ? coordinates : [];
    }
    if (latitude !== 0 || longitude !== 0) {
      return [[latitude, longitude]];
    }
    return [];
  }, [isPathMode, coordinates, latitude, longitude]);

  // Obtener ubicación actual
  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
          }
        );
      });

      const { latitude: lat, longitude: lng, accuracy: acc } = position.coords;
      
      console.log('📍 Ubicación obtenida:', { lat, lng, accuracy: acc });
      
      if (isPathMode && onCoordinatesChange) {
        const updated: [number, number][] = [
          ...(coordinates || []),
          [lat, lng] as [number, number],
        ];
        onCoordinatesChange(updated);
        mapRef.current?.flyTo([lat, lng], 16, { animate: true, duration: 1.5 });
      } else if (onLocationChange) {
        onLocationChange(lat, lng);
        setShouldMoveMap(true); // Activar movimiento del mapa
        setTimeout(() => setShouldMoveMap(false), 2000);
      }
      setAccuracy(acc);
      setHasPermission(true);
      
    } catch (err: any) {
      console.error('❌ Error de geolocalización:', err);
      
      let errorMessage = 'Error desconocido al obtener ubicación';
      
      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = 'Permiso de ubicación denegado. Por favor permite el acceso a tu ubicación.';
          setHasPermission(false);
          break;
        case err.POSITION_UNAVAILABLE:
          errorMessage = 'Información de ubicación no disponible.';
          break;
        case err.TIMEOUT:
          errorMessage = 'Tiempo de espera agotado. Intenta nuevamente.';
          break;
        default:
          errorMessage = `Error: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [coordinates, isPathMode, onCoordinatesChange, onLocationChange]);

  // Verificar permisos al cargar
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        console.log('🔐 Estado de permisos:', result.state);
        setHasPermission(result.state === 'granted');
        
        if (!isPathMode && result.state === 'granted' && latitude === 0 && longitude === 0) {
          getCurrentLocation();
        }
      });
    }
  }, [getCurrentLocation, latitude, longitude, isPathMode]);

  // Formatear coordenadas para mostrar
  const formatCoordinate = (coord: number, decimals: number = 6) => {
    return coord === 0 ? '0.000000' : coord.toFixed(decimals);
  };

  // Obtener precisión en metros
  const getAccuracyText = () => {
    if (!accuracy) return '';
    if (accuracy < 10) return '🎯 Muy precisa (< 10m)';
    if (accuracy < 50) return '✅ Buena precisión (< 50m)';
    if (accuracy < 100) return '⚠️ Precisión moderada (< 100m)';
    return `⚠️ Baja precisión (~${Math.round(accuracy)}m)`;
  };

  const mapCenter: [number, number] = (
    isPathMode
      ? (latLngCoordinates[0] ?? [14.634915, -90.506882])
      : (latitude !== 0 && longitude !== 0
          ? [latitude, longitude]
          : [14.634915, -90.506882])
  ) as [number, number];

  const lastPoint = latLngCoordinates.length > 0 ? latLngCoordinates[latLngCoordinates.length - 1] : null;

  const handleUndo = () => {
    if (disabled || !isPathMode || latLngCoordinates.length === 0 || !onCoordinatesChange) return;
    const updated = latLngCoordinates.slice(0, -1) as [number, number][];
    onCoordinatesChange(updated);
  };

  const handleClear = () => {
    if (disabled || !isPathMode || latLngCoordinates.length === 0 || !onCoordinatesChange) return;
    onCoordinatesChange([]);
  };

  return (
    <div className={className}>
      {/* Controles de ubicación */}
      <div className="space-y-4">
        {/* Botón para obtener ubicación */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={disabled || isLoading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
              disabled || isLoading
                ? 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
            }`}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Target className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {isLoading ? 'Obteniendo ubicación y moviendo mapa...' : 'Obtener mi ubicación'}
            </span>
          </button>
          {isPathMode && (
            <>
              <button
                type="button"
                onClick={handleUndo}
                disabled={disabled || latLngCoordinates.length === 0}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                  latLngCoordinates.length === 0 || disabled
                    ? 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'border-orange-300 dark:border-orange-600 text-orange-600 dark:text-orange-300 hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                }`}
              >
                <Undo2 className="h-4 w-4" />
                <span className="text-sm font-medium">Deshacer punto</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={disabled || latLngCoordinates.length === 0}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                  latLngCoordinates.length === 0 || disabled
                    ? 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'border-red-300 dark:border-red-600 text-red-600 dark:text-red-300 hover:border-red-400 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
              >
                <Trash2 className="h-4 w-4" />
                <span className="text-sm font-medium">Limpiar ruta</span>
              </button>
            </>
          )}
          
          {accuracy && (
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {getAccuracyText()}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-800 dark:text-red-300">
                Error de Ubicación
              </h4>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                {error}
              </p>
              {hasPermission === false && (
                <p className="text-xs text-red-600 dark:text-red-500 mt-2">
                  Tip: Haz clic en el ícono de ubicación en la barra de direcciones del navegador para permitir el acceso.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Coordenadas actuales */}
        {!isPathMode ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Latitud
              </label>
              <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-mono text-gray-900 dark:text-gray-100">
                    {formatCoordinate(latitude)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Longitud
              </label>
              <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-mono text-gray-900 dark:text-gray-100">
                    {formatCoordinate(longitude)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Puntos de la tubería ({latLngCoordinates.length})
            </label>
            {latLngCoordinates.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Aún no has marcado puntos. Haz clic en el mapa para agregar el primero.
              </p>
            ) : (
              <div className="max-h-40 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-600 divide-y divide-gray-100 dark:divide-gray-700 bg-white/60 dark:bg-gray-900/40">
                {latLngCoordinates.map(([lat, lng], index) => (
                  <div key={`${lat}-${lng}-${index}`} className="flex items-center justify-between px-3 py-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-200 mr-2">
                        Punto {index + 1}
                      </span>
                      <span className="font-mono text-gray-600 dark:text-gray-400">
                        {formatCoordinate(lat)}, {formatCoordinate(lng)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {latLngCoordinates.length > 0 && lastPoint && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Último punto: {formatCoordinate(lastPoint[0])}, {formatCoordinate(lastPoint[1])}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Necesitas al menos dos puntos para definir la ruta completa.
            </p>
          </div>
        )}

        {/* Mapa interactivo */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Ubicación en el Mapa (click para cambiar)
          </label>
          <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 relative">
            <MapContainer
              center={mapCenter}
              zoom={15}
              style={{ height: '100%', width: '100%', position: 'relative', zIndex: 10 }}
              zoomControl={true}
              className="tank-location-map"
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {isPathMode ? (
                <>
                  {latLngCoordinates.length >= 2 && (
                    <Polyline
                      positions={latLngCoordinates as unknown as LatLngExpression[]}
                      color="#2563eb"
                      weight={4}
                    />
                  )}
                  {latLngCoordinates.map(([lat, lng], index) => (
                    <Marker key={`${lat}-${lng}-${index}`} position={[lat, lng]}>
                      <Popup>
                        <div className="text-center">
                          <strong>Punto {index + 1}</strong><br/>
                          Lat: {formatCoordinate(lat)}<br/>
                          Lng: {formatCoordinate(lng)}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  <PathClickHandler
                    disabled={disabled}
                    onAddPoint={(lat, lng) => {
                      if (onCoordinatesChange) {
                            const updated: [number, number][] = [
                              ...latLngCoordinates,
                              [lat, lng] as [number, number],
                            ];
                        onCoordinatesChange(updated);
                      }
                    }}
                  />
                </>
              ) : (
                <LocationMarker
                  position={[latitude || mapCenter[0], longitude || mapCenter[1]]}
                  onLocationChange={(lat, lng) => onLocationChange?.(lat, lng)}
                  shouldMoveMap={shouldMoveMap}
                />
              )}
            </MapContainer>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isPathMode
              ? '💡 Haz clic en el mapa para agregar puntos a la ruta. Usa "Deshacer" o "Limpiar" para ajustar la trayectoria.'
              : '💡 Haz clic en cualquier punto del mapa para establecer la ubicación.'}
          </p>
        </div>
      </div>
    </div>
  );
}

function PathClickHandler({
  onAddPoint,
  disabled,
}: {
  onAddPoint: (lat: number, lng: number) => void;
  disabled?: boolean;
}) {
  useMapEvents({
    click(e) {
      if (disabled) return;
      onAddPoint(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}