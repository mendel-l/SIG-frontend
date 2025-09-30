import { useState, useEffect, useCallback } from 'react';
import { MapPin, Target, RefreshCw, AlertCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet en React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
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
  latitude,
  longitude,
  onLocationChange,
  className = '',
  disabled = false
}: LocationPickerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [shouldMoveMap, setShouldMoveMap] = useState(false);

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
      
      onLocationChange(lat, lng);
      setAccuracy(acc);
      setHasPermission(true);
      setShouldMoveMap(true); // Activar movimiento del mapa
      
      // Desactivar el movimiento después de un momento para evitar conflictos con clicks
      setTimeout(() => setShouldMoveMap(false), 2000);
      
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
  }, [onLocationChange]);

  // Verificar permisos al cargar
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        console.log('🔐 Estado de permisos:', result.state);
        setHasPermission(result.state === 'granted');
        
        if (result.state === 'granted' && latitude === 0 && longitude === 0) {
          getCurrentLocation();
        }
      });
    }
  }, [getCurrentLocation, latitude, longitude]);

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

  const mapCenter: [number, number] = latitude !== 0 && longitude !== 0 
    ? [latitude, longitude] 
    : [14.634915, -90.506882]; // Guatemala City como default

  return (
    <div className={className}>
      {/* Controles de ubicación */}
      <div className="space-y-4">
        {/* Botón para obtener ubicación */}
        <div className="flex items-center space-x-3">
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
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker
                position={[latitude || mapCenter[0], longitude || mapCenter[1]]}
                onLocationChange={onLocationChange}
                shouldMoveMap={shouldMoveMap}
              />
            </MapContainer>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            💡 Haz clic en cualquier punto del mapa para establecer la ubicación del tanque
          </p>
        </div>
      </div>
    </div>
  );
}