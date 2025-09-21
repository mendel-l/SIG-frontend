# 📢 Sistema de Notificaciones Toast

## 🎯 **Descripción General**

El sistema de notificaciones toast proporciona feedback visual inmediato a los usuarios sobre las acciones realizadas en la aplicación. Está construido sobre `react-hot-toast` y personalizado para integrarse perfectamente con nuestro sistema de temas.

## 🚀 **Instalación y Configuración**

### **Dependencias**
```bash
npm install react-hot-toast
```

### **Configuración en main.tsx**
```tsx
import { Toaster } from 'react-hot-toast';

<Toaster
  position="top-right"
  toastOptions={{
    duration: 4000,
    style: {
      background: '#363636',
      color: '#fff',
    },
    success: {
      duration: 3000,
      iconTheme: {
        primary: '#22c55e',
        secondary: '#fff',
      },
    },
    error: {
      duration: 5000,
      iconTheme: {
        primary: '#ef4444',
        secondary: '#fff',
      },
    },
  }}
/>
```

## 🛠️ **Hook useNotifications**

### **Importación**
```tsx
import { useNotifications } from '@/hooks/useNotifications';
```

### **Uso Básico**
```tsx
function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo } = useNotifications();

  const handleAction = () => {
    showSuccess('Operación exitosa', 'Los datos se han guardado correctamente');
  };

  return <button onClick={handleAction}>Ejecutar</button>;
}
```

### **Métodos Disponibles**

#### **1. showSuccess(title, message?, options?)**
```tsx
showSuccess('Usuario creado', 'El usuario ha sido agregado al sistema');
```

#### **2. showError(title, message?, options?)**
```tsx
showError('Error de validación', 'Por favor, revisa los campos requeridos');
```

#### **3. showWarning(title, message?, options?)**
```tsx
showWarning('Advertencia', 'Esta acción no se puede deshacer');
```

#### **4. showInfo(title, message?, options?)**
```tsx
showInfo('Información', 'Los cambios se aplicarán en la próxima sesión');
```

#### **5. showLoading(message, options?)**
```tsx
const loadingToast = showLoading('Procesando datos...');

// Actualizar después de completar
updateLoading(loadingToast, 'Datos procesados exitosamente', 'success');
```

#### **6. updateLoading(toastId, message, type)**
```tsx
updateLoading(loadingToast, 'Error al procesar', 'error');
```

#### **7. showCustom(message, options?)**
```tsx
showCustom('Mensaje personalizado', {
  icon: '🎉',
  style: { background: '#8b5cf6', color: '#fff' }
});
```

#### **8. dismiss(toastId?)**
```tsx
dismiss(); // Dismiss all
dismiss(toastId); // Dismiss specific
```

#### **9. dismissAll()**
```tsx
dismissAll();
```

## 🎨 **Componente Notification Personalizado**

### **Importación**
```tsx
import { showNotification } from '@/components/ui';
```

### **Uso**
```tsx
showNotification.success('Título', 'Mensaje opcional');
showNotification.error('Error', 'Descripción del error');
showNotification.warning('Advertencia', 'Mensaje de precaución');
showNotification.info('Información', 'Detalles adicionales');
```

### **Características**
- ✅ Diseño consistente con el tema
- ✅ Iconos semánticos (CheckCircle, XCircle, AlertTriangle, Info)
- ✅ Colores adaptativos para modo claro/oscuro
- ✅ Animaciones suaves
- ✅ Botón de cierre opcional

## 📋 **Ejemplos de Uso**

### **1. Formulario de Usuario**
```tsx
const handleSubmit = async (data) => {
  try {
    await createUser(data);
    showSuccess('Usuario creado', `${data.name} ha sido agregado al sistema`);
  } catch (error) {
    showError('Error al crear usuario', 'Por favor, revisa los datos e intenta nuevamente');
  }
};
```

### **2. Operación de Carga**
```tsx
const handleExport = async () => {
  const loadingToast = showLoading('Exportando datos...');
  
  try {
    await exportData();
    updateLoading(loadingToast, 'Datos exportados exitosamente', 'success');
  } catch (error) {
    updateLoading(loadingToast, 'Error al exportar datos', 'error');
  }
};
```

