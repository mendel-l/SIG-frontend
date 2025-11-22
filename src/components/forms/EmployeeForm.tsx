import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useTypeEmployees } from '@/queries/typeEmployeeQueries';

interface EmployeeFormProps {
  onSubmit: (employeeData: {
    first_name: string;
    last_name: string;
    phone_number: string;
    id_type_employee: number;
    state: boolean;
  }) => Promise<boolean>;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
  initialData?: {
    first_name: string;
    last_name: string;
    phone_number: string;
    id_type_employee: number;
    state?: boolean;
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
  // ✅ Usar TanStack Query en lugar de store
  const { data: typeEmployeesData } = useTypeEmployees(1, 10000);
  const typeEmployees = typeEmployeesData?.items || [];
  
  const [formData, setFormData] = useState({
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    phone_number: initialData?.phone_number || '',
    id_type_employee: initialData?.id_type_employee || 0,
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

    // Validar tipo de empleado
    if (!formData.id_type_employee || formData.id_type_employee === 0) {
      newErrors.id_type_employee = 'Debe seleccionar un tipo de empleado';
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
      id_type_employee: formData.id_type_employee,
      state: initialData?.state ?? true,
    });

    if (success && !isEdit) {
      // Limpiar formulario después del éxito solo si es creación
      setFormData({
        first_name: '',
        last_name: '',
        phone_number: '',
        id_type_employee: 0,
      });
      setErrors({});
    }
  };

  // Manejar cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
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
    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  const typeEmployeeOptions = [
    { value: '0', label: 'Seleccione un tipo de empleado' },
    ...typeEmployees.filter(type => type.state).map((type) => ({
      value: type.id_type_employee.toString(),
      label: type.name
    }))
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              {employeeIcon}
            </div>
            <div>
              <CardTitle>{isEdit ? "Editar Empleado" : "Crear Nuevo Empleado"}</CardTitle>
              <CardDescription>
                {isEdit ? "Modifica la información del empleado" : "Registra la información básica del empleado"}
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
          {/* Campo Nombre */}
          <Input
            label="Nombre"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Ingrese el nombre del empleado"
            disabled={loading}
            error={errors.first_name}
            required
          />

          {/* Campo Apellido */}
          <Input
            label="Apellido"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Ingrese el apellido del empleado"
            disabled={loading}
            error={errors.last_name}
            required
          />

          {/* Campo Teléfono */}
          <Input
            label="Número de Teléfono"
            name="phone_number"
            type="tel"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="Ej: 12345678 o +123-456-7890"
            disabled={loading}
            error={errors.phone_number}
            required
          />

          {/* Campo Tipo de Empleado */}
          <Select
            label="Tipo de Empleado"
            name="id_type_employee"
            value={formData.id_type_employee.toString()}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10) || 0;
              setFormData(prev => ({ ...prev, id_type_employee: value }));
              if (errors.id_type_employee) {
                setErrors(prev => ({ ...prev, id_type_employee: '' }));
              }
            }}
            disabled={loading}
            error={errors.id_type_employee}
            options={typeEmployeeOptions}
            required
          />

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
              {isEdit ? "Actualizar Empleado" : "Crear Empleado"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
