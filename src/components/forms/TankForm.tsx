import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import MapboxLocationPicker from '../ui/MapboxLocationPicker';
import CameraCapture from '../ui/CameraCapture';

interface TankFormProps {
  onSubmit: (tankData: {
    name: string;
    latitude: number;
    longitude: number;
    connections: string;
    photos: string[];
  }) => Promise<boolean>;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
  initialData?: {
    name: string;
    latitude: number;
    longitude: number;
    connections: string;
    photos: string[];
    state?: boolean;
  } | null;
  isEdit?: boolean;
}

export default function TankForm({ 
  onSubmit, 
  onCancel, 
  loading = false, 
  className = '', 
  initialData = null, 
  isEdit = false 
}: TankFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    latitude: initialData?.latitude || 0,
    longitude: initialData?.longitude || 0,
    connections: initialData?.connections || '',
    photos: initialData?.photos || [],
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Validación de formulario
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del tanque es obligatorio';
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

    // Validar conexiones
    if (!formData.connections.trim()) {
      newErrors.connections = 'Debe ingresar las conexiones del tanque';
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
      connections: formData.connections.trim(),
      photos: formData.photos,
    });

    if (success && !isEdit) {
      // Limpiar formulario después del éxito solo si es creación
      setFormData({
        name: '',
        latitude: 0,
        longitude: 0,
        connections: '',
        photos: [],
      });
      setErrors({});
    }
  };

  // Manejar cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
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



  const tankIcon = (
    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              {tankIcon}
            </div>
            <div>
              <CardTitle>{isEdit ? "Editar Tanque" : "Crear Nuevo Tanque"}</CardTitle>
              <CardDescription>
                {isEdit ? "Modifica la información del tanque y su ubicación" : "Registra información del tanque y su ubicación"}
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
            label="Nombre del Tanque"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ingrese el nombre del tanque"
            disabled={loading}
            error={errors.name}
            required
          />

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
            value={formData.connections}
            onChange={handleChange}
            placeholder="Ingrese las conexiones del tanque..."
            disabled={loading}
            error={errors.connections}
            rows={4}
            required
          />

          {/* Captura de Fotos */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Fotografías del Tanque
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
              {isEdit ? "Actualizar Tanque" : "Crear Tanque"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}