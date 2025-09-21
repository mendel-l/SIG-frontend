import { useState } from 'react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  Input,
  Select,
  Textarea,
  Switch,
  LoadingSpinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge,
  Tooltip,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
  ProgressBar,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Avatar,
} from '@/components/ui';
import { Search, Mail, User, Settings, Bell, MoreVertical, UserPlus, LogOut, Edit, Trash2, ChevronDown } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

export function ComponentsExample() {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    description: '',
    notifications: true,
    darkMode: false,
  });

  const { showSuccess, showError, showWarning, showInfo, showLoading, updateLoading } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular llamada a API
    setTimeout(() => {
      setLoading(false);
      showSuccess('Formulario enviado correctamente');
      console.log('Form data:', formData);
    }, 2000);
  };

  // Funciones para probar diferentes tipos de notificaciones
  const testNotifications = () => {
    showSuccess('Operación exitosa', 'Los datos se han guardado correctamente');
    
    setTimeout(() => {
      showInfo('Información importante', 'Recuerda revisar tu configuración');
    }, 500);
    
    setTimeout(() => {
      showWarning('Advertencia', 'Algunos campos podrían necesitar atención');
    }, 1000);
    
    setTimeout(() => {
      showError('Error crítico', 'No se pudo completar la operación');
    }, 1500);
  };

  const testLoadingNotification = () => {
    const loadingToast = showLoading('Procesando datos...');
    
    setTimeout(() => {
      updateLoading(loadingToast, 'Datos procesados exitosamente', 'success');
    }, 2000);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const roleOptions = [
    { value: 'admin', label: 'Administrador' },
    { value: 'user', label: 'Usuario' },
    { value: 'viewer', label: 'Visualizador' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Componentes Reutilizables
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ejemplos de uso de todos los componentes disponibles
        </p>
      </div>

      {/* Buttons Section */}
      <Card>
        <CardHeader>
          <CardTitle>Botones (Buttons)</CardTitle>
          <CardDescription>
            Diferentes variantes y tamaños de botones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" size="sm">Primario Pequeño</Button>
            <Button variant="primary" size="md">Primario Mediano</Button>
            <Button variant="primary" size="lg">Primario Grande</Button>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button variant="secondary">Secundario</Button>
            <Button variant="success">Éxito</Button>
            <Button variant="warning">Advertencia</Button>
            <Button variant="danger">Peligro</Button>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button disabled>Deshabilitado</Button>
            <Button loading={loading}>Con Loading</Button>
          </div>
        </CardContent>
      </Card>

      {/* Form Section */}
      <Card>
        <CardHeader>
          <CardTitle>Formularios</CardTitle>
          <CardDescription>
            Componentes de entrada de datos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input with icon */}
            <Input
              label="Nombre completo"
              placeholder="Ingresa tu nombre"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              leftIcon={<User className="h-4 w-4" />}
              helperText="Este será tu nombre público"
            />

            {/* Input with validation */}
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              leftIcon={<Mail className="h-4 w-4" />}
              error={formData.email && !formData.email.includes('@') ? 'Email inválido' : undefined}
            />

            {/* Search input */}
            <Input
              label="Buscar"
              placeholder="Buscar usuarios..."
              leftIcon={<Search className="h-4 w-4" />}
            />

            {/* Select */}
            <Select
              label="Rol"
              placeholder="Selecciona un rol"
              options={roleOptions}
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              helperText="El rol determina los permisos del usuario"
            />

            {/* Textarea */}
            <Textarea
              label="Descripción"
              placeholder="Describe brevemente..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              helperText="Máximo 500 caracteres"
            />

            {/* Switches */}
            <div className="space-y-4">
              <Switch
                label="Notificaciones por email"
                description="Recibe notificaciones importantes por email"
                checked={formData.notifications}
                onChange={(e) => handleInputChange('notifications', e.target.checked)}
              />
              
              <Switch
                label="Modo oscuro"
                description="Usa el tema oscuro de la aplicación"
                checked={formData.darkMode}
                onChange={(e) => handleInputChange('darkMode', e.target.checked)}
              />
            </div>

            <CardFooter className="px-0">
              <Button type="submit" loading={loading}>
                Enviar Formulario
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      {/* Loading States */}
      <Card>
        <CardHeader>
          <CardTitle>Estados de Carga</CardTitle>
          <CardDescription>
            Indicadores de carga en diferentes tamaños
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <LoadingSpinner size="sm" />
            <LoadingSpinner size="md" />
            <LoadingSpinner size="lg" />
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notificaciones (Toast)
          </CardTitle>
          <CardDescription>
            Sistema de notificaciones emergentes con diferentes tipos y estilos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button 
              variant="success" 
              onClick={() => showSuccess('Operación exitosa', 'Los datos se han guardado correctamente')}
            >
              Éxito
            </Button>
            
            <Button 
              variant="warning" 
              onClick={() => showWarning('Advertencia', 'Algunos campos podrían necesitar atención')}
            >
              Advertencia
            </Button>
            
            <Button 
              variant="danger" 
              onClick={() => showError('Error crítico', 'No se pudo completar la operación')}
            >
              Error
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={() => showInfo('Información', 'Recuerda revisar tu configuración')}
            >
              Información
            </Button>
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="primary" 
                onClick={testNotifications}
              >
                Probar Todas las Notificaciones
              </Button>
              
              <Button 
                variant="secondary" 
                onClick={testLoadingNotification}
              >
                Notificación de Carga
              </Button>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Tipos de notificaciones disponibles:</strong></p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Éxito:</strong> Operaciones completadas exitosamente</li>
                <li><strong>Error:</strong> Errores críticos que requieren atención</li>
                <li><strong>Advertencia:</strong> Situaciones que requieren precaución</li>
                <li><strong>Información:</strong> Información general o recordatorios</li>
                <li><strong>Carga:</strong> Operaciones en progreso con actualización automática</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tarjeta Simple</CardTitle>
            <CardDescription>
              Una tarjeta básica con contenido
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              Este es el contenido principal de la tarjeta. Puede contener cualquier tipo de información.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" size="sm">Acción</Button>
          </CardFooter>
        </Card>

        <Card shadow="lg" padding="lg">
          <CardHeader>
            <CardTitle>Tarjeta con Sombra</CardTitle>
            <CardDescription>
              Tarjeta con mayor padding y sombra
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Configuración avanzada</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Gestión de usuarios</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Components Section */}
      <div className="grid grid-cols-1 gap-6">
        {/* Modal Example */}
        <Card>
          <CardHeader>
            <CardTitle>Modal/Dialog</CardTitle>
            <CardDescription>
              Ventanas emergentes para confirmaciones y formularios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsModalOpen(true)} variant="primary">
              Abrir Modal
            </Button>
          </CardContent>
        </Card>

        {/* Badge Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>
              Etiquetas para estados y categorías
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge size="sm">Small</Badge>
              <Badge size="md">Medium</Badge>
              <Badge size="lg">Large</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Tooltip Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Tooltips</CardTitle>
            <CardDescription>
              Información adicional al hacer hover
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Tooltip content="Este es un tooltip en la parte superior">
                <Button variant="secondary">Hover me (Top)</Button>
              </Tooltip>
              <Tooltip content="Este es un tooltip en la parte inferior" position="bottom">
                <Button variant="secondary">Hover me (Bottom)</Button>
              </Tooltip>
              <Tooltip content="Este es un tooltip a la izquierda" position="left">
                <Button variant="secondary">Hover me (Left)</Button>
              </Tooltip>
              <Tooltip content="Este es un tooltip a la derecha" position="right">
                <Button variant="secondary">Hover me (Right)</Button>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        {/* Dropdown Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Dropdown</CardTitle>
            <CardDescription>
              Menús desplegables personalizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Dropdown
                trigger={
                  <Button variant="secondary">
                    Acciones <MoreVertical className="h-4 w-4 ml-2" />
                  </Button>
                }
              >
                <DropdownLabel>Acciones de Usuario</DropdownLabel>
                <DropdownItem icon={<UserPlus />}>Agregar Usuario</DropdownItem>
                <DropdownItem icon={<Edit />}>Editar</DropdownItem>
                <DropdownSeparator />
                <DropdownItem icon={<Trash2 />}>Eliminar</DropdownItem>
              </Dropdown>

              <Dropdown
                trigger={
                  <Button variant="outline">
                    Perfil <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                }
                align="right"
              >
                <DropdownItem icon={<User />}>Mi Perfil</DropdownItem>
                <DropdownItem icon={<Settings />}>Configuración</DropdownItem>
                <DropdownSeparator />
                <DropdownItem icon={<LogOut />}>Cerrar Sesión</DropdownItem>
              </Dropdown>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Bar</CardTitle>
            <CardDescription>
              Indicadores de progreso para tareas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3">Diferentes Variantes:</h4>
              <div className="space-y-3">
                <ProgressBar value={75} variant="default" showLabel />
                <ProgressBar value={60} variant="success" showLabel />
                <ProgressBar value={45} variant="warning" showLabel />
                <ProgressBar value={30} variant="danger" showLabel />
                <ProgressBar value={85} variant="info" showLabel />
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-3">Diferentes Tamaños:</h4>
              <div className="space-y-3">
                <ProgressBar value={70} size="sm" showLabel />
                <ProgressBar value={70} size="md" showLabel />
                <ProgressBar value={70} size="lg" showLabel />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Example */}
        <Card>
          <CardHeader>
            <CardTitle>Tabs</CardTitle>
            <CardDescription>
              Organización de contenido en pestañas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tab1">
              <TabsList>
                <TabsTrigger value="tab1">Información</TabsTrigger>
                <TabsTrigger value="tab2">Configuración</TabsTrigger>
                <TabsTrigger value="tab3">Historial</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="mt-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium mb-2">Información del Usuario</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Aquí puedes ver la información básica del usuario.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="tab2" className="mt-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium mb-2">Configuración</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ajusta las preferencias del usuario.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="tab3" className="mt-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium mb-2">Historial</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Revisa el historial de actividades.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Avatar Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Avatars</CardTitle>
            <CardDescription>
              Imágenes de perfil con diferentes estados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Diferentes Tamaños:</h4>
                <div className="flex items-center gap-4">
                  <Avatar size="sm" fallback="JD" />
                  <Avatar size="md" fallback="JD" />
                  <Avatar size="lg" fallback="JD" />
                  <Avatar size="xl" fallback="JD" />
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-3">Con Estados:</h4>
                <div className="flex items-center gap-4">
                  <Avatar fallback="JD" status="online" />
                  <Avatar fallback="AB" status="away" />
                  <Avatar fallback="CD" status="busy" />
                  <Avatar fallback="EF" status="offline" />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Con Imagen:</h4>
                <div className="flex items-center gap-4">
                  <Avatar 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" 
                    alt="Usuario"
                    fallback="JD"
                  />
                  <Avatar 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face" 
                    alt="Usuario"
                    fallback="AB"
                    status="online"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader>Confirmar Acción</ModalHeader>
        <ModalBody>
          <p className="text-gray-600 dark:text-gray-400">
            ¿Estás seguro de que quieres realizar esta acción? Esta operación no se puede deshacer.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => {
            setIsModalOpen(false);
            showSuccess('Acción confirmada', 'La operación se ha realizado exitosamente');
          }}>
            Confirmar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
