import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';

interface PermissionButtonProps {
  children: ReactNode;
  permission: string; 
  fallback?: ReactNode;
  className?: string;
}

/**
 * Componente que muestra u oculta un botón basándose en permisos del usuario
 * Si el usuario no tiene el permiso requerido, oculta el botón o muestra un componente alternativo
 */
export function PermissionButton({ 
  children, 
  permission, 
  fallback,
  className 
}: PermissionButtonProps) {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(permission)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return null;
  }
  
  return <div className={className}>{children}</div>;
}

