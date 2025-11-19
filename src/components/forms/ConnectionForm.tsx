import { useState, useEffect } from 'react';
import FormContainer, { FormField, FormInput, FormTextarea, FormSelect, FormActions } from '../ui/FormContainer';
import MapboxLocationPicker from '../ui/MapboxLocationPicker';
import { useEmployees } from '@/queries/employeesQueries';
import { PALESTINA_COORDS } from '@/config/mapbox';

interface ConnectionFormProps {
  onSubmit: (connectionData: {
    latitude: number;
    longitude: number;
    material: string;
    diameter_mn: number;
    pressure_nominal: string;
    connection_type: string;
    depth_m: number;
    installed_date: string;
    installed_by?: string;
    description?: string;
    pipe_ids?: number[];
  }) => Promise<boolean>;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
  initialData?: {
    latitude: number;
    longitude: number;
    material: string;
    diameter_mn: number;
    pressure_nominal: string;
    connection_type: string;
    depth_m: number;
    installed_date: string;
    installed_by?: string;
    description?: string;
    state?: boolean;
  } | null;
  isEdit?: boolean;
}

export default function ConnectionForm({
  onSubmit,
  onCancel,
  loading = false,
  className = '',
  initialData = null,
  isEdit = false
}: ConnectionFormProps) {
  const { data: employeesData } = useEmployees(1, 100);
  const employees = employeesData?.items || [];
  
  const [formData, setFormData] = useState({
    latitude: initialData?.latitude || PALESTINA_COORDS[1],
    longitude: initialData?.longitude || PALESTINA_COORDS[0],
    material: initialData?.material || '',
    diameter_mn: initialData?.diameter_mn || 0,
    pressure_nominal: initialData?.pressure_nominal || '',
    connection_type: initialData?.connection_type || '',
    depth_m: initialData?.depth_m || 0,
    installed_date: initialData?.installed_date || new Date().toISOString().slice(0, 16),
    installed_by: initialData?.installed_by || '',
    description: initialData?.description || '',
    state: initialData?.state ?? true,
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Actualizar formulario cuando cambian los datos iniciales (modo edición)
  useEffect(() => {
    if (initialData) {
      setFormData({
        latitude: initialData.latitude,
        longitude: initialData.longitude,
        material: initialData.material || '',
        diameter_mn: initialData.diameter_mn || 0,
        pressure_nominal: initialData.pressure_nominal || '',
        connection_type: initialData.connection_type || '',
        depth_m: initialData.depth_m || 0,
        installed_date: initialData.installed_date || new Date().toISOString().slice(0, 16),
        installed_by: initialData.installed_by || '',
        description: initialData.description || '',
        state: initialData.state ?? true,
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Validar coordenadas
    if (formData.latitude < -90 || formData.latitude > 90) {
      newErrors.latitude = 'La latitud debe estar entre -90 y 90';
    }
    if (formData.longitude < -180 || formData.longitude > 180) {
      newErrors.longitude = 'La longitud debe estar entre -180 y 180';
    }

    // Validar material
    if (!formData.material.trim()) {
      newErrors.material = 'El material es obligatorio';
    }

    // Validar diámetro
    if (formData.diameter_mn <= 0) {
      newErrors.diameter_mn = 'El diámetro debe ser mayor a 0';
    }

    // Validar presión nominal
    if (!formData.pressure_nominal.trim()) {
      newErrors.pressure_nominal = 'La presión nominal es obligatoria';
    }

    // Validar tipo de conexión
    if (!formData.connection_type.trim()) {
      newErrors.connection_type = 'El tipo de conexión es obligatorio';
    }

    // Validar profundidad
    if (formData.depth_m < 0) {
      newErrors.depth_m = 'La profundidad no puede ser negativa';
    }

    // Validar fecha
    if (!formData.installed_date) {
      newErrors.installed_date = 'La fecha de instalación es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      latitude: formData.latitude,
      longitude: formData.longitude,
      material: formData.material.trim(),
      diameter_mn: formData.diameter_mn,
      pressure_nominal: formData.pressure_nominal.trim(),
      connection_type: formData.connection_type.trim(),
      depth_m: formData.depth_m,
      installed_date: formData.installed_date,
      installed_by: formData.installed_by.trim() || undefined,
      description: formData.description.trim() || undefined,
    };

    const success = await onSubmit(submitData);

    if (success && !isEdit) {
      setFormData({
        latitude: PALESTINA_COORDS[1],
        longitude: PALESTINA_COORDS[0],
        material: '',
        diameter_mn: 0,
        pressure_nominal: '',
        state: true,
        connection_type: '',
        depth_m: 0,
        installed_date: new Date().toISOString().slice(0, 16),
        installed_by: '',
        description: '',
      });
      setErrors({});
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'diameter_mn' || name === 'depth_m' ? parseFloat(value) || 0 :
              value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
    
    if (errors.latitude) setErrors(prev => ({ ...prev, latitude: '' }));
    if (errors.longitude) setErrors(prev => ({ ...prev, longitude: '' }));
  };

  return (
    <FormContainer
      title={isEdit ? "Editar Conexión" : "Registrar Nueva Conexión"}
      subtitle={isEdit ? "Modifica la información de la conexión" : "Ingresa los detalles de la conexión"}
      className={className}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ubicación con Mapa */}
          <div className="md:col-span-2">
            <FormField
              label="Ubicación de la Conexión"
              error={errors.latitude || errors.longitude}
              required
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            >
              <div className="space-y-4">
                {/* Campos de coordenadas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Latitud" error={errors.latitude} required>
                    <FormInput
                      type="number"
                      name="latitude"
                      value={formData.latitude.toString()}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        setFormData(prev => ({
                          ...prev,
                          latitude: value
                        }));
                        if (errors.latitude) {
                          setErrors(prev => ({ ...prev, latitude: '' }));
                        }
                      }}
                      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                        // Actualizar mapa cuando el usuario termina de escribir
                        const value = parseFloat(e.target.value) || 0;
                        if (value !== 0 && formData.longitude !== 0 && 
                            value >= -90 && value <= 90) {
                          handleLocationChange(value, formData.longitude);
                        }
                      }}
                      step="any"
                      placeholder={`Ej: ${PALESTINA_COORDS[1].toFixed(6)}`}
                    />
                  </FormField>
                  <FormField label="Longitud" error={errors.longitude} required>
                    <FormInput
                      type="number"
                      name="longitude"
                      value={formData.longitude.toString()}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        setFormData(prev => ({
                          ...prev,
                          longitude: value
                        }));
                        if (errors.longitude) {
                          setErrors(prev => ({ ...prev, longitude: '' }));
                        }
                      }}
                      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                        // Actualizar mapa cuando el usuario termina de escribir
                        const value = parseFloat(e.target.value) || 0;
                        if (formData.latitude !== 0 && value !== 0 && 
                            value >= -180 && value <= 180) {
                          handleLocationChange(formData.latitude, value);
                        }
                      }}
                      step="any"
                      placeholder={`Ej: ${PALESTINA_COORDS[0].toFixed(6)}`}
                    />
                  </FormField>
                </div>
                {/* Mapa */}
                <MapboxLocationPicker
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  onLocationChange={handleLocationChange}
                />
              </div>
            </FormField>
          </div>

          {/* Material */}
          <FormField label="Material" error={errors.material} required>
            <FormInput
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
              placeholder="Ej: PVC, Hierro Fundido, Acero, Cobre..."
            />
          </FormField>

          {/* Diámetro */}
          <FormField label="Diámetro (mm)" error={errors.diameter_mn} required>
            <FormInput
              type="number"
              name="diameter_mn"
              value={formData.diameter_mn.toString()}
              onChange={handleChange}
              placeholder="Ej: 150"
            />
          </FormField>

          {/* Presión Nominal */}
          <FormField label="Presión Nominal" error={errors.pressure_nominal} required>
            <FormInput
              type="text"
              name="pressure_nominal"
              value={formData.pressure_nominal}
              onChange={handleChange}
              placeholder="Ej: PN-10, PN-16"
            />
          </FormField>

          {/* Tipo de Conexión */}
          <FormField label="Tipo de Conexión" error={errors.connection_type} required>
            <FormInput
              type="text"
              name="connection_type"
              value={formData.connection_type}
              onChange={handleChange}
              placeholder="Ej: T, Codo, Cruz, Reducción, Brida, Válvula..."
            />
          </FormField>

          {/* Profundidad */}
          <FormField label="Profundidad (m)" error={errors.depth_m} required>
            <FormInput
              type="number"
              name="depth_m"
              value={formData.depth_m.toString()}
              onChange={handleChange}
              placeholder="Ej: 1.5"
            />
          </FormField>

          {/* Fecha de Instalación */}
          <FormField label="Fecha de Instalación" error={errors.installed_date} required>
            <input
              type="datetime-local"
              name="installed_date"
              value={formData.installed_date}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-0 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700"
            />
          </FormField>

          {/* Instalado por */}
          <FormField label="Instalado por" error={errors.installed_by}>
            <FormSelect
              name="installed_by"
              value={formData.installed_by}
              onChange={handleChange}
            >
              <option value="">Seleccione un empleado...</option>
              {employees
                .filter(emp => emp.state) // Solo empleados activos
                .map((employee) => (
                  <option key={employee.id} value={employee.fullName}>
                    {employee.fullName}
                  </option>
                ))}
            </FormSelect>
          </FormField>

          {/* Descripción */}
          <div className="md:col-span-2">
            <FormField label="Descripción" error={errors.description}>
              <FormTextarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Observaciones o notas adicionales sobre la conexión..."
                rows={3}
              />
            </FormField>
          </div>
        </div>

        <FormActions
          onCancel={onCancel}
          loading={loading}
          submitText={isEdit ? "Actualizar Conexión" : "Registrar Conexión"}
          cancelText="Cancelar"
        />
      </form>
    </FormContainer>
  );
}
