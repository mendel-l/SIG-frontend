# 🎯 Patrones de Uso de Componentes

Esta guía muestra patrones comunes y mejores prácticas para usar los componentes del sistema.

## 📋 Tabla de Contenidos

- [Patrones de Formularios](#patrones-de-formularios)
- [Patrones de Navegación](#patrones-de-navegación)
- [Patrones de Feedback](#patrones-de-feedback)
- [Patrones de Layout](#patrones-de-layout)
- [Patrones de Datos](#patrones-de-datos)
- [Patrones de Interacción](#patrones-de-interacción)

---

## 📝 Patrones de Formularios

### Formulario Básico con Validación

```typescript
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Select } from '@/components/ui';

const schema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  role: z.enum(['admin', 'user', 'guest']),
});

type FormData = z.infer<typeof schema>;

function UserForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useNotifications();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await saveUser(data);
      showSuccess('Usuario guardado', 'El usuario se ha creado exitosamente');
      reset();
    } catch (error) {
      showError('Error al guardar', 'No se pudo crear el usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Usuario</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nombre"
            placeholder="Nombre completo"
            {...register('name')}
            error={errors.name?.message}
          />
          
          <Input
            label="Email"
            type="email"
            placeholder="usuario@ejemplo.com"
            {...register('email')}
            error={errors.email?.message}
          />
          
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
          
          <Button type="submit" loading={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar Usuario'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

### Formulario con Tabs

```typescript
import { Tabs, TabsList, TabsTrigger, TabsContent, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

function UserSettingsForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración de Usuario</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
            <TabsTrigger value="preferences">Preferencias</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-6">
            <div className="space-y-4">
              <Input label="Nombre" />
              <Input label="Email" type="email" />
              <Textarea label="Biografía" />
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="mt-6">
            <div className="space-y-4">
              <Input label="Contraseña actual" type="password" />
              <Input label="Nueva contraseña" type="password" />
              <Input label="Confirmar contraseña" type="password" />
            </div>
          </TabsContent>
          
          <TabsContent value="preferences" className="mt-6">
            <div className="space-y-4">
              <Switch label="Notificaciones por email" />
              <Switch label="Modo oscuro" />
              <Select label="Idioma" options={languageOptions} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
```

---

## 🧭 Patrones de Navegación

### Dropdown de Acciones

```typescript
import { Dropdown, DropdownItem, DropdownSeparator, DropdownLabel, Button } from '@/components/ui';
import { MoreVertical, Edit, Trash2, Copy, Share } from 'lucide-react';

function ActionDropdown({ item, onEdit, onDelete, onCopy, onShare }) {
  return (
    <Dropdown
      trigger={
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      }
      align="right"
    >
      <DropdownLabel>Acciones</DropdownLabel>
      <DropdownItem icon={<Edit />} onClick={() => onEdit(item)}>
        Editar
      </DropdownItem>
      <DropdownItem icon={<Copy />} onClick={() => onCopy(item)}>
        Duplicar
      </DropdownItem>
      <DropdownItem icon={<Share />} onClick={() => onShare(item)}>
        Compartir
      </DropdownItem>
      <DropdownSeparator />
      <DropdownItem 
        icon={<Trash2 />} 
        onClick={() => onDelete(item)}
        className="text-red-600 hover:text-red-700"
      >
        Eliminar
      </DropdownItem>
    </Dropdown>
  );
}
```

### Navegación con Breadcrumbs

```typescript
import { Card, CardHeader, CardTitle } from '@/components/ui';
import { ChevronRight, Home } from 'lucide-react';

function Breadcrumbs({ items }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
      <Home className="h-4 w-4" />
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4" />
          {index === items.length - 1 ? (
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {item.label}
            </span>
          ) : (
            <Link 
              to={item.href}
              className="hover:text-gray-900 dark:hover:text-gray-100"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
```

---

## 💬 Patrones de Feedback

### Confirmación con Modal

```typescript
import { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@/components/ui';
import { useNotifications } from '@/hooks/useNotifications';

function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { showSuccess, showError } = useNotifications();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      showSuccess('Eliminado', `${itemName} ha sido eliminado exitosamente`);
      onClose();
    } catch (error) {
      showError('Error', 'No se pudo eliminar el elemento');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalHeader>Confirmar Eliminación</ModalHeader>
      <ModalBody>
        <p className="text-gray-600 dark:text-gray-400">
          ¿Estás seguro de que quieres eliminar <strong>{itemName}</strong>? 
          Esta acción no se puede deshacer.
        </p>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
          Cancelar
        </Button>
        <Button 
          variant="danger" 
          onClick={handleDelete} 
          loading={isDeleting}
        >
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
```

### Estados de Carga con Progress

```typescript
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, ProgressBar, Button } from '@/components/ui';

function DataUpload() {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const simulateUpload = async () => {
    setIsUploading(true);
    setProgress(0);

    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(i);
    }

    setIsUploading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subir Archivos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={simulateUpload} 
          disabled={isUploading}
          className="w-full"
        >
          {isUploading ? 'Subiendo...' : 'Subir Archivos'}
        </Button>
        
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progreso</span>
              <span>{progress}%</span>
            </div>
            <ProgressBar 
              value={progress} 
              variant={progress === 100 ? 'success' : 'primary'}
              showLabel={false}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## 🏗️ Patrones de Layout

### Grid Responsive con Cards

```typescript
import { Card, CardHeader, CardTitle, CardContent, Badge, Avatar } from '@/components/ui';

function UserGrid({ users }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {users.map((user) => (
        <Card key={user.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <Avatar 
                src={user.avatar} 
                fallback={user.name}
                size="md"
                status={user.isOnline ? 'online' : 'offline'}
              />
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate">{user.name}</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant={user.role === 'admin' ? 'primary' : 'secondary'}>
                {user.role}
              </Badge>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Última actividad: {user.lastSeen}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

### Layout con Sidebar y Header

```typescript
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header de la página */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Bienvenido de vuelta, aquí tienes un resumen de tu actividad.
            </p>
          </div>
          <Button>Nueva Acción</Button>
        </div>

        {/* Grid de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Usuarios Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-green-600">+12% este mes</p>
            </CardContent>
          </Card>
          {/* Más cards de métricas... */}
        </div>
      </div>
    </DashboardLayout>
  );
}
```

---

## 📊 Patrones de Datos

### Tabla de Datos con Acciones

```typescript
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Avatar } from '@/components/ui';
import { ActionDropdown } from './ActionDropdown';

function UsersTable({ users, onEdit, onDelete }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuarios</CardTitle>
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
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <Avatar 
                        src={user.avatar} 
                        fallback={user.name}
                        size="sm"
                        status={user.isOnline ? 'online' : 'offline'}
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={user.role === 'admin' ? 'primary' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={user.status === 'active' ? 'success' : 'warning'}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {user.lastSeen}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <ActionDropdown 
                      item={user}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
```

### Lista con Filtros y Búsqueda

```typescript
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Input, Select, Badge } from '@/components/ui';
import { Search, Filter } from 'lucide-react';

function FilterableList({ items }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Elementos</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Buscar elementos..."
              leftIcon={<Search className="h-4 w-4" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={[
                { value: 'all', label: 'Todos' },
                { value: 'active', label: 'Activos' },
                { value: 'inactive', label: 'Inactivos' },
              ]}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Lista filtrada */}
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                </div>
              </div>
              <Badge variant={item.status === 'active' ? 'success' : 'warning'}>
                {item.status}
              </Badge>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            No se encontraron elementos que coincidan con los filtros.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## 🎯 Patrones de Interacción

### Wizard/Stepper

```typescript
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, ProgressBar } from '@/components/ui';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

function Wizard({ steps }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeStep = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    nextStep();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{steps[currentStep].title}</CardTitle>
        <ProgressBar value={progress} variant="primary" showLabel />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Indicador de pasos */}
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${index === currentStep 
                    ? 'bg-primary-600 text-white' 
                    : completedSteps.has(index)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {completedSteps.has(index) ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-12 h-0.5 mx-2
                    ${completedSteps.has(index) ? 'bg-green-600' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>

          {/* Contenido del paso actual */}
          <div className="min-h-[200px]">
            {steps[currentStep].content}
          </div>

          {/* Navegación */}
          <div className="flex justify-between">
            <Button 
              variant="secondary" 
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            
            <div className="flex space-x-2">
              {currentStep === steps.length - 1 ? (
                <Button onClick={() => console.log('Completado')}>
                  Completar
                </Button>
              ) : (
                <Button onClick={completeStep}>
                  Continuar
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### Tooltip Informativo

```typescript
import { Tooltip } from '@/components/ui';
import { Info } from 'lucide-react';

function InfoTooltip({ content, position = 'top' }) {
  return (
    <Tooltip content={content} position={position}>
      <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
    </Tooltip>
  );
}

// Uso en formularios
function FormFieldWithInfo({ label, info, children }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {label}
        </label>
        <InfoTooltip content={info} />
      </div>
      {children}
    </div>
  );
}
```

---

## 🎨 Patrones de Estilo

### Tema Consistente

```typescript
// Usar siempre las variantes del sistema
<Button variant="primary">Acción Principal</Button>
<Button variant="secondary">Acción Secundaria</Button>
<Badge variant="success">Estado Exitoso</Badge>
<Badge variant="warning">Estado de Advertencia</Badge>

// Mantener consistencia en tamaños
<Button size="sm">Acción Pequeña</Button>
<Button size="md">Acción Normal</Button>
<Button size="lg">Acción Destacada</Button>
```

### Espaciado Consistente

```typescript
// Usar el sistema de espaciado de Tailwind
<div className="space-y-4">  {/* Espaciado vertical */}
  <Card>...</Card>
  <Card>...</Card>
</div>

<div className="space-x-4">  {/* Espaciado horizontal */}
  <Button>Cancelar</Button>
  <Button>Guardar</Button>
</div>

// Grid responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>
```

---

*Última actualización: Enero 2025*
