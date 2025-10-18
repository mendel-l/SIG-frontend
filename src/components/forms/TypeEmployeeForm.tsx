import React, { useState } from 'react';
import { Briefcase, FileText, CheckCircle } from 'lucide-react';
import { TypeEmployeeBase } from '../../types';
import FormContainer, { FormField, FormInput, FormTextarea, FormSelect, FormActions } from '../ui/FormContainer';

interface TypeEmployeeFormProps {
  onSubmit: (data: TypeEmployeeBase) => Promise<boolean>;
  onCancel: () => void;
  loading?: boolean;
  initialData?: TypeEmployeeBase;
  className?: string;
}

const TypeEmployeeForm: React.FC<TypeEmployeeFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
  initialData,
  className = '',
}) => {
  const [formData, setFormData] = useState<TypeEmployeeBase>(
    initialData || {
      name: '',
      description: '',
      state: true,
    }
  );
  
  const [errors, setErrors] = useState<Partial<Record<keyof TypeEmployeeBase, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TypeEmployeeBase, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    } else if (formData.name.length > 50) {
      newErrors.name = 'El nombre no puede exceder 50 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData.description.length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    } else if (formData.description.length > 255) {
      newErrors.description = 'La descripción no puede exceder 255 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await onSubmit(formData);
    
    if (success) {
      // Limpiar el formulario después de enviar exitosamente
      setFormData({
        name: '',
        description: '',
        state: true,
      });
      setErrors({});
    }
  };

  const handleChange = (field: keyof TypeEmployeeBase, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar el error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const iconBriefcase = <Briefcase className="w-6 h-6 text-white" />;

  return (
    <FormContainer
      title={initialData ? 'Editar Tipo de Empleado' : 'Nuevo Tipo de Empleado'}
      subtitle={initialData ? 'Modifica los detalles del tipo de empleado' : 'Registra un nuevo tipo de empleado en el sistema'}
      icon={iconBriefcase}
      onCancel={onCancel}
      loading={loading}
      className={className}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre */}
        <FormField
          label="Nombre del Tipo de Empleado"
          icon={<Briefcase className="w-4 h-4" />}
          error={errors.name}
          required
        >
          <FormInput
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Ej: Técnico de Campo, Supervisor, Coordinador..."
            disabled={loading}
            error={errors.name}
            name="name"
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {formData.name.length}/50 caracteres
          </p>
        </FormField>

        {/* Descripción */}
        <FormField
          label="Descripción"
          icon={<FileText className="w-4 h-4" />}
          error={errors.description}
          required
        >
          <FormTextarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe las funciones, responsabilidades y características de este tipo de empleado..."
            disabled={loading}
            error={errors.description}
            rows={4}
            name="description"
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {formData.description.length}/255 caracteres
          </p>
        </FormField>

        {/* Estado */}
        <FormField
          label="Estado"
          icon={<CheckCircle className="w-4 h-4" />}
        >
          <FormSelect
            value={formData.state ? 1 : 0}
            onChange={(e) => handleChange('state', parseInt(e.target.value) === 1)}
            disabled={loading}
            name="state"
          >
            <option value={1}>✅ Activo</option>
            <option value={0}>❌ Inactivo</option>
          </FormSelect>
        </FormField>

        {/* Botones */}
        <FormActions
          onCancel={onCancel}
          loading={loading}
          cancelText="Cancelar"
          submitText={initialData ? 'Actualizar Tipo' : 'Crear Tipo'}
          loadingText={initialData ? 'Actualizando...' : 'Creando...'}
        />
      </form>
    </FormContainer>
  );
};

export default TypeEmployeeForm;
