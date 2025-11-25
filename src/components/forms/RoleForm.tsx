import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
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
    active: boolean;
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
    active: initialData?.active ?? true,
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
        active: initialData.active ?? true,
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
      active: formData.active,
      permission_ids: selectedPermissionIds,
    };

    const success = await onSubmit(roleData);

    if (success && !isEdit) {
      // Limpiar el formulario después del éxito solo si es creación
      setFormData({
        name: '',
        description: '',
        active: true,
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
    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4" />
    </svg>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              {roleIcon}
            </div>
            <div>
              <CardTitle>{isEdit ? "Editar Rol" : "Crear Nuevo Rol"}</CardTitle>
              <CardDescription>
                Define los permisos y responsabilidades del rol
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
          {/* Nombre del Rol */}
          <Input
            label="Nombre del Rol"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej: Administrador, Editor, Viewer"
            disabled={loading}
            error={errors.name}
            required
          />

          {/* Descripción */}
          <Textarea
            label="Descripción"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            placeholder="Describe los permisos y responsabilidades de este rol..."
            disabled={loading}
            error={errors.description}
            rows={3}
            required
          />

          {/* Estado */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Estado
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                disabled={loading}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {formData.active ? 'Activo' : 'Inactivo'}
              </span>
            </label>
          </div>

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
              {isEdit ? "Actualizar Rol" : "Crear Rol"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RoleForm;
