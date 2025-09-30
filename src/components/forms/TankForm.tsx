import { useState } from 'react';
import CameraCapture from '../ui/CameraCapture';
import LocationPicker from '../ui/LocationPicker';

interface TankFormProps {
  onSubmit: (tankData: {
    name: string;
    latitude: number;
    longitude: number;
    connections: string;
    photos: string[];
    state: boolean;
  }) => Promise<boolean>;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
}

export default function TankForm({ onSubmit, onCancel, loading = false, className = '' }: TankFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    latitude: 0,
    longitude: 0,
    connections: '',
    photos: [] as string[],
    state: true, // Por defecto activo
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
      newErrors.connections = 'Las conexiones son obligatorias';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const success = await onSubmit({
        name: formData.name.trim(),
        latitude: formData.latitude,
        longitude: formData.longitude,
        connections: formData.connections.trim(),
        photos: formData.photos,
        state: formData.state,
      });

      if (success) {
        // Limpiar formulario en caso de éxito
        setFormData({
          name: '',
          latitude: 0,
          longitude: 0,
          connections: '',
          photos: [],
          state: true,
        });
        setErrors({});
      }
    } catch (error) {
      console.error('Error al crear tanque:', error);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className={`relative bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 shadow-xl rounded-2xl border border-blue-100 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Header con gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 dark:bg-white/20 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Crear Nuevo Tanque
              </h3>
              <p className="text-blue-100 dark:text-blue-200 text-sm">
                Registra un tanque de agua y su ubicación
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 dark:hover:bg-white/20 rounded-lg transition-all duration-200"
            disabled={loading}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre del Tanque */}
          <div className="group">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Nombre del Tanque *</span>
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-0 text-gray-900 dark:text-gray-100 ${
                  errors.name 
                    ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400 bg-red-50 dark:bg-red-900/20' 
                    : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                }`}
                placeholder="Ej: Tanque Central, Tanque Norte, Reservorio Principal"
                disabled={loading}
              />
              {errors.name && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.312 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              )}
            </div>
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Ubicación con Mapa Interactivo */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Ubicación del Tanque *</span>
              </span>
            </label>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-600">
              <LocationPicker
                latitude={formData.latitude}
                longitude={formData.longitude}
                onLocationChange={(lat: number, lng: number) => {
                  handleInputChange('latitude', lat);
                  handleInputChange('longitude', lng);
                  // Limpiar errores cuando se obtiene ubicación
                  if (errors.latitude || errors.longitude) {
                    setErrors(prev => ({
                      ...prev,
                      latitude: '',
                      longitude: ''
                    }));
                  }
                }}
                disabled={loading}
              />
              {(errors.latitude || errors.longitude) && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{errors.latitude || errors.longitude}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Conexiones */}
          <div className="group">
            <label htmlFor="connections" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span>Conexiones *</span>
              </span>
            </label>
            <div className="relative">
              <textarea
                id="connections"
                rows={3}
                value={formData.connections}
                onChange={(e) => handleInputChange('connections', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-0 text-gray-900 dark:text-gray-100 resize-none ${
                  errors.connections 
                    ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400 bg-red-50 dark:bg-red-900/20' 
                    : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                }`}
                placeholder="Describe las conexiones del tanque (tuberías, válvulas, etc.)"
                disabled={loading}
              />
              {errors.connections && (
                <div className="absolute right-3 top-3">
                  <svg className="w-5 h-5 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.312 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              )}
            </div>
            {errors.connections && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errors.connections}</span>
              </p>
            )}
          </div>

          {/* Fotografías */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Fotografías del Tanque (Opcional)</span>
              </span>
            </label>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-600">
              <CameraCapture
                onPhotosChange={(photos: string[]) => handleInputChange('photos', photos)}
                maxPhotos={5}
                disabled={loading}
                initialPhotos={formData.photos}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Captura hasta 5 fotografías del tanque desde la cámara de tu dispositivo. Las fotos se almacenarán de forma segura.
              </p>
            </div>
          </div>

          {/* Estado */}
          <div className="group">
            <label htmlFor="state" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Estado del Tanque</span>
              </span>
            </label>
            <select
              id="state"
              value={formData.state ? "true" : "false"}
              onChange={(e) => handleInputChange('state', e.target.value === "true")}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 hover:border-gray-300 dark:hover:border-gray-500 focus:outline-none focus:ring-0 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              disabled={loading}
            >
              <option value="true">✅ Activo</option>
              <option value="false">❌ Inactivo</option>
            </select>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700"
              disabled={loading}
            >
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Cancelar</span>
              </span>
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creando...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Crear Tanque</span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
            <div className="flex items-center space-x-3">
              <svg className="animate-spin w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Guardando tanque...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}