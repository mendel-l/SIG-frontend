import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '@/hooks/usePermissions';
import { Card } from '@/components/ui/Card';
import { ShieldX } from 'lucide-react';

interface PermissionRouteProps {
  children: ReactNode;
  permission: string; // Nombre del permiso del backend (ej: "leer_tanques")
  fallback?: ReactNode;
  redirectTo?: string;
}

/**
 * Componente que protege una ruta basándose en permisos del usuario
 * Si el usuario no tiene el permiso requerido, muestra un mensaje o redirige
 */
export function PermissionRoute({ 
  children, 
  permission, 
  fallback,
  redirectTo = '/dashboard'
}: PermissionRouteProps) {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(permission)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Mostrar mensaje de acceso denegado o redirigir
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="flex justify-center mb-4">
            <ShieldX className="h-16 w-16 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Acceso Denegado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            No tienes permisos para acceder a esta sección.
          </p>
          <Navigate to={redirectTo} replace />
        </Card>
      </div>
    );
  }
  
  return <>{children}</>;
}

