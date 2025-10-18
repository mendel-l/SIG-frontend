import { useState } from 'react';
import FormContainer, { FormField, FormInput, FormTextarea, FormSelect, FormActions } from '../ui/FormContainer';

interface PermissionFormProps {
  onSubmit: (permissionData: {
    name: string;
    description: string;
    status: boolean;
  }) => Promise<boolean>;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
  initialData?: {
    name: string;
    description: string;
    status: boolean;
  } | null;
  isEdit?: boolean;
}

export default function PermissionForm({ 
  onSubmit, 
  onCancel, 
  loading = false, 
  className = '', 
  initialData = null, 
  isEdit = false 
}: PermissionFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    status: initialData?.status ?? true,
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Validación de formulario
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del permiso es obligatorio';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'El nombre no puede exceder 50 caracteres';
    }

    // Validar descripción
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    } else if (formData.description.trim().length < 5) {
      newErrors.description = 'La descripción debe tener al menos 5 caracteres';
    } else if (formData.description.trim().length > 200) {
      newErrors.description = 'La descripción no puede exceder 200 caracteres';
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
      description: formData.description.trim(),
      status: formData.status,
    });

    if (success && !isEdit) {
      // Limpiar formulario después del éxito solo si es creación
      setFormData({
        name: '',
        description: '',
        status: true,
      });
      setErrors({});
    }
  };

  // Manejar cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'status' ? value === '1' : value
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
      title={isEdit ? "Editar Permiso" : "Crear Nuevo Permiso"}
      subtitle={isEdit ? "Modifica la información del permiso" : "Ingresa los datos del nuevo permiso"}
      className={className}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Nombre del permiso */}
          <FormField
            label="Nombre del Permiso"
            error={errors.name}
            required
          >
            <FormInput
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: read_users, manage_tanks..."
            />
          </FormField>

          {/* Descripción */}
          <FormField
            label="Descripción"
            error={errors.description}
            required
          >
            <FormTextarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe qué permite hacer este permiso..."
              rows={3}
            />
          </FormField>

          {/* Estado */}
          <FormField
            label="Estado"
            error={errors.status}
            required
          >
            <FormSelect
              name="status"
              value={formData.status ? '1' : '0'}
              onChange={handleChange}
            >
              <option value="1">✅ Activo</option>
              <option value="0">❌ Inactivo</option>
            </FormSelect>
          </FormField>
        </div>

        {/* Información adicional para edición */}
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
                  Editando permiso existente
                </h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  <p>Los cambios afectarán a todos los roles que tengan este permiso asignado.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Acciones del formulario */}
        <FormActions
          onCancel={onCancel}
          loading={loading}
          submitText={isEdit ? "Actualizar Permiso" : "Crear Permiso"}
          cancelText="Cancelar"
        />
      </form>
    </FormContainer>
  );
}