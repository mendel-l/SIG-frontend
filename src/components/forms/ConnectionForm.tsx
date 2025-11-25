import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
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
    active?: boolean;
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
    active: initialData?.active ?? true,
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
        active: initialData.active ?? true,
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
        active: true,
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

  const connectionIcon = (
    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
    </svg>
  );

  const employeeOptions = [
    { value: '', label: 'Seleccione un empleado...' },
    ...employees.filter(emp => emp.active).map((employee) => ({
      value: employee.fullName,
      label: employee.fullName
    }))
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              {connectionIcon}
            </div>
            <div>
              <CardTitle>{isEdit ? "Editar Conexión" : "Registrar Nueva Conexión"}</CardTitle>
              <CardDescription>
                {isEdit ? "Modifica la información de la conexión" : "Ingresa los detalles de la conexión"}
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
            {/* Ubicación con Mapa */}
            <div className="md:col-span-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Ubicación de la Conexión <span className="text-red-500">*</span>
                </label>
                <div className="space-y-4">
                  {/* Campos de coordenadas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Latitud"
                      type="number"
                      name="latitude"
                      value={formData.latitude.toString()}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        setFormData(prev => ({ ...prev, latitude: value }));
                        if (errors.latitude) {
                          setErrors(prev => ({ ...prev, latitude: '' }));
                        }
                      }}
                      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                        const value = parseFloat(e.target.value) || 0;
                        if (value !== 0 && formData.longitude !== 0 && 
                            value >= -90 && value <= 90) {
                          handleLocationChange(value, formData.longitude);
                        }
                      }}
                      step="any"
                      placeholder={`Ej: ${PALESTINA_COORDS[1].toFixed(6)}`}
                      error={errors.latitude}
                      required
                    />
                    <Input
                      label="Longitud"
                      type="number"
                      name="longitude"
                      value={formData.longitude.toString()}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        setFormData(prev => ({ ...prev, longitude: value }));
                        if (errors.longitude) {
                          setErrors(prev => ({ ...prev, longitude: '' }));
                        }
                      }}
                      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                        const value = parseFloat(e.target.value) || 0;
                        if (formData.latitude !== 0 && value !== 0 && 
                            value >= -180 && value <= 180) {
                          handleLocationChange(formData.latitude, value);
                        }
                      }}
                      step="any"
                      placeholder={`Ej: ${PALESTINA_COORDS[0].toFixed(6)}`}
                      error={errors.longitude}
                      required
                    />
                  </div>
                  {/* Mapa */}
                  <MapboxLocationPicker
                    latitude={formData.latitude}
                    longitude={formData.longitude}
                    onLocationChange={handleLocationChange}
                  />
                </div>
                {(errors.latitude || errors.longitude) && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.latitude || errors.longitude}
                  </p>
                )}
              </div>
            </div>

            {/* Material */}
            <Input
              label="Material"
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
              placeholder="Ej: PVC, Hierro Fundido, Acero, Cobre..."
              error={errors.material}
              required
            />

            {/* Diámetro */}
            <Input
              label="Diámetro (mm)"
              type="number"
              name="diameter_mn"
              value={formData.diameter_mn.toString()}
              onChange={handleChange}
              placeholder="Ej: 150"
              error={errors.diameter_mn}
              required
            />

            {/* Presión Nominal */}
            <Input
              label="Presión Nominal"
              type="text"
              name="pressure_nominal"
              value={formData.pressure_nominal}
              onChange={handleChange}
              placeholder="Ej: PN-10, PN-16"
              error={errors.pressure_nominal}
              required
            />

            {/* Tipo de Conexión */}
            <Input
              label="Tipo de Conexión"
              type="text"
              name="connection_type"
              value={formData.connection_type}
              onChange={handleChange}
              placeholder="Ej: T, Codo, Cruz, Reducción, Brida, Válvula..."
              error={errors.connection_type}
              required
            />

            {/* Profundidad */}
            <Input
              label="Profundidad (m)"
              type="number"
              name="depth_m"
              value={formData.depth_m.toString()}
              onChange={handleChange}
              placeholder="Ej: 1.5"
              error={errors.depth_m}
              required
            />

            {/* Fecha de Instalación */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Fecha de Instalación <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="installed_date"
                value={formData.installed_date}
                onChange={handleChange}
                className={`input w-full ${errors.installed_date ? 'border-red-500' : ''}`}
              />
              {errors.installed_date && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.installed_date}</p>
              )}
            </div>

            {/* Instalado por */}
            <Select
              label="Instalado por"
              name="installed_by"
              value={formData.installed_by}
              onChange={handleChange}
              options={employeeOptions}
              error={errors.installed_by}
            />

            {/* Descripción */}
            <div className="md:col-span-2">
              <Textarea
                label="Descripción"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Observaciones o notas adicionales sobre la conexión..."
                rows={3}
                error={errors.description}
              />
            </div>
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
              {isEdit ? "Actualizar Conexión" : "Registrar Conexión"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
