import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import MapboxLocationPicker from '../ui/MapboxLocationPicker';
import CameraCapture from '../ui/CameraCapture';
import SearchableSelect from '../ui/SearchableSelect';
import { useSectors } from '@/queries/sectorsQueries';

interface BombFormProps {
  onSubmit: (bombData: {
    name: string;
    latitude: number;
    longitude: number;
    connections: string | null;
    photos: string[];
    sector_id: number;
    active: boolean;
  }) => Promise<boolean>;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
  initialData?: {
    name: string;
    latitude: number;
    longitude: number;
    connections: string | null;
    photos: string[];
    sector_id: number | null;
    active: boolean;
  } | null;
  isEdit?: boolean;
}

export default function BombForm({ 
  onSubmit, 
  onCancel, 
  loading = false, 
  className = '', 
  initialData = null, 
  isEdit = false 
}: BombFormProps) {
  const { data: sectorsData, isLoading: isLoadingSectors } = useSectors();
  const sectors = sectorsData || [];

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    latitude: initialData?.latitude || 0,
    longitude: initialData?.longitude || 0,
    connections: initialData?.connections || null,
    photos: initialData?.photos || [],
    sector_id: initialData?.sector_id || undefined,
    active: initialData?.active ?? true,
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Actualizar formulario cuando cambian los datos iniciales
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        latitude: initialData.latitude || 0,
        longitude: initialData.longitude || 0,
        connections: initialData.connections || null,
        photos: initialData.photos || [],
        sector_id: initialData.sector_id || undefined,
        active: initialData.active ?? true,
      });
    }
  }, [initialData]);

  // Validación de formulario
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la bomba es obligatorio';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar latitud
    if (formData.latitude === 0) {
      newErrors.latitude = 'La latitud es obligatoria';
    } else if (formData.latitude < -90 || formData.latitude > 90) {
      newErrors.latitude = 'La latitud debe estar entre -90 y 90';
    }

    // Validar longitud
    if (formData.longitude === 0) {
      newErrors.longitude = 'La longitud es obligatoria';
    } else if (formData.longitude < -180 || formData.longitude > 180) {
      newErrors.longitude = 'La longitud debe estar entre -180 y 180';
    }

    // Validar sector
    if (!formData.sector_id) {
      newErrors.sector_id = 'El sector es obligatorio';
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

    const success = await onSubmit({
      name: formData.name.trim(),
      latitude: formData.latitude,
      longitude: formData.longitude,
      connections: formData.connections || null,
      photos: formData.photos,
      sector_id: formData.sector_id!,
      active: formData.active,
    });

    if (success && !isEdit) {
      // Limpiar formulario después del éxito solo si es creación
      setFormData({
        name: '',
        latitude: 0,
        longitude: 0,
        connections: null,
        photos: [],
        sector_id: undefined,
        active: true,
      });
      setErrors({});
    }
  };

  // Manejar cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) || 0 : value
    }));

    // Limpiar error específico cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Manejar cambios de ubicación GPS
  const handleLocationChange = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));

    // Limpiar errores de coordenadas
    setErrors(prev => ({
      ...prev,
      latitude: '',
      longitude: ''
    }));
  };

  // Manejar cambios de fotos
  const handlePhotosChange = (photos: string[]) => {
    setFormData(prev => ({
      ...prev,
      photos
    }));
  };

  // Manejar cambio de sector
  const handleSectorChange = (value: number | string | undefined) => {
    setFormData(prev => ({
      ...prev,
      sector_id: value ? Number(value) : undefined
    }));

    if (errors.sector_id) {
      setErrors(prev => ({
        ...prev,
        sector_id: ''
      }));
    }
  };

  const bombIcon = (
    <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );

  const sectorOptions = sectors
    .filter((sector) => sector.active)
    .map((sector) => ({
      value: sector.id_sector,
      label: sector.name,
      searchText: `${sector.id_sector} ${sector.name} ${sector.description || ''}`,
    }));

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              {bombIcon}
            </div>
            <div>
              <CardTitle>{isEdit ? "Editar Bomba" : "Crear Nueva Bomba"}</CardTitle>
              <CardDescription>
                {isEdit ? "Modifica la información de la bomba y su ubicación" : "Registra información de la bomba y su ubicación"}
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
          {/* Campo Nombre */}
          <Input
            label="Nombre de la Bomba"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ingrese el nombre de la bomba"
            disabled={loading}
            error={errors.name}
            required
          />

          {/* Selector de Sector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Sector <span className="text-red-500">*</span>
            </label>
            <SearchableSelect
              options={isLoadingSectors 
                ? [{ value: '', label: 'Cargando sectores...' }]
                : sectorOptions.length === 0
                ? [{ value: '', label: 'No hay sectores disponibles' }]
                : sectorOptions
              }
              value={formData.sector_id}
              onChange={handleSectorChange}
              placeholder="Seleccione un sector"
              disabled={loading || isLoadingSectors}
              error={errors.sector_id}
              loading={isLoadingSectors}
            />
            {errors.sector_id && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.sector_id}</p>
            )}
          </div>

          {/* Ubicación GPS */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Ubicación GPS <span className="text-red-500">*</span>
            </label>
            <MapboxLocationPicker
              latitude={formData.latitude}
              longitude={formData.longitude}
              onLocationChange={handleLocationChange}
              disabled={loading}
            />
            {(errors.latitude || errors.longitude) && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.latitude || errors.longitude}
              </p>
            )}
          </div>

          {/* Campo Conexiones */}
          <Textarea
            label="Conexiones"
            name="connections"
            value={formData.connections || ''}
            onChange={handleChange}
            placeholder="Ingrese las conexiones de la bomba..."
            disabled={loading}
            error={errors.connections}
            rows={4}
          />

          {/* Campo Estado Activo */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              disabled={loading}
              className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
            />
            <label htmlFor="active" className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Bomba activa
            </label>
          </div>

          {/* Captura de Fotos */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Fotografías de la Bomba
            </label>
            <CameraCapture
              onPhotosChange={handlePhotosChange}
              maxPhotos={5}
              disabled={loading}
              initialPhotos={formData.photos}
            />
          </div>

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
              {isEdit ? "Actualizar Bomba" : "Crear Bomba"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

