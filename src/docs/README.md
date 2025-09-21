# 📚 Documentación del Sistema SIG Municipal

Bienvenido a la documentación completa del sistema de componentes y funcionalidades del SIG Municipal.

## 📋 Tabla de Contenidos

### 🧱 Componentes UI
- **[Documentación de Componentes](./components.md)** - Guía completa de todos los componentes disponibles
- **[API de Componentes](./component-api.md)** - Referencia técnica de props y APIs
- **[Patrones de Uso](./usage-patterns.md)** - Mejores prácticas y patrones comunes
- **[Ejemplos Prácticos](./examples.md)** - Ejemplos completos y listos para usar

### 🔔 Sistema de Notificaciones
- **[Notificaciones](./notifications.md)** - Guía del sistema de toast notifications

### 🏗️ Arquitectura
- **[Estructura del Proyecto](#estructura-del-proyecto)**
- **[Convenciones de Código](#convenciones-de-código)**
- **[Guía de Contribución](#guía-de-contribución)**

---

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes de interfaz
│   ├── layout/         # Componentes de layout
│   ├── forms/          # Componentes de formularios
│   └── auth/           # Componentes de autenticación
├── hooks/              # Hooks personalizados
├── pages/              # Páginas de la aplicación
├── stores/             # Estado global (Zustand)
├── types/              # Definiciones de TypeScript
├── utils/              # Funciones utilitarias
├── docs/               # Documentación
└── assets/             # Recursos estáticos
```

### 📁 Componentes UI

| Componente | Descripción | Documentación |
|------------|-------------|---------------|
| **Button** | Botón interactivo con múltiples variantes | [Ver docs](./components.md#button) |
| **Card** | Contenedor con estilo para agrupar contenido | [Ver docs](./components.md#card) |
| **Input** | Campo de entrada de texto con validación | [Ver docs](./components.md#input) |
| **Select** | Campo de selección desplegable | [Ver docs](./components.md#select) |
| **Textarea** | Campo de texto multilínea | [Ver docs](./components.md#textarea) |
| **Switch** | Interruptor de encendido/apagado | [Ver docs](./components.md#switch) |
| **Modal** | Ventana emergente para confirmaciones | [Ver docs](./components.md#modal) |
| **Badge** | Etiqueta para mostrar estados | [Ver docs](./components.md#badge) |
| **Tooltip** | Información adicional al hacer hover | [Ver docs](./components.md#tooltip) |
| **Dropdown** | Menú desplegable personalizado | [Ver docs](./components.md#dropdown) |
| **ProgressBar** | Indicador de progreso para tareas | [Ver docs](./components.md#progressbar) |
| **Tabs** | Organización de contenido en pestañas | [Ver docs](./components.md#tabs) |
| **Avatar** | Imagen de perfil con fallback | [Ver docs](./components.md#avatar) |
| **LoadingSpinner** | Indicador de carga | [Ver docs](./components.md#loadingspinner) |

### 🔧 Hooks Personalizados

| Hook | Descripción | Uso |
|------|-------------|-----|
| **useAuth** | Manejo de autenticación | `const { user, login, logout } = useAuth()` |
| **useTheme** | Gestión de tema claro/oscuro | `const { theme, setTheme } = useTheme()` |
| **useNotifications** | Sistema de notificaciones toast | `const { showSuccess, showError } = useNotifications()` |
| **useUsers** | CRUD de usuarios | `const { users, createUser, updateUser } = useUsers()` |
| **useLocalStorage** | Persistencia en localStorage | `const [value, setValue] = useLocalStorage('key', defaultValue)` |
| **useDebounce** | Debounce para búsquedas | `const debouncedValue = useDebounce(value, 500)` |

---

## 🎨 Convenciones de Código

### 📝 Naming Conventions

#### Componentes
```typescript
// ✅ Correcto - PascalCase
export const UserProfile = () => { ... }

// ❌ Incorrecto - camelCase
export const userProfile = () => { ... }
```

#### Props y Variables
```typescript
// ✅ Correcto - camelCase
interface ButtonProps {
  isLoading: boolean;
  onButtonClick: () => void;
  variant: 'primary' | 'secondary';
}

// ❌ Incorrecto - snake_case
interface ButtonProps {
  is_loading: boolean;
  on_button_click: () => void;
  button_variant: 'primary' | 'secondary';
}
```

#### Archivos
```
// ✅ Correcto
UserProfile.tsx
user-profile.tsx
UserProfile.test.tsx

// ❌ Incorrecto
userProfile.tsx
user_profile.tsx
userprofile.tsx
```

### 🏗️ Estructura de Componentes

```typescript
// 1. Imports
import { useState } from 'react';
import { Button, Card } from '@/components/ui';

// 2. Types/Interfaces
interface ComponentProps {
  title: string;
  onAction: () => void;
}

// 3. Component
export function MyComponent({ title, onAction }: ComponentProps) {
  // 4. Hooks
  const [isLoading, setIsLoading] = useState(false);
  
  // 5. Event Handlers
  const handleClick = () => {
    setIsLoading(true);
    onAction();
  };
  
  // 6. Render
  return (
    <Card>
      <h2>{title}</h2>
      <Button onClick={handleClick} loading={isLoading}>
        Acción
      </Button>
    </Card>
  );
}
```

### 🎯 Patrones de Props

#### Props Obligatorias vs Opcionales
```typescript
// ✅ Correcto - Props obligatorias primero
interface ButtonProps {
  children: ReactNode;           // Obligatoria
  onClick: () => void;          // Obligatoria
  variant?: 'primary' | 'secondary'; // Opcional
  size?: 'sm' | 'md' | 'lg';    // Opcional
  disabled?: boolean;           // Opcional
}
```

#### Extensión de Props HTML
```typescript
// ✅ Correcto - Extender props HTML nativas
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

// Uso
<Button 
  variant="primary" 
  onClick={handleClick}
  aria-label="Guardar cambios"  // Props HTML nativas
  disabled={isLoading}
>
  Guardar
</Button>
```

### 🎨 Estilos y Clases

#### Uso de Tailwind
```typescript
// ✅ Correcto - Clases semánticas
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
    Título
  </h3>
  <Button variant="secondary">Acción</Button>
</div>

// ❌ Incorrecto - Clases muy específicas
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
```

#### Clases Condicionales
```typescript
import { cn } from '@/utils';

// ✅ Correcto - Usar función cn
<Button 
  className={cn(
    'base-button-classes',
    variant === 'primary' && 'primary-classes',
    size === 'lg' && 'large-classes',
    disabled && 'disabled-classes',
    className // Permitir clases adicionales
  )}
>
  {children}
</Button>
```

---

## 🚀 Guía de Uso Rápido

### 🔧 Instalación y Setup

```bash
# Clonar el repositorio
git clone <repository-url>
cd sig-frontend-modern

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

### 📦 Importación de Componentes

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

// Importar hooks
import { useAuth, useTheme, useNotifications } from '@/hooks';
```

### 🎯 Uso Básico

```typescript
import { useState } from 'react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { useNotifications } from '@/hooks/useNotifications';

function MyPage() {
  const [count, setCount] = useState(0);
  const { showSuccess } = useNotifications();

  const handleIncrement = () => {
    setCount(count + 1);
    showSuccess('Contador actualizado', `El valor ahora es ${count + 1}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mi Página</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Contador: {count}</p>
        <Button onClick={handleIncrement}>
          Incrementar
        </Button>
      </CardContent>
    </Card>
  );
}
```

---

## 🧪 Testing

### 🔍 Testing de Componentes

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui';

test('Button renders correctly', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toBeInTheDocument();
});

test('Button calls onClick handler', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### 🎯 Testing de Hooks

```typescript
import { renderHook, act } from '@testing-library/react';
import { useNotifications } from '@/hooks/useNotifications';

test('useNotifications shows success message', () => {
  const { result } = renderHook(() => useNotifications());
  
  act(() => {
    result.current.showSuccess('Test message');
  });
  
  // Verificar que se muestra la notificación
  expect(document.querySelector('[data-testid="toast"]')).toBeInTheDocument();
});
```

---

## 🔧 Configuración del Entorno

### 📝 Variables de Entorno

```bash
# .env.local
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=SIG Municipal
VITE_APP_VERSION=1.0.0
```

### ⚙️ Configuración de TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 🎨 Configuración de Tailwind

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    }
  }
}
```

---

## 🤝 Guía de Contribución

### 🔄 Proceso de Contribución

1. **Fork** el repositorio
2. **Crear** una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. **Commit** tus cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. **Push** a la rama: `git push origin feature/nueva-funcionalidad`
5. **Crear** un Pull Request

### 📋 Checklist para PRs

- [ ] Código sigue las convenciones establecidas
- [ ] Componentes tienen TypeScript types completos
- [ ] Documentación actualizada
- [ ] Tests incluidos (si aplica)
- [ ] Responsive design verificado
- [ ] Accesibilidad verificada
- [ ] Tema claro/oscuro soportado

### 🐛 Reportar Bugs

Al reportar bugs, incluye:

1. **Descripción** clara del problema
2. **Pasos** para reproducir
3. **Comportamiento** esperado vs actual
4. **Screenshots** (si aplica)
5. **Información** del entorno (navegador, OS, etc.)

### ✨ Solicitar Features

Para solicitar nuevas features:

1. **Descripción** detallada de la funcionalidad
2. **Caso de uso** y beneficio
3. **Ejemplos** de implementación (si aplica)
4. **Prioridad** y urgencia

---

## 📞 Soporte y Contacto

### 📧 Contacto
- **Email**: soporte@sig-municipal.com
- **Slack**: #sig-frontend
- **GitHub Issues**: Para bugs y features

### 📚 Recursos Adicionales
- [Tailwind CSS](https://tailwindcss.com/) - Framework de estilos
- [Headless UI](https://headlessui.com/) - Componentes accesibles
- [React Hook Form](https://react-hook-form.com/) - Manejo de formularios
- [Zod](https://zod.dev/) - Validación de esquemas
- [Zustand](https://zustand-demo.pmnd.rs/) - Estado global

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](../LICENSE) para más detalles.

---

*Última actualización: Enero 2025*
*Versión de la documentación: 1.0.0*
