import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import CameraCapture from '../ui/CameraCapture';

interface InterventionFormProps {
  onSubmit: (interventionData: {
    description: string;
    start_date: string;
    end_date: string;
    status: boolean;
    photography?: string[];
  }) => Promise<boolean>;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
  initialData?: {
    description: string;
    start_date: string;
    end_date: string;
    status?: boolean;
    photography?: string[];
  } | null;
  isEdit?: boolean;
}

export default function InterventionForm({ 
  onSubmit, 
  onCancel, 
  loading = false, 
  className = '', 
  initialData = null, 
  isEdit = false 
}: InterventionFormProps) {
  const [formData, setFormData] = useState({
    description: initialData?.description || '',
    start_date: initialData?.start_date || new Date().toISOString().slice(0, 16),
    end_date: initialData?.end_date || new Date().toISOString().slice(0, 16),
    photography: initialData?.photography || [],
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Handler para cambio de fotos
  const handlePhotosChange = (photos: string[]) => {
    setFormData(prev => ({
      ...prev,
      photography: photos
    }));
  };

  // Validación de formulario
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Validar descripción
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    } else if (formData.description.trim().length > 200) {
      newErrors.description = 'La descripción no puede exceder 200 caracteres';
    }

    // Validar fechas
    if (!formData.start_date) {
      newErrors.start_date = 'La fecha de inicio es obligatoria';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'La fecha de fin es obligatoria';
    }

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      if (endDate < startDate) {
        newErrors.end_date = 'La fecha de fin debe ser posterior a la fecha de inicial';
      }
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

    // Preparar datos
    const submitData = {
      description: formData.description.trim(),
      start_date: formData.start_date,
      end_date: formData.end_date,
      status: initialData?.status ?? true,
      photography: formData.photography,
    };

    const success = await onSubmit(submitData);

    if (success && !isEdit) {
      // Limpiar formulario después del éxito solo si es creación
      setFormData({
        description: '',
        start_date: new Date().toISOString().slice(0, 16),
        end_date: new Date().toISOString().slice(0, 16),
        photography: [],
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

  const interventionIcon = (
    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              {interventionIcon}
            </div>
            <div>
              <CardTitle>{isEdit ? "Editar Intervención" : "Registrar Nueva Intervención"}</CardTitle>
              <CardDescription>
                {isEdit ? "Modifica la información de la intervención" : "Ingresa los detalles de la intervención realizada"}
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
            {/* Descripción */}
            <div className="md:col-span-2">
              <Textarea
                label="Descripción de la Intervención"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe detalladamente la intervención realizada..."
                rows={4}
                error={errors.description}
                required
              />
            </div>

            {/* Fecha de inicio */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Fecha de Inicio <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className={`input w-full ${errors.start_date ? 'border-red-500' : ''}`}
              />
              {errors.start_date && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.start_date}</p>
              )}
            </div>

            {/* Fecha de fin */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Fecha de Finalización <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className={`input w-full ${errors.end_date ? 'border-red-500' : ''}`}
              />
              {errors.end_date && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.end_date}</p>
              )}
            </div>

            {/* Fotografías de la Intervención */}
            <div className="md:col-span-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Fotografías de la Intervención
                </label>
                <CameraCapture
                  onPhotosChange={handlePhotosChange}
                  maxPhotos={5}
                  disabled={loading}
                  initialPhotos={formData.photography}
                />
              </div>
            </div>
          </div>

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
              {isEdit ? "Actualizar Intervención" : "Registrar Intervención"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
