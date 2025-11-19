import { useEffect, useState } from 'react';
import FormContainer, { FormField, FormInput, FormTextarea, FormSelect, FormActions } from '../ui/FormContainer';
import MapboxLocationPicker from '../ui/MapboxLocationPicker';
import SearchableSelect from '../ui/SearchableSelect';
import { useConnections } from '../../queries/connectionsQueries';
import { useTanks } from '../../queries/tanksQueries';

interface PipeFormProps {
  onSubmit: (pipeData: {
    material: string;
    diameter: number;
    size: number;
    status: boolean;
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
    status: boolean;
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
  // Obtener lista de conexiones disponibles (límite máximo del backend es 100)
  const { data: connectionsData, isLoading: isLoadingConnections, error: connectionsError } = useConnections(1, 100);
  const connections = connectionsData?.items || [];

  // Obtener lista de tanques disponibles
  const { data: tanksData, isLoading: isLoadingTanks, error: tanksError } = useTanks(1, 100);
  const tanks = tanksData?.items || [];

  const buildInitialState = (data: PipeFormProps['initialData']) => ({
    material: data?.material || '',
    diameter: data?.diameter || 0,
    size: data?.size || 0,
    status: data?.status ?? true,
    installation_date: data?.installation_date || new Date().toISOString().slice(0, 16),
    coordinates: data?.coordinates || [],
    observations: data?.observations || '',
    tank_id: data?.tank_id || undefined,
    start_connection_id: data?.start_connection_id || undefined,
    end_connection_id: data?.end_connection_id || undefined,
  });

  const [formData, setFormData] = useState(buildInitialState(initialData));

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
        const startConn = connections.find(c => c.id_connection === formData.start_connection_id);
        if (startConn) {
          finalCoordinates[0] = [startConn.latitude, startConn.longitude];
        }
      } else if (formData.coordinates && formData.coordinates.length > 0) {
        finalCoordinates[0] = formData.coordinates[0];
      }
      
      if (formData.end_connection_id) {
        const endConn = connections.find(c => c.id_connection === formData.end_connection_id);
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
      status: formData.status,
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
        status: true,
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
      [name]: type === 'number' ? parseFloat(value) || 0
             : name === 'status' ? value === 'true'
             : value
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

  const handleConnectionChange = (type: 'start' | 'end', connectionId: string) => {
    const id = connectionId === '' ? undefined : parseInt(connectionId);
    
    // Actualizar coordenadas si se selecciona una conexión
    let updatedCoordinates = [...formData.coordinates];
    
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

  return (
    <FormContainer
      title={isEdit ? "Editar Tubería" : "Registrar Nueva Tubería"}
      subtitle={isEdit ? "Modifica la información de la tubería" : "Ingresa los datos de la nueva tubería del sistema"}
      className={className}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormField label="Material" error={errors.material} required>
            <FormInput
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
              placeholder="Ej: PVC, Hierro Galvanizado, Polietileno"
            />
          </FormField>

          <FormField label="Diámetro (mm)" error={errors.diameter} required>
            <FormInput
              type="number"
              name="diameter"
              value={formData.diameter.toString()}
              onChange={handleChange}
              placeholder="150"
            />
          </FormField>

          <FormField label="Tamaño (m)" error={errors.size} required>
            <FormInput
              type="number"
              name="size"
              value={formData.size.toString()}
              onChange={handleChange}
              placeholder="250"
            />
          </FormField>

          <FormField label="Fecha de Instalación" error={errors.installation_date} required>
            <input
              type="datetime-local"
              name="installation_date"
              value={formData.installation_date}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-gray-100"
            />
          </FormField>

          <FormField label="Estado" error={errors.status}>
            <FormSelect
              name="status"
              value={formData.status.toString()}
              onChange={handleChange}
            >
              <option value="true"> Activo</option>
              <option value="false"> Inactivo</option>
            </FormSelect>
          </FormField>

          <FormField label="Tanque asociado" error={errors.tank_id}>
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
          </FormField>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="" error={errors.start_connection}>
              <SearchableSelect
                options={connections.map(conn => {
                  const parts = [];
                  parts.push(`#${conn.id_connection}`);
                  if (conn.connection_type) parts.push(conn.connection_type);
                  if (conn.material) parts.push(conn.material);
                  
                  // Texto de búsqueda incluye ID, descripción y material para búsqueda completa
                  const searchText = [
                    conn.id_connection.toString(),
                    conn.connection_type || '',
                    conn.material || '',
                    conn.description || ''
                  ].filter(Boolean).join(' ');
                  
                  return {
                    value: conn.id_connection,
                    label: parts.join(' - '),
                    searchText: searchText
                  };
                })}
                value={formData.start_connection_id}
                onChange={(value) => handleConnectionChange('start', value?.toString() || '')}
                placeholder="Seleccionar conexión de inicio o usar punto manual"
                searchPlaceholder="Buscar por ID, tipo, material o descripción..."
                disabled={isLoadingConnections || loading}
                loading={isLoadingConnections}
                error={connectionsError ? 'Error al cargar conexiones' : errors.start_connection}
              />
              {connectionsError && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                  Error al cargar conexiones. Puedes usar puntos manuales en el mapa.
                </p>
              )}
            </FormField>

            <FormField label="" error={errors.end_connection}>
              <SearchableSelect
                options={connections.map(conn => {
                  const parts = [];
                  parts.push(`#${conn.id_connection}`);
                  if (conn.connection_type) parts.push(conn.connection_type);
                  if (conn.material) parts.push(conn.material);
                  
                  // Texto de búsqueda incluye ID, descripción y material para búsqueda completa
                  const searchText = [
                    conn.id_connection.toString(),
                    conn.connection_type || '',
                    conn.material || '',
                    conn.description || ''
                  ].filter(Boolean).join(' ');
                  
                  return {
                    value: conn.id_connection,
                    label: parts.join(' - '),
                    searchText: searchText
                  };
                })}
                value={formData.end_connection_id}
                onChange={(value) => handleConnectionChange('end', value?.toString() || '')}
                placeholder="Seleccionar conexión de fin o usar punto manual"
                searchPlaceholder="Buscar por ID, tipo, material o descripción..."
                disabled={isLoadingConnections || loading}
                loading={isLoadingConnections}
                error={connectionsError ? 'Error al cargar conexiones' : errors.end_connection}
              />
              {connectionsError && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                  Error al cargar conexiones. Puedes usar puntos manuales en el mapa.
                </p>
              )}
            </FormField>
          </div>

          <FormField label="Coordenadas (2 puntos: inicio y fin)" error={errors.coordinates}>
            <MapboxLocationPicker
              mode="path"
              coordinates={formData.coordinates}
              onCoordinatesChange={handleCoordinatesChange}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Puedes seleccionar conexiones arriba o hacer clic en el mapa para definir los puntos manualmente. 
              Debes tener exactamente 2 puntos.
            </p>
          </FormField>
        </div>

        <FormField label="Observaciones" error={errors.observations}>
          <FormTextarea
            name="observations"
            value={formData.observations}
            onChange={handleChange}
            placeholder="Descripción adicional sobre la tubería..."
            rows={3}
          />
        </FormField>

        <FormActions
          onCancel={onCancel}
          loading={loading}
          submitText={isEdit ? "Actualizar Tubería" : "Registrar Tubería"}
          cancelText="Cancelar"
        />
      </form>
    </FormContainer>
  );
}
