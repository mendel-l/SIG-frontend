import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import SearchableSelect from '../ui/SearchableSelect';
import { Button } from '../ui/Button';
import CameraCapture from '../ui/CameraCapture';
import { InterventionStatus } from '@/types';
import { usePipes } from '@/queries/pipesQueries';
import { useConnections } from '@/queries/connectionsQueries';
import { useTanks } from '@/queries/tanksQueries';

interface InterventionFormProps {
  onSubmit: (interventionData: {
    description: string;
    start_date: string;
    end_date: string;
    status?: InterventionStatus;
    active: boolean;
    photography?: string[];
    id_tank?: number | null;
    id_pipes?: number | null;
    id_connection?: number | null;
  }) => Promise<boolean>;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
  initialData?: {
    description: string;
    start_date: string;
    end_date: string;
    status?: InterventionStatus;
    active?: boolean;
    photography?: string[];
    id_tank?: number | null;
    id_pipes?: number | null;
    id_connection?: number | null;
  } | null;
  isEdit?: boolean;
}

type EntityType = 'TUBERIAS' | 'CONEXIONES' | 'TANQUES' | '';

export default function InterventionForm({ 
  onSubmit, 
  onCancel, 
  loading = false, 
  className = '', 
  initialData = null, 
  isEdit = false 
}: InterventionFormProps) {
  // Determinar el tipo de entidad inicial basado en los datos iniciales
  const getInitialEntityType = (): EntityType => {
    if (initialData?.id_pipes) return 'TUBERIAS';
    if (initialData?.id_connection) return 'CONEXIONES';
    if (initialData?.id_tank) return 'TANQUES';
    return '';
  };

  const [entityType, setEntityType] = useState<EntityType>(getInitialEntityType());
  const [selectedEntityId, setSelectedEntityId] = useState<number | null>(
    initialData?.id_pipes || initialData?.id_connection || initialData?.id_tank || null
  );

  const [formData, setFormData] = useState({
    description: initialData?.description || '',
    start_date: initialData?.start_date || new Date().toISOString().slice(0, 16),
    end_date: initialData?.end_date || new Date().toISOString().slice(0, 16),
    status: initialData?.status || InterventionStatus.SIN_INICIAR,
    photography: initialData?.photography || [],
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Obtener datos de las entidades - cargar todos al inicio para evitar problemas de timing
  // Usar límites más razonables que no excedan los máximos del backend
  const { data: pipesData, isLoading: isLoadingPipes, error: pipesError } = usePipes(1, 100);
  const { data: connectionsData, isLoading: isLoadingConnections, error: connectionsError } = useConnections(1, 100);
  const { data: tanksData, isLoading: isLoadingTanks, error: tanksError } = useTanks(1, 100);

  // Debug: Log para ver qué datos están llegando
  useEffect(() => {
    if (pipesData) {
      console.log('Pipes Data:', pipesData);
    }
    if (connectionsData) {
      console.log('Connections Data:', connectionsData);
    }
    if (tanksData) {
      console.log('Tanks Data:', tanksData);
    }
    if (pipesError) {
      console.error('Pipes Error:', pipesError);
    }
    if (connectionsError) {
      console.error('Connections Error:', connectionsError);
    }
    if (tanksError) {
      console.error('Tanks Error:', tanksError);
    }
  }, [pipesData, connectionsData, tanksData, pipesError, connectionsError, tanksError]);

  // Actualizar estado cuando cambia initialData
  useEffect(() => {
    if (initialData) {
      const newEntityType = initialData.id_pipes ? 'TUBERIAS' : 
                           initialData.id_connection ? 'CONEXIONES' : 
                           initialData.id_tank ? 'TANQUES' : '';
      const newEntityId = initialData.id_pipes || initialData.id_connection || initialData.id_tank || null;
      setEntityType(newEntityType);
      setSelectedEntityId(newEntityId);
      setFormData({
        description: initialData.description || '',
        start_date: initialData.start_date || new Date().toISOString().slice(0, 16),
        end_date: initialData.end_date || new Date().toISOString().slice(0, 16),
        status: initialData.status || InterventionStatus.SIN_INICIAR,
        photography: initialData.photography || [],
      });
    } else {
      setEntityType('');
      setSelectedEntityId(null);
    }
  }, [initialData]);

  // Resetear el ID seleccionado cuando cambia el tipo de entidad
  useEffect(() => {
    if (entityType && !initialData) {
      setSelectedEntityId(null);
    }
  }, [entityType]);

  // Handler para cambio de fotos
  const handlePhotosChange = (photos: string[]) => {
    setFormData(prev => ({
      ...prev,
      photography: photos
    }));
  };

  // Validación de formulario
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Validar descripción
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    } else if (formData.description.trim().length > 200) {
      newErrors.description = 'La descripción no puede exceder 200 caracteres';
    }

    // Validar fechas
    if (!formData.start_date) {
      newErrors.start_date = 'La fecha de inicio es obligatoria';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'La fecha de fin es obligatoria';
    }

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      if (endDate < startDate) {
        newErrors.end_date = 'La fecha de fin debe ser posterior a la fecha de inicial';
      }
    }

    // Validar que se haya seleccionado una entidad
    if (!entityType) {
      newErrors.entityType = 'Debe seleccionar un tipo de entidad';
    } else if (!selectedEntityId) {
      newErrors.entityId = 'Debe seleccionar una entidad';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Preparar datos con el ID de la entidad seleccionada
    const submitData = {
      description: formData.description.trim(),
      start_date: formData.start_date,
      end_date: formData.end_date,
      status: formData.status,
      active: initialData?.active ?? true,
      photography: formData.photography,
      id_tank: entityType === 'TANQUES' ? selectedEntityId : null,
      id_pipes: entityType === 'TUBERIAS' ? selectedEntityId : null,
      id_connection: entityType === 'CONEXIONES' ? selectedEntityId : null,
    };

    const success = await onSubmit(submitData);

    if (success && !isEdit) {
      // Limpiar formulario después del éxito solo si es creación
      setFormData({
        description: '',
        start_date: new Date().toISOString().slice(0, 16),
        end_date: new Date().toISOString().slice(0, 16),
        status: InterventionStatus.SIN_INICIAR,
        photography: [],
      });
      setEntityType('');
      setSelectedEntityId(null);
      setErrors({});
    }
  };

  // Manejar cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error específico cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const interventionIcon = (
    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              {interventionIcon}
            </div>
            <div>
              <CardTitle>{isEdit ? "Editar Intervención" : "Registrar Nueva Intervención"}</CardTitle>
              <CardDescription>
                {isEdit ? "Modifica la información de la intervención" : "Ingresa los detalles de la intervención realizada"}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Descripción */}
            <div className="md:col-span-2">
              <Textarea
                label="Descripción de la Intervención"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe detalladamente la intervención realizada..."
                rows={4}
                error={errors.description}
                required
              />
            </div>

            {/* Fecha de inicio */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Fecha de Inicio <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className={`input w-full ${errors.start_date ? 'border-red-500' : ''}`}
              />
              {errors.start_date && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.start_date}</p>
              )}
            </div>

            {/* Fecha de fin */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Fecha de Finalización <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className={`input w-full ${errors.end_date ? 'border-red-500' : ''}`}
              />
              {errors.end_date && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.end_date}</p>
              )}
            </div>

            {/* Estado */}
            <Select
              label="Estado"
              name="status"
              value={formData.status}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  status: e.target.value as InterventionStatus
                }));
                if (errors.status) {
                  setErrors(prev => ({
                    ...prev,
                    status: ''
                  }));
                }
              }}
              options={[
                { value: InterventionStatus.SIN_INICIAR, label: 'Sin Iniciar' },
                { value: InterventionStatus.EN_CURSO, label: 'En Curso' },
                { value: InterventionStatus.FINALIZADO, label: 'Finalizado' },
              ]}
              error={errors.status}
              required
            />

            {/* Tipo de Entidad */}
            <Select
              label="Tipo de Entidad"
              name="entityType"
              value={entityType}
              onChange={(e) => {
                const newType = e.target.value as EntityType;
                setEntityType(newType);
                setSelectedEntityId(null);
                if (errors.entityType) {
                  setErrors(prev => ({
                    ...prev,
                    entityType: '',
                    entityId: ''
                  }));
                }
              }}
              options={[
                { value: '', label: 'Seleccione un tipo...' },
                { value: 'TUBERIAS', label: 'Tuberías' },
                { value: 'CONEXIONES', label: 'Conexiones' },
                { value: 'TANQUES', label: 'Tanques' },
              ]}
              error={errors.entityType}
              required
            />

            {/* Entidad Específica */}
            {entityType && (
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-100 block mb-2">
                    {
                      entityType === 'TUBERIAS' ? 'Tubería' :
                      entityType === 'CONEXIONES' ? 'Conexión' :
                      'Tanque'
                    }
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <SearchableSelect
                    options={(() => {
                      // Tuberías
                      if (entityType === 'TUBERIAS') {
                        if (isLoadingPipes) {
                          return [{ value: '', label: 'Cargando tuberías...' }];
                        }
                        if (pipesError) {
                          const errorMsg = pipesError instanceof Error ? pipesError.message : String(pipesError);
                          console.error('Error cargando tuberías:', pipesError);
                          return [{ value: '', label: `Error: ${errorMsg}` }];
                        }
                        if (!pipesData?.items || !Array.isArray(pipesData.items)) {
                          return [{ value: '', label: 'No hay datos disponibles' }];
                        }
                        const activePipes = pipesData.items.filter(pipe => pipe && pipe.active !== false);
                        if (activePipes.length === 0) {
                          return [{ value: '', label: 'No hay tuberías activas disponibles' }];
                        }
                        return activePipes.map(pipe => ({
                          value: pipe.id_pipes,
                          label: `Tubería #${pipe.id_pipes} - ${pipe.material || 'Sin material'} (Ø${pipe.diameter || 'N/A'}mm)`,
                          searchText: `${pipe.id_pipes} ${pipe.material || ''} ${pipe.diameter || ''}`
                        }));
                      }
                      
                      // Conexiones
                      if (entityType === 'CONEXIONES') {
                        if (isLoadingConnections) {
                          return [{ value: '', label: 'Cargando conexiones...' }];
                        }
                        if (connectionsError) {
                          const errorMsg = connectionsError instanceof Error ? connectionsError.message : String(connectionsError);
                          console.error('Error cargando conexiones:', connectionsError);
                          return [{ value: '', label: `Error: ${errorMsg}` }];
                        }
                        if (!connectionsData?.items || !Array.isArray(connectionsData.items)) {
                          return [{ value: '', label: 'No hay datos disponibles' }];
                        }
                        const activeConnections = connectionsData.items.filter(conn => conn && conn.active !== false);
                        if (activeConnections.length === 0) {
                          return [{ value: '', label: 'No hay conexiones activas disponibles' }];
                        }
                        return activeConnections.map(conn => ({
                          value: conn.id_connection,
                          label: `Conexión #${conn.id_connection} - ${conn.material || 'Sin material'} (${conn.connection_type || 'Sin tipo'})`,
                          searchText: `${conn.id_connection} ${conn.material || ''} ${conn.connection_type || ''} ${conn.pressure_nominal || ''}`
                        }));
                      }
                      
                      // Tanques
                      if (entityType === 'TANQUES') {
                        if (isLoadingTanks) {
                          return [{ value: '', label: 'Cargando tanques...' }];
                        }
                        if (tanksError) {
                          const errorMsg = tanksError instanceof Error ? tanksError.message : String(tanksError);
                          console.error('Error cargando tanques:', tanksError);
                          return [{ value: '', label: `Error: ${errorMsg}` }];
                        }
                        if (!tanksData?.items || !Array.isArray(tanksData.items)) {
                          return [{ value: '', label: 'No hay datos disponibles' }];
                        }
                        const activeTanks = tanksData.items.filter(tank => tank && tank.active !== false);
                        if (activeTanks.length === 0) {
                          return [{ value: '', label: 'No hay tanques activos disponibles' }];
                        }
                        return activeTanks.map(tank => ({
                          value: tank.id,
                          label: `Tanque: ${tank.name || 'Sin nombre'}`,
                          searchText: `${tank.id} ${tank.name || ''}`
                        }));
                      }
                      
                      return [];
                    })()}
                    value={selectedEntityId || undefined}
                    onChange={(value) => {
                      const id = value ? (typeof value === 'string' ? parseInt(value) : value) : null;
                      setSelectedEntityId(id);
                      if (errors.entityId) {
                        setErrors(prev => ({
                          ...prev,
                          entityId: ''
                        }));
                      }
                    }}
                    placeholder={`Seleccione una ${entityType === 'TUBERIAS' ? 'tubería' : entityType === 'CONEXIONES' ? 'conexión' : 'tanque'}...`}
                    searchPlaceholder="Buscar..."
                    disabled={
                      entityType === 'TUBERIAS' ? isLoadingPipes :
                      entityType === 'CONEXIONES' ? isLoadingConnections :
                      isLoadingTanks
                    }
                    error={errors.entityId}
                    loading={
                      entityType === 'TUBERIAS' ? isLoadingPipes :
                      entityType === 'CONEXIONES' ? isLoadingConnections :
                      isLoadingTanks
                    }
                  />
                </div>
              </div>
            )}

            {/* Fotografías de la Intervención */}
            <div className="md:col-span-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Fotografías de la Intervención
                </label>
                <CameraCapture
                  onPhotosChange={handlePhotosChange}
                  maxPhotos={5}
                  disabled={loading}
                  initialPhotos={formData.photography}
                />
              </div>
            </div>
          </div>

          {/* Acciones del formulario */}
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
              {isEdit ? "Actualizar Intervención" : "Registrar Intervención"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
