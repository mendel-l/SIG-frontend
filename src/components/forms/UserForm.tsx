import React, { useState, useEffect } from 'react';
import { getAuthToken } from '../../utils';
import FormContainer, { FormField, FormInput, FormSelect, FormActions } from '../ui/FormContainer';

interface UserFormData {
  user: string;
  password_hash: string;
  email: string;
  employee_id?: number;
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
    status: number;
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
  const [formData, setFormData] = useState<UserFormData>({
    user: initialData?.user || '',
    password_hash: '',
    email: initialData?.email || '',
    employee_id: initialData?.employee_id || undefined,
    rol_id: initialData?.rol_id || 1,
    status: initialData?.status ?? 1, // Por defecto activo
  });
  
  const [roles, setRoles] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Cargar roles y empleados disponibles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        // Obtener el token del sessionStorage
        const token = getAuthToken();
        
        const response = await fetch('http://localhost:8000/api/v1/rol?page=1&limit=100', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success') {
            setRoles(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    const fetchEmployees = async () => {
      try {
        // Obtener el token del sessionStorage
        const token = getAuthToken();
        
        const response = await fetch('http://localhost:8000/api/v1/employee?page=1&limit=100', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success') {
            setEmployees(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    
    fetchRoles();
    fetchEmployees();
  }, []);

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

    if (!formData.rol_id) {
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
      employee_id: formData.employee_id || undefined,
      rol_id: formData.rol_id,
      status: formData.status,
    };

    // Solo incluir password_hash si tiene valor o si no es edición
    if (!isEdit || formData.password_hash.trim()) {
      submitData.password_hash = formData.password_hash.trim();
    }

    const success = await onSubmit(submitData);

    if (success && !isEdit) {
      // Limpiar el formulario después del éxito solo si es creación
      setFormData({
        user: '',
        password_hash: '',
        email: '',
        employee_id: undefined,
        rol_id: 1,
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
      [name]: name === 'rol_id' || name === 'employee_id' || name === 'status' 
        ? parseInt(value, 10) || (name === 'employee_id' ? undefined : 0)
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
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  return (
    <FormContainer
      title={isEdit ? "Editar Usuario" : "Crear Nuevo Usuario"}
      subtitle={isEdit ? "Modifica las credenciales y permisos de acceso" : "Define las credenciales y permisos de acceso"}
      icon={userIcon}
      onCancel={onCancel}
      loading={loading}
      className={className}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Campo Usuario */}
          <FormField
            label="Nombre de Usuario"
            required={true}
            error={errors.user}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          >
            <FormInput
              name="user"
              value={formData.user}
              onChange={handleChange}
              placeholder="Ingrese el nombre de usuario"
              disabled={loading}
              error={errors.user}
            />
          </FormField>

          {/* Campo Email */}
          <FormField
            label="Correo Electrónico"
            required={true}
            error={errors.email}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            }
          >
            <FormInput
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="usuario@ejemplo.com"
              disabled={loading}
              error={errors.email}
            />
          </FormField>

          {/* Campo Contraseña */}
          <FormField
            label={isEdit ? "Nueva Contraseña (opcional)" : "Contraseña"}
            required={!isEdit}
            error={errors.password_hash}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          >
            <div className="relative">
              <FormInput
                name="password_hash"
                type={showPassword ? "text" : "password"}
                value={formData.password_hash}
                onChange={handleChange}
                placeholder={isEdit ? "Dejar vacío para mantener actual (mín. 6 caracteres)" : "Ingrese la contraseña (mín. 6 caracteres)"}
                disabled={loading}
                error={errors.password_hash}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
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
          </FormField>

          {/* Campo Rol */}
          <FormField
            label="Rol"
            required={true}
            error={errors.rol_id}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
          >
            <FormSelect
              name="rol_id"
              value={formData.rol_id}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Seleccionar rol...</option>
              {roles.map((role) => (
                <option key={role.id_rol} value={role.id_rol}>
                  {role.name}
                </option>
              ))}
            </FormSelect>
          </FormField>

          {/* Campo Empleado (Opcional) */}
          <FormField
            label="Empleado (Opcional)"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            }
          >
            <FormSelect
              name="employee_id"
              value={formData.employee_id || ""}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Sin vincular a empleado</option>
              {employees.map((employee) => (
                <option key={employee.id_employee} value={employee.id_employee}>
                  {employee.first_name} {employee.last_name}
                </option>
              ))}
            </FormSelect>
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
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
            >
              <option value={1}>✅ Activo</option>
              <option value={0}>❌ Inactivo</option>
            </FormSelect>
          </FormField>
        </div>

        {/* Botones */}
        <FormActions
          onCancel={onCancel}
          loading={loading}
          cancelText="Cancelar"
          submitText={isEdit ? "Actualizar Usuario" : "Crear Usuario"}
          loadingText={isEdit ? "Actualizando..." : "Creando..."}
        />
      </form>
    </FormContainer>
  );
};

export default UserForm;