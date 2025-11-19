import React, { useState, useEffect } from 'react';
import FormContainer, { FormField, FormInput, FormTextarea, FormActions } from '../ui/FormContainer';
import PermissionSelector from './PermissionSelector';
import { useGroupedPermissions } from '../../queries/rolesQueries';
import { RolCreate, RolUpdate } from '../../queries/rolesQueries';

interface RoleFormProps {
  onSubmit: (roleData: RolCreate | RolUpdate) => Promise<boolean>;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
  initialData?: {
    id_rol?: number;
    name: string;
    description?: string | null;
    status: boolean;
    permission_ids?: number[];
  };
  isEdit?: boolean;
}

const RoleForm: React.FC<RoleFormProps> = ({ 
  onSubmit, 
  onCancel, 
  loading = false, 
  className = '',
  initialData,
  isEdit = false
}) => {
  const { data: groupedPermissions, isLoading: loadingPermissions } = useGroupedPermissions();
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    status: initialData?.status ?? true,
  });
  
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>(
    initialData?.permission_ids || []
  );
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Actualizar formulario cuando cambian los datos iniciales
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        status: initialData.status ?? true,
      });
      setSelectedPermissionIds(initialData.permission_ids || []);
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.description?.trim()) {
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

    const roleData: RolCreate | RolUpdate = {
      name: formData.name.trim(),
      description: formData.description?.trim() || null,
      status: formData.status,
      permission_ids: selectedPermissionIds,
    };

    const success = await onSubmit(roleData);

    if (success && !isEdit) {
      // Limpiar el formulario después del éxito solo si es creación
      setFormData({
        name: '',
        description: '',
        status: true,
      });
      setSelectedPermissionIds([]);
      setErrors({});
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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
      title={isEdit ? "Editar Rol" : "Crear Nuevo Rol"}
      subtitle="Define los permisos y responsabilidades del rol"
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
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Describe los permisos y responsabilidades de este rol..."
              disabled={loading}
              error={errors.description}
              rows={3}
            />
          </FormField>

          {/* Estado */}
          <FormField
            label="Estado"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          >
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleChange}
                disabled={loading}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {formData.status ? 'Activo' : 'Inactivo'}
              </span>
            </label>
          </FormField>

          {/* Selector de Permisos */}
          {loadingPermissions ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando permisos...</span>
            </div>
          ) : groupedPermissions ? (
            <PermissionSelector
              groupedPermissions={groupedPermissions}
              selectedPermissionIds={selectedPermissionIds}
              onSelectionChange={setSelectedPermissionIds}
              loading={loading}
            />
          ) : (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              No se pudieron cargar los permisos
            </div>
          )}
        </div>

        {/* Botones */}
        <FormActions
          onCancel={onCancel}
          loading={loading}
          cancelText="Cancelar"
          submitText={isEdit ? "Actualizar Rol" : "Crear Rol"}
          loadingText={isEdit ? "Actualizando..." : "Creando..."}
        />
      </form>
    </FormContainer>
  );
};

export default RoleForm;