### **3. Configuración de Tema**
```tsx
const handleThemeChange = (newTheme) => {
  setTheme(newTheme);
  showSuccess('Tema actualizado', `El tema ha sido cambiado a ${newTheme}`);
};
```

### **4. Validación de Formulario**
```tsx
const validateForm = (data) => {
  if (!data.email) {
    showError('Campo requerido', 'El email es obligatorio');
    return false;
  }
  
  if (!isValidEmail(data.email)) {
    showWarning('Email inválido', 'Por favor, ingresa un email válido');
    return false;
  }
  
  return true;
};
```

## 🎯 **Mejores Prácticas**

### **1. Mensajes Claros y Concisos**
```tsx
// ✅ Bueno
showSuccess('Usuario actualizado', 'Los cambios se han guardado correctamente');

// ❌ Malo
showSuccess('OK');
```

### **2. Usar el Tipo Correcto**
```tsx
// ✅ Éxito para operaciones completadas
showSuccess('Datos guardados');

// ✅ Error para fallos críticos
showError('No se pudo conectar al servidor');

// ✅ Advertencia para situaciones de precaución
showWarning('Esta acción eliminará todos los datos');

// ✅ Info para información general
showInfo('Los cambios se aplicarán mañana');
```

### **3. Duración Apropiada**
```tsx
// ✅ Errores más tiempo (5s)
showError('Error crítico', undefined, { duration: 5000 });

// ✅ Éxitos menos tiempo (3s)
showSuccess('Operación exitosa', undefined, { duration: 3000 });
```

### **4. Posicionamiento**
```tsx
// ✅ Top-right para la mayoría de casos
showSuccess('Mensaje', undefined, { position: 'top-right' });

// ✅ Top-center para mensajes importantes
showError('Error crítico', undefined, { position: 'top-center' });
```

## 🔧 **Opciones de Configuración**

### **NotificationOptions**
```tsx
interface NotificationOptions {
  duration?: number; // Duración en ms
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}
```

### **Estilos Personalizados**
```tsx
showCustom('Mensaje personalizado', {
  duration: 6000,
  position: 'bottom-center',
  icon: '🚀',
  style: {
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 20px',
    fontSize: '14px',
    fontWeight: '500',
  }
});
```

## 🎨 **Temas y Estilos**

### **Colores por Tipo**
- **Éxito:** Verde (`#10b981`)
- **Error:** Rojo (`#ef4444`)
- **Advertencia:** Amarillo (`#f59e0b`)
- **Información:** Azul (`#3b82f6`)

### **Modo Oscuro**
- Los colores se adaptan automáticamente
- Bordes y fondos ajustados para mejor contraste
- Texto optimizado para legibilidad

## 📱 **Responsive Design**

- ✅ Adaptable a móviles y tablets
- ✅ Posicionamiento inteligente en pantallas pequeñas
- ✅ Tamaño de fuente optimizado
- ✅ Espaciado apropiado en diferentes dispositivos

## 🧪 **Testing**

### **Ejemplo de Test**
```tsx
import { renderHook, act } from '@testing-library/react';
import { useNotifications } from '@/hooks/useNotifications';

test('should show success notification', () => {
  const { result } = renderHook(() => useNotifications());
  
  act(() => {
    result.current.showSuccess('Test message');
  });
  
  // Verificar que la notificación se muestra
});
```

## 🚀 **Integración con Hooks Personalizados**

```tsx
// hooks/useUsers.ts
export function useUsers() {
  const { showSuccess, showError } = useNotifications();
  
  const createUser = async (userData) => {
    try {
      await api.createUser(userData);
      showSuccess('Usuario creado', `${userData.name} ha sido agregado`);
    } catch (error) {
      showError('Error al crear usuario', 'No se pudo completar la operación');
      throw error;
    }
  };
  
  return { createUser };
}
```

---

**¡Con este sistema de notificaciones tienes todo lo necesario para proporcionar feedback excelente a tus usuarios!** 🎉
