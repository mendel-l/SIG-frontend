import { useState } from 'react';
import FormContainer, { FormField, FormInput, FormTextarea, FormSelect, FormActions } from '../ui/FormContainer';

interface PipeFormProps {
  onSubmit: (pipeData: {
    material: string;
    diameter: number;
    length: number;
    status: boolean;
    installationDate: string;
    location: string;
    observations?: string;
  }) => Promise<boolean>;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
  initialData?: {
    material: string;
    diameter: number;
    length: number;
    status: boolean;
    installationDate: string;
    location: string;
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
    length: initialData?.length || 0,
    status: initialData?.status ?? true,
    installationDate: initialData?.installationDate || new Date().toISOString().split('T')[0],
    location: initialData?.location || '',
    observations: initialData?.observations || '',
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Opciones de materiales comunes para tuberías
  const materialOptions = [
    { value: '', label: 'Seleccionar material...' },
    { value: 'PVC', label: 'PVC (Cloruro de Polivinilo)' },
    { value: 'Hierro Galvanizado', label: 'Hierro Galvanizado' },
    { value: 'Polietileno', label: 'Polietileno (HDPE)' },
    { value: 'Cobre', label: 'Cobre' },
    { value: 'Acero Inoxidable', label: 'Acero Inoxidable' },
    { value: 'Hierro Fundido', label: 'Hierro Fundido' },
    { value: 'Concreto', label: 'Concreto/Hormigón' },
  ];

  // Validación de formulario
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Validar material
    if (!formData.material.trim()) {
      newErrors.material = 'El material es obligatorio';
    }

    // Validar diámetro
    if (formData.diameter <= 0) {
      newErrors.diameter = 'El diámetro debe ser mayor a 0';
    } else if (formData.diameter > 2000) {
      newErrors.diameter = 'El diámetro no puede exceder 2000mm';
    }

    // Validar longitud
    if (formData.length <= 0) {
      newErrors.length = 'La longitud debe ser mayor a 0';
    } else if (formData.length > 10000) {
      newErrors.length = 'La longitud no puede exceder 10,000 metros';
    }

    // Validar fecha de instalación
    if (!formData.installationDate) {
      newErrors.installationDate = 'La fecha de instalación es obligatoria';
    } else {
      const installDate = new Date(formData.installationDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Final del día
      
      if (installDate > today) {
        newErrors.installationDate = 'La fecha de instalación no puede ser futura';
      }
    }

    // Validar ubicación
    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación es obligatoria';
    } else if (formData.location.trim().length < 5) {
      newErrors.location = 'La ubicación debe tener al menos 5 caracteres';
    } else if (formData.location.trim().length > 200) {
      newErrors.location = 'La ubicación no puede exceder 200 caracteres';
    }

    // Validar observaciones (opcional)
    if (formData.observations && formData.observations.length > 500) {
      newErrors.observations = 'Las observaciones no pueden exceder 500 caracteres';
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
      material: formData.material.trim(),
      diameter: formData.diameter,
      length: formData.length,
      status: formData.status,
      installationDate: formData.installationDate,
      location: formData.location.trim(),
      observations: formData.observations.trim(),
    });

    if (success && !isEdit) {
      // Limpiar formulario después del éxito solo si es creación
      setFormData({
        material: '',
        diameter: 0,
        length: 0,
        status: true,
        installationDate: new Date().toISOString().split('T')[0],
        location: '',
        observations: '',
      });
      setErrors({});
    }
  };

  // Manejar cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0
             : name === 'status' ? value === 'true'
             : value
    }));

    // Limpiar error específico cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <FormContainer
      title={isEdit ? "Editar Tubería" : "Registrar Nueva Tubería"}
      subtitle={isEdit ? "Modifica la información de la tubería" : "Ingresa los datos de la nueva tubería del sistema"}
      className={className}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Material */}
          <FormField
            label="Material"
            error={errors.material}
            required
          >
            <FormSelect
              name="material"
              value={formData.material}
              onChange={handleChange}
            >
              {materialOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormSelect>
          </FormField>

          {/* Diámetro */}
          <FormField
            label="Diámetro (mm)"
            error={errors.diameter}
            required
          >
            <FormInput
              type="number"
              name="diameter"
              value={formData.diameter.toString()}
              onChange={handleChange}
              placeholder="150"
            />
          </FormField>

          {/* Longitud */}
          <FormField
            label="Longitud (metros)"
            error={errors.length}
            required
          >
            <FormInput
              type="number"
              name="length"
              value={formData.length.toString()}
              onChange={handleChange}
              placeholder="100.5"
            />
          </FormField>

          {/* Fecha de instalación */}
          <FormField
            label="Fecha de Instalación"
            error={errors.installationDate}
            required
          >
            <FormInput
              type="text"
              name="installationDate"
              value={formData.installationDate}
              onChange={handleChange}
              placeholder="YYYY-MM-DD"
            />
          </FormField>

          {/* Estado */}
          <FormField
            label="Estado Operacional"
            error={errors.status}
          >
            <FormSelect
              name="status"
              value={formData.status.toString()}
              onChange={handleChange}
            >
              <option value="true">🟢 Operacional</option>
              <option value="false">🔴 Fuera de Servicio</option>
            </FormSelect>
          </FormField>
        </div>

        {/* Ubicación - Campo completo */}
        <FormField
          label="Ubicación/Dirección"
          error={errors.location}
          required
        >
          <FormInput
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Ej: Calle Principal entre 1ra y 2da Avenida, Sector Norte"
          />
        </FormField>

        {/* Observaciones */}
        <FormField
          label="Observaciones"
          error={errors.observations}
        >
          <FormTextarea
            name="observations"
            value={formData.observations}
            onChange={handleChange}
            placeholder="Notas adicionales sobre el estado, mantenimiento, o características especiales..."
            rows={4}
          />
        </FormField>

        {/* Información técnica para edición */}
        {isEdit && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Editando tubería existente
                </h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  <p>Los cambios en las especificaciones técnicas pueden afectar el sistema de distribución de agua.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Acciones del formulario */}
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