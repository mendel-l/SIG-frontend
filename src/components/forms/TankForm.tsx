import { useState } from 'react';
import FormContainer, { FormField, FormInput, FormActions } from '../ui/FormContainer';
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
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );

  return (
    <FormContainer
      title={isEdit ? "Editar Tanque" : "Crear Nuevo Tanque"}
      subtitle={isEdit ? "Modifica la información del tanque y su ubicación" : "Registra información del tanque y su ubicación"}
      icon={tankIcon}
      onCancel={onCancel}
      loading={loading}
      className={className}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Campo Nombre */}
          <FormField
            label="Nombre del Tanque"
            required={true}
            error={errors.name}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
          >
            <FormInput
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ingrese el nombre del tanque"
              disabled={loading}
              error={errors.name}
            />
          </FormField>

          {/* Ubicación GPS */}
          <FormField
            label="Ubicación GPS"
            required={true}
            error={errors.latitude || errors.longitude}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          >
            <MapboxLocationPicker
              latitude={formData.latitude}
              longitude={formData.longitude}
              onLocationChange={handleLocationChange}
              disabled={loading}
            />
          </FormField>

          {/* Campo Conexiones */}
          <FormField
            label="Conexiones"
            required={true}
            error={errors.connections}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            }
          >
            <textarea
              name="connections"
              value={formData.connections}
              onChange={handleChange}
              placeholder="Ingrese las conexiones del tanque..."
              disabled={loading}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:disabled:bg-gray-900 ${
                errors.connections ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
          </FormField>

          {/* Captura de Fotos */}
          <FormField
            label="Fotografías del Tanque"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          >
            <CameraCapture
              onPhotosChange={handlePhotosChange}
              maxPhotos={5}
              disabled={loading}
              initialPhotos={formData.photos}
            />
          </FormField>

        </div>

        {/* Botones */}
        <FormActions
          onCancel={onCancel}
          loading={loading}
          cancelText="Cancelar"
          submitText={isEdit ? "Actualizar Tanque" : "Crear Tanque"}
          loadingText={isEdit ? "Actualizando..." : "Creando..."}
        />
      </form>
    </FormContainer>
  );
}