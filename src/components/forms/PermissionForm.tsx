import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

interface PermissionFormProps {
  onSubmit: (permissionData: {
    name: string;
    description: string;
  }) => Promise<boolean>;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
  initialData?: {
    name: string;
    description: string;
    status?: boolean;
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
    });

    if (success && !isEdit) {
      // Limpiar formulario después del éxito solo si es creación
      setFormData({
        name: '',
        description: '',
      });
      setErrors({});
    }
  };

  // Manejar cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error específico cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const permissionIcon = (
    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              {permissionIcon}
            </div>
            <div>
              <CardTitle>{isEdit ? "Editar Permiso" : "Crear Nuevo Permiso"}</CardTitle>
              <CardDescription>
                {isEdit ? "Modifica la información del permiso" : "Ingresa los datos del nuevo permiso"}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Nombre del permiso */}
            <Input
              label="Nombre del Permiso"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: read_users, manage_tanks..."
              error={errors.name}
              required
            />

            {/* Descripción */}
            <div className="md:col-span-2">
              <Textarea
                label="Descripción"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe qué permite hacer este permiso..."
                rows={3}
                error={errors.description}
                required
              />
            </div>
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
              {isEdit ? "Actualizar Permiso" : "Crear Permiso"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
