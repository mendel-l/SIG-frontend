import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Input, 
  Select 
} from '@/components/ui';
import { UserPlus, User } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

// Schema de validación con Zod
const userSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  role: z.enum(['admin', 'user', 'viewer'], {
    required_error: 'Selecciona un rol',
  }),
  department: z.string().min(1, 'Selecciona un departamento'),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  onSubmit: (data: UserFormData) => Promise<void>;
  initialData?: Partial<UserFormData>;
  isEditing?: boolean;
}

export function UserForm({ onSubmit, initialData, isEditing = false }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useNotifications();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData,
  });

  const roleOptions = [
    { value: 'admin', label: 'Administrador' },
    { value: 'user', label: 'Usuario' },
    { value: 'viewer', label: 'Visualizador' },
  ];

  const departmentOptions = [
    { value: 'it', label: 'Tecnología' },
    { value: 'hr', label: 'Recursos Humanos' },
    { value: 'finance', label: 'Finanzas' },
    { value: 'operations', label: 'Operaciones' },
    { value: 'marketing', label: 'Marketing' },
  ];

  const handleFormSubmit = async (data: UserFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      showSuccess(
        isEditing ? 'Usuario actualizado' : 'Usuario creado',
        isEditing ? 'Los cambios se han guardado correctamente' : 'El usuario ha sido agregado al sistema'
      );
      if (!isEditing) {
        reset();
      }
    } catch (error) {
      showError('Error al procesar el formulario', 'Por favor, revisa los datos e intenta nuevamente');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {isEditing ? (
            <User className="h-5 w-5 mr-2" />
          ) : (
            <UserPlus className="h-5 w-5 mr-2" />
          )}
          {isEditing ? 'Editar Usuario' : 'Crear Usuario'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <Input
            label="Nombre completo"
            placeholder="Ingresa el nombre completo"
            {...register('name')}
            error={errors.name?.message}
            helperText="Nombre y apellidos del usuario"
          />

          <Input
            label="Email"
            type="email"
            placeholder="usuario@empresa.com"
            {...register('email')}
            error={errors.email?.message}
            helperText="Email corporativo del usuario"
          />

          <Select
            label="Rol"
            placeholder="Selecciona un rol"
            options={roleOptions}
            {...register('role')}
            error={errors.role?.message}
            helperText="Determina los permisos del usuario"
          />

          <Select
            label="Departamento"
            placeholder="Selecciona un departamento"
            options={departmentOptions}
            {...register('department')}
            error={errors.department?.message}
            helperText="Departamento al que pertenece el usuario"
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Limpiar
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
