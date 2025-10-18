import { useState } from 'react';
import FormContainer, { FormField, FormInput, FormTextarea, FormSelect, FormActions } from '../ui/FormContainer';
import LocationPicker from '../ui/LocationPicker';

interface PipeFormProps {
  onSubmit: (pipeData: {
    material: string;
    diameter: number;
    size: number;
    status: boolean;
    installation_date: string;
    latitude: number;
    longitude: number;
    observations?: string;
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
    latitude: number;
    longitude: number;
    observations?: string;
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
  const [formData, setFormData] = useState({
    material: initialData?.material || '',
    diameter: initialData?.diameter || 0,
    size: initialData?.size || 0,
    status: initialData?.status ?? true,
    installation_date: initialData?.installation_date || new Date().toISOString().slice(0, 16),
    latitude: initialData?.latitude || 0,
    longitude: initialData?.longitude || 0,
    observations: initialData?.observations || '',
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

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

    if (formData.latitude < -90 || formData.latitude > 90) {
      newErrors.latitude = 'La latitud debe estar entre -90 y 90';
    }

    if (formData.longitude < -180 || formData.longitude > 180) {
      newErrors.longitude = 'La longitud debe estar entre -180 y 180';
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

    const success = await onSubmit({
      material: formData.material.trim(),
      diameter: formData.diameter,
      size: formData.size,
      status: formData.status,
      installation_date: formData.installation_date,
      latitude: formData.latitude,
      longitude: formData.longitude,
      observations: formData.observations.trim(),
    });

    if (success && !isEdit) {
      setFormData({
        material: '',
        diameter: 0,
        size: 0,
        status: true,
        installation_date: new Date().toISOString().slice(0, 16),
        latitude: 0,
        longitude: 0,
        observations: '',
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

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
    setErrors(prev => ({ ...prev, latitude: '', longitude: '' }));
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
        </div>

        <FormField label="Coordenadas" error={errors.latitude || errors.longitude}>
          <LocationPicker
            latitude={formData.latitude}
            longitude={formData.longitude}
            onLocationChange={handleLocationChange}
          />
        </FormField>

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
