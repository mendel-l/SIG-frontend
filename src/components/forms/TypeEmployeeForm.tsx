import React, { useState } from 'react';
import { Briefcase } from 'lucide-react';
import { TypeEmployeeBase } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

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

  const iconBriefcase = <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              {iconBriefcase}
            </div>
            <div>
              <CardTitle>{initialData ? 'Editar Tipo de Empleado' : 'Nuevo Tipo de Empleado'}</CardTitle>
              <CardDescription>
                {initialData ? 'Modifica los detalles del tipo de empleado' : 'Registra un nuevo tipo de empleado en el sistema'}
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
          {/* Nombre */}
          <div>
            <Input
              label="Nombre del Tipo de Empleado"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ej: Técnico de Campo, Supervisor, Coordinador..."
              disabled={loading}
              error={errors.name}
              name="name"
              required
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {formData.name.length}/50 caracteres
            </p>
          </div>

          {/* Descripción */}
          <div>
            <Textarea
              label="Descripción"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe las funciones, responsabilidades y características de este tipo de empleado..."
              disabled={loading}
              error={errors.description}
              rows={4}
              name="description"
              required
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {formData.description.length}/255 caracteres
            </p>
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
              {initialData ? 'Actualizar Tipo' : 'Crear Tipo'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TypeEmployeeForm;
