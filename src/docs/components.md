# 📚 Documentación de Componentes UI

Este documento describe todos los componentes reutilizables disponibles en el sistema SIG Municipal.

## 📋 Tabla de Contenidos

- [Componentes Básicos](#componentes-básicos)
- [Componentes de Formulario](#componentes-de-formulario)
- [Componentes de Navegación](#componentes-de-navegación)
- [Componentes de Feedback](#componentes-de-feedback)
- [Componentes de Datos](#componentes-de-datos)
- [Componentes de Layout](#componentes-de-layout)
- [Guía de Uso](#guía-de-uso)
- [Mejores Prácticas](#mejores-prácticas)

---

## 🧱 Componentes Básicos

### Button
Botón interactivo con múltiples variantes y estados.

```typescript
import { Button } from '@/components/ui';

// Uso básico
<Button>Click me</Button>

// Con variantes
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
<Button variant="danger">Danger</Button>

// Con tamaños
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Estados especiales
<Button loading>Cargando...</Button>
<Button disabled>Deshabilitado</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `disabled`: boolean
- `type`: 'button' | 'submit' | 'reset'

### Card
Contenedor con estilo para agrupar contenido relacionado.

```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui';

<Card>
  <CardHeader>
    <CardTitle>Título de la tarjeta</CardTitle>
    <CardDescription>Descripción opcional</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Contenido principal de la tarjeta</p>
  </CardContent>
  <CardFooter>
    <Button>Acción</Button>
  </CardFooter>
</Card>
```

**Props:**
- `padding`: 'none' | 'sm' | 'md' | 'lg'
- `shadow`: 'none' | 'sm' | 'md' | 'lg'

---

## 📝 Componentes de Formulario

### Input
Campo de entrada de texto con validación y estados.

```typescript
import { Input } from '@/components/ui';

// Básico
<Input placeholder="Ingresa tu nombre" />

// Con label y validación
<Input
  label="Email"
  type="email"
  placeholder="tu@email.com"
  error="Email inválido"
  helperText="Ingresa un email válido"
/>

// Con iconos
<Input
  label="Buscar"
  leftIcon={<Search className="h-4 w-4" />}
  rightIcon={<X className="h-4 w-4" />}
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `leftIcon`: ReactNode
- `rightIcon`: ReactNode
- `type`: string (input types)

### Select
Campo de selección desplegable.

```typescript
import { Select } from '@/components/ui';

const options = [
  { value: 'admin', label: 'Administrador' },
  { value: 'user', label: 'Usuario' },
  { value: 'guest', label: 'Invitado' },
];

<Select
  label="Rol"
  options={options}
  placeholder="Selecciona un rol"
  error="Selecciona un rol válido"
/>
```

**Props:**
- `label`: string
- `options`: Array<{value: string, label: string}>
- `placeholder`: string
- `error`: string
- `helperText`: string

### Textarea
Campo de texto multilínea.

```typescript
import { Textarea } from '@/components/ui';

<Textarea
  label="Descripción"
  placeholder="Escribe una descripción..."
  rows={4}
  helperText="Máximo 500 caracteres"
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `rows`: number

### Switch
Interruptor de encendido/apagado.

```typescript
import { Switch } from '@/components/ui';

<Switch
  label="Notificaciones"
  description="Recibe notificaciones por email"
  checked={notifications}
  onChange={(e) => setNotifications(e.target.checked)}
/>
```

**Props:**
- `label`: string
- `description`: string
- `checked`: boolean
- `onChange`: (e: ChangeEvent) => void
- `size`: 'sm' | 'md' | 'lg'

---

## 🧭 Componentes de Navegación

### Tabs
Organización de contenido en pestañas.

```typescript
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Información</TabsTrigger>
    <TabsTrigger value="tab2">Configuración</TabsTrigger>
    <TabsTrigger value="tab3">Historial</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    <p>Contenido de la pestaña 1</p>
  </TabsContent>
  <TabsContent value="tab2">
    <p>Contenido de la pestaña 2</p>
  </TabsContent>
  <TabsContent value="tab3">
    <p>Contenido de la pestaña 3</p>
  </TabsContent>
</Tabs>
```

### Dropdown
Menú desplegable personalizado.

```typescript
import { Dropdown, DropdownItem, DropdownSeparator, DropdownLabel } from '@/components/ui';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';

<Dropdown
  trigger={
    <Button variant="secondary">
      Acciones <MoreVertical className="h-4 w-4 ml-2" />
    </Button>
  }
>
  <DropdownLabel>Acciones de Usuario</DropdownLabel>
  <DropdownItem icon={<Edit />}>Editar</DropdownItem>
  <DropdownSeparator />
  <DropdownItem icon={<Trash2 />}>Eliminar</DropdownItem>
</Dropdown>
```

**Props del Dropdown:**
- `trigger`: ReactNode
- `align`: 'left' | 'right'

**Props del DropdownItem:**
- `icon`: ReactNode
- `onClick`: () => void
- `disabled`: boolean

---

## 💬 Componentes de Feedback

### Modal
Ventana emergente para confirmaciones y formularios.

```typescript
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui';

const [isOpen, setIsOpen] = useState(false);

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="md">
  <ModalHeader>Confirmar Acción</ModalHeader>
  <ModalBody>
    <p>¿Estás seguro de que quieres continuar?</p>
  </ModalBody>
  <ModalFooter>
    <Button variant="secondary" onClick={() => setIsOpen(false)}>
      Cancelar
    </Button>
    <Button variant="danger" onClick={handleConfirm}>
      Confirmar
    </Button>
  </ModalFooter>
</Modal>
```

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `showCloseButton`: boolean

### Badge
Etiqueta para mostrar estados o categorías.

```typescript
import { Badge } from '@/components/ui';

// Variantes
<Badge variant="default">Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>

// Tamaños
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

**Props:**
- `variant`: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'secondary' | 'outline'
- `size`: 'sm' | 'md' | 'lg'

### Tooltip
Información adicional al hacer hover.

```typescript
import { Tooltip } from '@/components/ui';

<Tooltip content="Este es un tooltip" position="top">
  <Button>Hover me</Button>
</Tooltip>
```

**Props:**
- `content`: string
- `position`: 'top' | 'bottom' | 'left' | 'right'
- `delay`: number (ms)

### ProgressBar
Indicador de progreso para tareas.

```typescript
import { ProgressBar } from '@/components/ui';

<ProgressBar 
  value={75} 
  max={100} 
  variant="success" 
  showLabel 
  size="md"
/>
```

**Props:**
- `value`: number
- `max`: number (default: 100)
- `variant`: 'default' | 'success' | 'warning' | 'danger' | 'info'
- `size`: 'sm' | 'md' | 'lg'
- `showLabel`: boolean
- `animated`: boolean

---

## 👤 Componentes de Datos

### Avatar
Imagen de perfil con fallback y estados.

```typescript
import { Avatar } from '@/components/ui';

// Con iniciales
<Avatar fallback="JD" size="md" />

// Con imagen
<Avatar 
  src="/user.jpg" 
  alt="Usuario"
  fallback="JD"
  size="lg"
/>

// Con estado de conexión
<Avatar 
  fallback="JD" 
  status="online"
  size="md"
/>
```

**Props:**
- `src`: string (URL de la imagen)
- `alt`: string
- `fallback`: string (iniciales)
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `status`: 'online' | 'offline' | 'away' | 'busy'
- `onClick`: () => void

---

## 🎨 Componentes de Layout

### LoadingSpinner
Indicador de carga en diferentes tamaños.

```typescript
import { LoadingSpinner } from '@/components/ui';

<LoadingSpinner size="sm" />
<LoadingSpinner size="md" />
<LoadingSpinner size="lg" />
```

**Props:**
- `size`: 'sm' | 'md' | 'lg'

---

## 🚀 Guía de Uso

### Importación de Componentes

```typescript
// Importar componentes individuales
import { Button, Card, Input } from '@/components/ui';

// Importar múltiples componentes
import { 
  Button, 
  Card, 
  Input, 
  Modal, 
  Badge 
} from '@/components/ui';
```

### Uso con TypeScript

Todos los componentes están completamente tipados:

```typescript
interface MyComponentProps {
  title: string;
  onSave: (data: FormData) => void;
}

function MyComponent({ title, onSave }: MyComponentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => onSave(formData)}>
          Guardar
        </Button>
      </CardContent>
    </Card>
  );
}
```

### Tema Claro/Oscuro

Todos los componentes soportan automáticamente el tema claro/oscuro:

```typescript
// Los componentes se adaptan automáticamente
<Button>Botón que cambia con el tema</Button>
<Card>Tarjeta que cambia con el tema</Card>
```

### Responsive Design

Los componentes son responsive por defecto:

```typescript
// Se adaptan automáticamente a diferentes tamaños de pantalla
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>Tarjeta 1</Card>
  <Card>Tarjeta 2</Card>
  <Card>Tarjeta 3</Card>
</div>
```

---

## ✅ Mejores Prácticas

### 1. Consistencia
- Usa siempre los componentes del sistema
- Mantén el mismo patrón de props en componentes similares
- Sigue las convenciones de naming

### 2. Accesibilidad
- Siempre proporciona `alt` text para imágenes
- Usa `aria-label` cuando sea necesario
- Asegúrate de que todos los elementos sean navegables por teclado

### 3. Performance
- Usa `React.memo` para componentes que no cambian frecuentemente
- Evita re-renders innecesarios
- Usa `useCallback` para funciones que se pasan como props

### 4. Testing
- Prueba todos los estados de los componentes
- Verifica la accesibilidad
- Prueba la responsividad en diferentes dispositivos

### 5. Documentación
- Documenta props complejas
- Incluye ejemplos de uso
- Mantén la documentación actualizada

---

## 🔧 Extensión de Componentes

### Crear un Componente Personalizado

```typescript
import { forwardRef } from 'react';
import { cn } from '@/utils';
import { BaseComponentProps } from '@/types';

interface MyCustomComponentProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const MyCustomComponent = forwardRef<HTMLDivElement, MyCustomComponentProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'base-classes',
          variant === 'primary' && 'primary-classes',
          variant === 'secondary' && 'secondary-classes',
          size === 'sm' && 'small-classes',
          size === 'md' && 'medium-classes',
          size === 'lg' && 'large-classes',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MyCustomComponent.displayName = 'MyCustomComponent';
```

### Agregar al Índice

```typescript
// src/components/ui/index.ts
export { MyCustomComponent } from './MyCustomComponent';
```

---

## 📚 Recursos Adicionales

- [Storybook](https://storybook.js.org/) - Para desarrollo de componentes
- [Tailwind CSS](https://tailwindcss.com/) - Framework de estilos
- [Headless UI](https://headlessui.com/) - Componentes accesibles
- [Lucide React](https://lucide.dev/) - Iconos
- [React Hook Form](https://react-hook-form.com/) - Manejo de formularios
- [Zod](https://zod.dev/) - Validación de esquemas

---

## 🤝 Contribuir

Para contribuir con nuevos componentes:

1. Crea el componente siguiendo las convenciones existentes
2. Agrega TypeScript types completos
3. Incluye soporte para tema claro/oscuro
4. Añade ejemplos de uso
5. Actualiza esta documentación
6. Prueba en diferentes dispositivos y navegadores

---

*Última actualización: Enero 2025*
