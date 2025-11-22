import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useRoles, type Rol } from '@/queries/rolesQueries';
import { useEmployees, type Employee } from '@/queries/employeesQueries';

interface UserFormData {
  user: string;
  password_hash: string;
  email: string;
  employee_id: number;
  rol_id: number;
  status: number;
}

interface UserFormProps {
  onSubmit: (userData: UserFormData) => Promise<boolean>;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
  initialData?: {
    user: string;
    email: string;
    employee_id?: number;
    rol_id: number;
    status?: number;
  } | null;
  isEdit?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ 
  onSubmit, 
  onCancel, 
  loading = false, 
  className = '', 
  initialData = null, 
  isEdit = false 
}) => {
  // ✅ Usar TanStack Query en lugar de store
  // Nota: El backend limita a 100 items por página, usamos el máximo permitido
  const { data: rolesData } = useRoles(1, 100);
  const roles = rolesData?.items || [];
  
  const { data: employeesData } = useEmployees(1, 100);
  const employees = employeesData?.items || [];
  
  const [formData, setFormData] = useState<UserFormData>({
    user: initialData?.user || '',
    password_hash: '',
    email: initialData?.email || '',
    status: initialData?.status ?? 1,
    employee_id: initialData?.employee_id || 0,
    rol_id: initialData?.rol_id || 0,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.user.trim()) {
      newErrors.user = 'El nombre de usuario es obligatorio';
    } else if (formData.user.trim().length < 3) {
      newErrors.user = 'El nombre de usuario debe tener al menos 3 caracteres';
    }

    // Validación de email con expresión regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Por favor ingresa un email válido (ejemplo: usuario@dominio.com)';
    }

    if (!isEdit && !formData.password_hash.trim()) {
      newErrors.password_hash = 'La contraseña es obligatoria';
    } else if (formData.password_hash.trim() && formData.password_hash.trim().length < 6) {
      newErrors.password_hash = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.employee_id || formData.employee_id === 0) {
      newErrors.employee_id = 'Debes seleccionar un empleado';
    }

    if (!formData.rol_id || formData.rol_id === 0) {
      newErrors.rol_id = 'Debes seleccionar un rol';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData: any = {
      user: formData.user.trim(),
      email: formData.email.trim(),
      employee_id: formData.employee_id,
      rol_id: formData.rol_id,
      status: initialData?.status ?? 1,
    };

    // Para crear: enviar password_hash, para editar: enviar password (solo si tiene valor)
    if (isEdit) {
      // En edición, solo enviar password si el usuario cambió la contraseña
      if (formData.password_hash.trim()) {
        submitData.password = formData.password_hash.trim();
      }
    } else {
      // En creación, siempre enviar password_hash
      submitData.password_hash = formData.password_hash.trim();
    }

    console.log('📤 Enviando datos al servidor:', { ...submitData, password_hash: '***', password: '***' });

    const success = await onSubmit(submitData);

    if (success && !isEdit) {
      // Limpiar el formulario después del éxito solo si es creación
      setFormData({
        user: '',
        password_hash: '',
        email: '',
        employee_id: 0,
        rol_id: 0,
        status: 1,
      });
      setErrors({});
      setShowPassword(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rol_id' || name === 'employee_id'
        ? parseInt(value, 10) || 0
        : value,
    }));

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const userIcon = (
    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  // Preparar opciones para Select
  const roleOptions = [
    { value: '0', label: 'Seleccionar rol...' },
    ...roles.filter((r: Rol) => r.status === true).map((role: Rol) => ({
      value: role.id_rol.toString(),
      label: role.name
    }))
  ];

  const employeeOptions = [
    { value: '0', label: 'Seleccionar empleado...' },
    ...employees.filter((e: Employee) => e.state).map((employee: Employee) => ({
      value: employee.id_employee.toString(),
      label: `${employee.first_name} ${employee.last_name}`
    }))
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              {userIcon}
            </div>
            <div>
              <CardTitle>{isEdit ? "Editar Usuario" : "Crear Nuevo Usuario"}</CardTitle>
              <CardDescription>
                {isEdit ? "Modifica las credenciales y permisos de acceso" : "Define las credenciales y permisos de acceso"}
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
          {/* Campo Usuario */}
          <Input
            label="Nombre de Usuario"
            name="user"
            value={formData.user}
            onChange={handleChange}
            placeholder="Ingrese el nombre de usuario"
            disabled={loading}
            error={errors.user}
            required
          />

          {/* Campo Email */}
          <Input
            label="Correo Electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="usuario@ejemplo.com"
            disabled={loading}
            error={errors.email}
            required
          />

          {/* Campo Contraseña */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {isEdit ? "Nueva Contraseña (opcional)" : "Contraseña"} {!isEdit && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password_hash"
                value={formData.password_hash}
                onChange={handleChange}
                placeholder={isEdit ? "Dejar vacío para mantener actual (mín. 6 caracteres)" : "Ingrese la contraseña (mín. 6 caracteres)"}
                disabled={loading}
                className={`input w-full pr-10 ${errors.password_hash ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-400"
                disabled={loading}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l5.657-5.657m4.242 4.242L21 21M21 21l-5.657-5.657m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.065 7-9.543 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password_hash && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.password_hash}
              </p>
            )}
          </div>

          {/* Campo Rol */}
          <Select
            label="Rol"
            name="rol_id"
            value={formData.rol_id.toString()}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10) || 0;
              setFormData(prev => ({ ...prev, rol_id: value }));
              if (errors.rol_id) {
                setErrors(prev => ({ ...prev, rol_id: '' }));
              }
            }}
            disabled={loading}
            error={errors.rol_id}
            options={roleOptions}
            required
          />

          {/* Campo Empleado */}
          <Select
            label="Empleado"
            name="employee_id"
            value={formData.employee_id.toString()}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10) || 0;
              setFormData(prev => ({ ...prev, employee_id: value }));
              if (errors.employee_id) {
                setErrors(prev => ({ ...prev, employee_id: '' }));
              }
            }}
            disabled={loading}
            error={errors.employee_id}
            options={employeeOptions}
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
              {isEdit ? "Actualizar Usuario" : "Crear Usuario"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserForm;