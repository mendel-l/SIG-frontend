/**
 * Mapeo de rutas a permisos requeridos del backend
 * Usar directamente los nombres de permisos del backend (ej: "leer_tanques", "crear_usuarios")
 */
export const ROUTE_PERMISSIONS_BACKEND: Record<string, string> = {
  // Principal - usar cualquier permiso de lectura como acceso
  '/dashboard': 'leer_tanques', // Cualquier permiso de lectura funciona
  '/map': 'leer_tanques',
  
  // Infraestructura
  '/tanks': 'leer_tanques',
  '/pipes': 'leer_tuberias',
  '/connections': 'leer_conexiones',
  '/interventions': 'leer_intervenciones',
  '/data-upload': 'leer_intervenciones', // Usar leer_intervenciones como permiso para data upload
  
  // Gestión de Personas
  '/users': 'leer_usuarios',
  '/employees': 'leer_empleados',
  
  // Administración
  '/roles': 'leer_roles',
  '/permissions': 'leer_roles', // Usar leer_roles como permiso para ver permisos
  '/type-employee': 'leer_empleados', // Usar leer_empleados como permiso
  '/reports': 'leer_intervenciones', // Usar cualquier permiso de lectura
  
  // Usuario y Sistema (siempre accesibles si está autenticado)
  '/profile': 'leer_tanques', // Cualquier permiso de lectura funciona
  '/settings': 'leer_tanques',
};

/**
 * Mapeo de acciones a permisos requeridos del backend
 */
export const ACTION_PERMISSIONS_BACKEND: Record<string, string> = {
  // Usuarios
  'create_user': 'crear_usuarios',
  'edit_user': 'actualizar_usuarios',
  'delete_user': 'eliminar_usuarios',
  
  // Roles
  'create_role': 'crear_roles',
  'edit_role': 'actualizar_roles',
  'delete_role': 'eliminar_roles',
  
  // Permisos
  'create_permission': 'crear_roles', // Usar crear_roles como permiso para crear permisos
  'edit_permission': 'actualizar_roles',
  'delete_permission': 'eliminar_roles',
  
  // Tanques
  'create_tank': 'crear_tanques',
  'edit_tank': 'actualizar_tanques',
  'delete_tank': 'eliminar_tanques',
  
  // Tuberías
  'create_pipe': 'crear_tuberias',
  'edit_pipe': 'actualizar_tuberias',
  'delete_pipe': 'eliminar_tuberias',
  
  // Conexiones
  'create_connection': 'crear_conexiones',
  'edit_connection': 'actualizar_conexiones',
  'delete_connection': 'eliminar_conexiones',
  
  // Intervenciones
  'create_intervention': 'crear_intervenciones',
  'edit_intervention': 'actualizar_intervenciones',
  'delete_intervention': 'eliminar_intervenciones',
  
  // Empleados
  'create_employee': 'crear_empleados',
  'edit_employee': 'actualizar_empleados',
  'delete_employee': 'eliminar_empleados',
  
  // Tipos de Empleado
  'create_type_employee': 'crear_empleados', // Usar crear_empleados como permiso
  'edit_type_employee': 'actualizar_empleados',
  'delete_type_employee': 'eliminar_empleados',
  
  // Reportes
  'export_report': 'leer_intervenciones', // Usar cualquier permiso de lectura
};

/**
 * Mapeo de rutas a permisos requeridos (mantener para compatibilidad)
 * @deprecated Usar ROUTE_PERMISSIONS_BACKEND en su lugar
 */
export const ROUTE_PERMISSIONS: Record<string, string> = ROUTE_PERMISSIONS_BACKEND;

/**
 * Mapeo de acciones a permisos requeridos (mantener para compatibilidad)
 * @deprecated Usar ACTION_PERMISSIONS_BACKEND en su lugar
 */
export const ACTION_PERMISSIONS: Record<string, string> = ACTION_PERMISSIONS_BACKEND;

/**
 * Obtiene el permiso requerido para una ruta (nombre del backend)
 */
export function getRoutePermission(route: string): string | null {
  return ROUTE_PERMISSIONS_BACKEND[route] || null;
}

/**
 * Obtiene el permiso requerido para una acción (nombre del backend)
 */
export function getActionPermission(action: string): string | null {
  return ACTION_PERMISSIONS_BACKEND[action] || null;
}
