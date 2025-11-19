import React, { useState } from 'react';
import { RolBase } from '../../types';
import FormContainer, { FormField, FormInput, FormTextarea, FormSelect, FormActions } from '../ui/FormContainer';

interface RoleFormProps {
  onSubmit: (roleData: RolBase) => Promise<boolean>;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
}

const RoleForm: React.FC<RoleFormProps> = ({ onSubmit, onCancel, loading = false, className = '' }) => {
  const [formData, setFormData] = useState<RolBase>({
    name: '',
    description: '',
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    } else if (formData.description.trim().length < 5) {
      newErrors.description = 'La descripción debe tener al menos 5 caracteres';
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
      name: formData.name.trim(),
      description: formData.description.trim(),
    });

    if (success) {
      // Limpiar el formulario después del éxito
      setFormData({
        name: '',
        description: '',
      });
      setErrors({});
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const roleIcon = (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4" />
    </svg>
  );

  return (
    <FormContainer
      title="Crear Nuevo Rol"
      subtitle="Define los permisos y responsabilidades"
      icon={roleIcon}
      onCancel={onCancel}
      loading={loading}
      className={className}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Nombre del Rol */}
          <FormField
            label="Nombre del Rol"
            required={true}
            error={errors.name}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          >
            <FormInput
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Administrador, Editor, Viewer"
              disabled={loading}
              error={errors.name}
            />
          </FormField>

          {/* Descripción */}
          <FormField
            label="Descripción"
            required={true}
            error={errors.description}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          >
            <FormTextarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe los permisos y responsabilidades de este rol..."
              disabled={loading}
              error={errors.description}
              rows={4}
            />
          </FormField>

        </div>

        {/* Botones */}
        <FormActions
          onCancel={onCancel}
          loading={loading}
          cancelText="Cancelar"
          submitText="Crear Rol"
          loadingText="Creando..."
        />
      </form>
    </FormContainer>
  );
};

export default RoleForm;