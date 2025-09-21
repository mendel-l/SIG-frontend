# 🚀 Ejemplos Prácticos de Componentes

Esta documentación proporciona ejemplos completos y listos para usar de los componentes del sistema.

## 📋 Tabla de Contenidos

- [Ejemplos de Formularios](#ejemplos-de-formularios)
- [Ejemplos de Dashboards](#ejemplos-de-dashboards)
- [Ejemplos de Gestión de Usuarios](#ejemplos-de-gestión-de-usuarios)
- [Ejemplos de Configuración](#ejemplos-de-configuración)
- [Ejemplos de Feedback](#ejemplos-de-feedback)

---

## 📝 Ejemplos de Formularios

### Formulario de Registro Completo

```typescript
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Button, 
  Input, 
  Select, 
  Switch,
  Badge
} from '@/components/ui';
import { useNotifications } from '@/hooks/useNotifications';
import { Eye, EyeOff, User, Mail, Lock, MapPin } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string(),
  role: z.enum(['admin', 'user', 'guest']),
  department: z.string().min(1, 'Selecciona un departamento'),
  acceptTerms: z.boolean().refine(val => val, 'Debes aceptar los términos'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type RegisterData = z.infer<typeof registerSchema>;

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useNotifications();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password');
  const passwordStrength = password ? getPasswordStrength(password) : 0;

  const onSubmit = async (data: RegisterData) => {
    try {
      setIsSubmitting(true);
      await registerUser(data);
      showSuccess('Registro exitoso', 'Tu cuenta ha sido creada correctamente');
      reset();
    } catch (error) {
      showError('Error en el registro', 'No se pudo crear la cuenta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthLabel = (strength: number) => {
    const labels = ['Muy débil', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte'];
    const variants = ['danger', 'danger', 'warning', 'success', 'success'];
    return { label: labels[strength] || 'Muy débil', variant: variants[strength] || 'danger' };
  };

  const strengthInfo = getPasswordStrengthLabel(passwordStrength);

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-6 w-6 mr-2" />
            Registro de Usuario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Información Personal
              </h3>
              
              <Input
                label="Nombre Completo"
                placeholder="Tu nombre completo"
                leftIcon={<User className="h-4 w-4" />}
                {...register('name')}
                error={errors.name?.message}
              />
              
              <Input
                label="Email"
                type="email"
                placeholder="tu@email.com"
                leftIcon={<Mail className="h-4 w-4" />}
                {...register('email')}
                error={errors.email?.message}
              />
            </div>

            {/* Información de Acceso */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Información de Acceso
              </h3>
              
              <div>
                <Input
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  {...register('password')}
                  error={errors.password?.message}
                />
                {password && (
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Fuerza:
                    </span>
                    <Badge variant={strengthInfo.variant as any} size="sm">
                      {strengthInfo.label}
                    </Badge>
                  </div>
                )}
              </div>
              
              <Input
                label="Confirmar Contraseña"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />
            </div>

            {/* Información Organizacional */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Información Organizacional
              </h3>
              
              <Select
                label="Rol"
                options={[
                  { value: 'admin', label: 'Administrador' },
                  { value: 'user', label: 'Usuario' },
                  { value: 'guest', label: 'Invitado' },
                ]}
                {...register('role')}
                error={errors.role?.message}
              />
              
              <Select
                label="Departamento"
                options={[
                  { value: 'it', label: 'Tecnología' },
                  { value: 'hr', label: 'Recursos Humanos' },
                  { value: 'finance', label: 'Finanzas' },
                  { value: 'operations', label: 'Operaciones' },
                ]}
                {...register('department')}
                error={errors.department?.message}
              />
            </div>

            {/* Términos y Condiciones */}
            <div className="space-y-4">
              <Switch
                label="Acepto los términos y condiciones"
                description="Al continuar, aceptas nuestros términos de servicio y política de privacidad"
                {...register('acceptTerms')}
                error={errors.acceptTerms?.message}
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-4">
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
                {isSubmitting ? 'Registrando...' : 'Crear Cuenta'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 📊 Ejemplos de Dashboards

### Dashboard con Métricas y Gráficos

```typescript
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, ProgressBar } from '@/components/ui';
import { 
  Users, 
  MapPin, 
  TrendingUp, 
  Activity, 
  Download,
  Filter,
  Calendar
} from 'lucide-react';

function Dashboard() {
  const metrics = {
    totalUsers: 1247,
    activeUsers: 892,
    totalLocations: 156,
    newRegistrations: 23,
  };

  const recentActivity = [
    { id: 1, user: 'Juan Pérez', action: 'Creó un nuevo punto de interés', time: '2 min ago', type: 'create' },
    { id: 2, user: 'María García', action: 'Actualizó información del mapa', time: '5 min ago', type: 'update' },
    { id: 3, user: 'Carlos López', action: 'Eliminó un marcador', time: '10 min ago', type: 'delete' },
    { id: 4, user: 'Ana Martínez', action: 'Subió una nueva imagen', time: '15 min ago', type: 'upload' },
  ];

  const getActivityIcon = (type: string) => {
    const icons = {
      create: '➕',
      update: '✏️',
      delete: '🗑️',
      upload: '📤',
    };
    return icons[type] || '📝';
  };

  const getActivityColor = (type: string) => {
    const colors = {
      create: 'success',
      update: 'primary',
      delete: 'danger',
      upload: 'warning',
    };
    return colors[type] || 'default';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard SIG Municipal
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Resumen de actividad y métricas del sistema
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          <Button variant="secondary">
            <Calendar className="h-4 w-4 mr-2" />
            Rango de Fechas
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Usuarios Totales
            </CardTitle>
            <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Usuarios Activos
            </CardTitle>
            <Activity className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics.activeUsers.toLocaleString()}
            </div>
            <div className="mt-2">
              <ProgressBar 
                value={(metrics.activeUsers / metrics.totalUsers) * 100}
                variant="success"
                size="sm"
                showLabel={false}
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {Math.round((metrics.activeUsers / metrics.totalUsers) * 100)}% del total
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Ubicaciones
            </CardTitle>
            <MapPin className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics.totalLocations}
            </div>
            <p className="text-xs text-blue-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3 nuevas esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Nuevos Registros
            </CardTitle>
            <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics.newRegistrations}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Últimas 24 horas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actividad Reciente */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {activity.user}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.action}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={getActivityColor(activity.type) as any} size="sm">
                    {activity.type}
                  </Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 👥 Ejemplos de Gestión de Usuarios

### Lista de Usuarios con Filtros Avanzados

```typescript
import { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Button, 
  Input, 
  Select, 
  Badge, 
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@/components/ui';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  UserPlus, 
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

function UserManagement() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan.perez@municipal.com',
      role: 'admin',
      status: 'active',
      department: 'Tecnología',
      lastSeen: '2 horas',
      avatar: null,
    },
    {
      id: 2,
      name: 'María García',
      email: 'maria.garcia@municipal.com',
      role: 'user',
      status: 'active',
      department: 'Recursos Humanos',
      lastSeen: '1 día',
      avatar: null,
    },
    {
      id: 3,
      name: 'Carlos López',
      email: 'carlos.lopez@municipal.com',
      role: 'user',
      status: 'inactive',
      department: 'Finanzas',
      lastSeen: '1 semana',
      avatar: null,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'warning';
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'primary' : 'secondary';
  };

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Administra los usuarios del sistema
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Agregar Usuario
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Buscar usuarios..."
                leftIcon={<Search className="h-4 w-4" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Select
                options={[
                  { value: 'all', label: 'Todos los estados' },
                  { value: 'active', label: 'Activos' },
                  { value: 'inactive', label: 'Inactivos' },
                ]}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            </div>
            <div>
              <Select
                options={[
                  { value: 'all', label: 'Todos los roles' },
                  { value: 'admin', label: 'Administradores' },
                  { value: 'user', label: 'Usuarios' },
                ]}
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              />
            </div>
            <div>
              <Button variant="secondary" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Más Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Usuario
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Contacto
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Rol
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Estado
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Última Actividad
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <Avatar 
                          src={user.avatar} 
                          fallback={user.name}
                          size="md"
                          status={user.status === 'active' ? 'online' : 'offline'}
                        />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {user.department}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Mail className="h-3 w-3 mr-2" />
                          {user.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Phone className="h-3 w-3 mr-2" />
                          +1 234 567 8900
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getRoleColor(user.role) as any}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusColor(user.status) as any}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {user.lastSeen}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Dropdown
                        trigger={
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        }
                        align="right"
                      >
                        <DropdownLabel>Acciones</DropdownLabel>
                        <DropdownItem icon={<Edit />}>
                          Editar Usuario
                        </DropdownItem>
                        <DropdownItem icon={<Mail />}>
                          Enviar Email
                        </DropdownItem>
                        <DropdownItem icon={<MapPin />}>
                          Ver Ubicación
                        </DropdownItem>
                        <DropdownSeparator />
                        <DropdownItem 
                          icon={<Trash2 />}
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Eliminar
                        </DropdownItem>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              No se encontraron usuarios que coincidan con los filtros.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Confirmación */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ModalHeader>Confirmar Eliminación</ModalHeader>
        <ModalBody>
          <p className="text-gray-600 dark:text-gray-400">
            ¿Estás seguro de que quieres eliminar a <strong>{selectedUser?.name}</strong>? 
            Esta acción no se puede deshacer.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button 
            variant="secondary" 
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDelete}
          >
            Eliminar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
```

---

## ⚙️ Ejemplos de Configuración

### Página de Configuración con Tabs

```typescript
import { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Button, 
  Input, 
  Select, 
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Badge,
  ProgressBar
} from '@/components/ui';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Palette,
  Save,
  Download,
  Upload
} from 'lucide-react';

function SettingsPage() {
  const [settings, setSettings] = useState({
    profile: {
      name: 'Juan Pérez',
      email: 'juan.perez@municipal.com',
      department: 'Tecnología',
      timezone: 'America/Guatemala',
    },
    notifications: {
      email: true,
      push: false,
      sms: true,
      weeklyReport: true,
    },
    privacy: {
      profileVisible: true,
      showLastSeen: true,
      allowMessages: false,
      shareLocation: false,
    },
    appearance: {
      theme: 'system',
      language: 'es',
      fontSize: 'medium',
    },
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Simular guardado
    setTimeout(() => {
      setHasChanges(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Configuración
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Personaliza tu experiencia en el sistema
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="secondary">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!hasChanges}
          >
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Shield className="h-4 w-4 mr-2" />
            Privacidad
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="h-4 w-4 mr-2" />
            Apariencia
          </TabsTrigger>
          <TabsTrigger value="data">
            <Database className="h-4 w-4 mr-2" />
            Datos
          </TabsTrigger>
        </TabsList>

        {/* Perfil */}
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Nombre Completo"
                value={settings.profile.name}
                onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                value={settings.profile.email}
                onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
              />
              <Select
                label="Departamento"
                options={[
                  { value: 'Tecnología', label: 'Tecnología' },
                  { value: 'Recursos Humanos', label: 'Recursos Humanos' },
                  { value: 'Finanzas', label: 'Finanzas' },
                  { value: 'Operaciones', label: 'Operaciones' },
                ]}
                value={settings.profile.department}
                onChange={(e) => handleSettingChange('profile', 'department', e.target.value)}
              />
              <Select
                label="Zona Horaria"
                options={[
                  { value: 'America/Guatemala', label: 'Guatemala (GMT-6)' },
                  { value: 'America/Mexico_City', label: 'México (GMT-6)' },
                  { value: 'America/New_York', label: 'Nueva York (GMT-5)' },
                ]}
                value={settings.profile.timezone}
                onChange={(e) => handleSettingChange('profile', 'timezone', e.target.value)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notificaciones */}
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Notificaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Switch
                  label="Notificaciones por Email"
                  description="Recibe notificaciones importantes por email"
                  checked={settings.notifications.email}
                  onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                />
                <Switch
                  label="Notificaciones Push"
                  description="Recibe notificaciones en tiempo real"
                  checked={settings.notifications.push}
                  onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                />
                <Switch
                  label="Notificaciones SMS"
                  description="Recibe notificaciones por mensaje de texto"
                  checked={settings.notifications.sms}
                  onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                />
                <Switch
                  label="Reporte Semanal"
                  description="Recibe un resumen semanal de actividad"
                  checked={settings.notifications.weeklyReport}
                  onChange={(e) => handleSettingChange('notifications', 'weeklyReport', e.target.checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacidad */}
        <TabsContent value="privacy" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Privacidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Switch
                  label="Perfil Visible"
                  description="Permite que otros usuarios vean tu perfil"
                  checked={settings.privacy.profileVisible}
                  onChange={(e) => handleSettingChange('privacy', 'profileVisible', e.target.checked)}
                />
                <Switch
                  label="Mostrar Última Conexión"
                  description="Muestra cuándo fue tu última actividad en línea"
                  checked={settings.privacy.showLastSeen}
                  onChange={(e) => handleSettingChange('privacy', 'showLastSeen', e.target.checked)}
                />
                <Switch
                  label="Permitir Mensajes Directos"
                  description="Permite que otros usuarios te envíen mensajes"
                  checked={settings.privacy.allowMessages}
                  onChange={(e) => handleSettingChange('privacy', 'allowMessages', e.target.checked)}
                />
                <Switch
                  label="Compartir Ubicación"
                  description="Permite que el sistema acceda a tu ubicación"
                  checked={settings.privacy.shareLocation}
                  onChange={(e) => handleSettingChange('privacy', 'shareLocation', e.target.checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Apariencia */}
        <TabsContent value="appearance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Apariencia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 block">
                  Tema
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['light', 'dark', 'system'].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => handleSettingChange('appearance', 'theme', theme)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        settings.appearance.theme === theme
                          ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-sm font-medium capitalize">{theme}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <Select
                label="Idioma"
                options={[
                  { value: 'es', label: 'Español' },
                  { value: 'en', label: 'English' },
                  { value: 'fr', label: 'Français' },
                ]}
                value={settings.appearance.language}
                onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
              />
              
              <Select
                label="Tamaño de Fuente"
                options={[
                  { value: 'small', label: 'Pequeño' },
                  { value: 'medium', label: 'Mediano' },
                  { value: 'large', label: 'Grande' },
                ]}
                value={settings.appearance.fontSize}
                onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Datos */}
        <TabsContent value="data" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Datos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Almacenamiento
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Archivos subidos</span>
                      <span>2.3 GB</span>
                    </div>
                    <ProgressBar value={46} variant="primary" showLabel={false} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Base de datos</span>
                      <span>156 MB</span>
                    </div>
                    <ProgressBar value={12} variant="success" showLabel={false} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Acciones
                  </h3>
                  <div className="space-y-3">
                    <Button variant="secondary" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Datos
                    </Button>
                    <Button variant="secondary" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Importar Datos
                    </Button>
                    <Button variant="danger" className="w-full">
                      Eliminar Cuenta
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

---

*Última actualización: Enero 2025*
