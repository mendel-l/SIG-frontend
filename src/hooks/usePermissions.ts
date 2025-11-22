import { useMemo } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Permission } from '@/types';

/**
 * Hook para gestionar permisos del usuario actual
 * Usa directamente los nombres de permisos del backend
 */
export function usePermissions() {
  const { user } = useAuthStore();
  
  // Obtener permisos del usuario o array vacío
  const permissions = useMemo(() => {
    return user?.permissions || [];
  }, [user?.permissions]);
  
  // Crear un Set de nombres de permisos del backend
  const permissionNames = useMemo(() => {
    const names = new Set<string>();
    
    permissions.forEach((p: Permission) => {
      // Agregar el nombre original del backend
      names.add(p.name);
    });
    
    // Debug: mostrar permisos en consola (solo en desarrollo)
    if (import.meta.env.MODE === 'development' && permissions.length > 0) {
      console.log('🔐 Permisos del usuario:', {
        permissions: permissions.map((p: Permission) => p.name),
        role: user?.role,
        roleId: user?.roleId,
      });
    }
    
    return names;
  }, [permissions, user?.role, user?.roleId]);
  
  /**
   * Verifica si el usuario tiene un permiso específico
   * Usa directamente los nombres de permisos del backend
   */
  const hasPermission = (permissionName: string): boolean => {
    if (!permissionName) return false;
    
    // Caso especial: dashboard y map - si tiene cualquier permiso de lectura, puede acceder
    // Esto permite acceso al dashboard/mapa si el usuario tiene al menos un permiso de lectura
    if (permissionName === 'leer_tanques') {
      // Verificar si tiene el permiso específico
      if (permissionNames.has(permissionName)) {
        return true;
      }
      // O si tiene cualquier permiso de lectura (para dashboard/map)
      const hasAnyReadPermission = Array.from(permissionNames).some(name => name.startsWith('leer_'));
      if (hasAnyReadPermission) {
        return true;
      }
    }
    
    // Verificar directamente el nombre del permiso del backend
    return permissionNames.has(permissionName);
  };
  
  /**
   * Verifica si el usuario tiene al menos uno de los permisos especificados
   */
  const hasAnyPermission = (permissionNames: string[]): boolean => {
    if (!permissionNames || permissionNames.length === 0) return false;
    return permissionNames.some(name => hasPermission(name));
  };
  
  /**
   * Verifica si el usuario tiene todos los permisos especificados
   */
  const hasAllPermissions = (permissionNames: string[]): boolean => {
    if (!permissionNames || permissionNames.length === 0) return false;
    return permissionNames.every(name => hasPermission(name));
  };
  
  /**
   * Obtiene todos los permisos del usuario
   */
  const getUserPermissions = (): Permission[] => {
    return permissions;
  };
  
  /**
   * Obtiene los nombres de todos los permisos del usuario
   */
  const getPermissionNames = (): string[] => {
    return Array.from(permissionNames);
  };
  
  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getUserPermissions,
    getPermissionNames,
  };
}

