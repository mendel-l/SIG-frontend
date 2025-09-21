# 🔧 API de Componentes - Referencia Técnica

Esta documentación proporciona una referencia completa de todas las props y APIs disponibles para cada componente.

## 📋 Tabla de Contenidos

- [Componentes Básicos](#componentes-básicos-1)
- [Componentes de Formulario](#componentes-de-formulario-1)
- [Componentes de Navegación](#componentes-de-navegación-1)
- [Componentes de Feedback](#componentes-de-feedback-1)
- [Componentes de Datos](#componentes-de-datos-1)
- [Componentes de Layout](#componentes-de-layout-1)
- [Tipos Base](#tipos-base)

---

## 🧱 Componentes Básicos

### Button

```typescript
interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}
```

**Props Detalladas:**

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'primary'` | Estilo visual del botón |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño del botón |
| `disabled` | `boolean` | `false` | Deshabilita el botón |
| `loading` | `boolean` | `false` | Muestra estado de carga |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Tipo de botón HTML |
| `onClick` | `() => void` | `undefined` | Función de callback al hacer click |
| `className` | `string` | `undefined` | Clases CSS adicionales |

**Ejemplo de Uso:**
```typescript
<Button 
  variant="success" 
  size="lg" 
  loading={isLoading}
  onClick={handleSave}
  className="custom-button"
>
  Guardar Cambios
</Button>
```

### Card

```typescript
interface CardProps extends BaseComponentProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

interface CardHeaderProps extends BaseComponentProps {}
interface CardTitleProps extends BaseComponentProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}
interface CardDescriptionProps extends BaseComponentProps {}
interface CardContentProps extends BaseComponentProps {}
interface CardFooterProps extends BaseComponentProps {}
```

**Props Detalladas:**

| Componente | Prop | Tipo | Default | Descripción |
|------------|------|------|---------|-------------|
| Card | `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Espaciado interno |
| Card | `shadow` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'sm'` | Intensidad de sombra |
| CardTitle | `as` | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'` | `'h3'` | Elemento HTML del título |

---

## 📝 Componentes de Formulario

### Input

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, BaseComponentProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

**Props Detalladas:**

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `label` | `string` | `undefined` | Etiqueta del campo |
| `error` | `string` | `undefined` | Mensaje de error |
| `helperText` | `string` | `undefined` | Texto de ayuda |
| `leftIcon` | `ReactNode` | `undefined` | Icono a la izquierda |
| `rightIcon` | `ReactNode` | `undefined` | Icono a la derecha |
| `type` | `string` | `'text'` | Tipo de input HTML |
| `placeholder` | `string` | `undefined` | Texto placeholder |
| `value` | `string` | `undefined` | Valor controlado |
| `onChange` | `(e: ChangeEvent<HTMLInputElement>) => void` | `undefined` | Callback de cambio |
| `disabled` | `boolean` | `false` | Deshabilita el campo |
| `required` | `boolean` | `false` | Campo requerido |

### Select

```typescript
interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>, BaseComponentProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}
```

**Props Detalladas:**

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `label` | `string` | `undefined` | Etiqueta del campo |
| `error` | `string` | `undefined` | Mensaje de error |
| `helperText` | `string` | `undefined` | Texto de ayuda |
| `options` | `SelectOption[]` | `[]` | Opciones del select |
| `placeholder` | `string` | `undefined` | Texto placeholder |
| `value` | `string` | `undefined` | Valor seleccionado |
| `onChange` | `(e: ChangeEvent<HTMLSelectElement>) => void` | `undefined` | Callback de cambio |
| `disabled` | `boolean` | `false` | Deshabilita el campo |

### Textarea

```typescript
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, BaseComponentProps {
  label?: string;
  error?: string;
  helperText?: string;
}
```

**Props Detalladas:**

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `label` | `string` | `undefined` | Etiqueta del campo |
| `error` | `string` | `undefined` | Mensaje de error |
| `helperText` | `string` | `undefined` | Texto de ayuda |
| `rows` | `number` | `3` | Número de filas |
| `placeholder` | `string` | `undefined` | Texto placeholder |
| `value` | `string` | `undefined` | Valor controlado |
| `onChange` | `(e: ChangeEvent<HTMLTextAreaElement>) => void` | `undefined` | Callback de cambio |
| `disabled` | `boolean` | `false` | Deshabilita el campo |

### Switch

```typescript
interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, BaseComponentProps {
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}
```

**Props Detalladas:**

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `label` | `string` | `undefined` | Etiqueta del switch |
| `description` | `string` | `undefined` | Descripción adicional |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño del switch |
| `checked` | `boolean` | `false` | Estado del switch |
| `onChange` | `(e: ChangeEvent<HTMLInputElement>) => void` | `undefined` | Callback de cambio |
| `disabled` | `boolean` | `false` | Deshabilita el switch |

---

## 🧭 Componentes de Navegación

### Tabs

```typescript
interface TabsProps extends BaseComponentProps {
  defaultValue: string;
  children: ReactNode;
}

interface TabsListProps extends BaseComponentProps {
  children: ReactNode;
}

interface TabsTriggerProps extends BaseComponentProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
}

interface TabsContentProps extends BaseComponentProps {
  value: string;
  children: ReactNode;
}
```

**Props Detalladas:**

| Componente | Prop | Tipo | Default | Descripción |
|------------|------|------|---------|-------------|
| Tabs | `defaultValue` | `string` | `required` | Pestaña activa por defecto |
| TabsTrigger | `value` | `string` | `required` | Identificador de la pestaña |
| TabsTrigger | `disabled` | `boolean` | `false` | Deshabilita la pestaña |
| TabsContent | `value` | `string` | `required` | Identificador del contenido |

### Dropdown

```typescript
interface DropdownProps extends BaseComponentProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right';
}

interface DropdownItemProps extends BaseComponentProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
}

interface DropdownSeparatorProps extends BaseComponentProps {}
interface DropdownLabelProps extends BaseComponentProps {
  children: ReactNode;
}
```

**Props Detalladas:**

| Componente | Prop | Tipo | Default | Descripción |
|------------|------|------|---------|-------------|
| Dropdown | `trigger` | `ReactNode` | `required` | Elemento que activa el dropdown |
| Dropdown | `align` | `'left' \| 'right'` | `'left'` | Alineación del dropdown |
| DropdownItem | `onClick` | `() => void` | `undefined` | Callback al hacer click |
| DropdownItem | `disabled` | `boolean` | `false` | Deshabilita el item |
| DropdownItem | `icon` | `ReactNode` | `undefined` | Icono del item |

---

## 💬 Componentes de Feedback

### Modal

```typescript
interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  children: ReactNode;
}

interface ModalHeaderProps extends BaseComponentProps {
  children: ReactNode;
}

interface ModalBodyProps extends BaseComponentProps {
  children: ReactNode;
}

interface ModalFooterProps extends BaseComponentProps {
  children: ReactNode;
}
```

**Props Detalladas:**

| Componente | Prop | Tipo | Default | Descripción |
|------------|------|------|---------|-------------|
| Modal | `isOpen` | `boolean` | `required` | Estado de apertura |
| Modal | `onClose` | `() => void` | `required` | Callback para cerrar |
| Modal | `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Tamaño del modal |
| Modal | `showCloseButton` | `boolean` | `true` | Mostrar botón de cerrar |

### Badge

```typescript
interface BadgeProps extends BaseComponentProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

**Props Detalladas:**

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `variant` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'secondary' \| 'outline'` | `'default'` | Estilo visual del badge |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño del badge |
| `children` | `ReactNode` | `required` | Contenido del badge |

### Tooltip

```typescript
interface TooltipProps extends BaseComponentProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  children: ReactNode;
}
```

**Props Detalladas:**

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `content` | `string` | `required` | Texto del tooltip |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Posición del tooltip |
| `delay` | `number` | `300` | Delay en milisegundos |
| `children` | `ReactNode` | `required` | Elemento que activa el tooltip |

### ProgressBar

```typescript
interface ProgressBarProps extends BaseComponentProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}
```

**Props Detalladas:**

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `value` | `number` | `required` | Valor actual del progreso |
| `max` | `number` | `100` | Valor máximo del progreso |
| `variant` | `'default' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | Color del progreso |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño de la barra |
| `showLabel` | `boolean` | `false` | Mostrar etiqueta con porcentaje |
| `animated` | `boolean` | `false` | Animación de pulso |

---

## 👤 Componentes de Datos

### Avatar

```typescript
interface AvatarProps extends BaseComponentProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  onClick?: () => void;
}
```

**Props Detalladas:**

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `src` | `string` | `undefined` | URL de la imagen |
| `alt` | `string` | `'Avatar'` | Texto alternativo |
| `fallback` | `string` | `'?'` | Iniciales cuando no hay imagen |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Tamaño del avatar |
| `status` | `'online' \| 'offline' \| 'away' \| 'busy'` | `undefined` | Estado de conexión |
| `onClick` | `() => void` | `undefined` | Callback al hacer click |

### LoadingSpinner

```typescript
interface LoadingSpinnerProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
}
```

**Props Detalladas:**

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño del spinner |

---

## 🏗️ Tipos Base

### BaseComponentProps

```typescript
interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}
```

Todos los componentes extienden de `BaseComponentProps`, que proporciona:

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `className` | `string` | `undefined` | Clases CSS adicionales |
| `children` | `ReactNode` | `undefined` | Contenido hijo del componente |

---

## 🎨 Variantes de Estilo

### Colores de Variantes

| Variante | Color Claro | Color Oscuro | Uso |
|----------|-------------|--------------|-----|
| `default` | Gray | Gray | Estado neutro |
| `primary` | Blue | Blue | Acción principal |
| `success` | Green | Green | Éxito, confirmación |
| `warning` | Yellow | Yellow | Advertencia |
| `danger` | Red | Red | Error, peligro |
| `secondary` | Gray | Gray | Acción secundaria |
| `outline` | Transparente | Transparente | Estilo minimalista |

### Tamaños

| Tamaño | Descripción | Uso |
|--------|-------------|-----|
| `sm` | Pequeño | Elementos compactos |
| `md` | Mediano | Uso general |
| `lg` | Grande | Elementos destacados |
| `xl` | Extra grande | Headers, elementos principales |

---

## 🔄 Estados de Componentes

### Estados Comunes

| Estado | Descripción | Props Relacionadas |
|--------|-------------|-------------------|
| `default` | Estado normal | - |
| `disabled` | Deshabilitado | `disabled={true}` |
| `loading` | Cargando | `loading={true}` |
| `error` | Error | `error="mensaje"` |
| `success` | Éxito | `variant="success"` |

### Estados de Focus

Todos los componentes incluyen estados de focus accesibles:

```css
/* Focus visible */
focus-visible:ring-2 focus-visible:ring-primary-500

/* Focus dentro del componente */
focus-within:ring-2 focus-within:ring-primary-500
```

---

## 📱 Responsive Design

### Breakpoints

Los componentes se adaptan automáticamente a estos breakpoints:

| Breakpoint | Ancho | Uso |
|------------|-------|-----|
| `sm` | 640px+ | Móviles grandes |
| `md` | 768px+ | Tablets |
| `lg` | 1024px+ | Laptops |
| `xl` | 1280px+ | Desktops |
| `2xl` | 1536px+ | Pantallas grandes |

### Clases Responsive

```typescript
// Los componentes usan clases responsive automáticamente
className="w-full md:w-1/2 lg:w-1/3"
```

---

## ♿ Accesibilidad

### ARIA Labels

Todos los componentes incluyen atributos ARIA apropiados:

```typescript
// Ejemplo de uso con ARIA
<Button 
  aria-label="Cerrar modal"
  aria-describedby="modal-description"
>
  <X className="h-4 w-4" />
</Button>
```

### Navegación por Teclado

Los componentes soportan navegación por teclado:

| Tecla | Acción |
|-------|--------|
| `Tab` | Navegar entre elementos |
| `Enter/Space` | Activar botones |
| `Escape` | Cerrar modales |
| `Arrow Keys` | Navegar en tabs |

---

## 🧪 Testing

### Props para Testing

Todos los componentes incluyen props para testing:

```typescript
// Ejemplo de testing
<Button 
  data-testid="save-button"
  aria-label="Guardar cambios"
>
  Guardar
</Button>
```

### Queries de Testing Recomendadas

```typescript
// Por testid
screen.getByTestId('save-button')

// Por role
screen.getByRole('button', { name: 'Guardar' })

// Por label
screen.getByLabelText('Email')
```

---

*Última actualización: Enero 2025*
