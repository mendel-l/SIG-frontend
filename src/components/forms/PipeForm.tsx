import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import MapboxLocationPicker from '../ui/MapboxLocationPicker';
import SearchableSelect from '../ui/SearchableSelect';
import AsyncSearchableSelect from '../ui/AsyncSearchableSelect';
import { useConnections, useConnection } from '../../queries/connectionsQueries';
import { useTanks } from '../../queries/tanksQueries';
import { useDebounce } from '../../hooks/useDebounce';
import { Link, MousePointerClick } from 'lucide-react';

interface PipeFormProps {
  onSubmit: (pipeData: {
    material: string;
    diameter: number;
    size: number;
    active: boolean;
    installation_date: string;
    coordinates: [number, number][];
    observations?: string;
    tank_id?: number;
    start_connection_id?: number;
    end_connection_id?: number;
  }) => Promise<boolean>;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
  initialData?: {
    material: string;
    diameter: number;
    size: number;
    active?: boolean;
    installation_date: string;
    coordinates: [number, number][];
    observations?: string;
    tank_id?: number;
    start_connection_id?: number;
    end_connection_id?: number;
  } | null;
  isEdit?: boolean;
}

export default function PipeForm({ 
  onSubmit, 
  onCancel, 
  loading = false, 
  className = '', 
  initialData = null, 
  isEdit = false 
}: PipeFormProps) {
  // Estados para búsqueda de conexiones
  const [startConnectionSearch, setStartConnectionSearch] = useState('');
  const [endConnectionSearch, setEndConnectionSearch] = useState('');
  const [isStartDropdownOpen, setIsStartDropdownOpen] = useState(false);
  const [isEndDropdownOpen, setIsEndDropdownOpen] = useState(false);
  const debouncedStartSearch = useDebounce(startConnectionSearch, 300);
  const debouncedEndSearch = useDebounce(endConnectionSearch, 300);

  // Obtener conexiones con búsqueda (inicio) - cargar cuando hay búsqueda o cuando el dropdown está abierto
  const shouldLoadStartConnections = isStartDropdownOpen || debouncedStartSearch.trim().length > 0;
  const { data: startConnectionsData, isLoading: isLoadingStartConnections, error: startConnectionsError } = useConnections(
    1, 
    50, 
    debouncedStartSearch.trim().length > 0 ? debouncedStartSearch : undefined,
    { enabled: shouldLoadStartConnections }
  );
  const startConnections = startConnectionsData?.items || [];

  // Obtener conexiones con búsqueda (fin) - cargar cuando hay búsqueda o cuando el dropdown está abierto
  const shouldLoadEndConnections = isEndDropdownOpen || debouncedEndSearch.trim().length > 0;
  const { data: endConnectionsData, isLoading: isLoadingEndConnections, error: endConnectionsError } = useConnections(
    1, 
    50, 
    debouncedEndSearch.trim().length > 0 ? debouncedEndSearch : undefined,
    { enabled: shouldLoadEndConnections }
  );
  const endConnections = endConnectionsData?.items || [];

  // Obtener lista de tanques disponibles
  const { data: tanksData, isLoading: isLoadingTanks, error: tanksError } = useTanks(1, 100);
  const tanks = tanksData?.items || [];

  const buildInitialState = (data: PipeFormProps['initialData']) => ({
    material: data?.material || '',
    diameter: data?.diameter || 0,
    size: data?.size || 0,
    installation_date: data?.installation_date || new Date().toISOString().slice(0, 16),
    coordinates: data?.coordinates || [],
    observations: data?.observations || '',
    tank_id: data?.tank_id || undefined,
    start_connection_id: data?.start_connection_id || undefined,
    end_connection_id: data?.end_connection_id || undefined,
  });

  const [formData, setFormData] = useState(buildInitialState(initialData));

  // Obtener detalles de las conexiones seleccionadas (después de inicializar formData)
  const { data: startConnectionDetails } = useConnection(formData.start_connection_id || null);
  const { data: endConnectionDetails } = useConnection(formData.end_connection_id || null);

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    setFormData(buildInitialState(initialData));
    setErrors({});
  }, [initialData]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.material.trim()) {
      newErrors.material = 'El material es obligatorio';
    } else if (formData.material.length > 50) {
      newErrors.material = 'El material no puede exceder 50 caracteres';
    }

    if (formData.diameter <= 0) {
      newErrors.diameter = 'El diámetro debe ser mayor a 0';
    }

    if (formData.size <= 0) {
      newErrors.size = 'El tamaño debe ser mayor a 0';
    }

    if (!formData.installation_date) {
      newErrors.installation_date = 'La fecha de instalación es obligatoria';
    }

    // Validar que haya exactamente 2 puntos (ya sea por conexiones o coordenadas manuales)
    const hasStartPoint = formData.start_connection_id !== undefined || (formData.coordinates && formData.coordinates.length > 0);
    const hasEndPoint = formData.end_connection_id !== undefined || (formData.coordinates && formData.coordinates.length > 1);
    
    if (!hasStartPoint || !hasEndPoint) {
      newErrors.coordinates = 'Debes definir exactamente 2 puntos: uno de inicio y uno de fin (pueden ser conexiones o puntos manuales)';
    } else if (formData.coordinates && formData.coordinates.length !== 2) {
      // Si hay coordenadas manuales, deben ser exactamente 2
      newErrors.coordinates = 'Debes trazar exactamente 2 puntos en el mapa';
    } else if (formData.coordinates && formData.coordinates.length === 2) {
      // Validar coordenadas si existen
      formData.coordinates.forEach(([lat, lng], index) => {
        if (lat < -90 || lat > 90) {
          newErrors.coordinates = `La latitud del punto ${index + 1} debe estar entre -90 y 90`;
        }
        if (lng < -180 || lng > 180) {
          newErrors.coordinates = `La longitud del punto ${index + 1} debe estar entre -180 y 180`;
        }
      });
    }

    if (formData.observations && formData.observations.length > 100) {
      newErrors.observations = 'Las observaciones no pueden exceder 100 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Construir coordenadas finales: si hay conexiones, usar sus coordenadas, sino usar las manuales
    let finalCoordinates = formData.coordinates;
    
    // Si se seleccionaron conexiones, obtener sus coordenadas
    if (formData.start_connection_id || formData.end_connection_id) {
      finalCoordinates = [[0, 0], [0, 0]]; // Inicializar con valores por defecto
      
      if (formData.start_connection_id) {
        const startConn = startConnections.find(c => c.id_connection === formData.start_connection_id) ||
                          endConnections.find(c => c.id_connection === formData.start_connection_id);
        if (startConn) {
          finalCoordinates[0] = [startConn.latitude, startConn.longitude];
        }
      } else if (formData.coordinates && formData.coordinates.length > 0) {
        finalCoordinates[0] = formData.coordinates[0];
      }
      
      if (formData.end_connection_id) {
        const endConn = endConnections.find(c => c.id_connection === formData.end_connection_id) ||
                        startConnections.find(c => c.id_connection === formData.end_connection_id);
        if (endConn) {
          finalCoordinates[1] = [endConn.latitude, endConn.longitude];
        }
      } else if (formData.coordinates && formData.coordinates.length > 1) {
        finalCoordinates[1] = formData.coordinates[1];
      }
    }

    const success = await onSubmit({
      material: formData.material.trim(),
      diameter: formData.diameter,
      size: formData.size,
      active: initialData?.active ?? true,
      installation_date: formData.installation_date,
      coordinates: finalCoordinates,
      observations: formData.observations.trim(),
      tank_id: formData.tank_id,
      start_connection_id: formData.start_connection_id,
      end_connection_id: formData.end_connection_id,
    });

    if (success && !isEdit) {
      setFormData({
        material: '',
        diameter: 0,
        size: 0,
        installation_date: new Date().toISOString().slice(0, 16),
        coordinates: [],
        observations: '',
        tank_id: undefined,
        start_connection_id: undefined,
        end_connection_id: undefined,
      });
      setErrors({});
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCoordinatesChange = (coords: [number, number][]) => {
    // Limitar a exactamente 2 puntos
    const limitedCoords = coords.slice(0, 2) as [number, number][];
    setFormData(prev => ({
      ...prev,
      coordinates: limitedCoords,
    }));
    setErrors(prev => ({ ...prev, coordinates: '' }));
  };

  const handleConnectionChange = (type: 'start' | 'end', connectionId: number | string | undefined) => {
    const id = connectionId === undefined || connectionId === '' ? undefined : typeof connectionId === 'number' ? connectionId : parseInt(connectionId);
    
    // Actualizar coordenadas si se selecciona una conexión
    let updatedCoordinates = [...formData.coordinates];
    const connections = type === 'start' ? startConnections : endConnections;
    
    if (id) {
      // Buscar la conexión seleccionada
      const selectedConnection = connections.find(c => c.id_connection === id);
      if (selectedConnection && selectedConnection.latitude && selectedConnection.longitude) {
        // Asegurar que tenemos al menos 2 elementos en el array
        if (updatedCoordinates.length < 2) {
          updatedCoordinates = [
            ...updatedCoordinates,
            ...Array(2 - updatedCoordinates.length).fill([0, 0])
          ] as [number, number][];
        }
        
        // Actualizar el punto correspondiente (inicio = índice 0, fin = índice 1)
        const index = type === 'start' ? 0 : 1;
        updatedCoordinates[index] = [selectedConnection.latitude, selectedConnection.longitude];
      }
    } else {
      // Si se deselecciona la conexión, mantener las coordenadas manuales si existen
      // No hacer nada, las coordenadas manuales se mantienen
    }
    
    setFormData(prev => ({
      ...prev,
      [type === 'start' ? 'start_connection_id' : 'end_connection_id']: id,
      coordinates: updatedCoordinates,
    }));
    setErrors(prev => ({ ...prev, coordinates: '' }));
  };

  const pipeIcon = (
    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              {pipeIcon}
            </div>
            <div>
              <CardTitle>{isEdit ? "Editar Tubería" : "Registrar Nueva Tubería"}</CardTitle>
              <CardDescription>
                {isEdit ? "Modifica la información de la tubería" : "Ingresa los datos de la nueva tubería del sistema"}
              </CardDescription>
            </div>
          </div>
          {onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={loading}
              className="h-8 w-8 p-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Input
              label="Material"
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
              placeholder="Ej: PVC, Hierro Galvanizado, Polietileno"
              error={errors.material}
              required
            />

            <Input
              label="Diámetro (mm)"
              type="number"
              name="diameter"
              value={formData.diameter.toString()}
              onChange={handleChange}
              placeholder="150"
              error={errors.diameter}
              required
            />

            <Input
              label="Tamaño (m)"
              type="number"
              name="size"
              value={formData.size.toString()}
              onChange={handleChange}
              placeholder="250"
              error={errors.size}
              required
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Fecha de Instalación <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="installation_date"
                value={formData.installation_date}
                onChange={handleChange}
                className={`input w-full ${errors.installation_date ? 'border-red-500' : ''}`}
              />
              {errors.installation_date && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.installation_date}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Tanque asociado
              </label>
              <SearchableSelect
                options={tanks.map(tank => ({
                  value: tank.id,
                  label: tank.name
                }))}
                value={formData.tank_id}
                onChange={(value) => {
                  setFormData(prev => ({
                    ...prev,
                    tank_id: value as number | undefined
                  }));
                  if (errors.tank_id) {
                    setErrors(prev => ({ ...prev, tank_id: '' }));
                  }
                }}
                placeholder="Seleccionar tanque..."
                searchPlaceholder="Buscar tanque..."
                disabled={isLoadingTanks || loading}
                loading={isLoadingTanks}
                error={tanksError ? 'Error al cargar tanques' : errors.tank_id}
              />
              {tanksError && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                  Error al cargar tanques. Intenta nuevamente.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Conexión de Inicio */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold">
                    1
                  </span>
                  Conexión de Inicio
                </label>
                <AsyncSearchableSelect
                  options={startConnections.map(conn => {
                    const parts = [];
                    parts.push(`#${conn.id_connection}`);
                    if (conn.connection_type) parts.push(conn.connection_type);
                    if (conn.material) parts.push(conn.material);
                    
                    return {
                      value: conn.id_connection,
                      label: parts.join(' - ')
                    };
                  })}
                  value={formData.start_connection_id}
                  onChange={(value) => handleConnectionChange('start', value)}
                  onSearchChange={(search) => setStartConnectionSearch(search)}
                  onOpenChange={(open) => setIsStartDropdownOpen(open)}
                  placeholder="Seleccionar conexión de inicio..."
                  searchPlaceholder="Buscar por ID, tipo, material..."
                  disabled={loading}
                  loading={isLoadingStartConnections}
                  error={startConnectionsError ? 'Error al cargar conexiones' : errors.start_connection}
                  debounceMs={300}
                />
                
                {/* Mostrar información de la conexión seleccionada */}
                {formData.start_connection_id && startConnectionDetails ? (
                  <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                    <div className="flex items-start gap-2">
                      <Link className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-900 dark:text-green-300">
                          Conexión #{startConnectionDetails.id_connection}
                        </p>
                        <div className="mt-1 space-y-0.5 text-xs text-green-700 dark:text-green-400">
                          {startConnectionDetails.connection_type && (
                            <p><span className="font-medium">Tipo:</span> {startConnectionDetails.connection_type}</p>
                          )}
                          {startConnectionDetails.material && (
                            <p><span className="font-medium">Material:</span> {startConnectionDetails.material}</p>
                          )}
                          {startConnectionDetails.pressure_nominal && (
                            <p><span className="font-medium">Presión:</span> {startConnectionDetails.pressure_nominal}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : formData.coordinates.length > 0 && formData.coordinates[0] ? (
                  <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                    <div className="flex items-start gap-2">
                      <MousePointerClick className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                          Punto Manual
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                          Coordenadas: {formData.coordinates[0][0].toFixed(6)}, {formData.coordinates[0][1].toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
                
                {startConnectionsError && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                    Error al cargar conexiones. Puedes usar puntos manuales en el mapa.
                  </p>
                )}
                {errors.start_connection && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.start_connection}</p>
                )}
              </div>

              {/* Conexión de Fin */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold">
                    2
                  </span>
                  Conexión de Fin
                </label>
                <AsyncSearchableSelect
                  options={endConnections.map(conn => {
                    const parts = [];
                    parts.push(`#${conn.id_connection}`);
                    if (conn.connection_type) parts.push(conn.connection_type);
                    if (conn.material) parts.push(conn.material);
                    
                    return {
                      value: conn.id_connection,
                      label: parts.join(' - ')
                    };
                  })}
                  value={formData.end_connection_id}
                  onChange={(value) => handleConnectionChange('end', value)}
                  onSearchChange={(search) => setEndConnectionSearch(search)}
                  onOpenChange={(open) => setIsEndDropdownOpen(open)}
                  placeholder="Seleccionar conexión de fin..."
                  searchPlaceholder="Buscar por ID, tipo, material..."
                  disabled={loading}
                  loading={isLoadingEndConnections}
                  error={endConnectionsError ? 'Error al cargar conexiones' : errors.end_connection}
                  debounceMs={300}
                />
                
                {/* Mostrar información de la conexión seleccionada */}
                {formData.end_connection_id && endConnectionDetails ? (
                  <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                    <div className="flex items-start gap-2">
                      <Link className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-red-900 dark:text-red-300">
                          Conexión #{endConnectionDetails.id_connection}
                        </p>
                        <div className="mt-1 space-y-0.5 text-xs text-red-700 dark:text-red-400">
                          {endConnectionDetails.connection_type && (
                            <p><span className="font-medium">Tipo:</span> {endConnectionDetails.connection_type}</p>
                          )}
                          {endConnectionDetails.material && (
                            <p><span className="font-medium">Material:</span> {endConnectionDetails.material}</p>
                          )}
                          {endConnectionDetails.pressure_nominal && (
                            <p><span className="font-medium">Presión:</span> {endConnectionDetails.pressure_nominal}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : formData.coordinates.length > 1 && formData.coordinates[1] ? (
                  <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                    <div className="flex items-start gap-2">
                      <MousePointerClick className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                          Punto Manual
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                          Coordenadas: {formData.coordinates[1][0].toFixed(6)}, {formData.coordinates[1][1].toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
                
                {endConnectionsError && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                    Error al cargar conexiones. Puedes usar puntos manuales en el mapa.
                  </p>
                )}
                {errors.end_connection && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.end_connection}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Coordenadas (2 puntos: inicio y fin)
              </label>
              <MapboxLocationPicker
                mode="path"
                coordinates={formData.coordinates}
                onCoordinatesChange={handleCoordinatesChange}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Puedes seleccionar conexiones arriba o hacer clic en el mapa para definir los puntos manualmente. 
                Debes tener exactamente 2 puntos.
              </p>
              {errors.coordinates && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.coordinates}</p>
              )}
            </div>
          </div>

          <Textarea
            label="Observaciones"
            name="observations"
            value={formData.observations}
            onChange={handleChange}
            placeholder="Descripción adicional sobre la tubería..."
            rows={3}
            error={errors.observations}
          />

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              {isEdit ? "Actualizar Tubería" : "Registrar Tubería"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
