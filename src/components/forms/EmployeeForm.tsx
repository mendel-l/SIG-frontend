import { useState } from 'react';
import FormContainer, { FormField, FormInput, FormSelect, FormActions } from '../ui/FormContainer';

interface EmployeeFormProps {
  onSubmit: (employeeData: {
    first_name: string;
    last_name: string;
    phone_number: string;
    state: boolean;
  }) => Promise<boolean>;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
  initialData?: {
    first_name: string;
    last_name: string;
    phone_number: string;
    state: boolean;
  } | null;
  isEdit?: boolean;
}

export default function EmployeeForm({ 
  onSubmit, 
  onCancel, 
  loading = false, 
  className = '', 
  initialData = null, 
  isEdit = false 
}: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    phone_number: initialData?.phone_number || '',
    state: initialData?.state ?? true, // Por defecto activo
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Validación de formulario
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Validar nombre
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'El nombre es obligatorio';
    } else if (formData.first_name.trim().length < 2) {
      newErrors.first_name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar apellido
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'El apellido es obligatorio';
    } else if (formData.last_name.trim().length < 2) {
      newErrors.last_name = 'El apellido debe tener al menos 2 caracteres';
    }

    // Validar teléfono
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'El teléfono es obligatorio';
    } else if (!/^\d{8,15}$/.test(formData.phone_number.replace(/[\s-]/g, ''))) {
      newErrors.phone_number = 'El teléfono debe tener entre 8 y 15 dígitos';
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
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      phone_number: formData.phone_number.trim(),
      state: formData.state,
    });

    if (success && !isEdit) {
      // Limpiar formulario después del éxito solo si es creación
      setFormData({
        first_name: '',
        last_name: '',
        phone_number: '',
        state: true,
      });
      setErrors({});
    }
  };

  // Manejar cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked
             : name === 'state' ? value === 'true'
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

  const employeeIcon = (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  return (
    <FormContainer
      title={isEdit ? "Editar Empleado" : "Crear Nuevo Empleado"}
      subtitle={isEdit ? "Modifica la información del empleado" : "Registra la información básica del empleado"}
      icon={employeeIcon}
      onCancel={onCancel}
      loading={loading}
      className={className}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Campo Nombre */}
          <FormField
            label="Nombre"
            required={true}
            error={errors.first_name}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          >
            <FormInput
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Ingrese el nombre del empleado"
              disabled={loading}
              error={errors.first_name}
            />
          </FormField>

          {/* Campo Apellido */}
          <FormField
            label="Apellido"
            required={true}
            error={errors.last_name}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          >
            <FormInput
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Ingrese el apellido del empleado"
              disabled={loading}
              error={errors.last_name}
            />
          </FormField>

          {/* Campo Teléfono */}
          <FormField
            label="Número de Teléfono"
            required={true}
            error={errors.phone_number}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }
          >
            <FormInput
              name="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Ej: 12345678 o +123-456-7890"
              disabled={loading}
              error={errors.phone_number}
            />
          </FormField>

          {/* Campo Estado */}
          <FormField
            label="Estado"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          >
            <FormSelect
              name="state"
              value={formData.state.toString()}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="true">✅ Activo</option>
              <option value="false">❌ Inactivo</option>
            </FormSelect>
          </FormField>
        </div>

        {/* Botones */}
        <FormActions
          onCancel={onCancel}
          loading={loading}
          cancelText="Cancelar"
          submitText={isEdit ? "Actualizar Empleado" : "Crear Empleado"}
          loadingText={isEdit ? "Actualizando..." : "Creando..."}
        />
      </form>
    </FormContainer>
  );
}