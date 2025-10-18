import { useState } from 'react';
import FormContainer, { FormField, FormTextarea, FormSelect, FormActions } from '../ui/FormContainer';
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
    status: boolean;
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
    status: initialData?.status ?? true,
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
      status: formData.status,
      photography: formData.photography,
    };

    const success = await onSubmit(submitData);

    if (success && !isEdit) {
      // Limpiar formulario después del éxito solo si es creación
      setFormData({
        description: '',
        start_date: new Date().toISOString().slice(0, 16),
        end_date: new Date().toISOString().slice(0, 16),
        status: true,
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
      title={isEdit ? "Editar Intervención" : "Registrar Nueva Intervención"}
      subtitle={isEdit ? "Modifica la información de la intervención" : "Ingresa los detalles de la intervención realizada"}
      className={className}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Descripción */}
          <div className="md:col-span-2">
            <FormField
              label="Descripción de la Intervención"
              error={errors.description}
              required
            >
              <FormTextarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe detalladamente la intervención realizada..."
                rows={4}
              />
            </FormField>
          </div>

          {/* Fecha de inicio */}
          <FormField
            label="Fecha de Inicio"
            error={errors.start_date}
            required
          >
            <input
              type="datetime-local"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-0 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700"
            />
          </FormField>

          {/* Fecha de fin */}
          <FormField
            label="Fecha de Finalización"
            error={errors.end_date}
            required
          >
            <input
              type="datetime-local"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-0 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700"
            />
          </FormField>

          {/* Fotografías de la Intervención */}
          <div className="md:col-span-2">
            <FormField
              label="Fotografías de la Intervención"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            >
              <CameraCapture
                onPhotosChange={handlePhotosChange}
                maxPhotos={5}
                disabled={loading}
                initialPhotos={formData.photography}
              />
            </FormField>
          </div>

          {/* Estado */}
          <FormField
            label="Estado de la Intervención"
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



        {/* Acciones del formulario */}
        <FormActions
          onCancel={onCancel}
          loading={loading}
          submitText={isEdit ? "Actualizar Intervención" : "Registrar Intervención"}
          cancelText="Cancelar"
        />
      </form>
    </FormContainer>
  );
}
