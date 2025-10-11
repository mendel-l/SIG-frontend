import { create } from 'zustand';
import { RoleWithPermissions, Permission, Rol } from '../types';

// Estado del store
interface RolePermissionsState {
  rolesWithPermissions: RoleWithPermissions[];
  availableRoles: Rol[];
  availablePermissions: Permission[];
  loading: boolean;
  error: string | null;
  
  // Acciones
  fetchRolesWithPermissions: () => Promise<void>;
  fetchAvailableRoles: () => Promise<void>;
  fetchAvailablePermissions: () => Promise<void>;
  assignPermissionToRole: (roleId: string, permissionId: string) => Promise<boolean>;
  removePermissionFromRole: (roleId: string, permissionId: string) => Promise<boolean>;
  assignMultiplePermissionsToRole: (roleId: string, permissionIds: string[]) => Promise<boolean>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// Store con Zustand
export const useRolePermissionsStore = create<RolePermissionsState>((set, get) => ({
  rolesWithPermissions: [],
  availableRoles: [],
  availablePermissions: [],
  loading: false,
  error: null,

  // Obtener roles con sus permisos (simulado)
  fetchRolesWithPermissions: async () => {
    set({ loading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockRolesWithPermissions: RoleWithPermissions[] = [
        {
          id: '1',
          name: 'Administrador General',
          description: 'Acceso completo al sistema SIG Municipal - Control total de usuarios, infraestructura y reportes',
          permissions: [
            {
              id: '1',
              name: 'read_users',
              description: 'Ver usuarios del sistema',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            },
            {
              id: '2',
              name: 'write_users',
              description: 'Crear y editar usuarios',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            },
            {
              id: '3',
              name: 'delete_users',
              description: 'Eliminar usuarios del sistema',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            },
            {
              id: '4',
              name: 'manage_tanks',
              description: 'Gestionar tanques de agua',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            },
            {
              id: '5',
              name: 'manage_pipes',
              description: 'Gestionar tuberías del sistema',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            },
            {
              id: '6',
              name: 'read_reports',
              description: 'Ver reportes del sistema',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            },
            {
              id: '7',
              name: 'manage_employees',
              description: 'Gestionar empleados',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            },
            {
              id: '8',
              name: 'manage_roles',
              description: 'Gestionar roles y permisos',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            }
          ],
          createdAt: '2024-01-10T08:00:00Z',
          updatedAt: '2024-01-15T14:30:00Z'
        },
        {
          id: '2',
          name: 'Supervisor de Infraestructura',
          description: 'Supervisión y gestión de la infraestructura hídrica municipal (tanques, tuberías, redes)',
          permissions: [
            {
              id: '1',
              name: 'read_users',
              description: 'Ver usuarios del sistema',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            },
            {
              id: '4',
              name: 'manage_tanks',
              description: 'Gestionar tanques de agua',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            },
            {
              id: '5',
              name: 'manage_pipes',
              description: 'Gestionar tuberías del sistema',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            },
            {
              id: '6',
              name: 'read_reports',
              description: 'Ver reportes del sistema',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            },
            {
              id: '7',
              name: 'manage_employees',
              description: 'Gestionar empleados',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            }
          ],
          createdAt: '2024-01-12T09:00:00Z',
          updatedAt: '2024-01-18T11:15:00Z'
        },
        {
          id: '3',
          name: 'Operador de Campo',
          description: 'Personal técnico para operaciones de mantenimiento y monitoreo in-situ de infraestructura',
          permissions: [
            {
              id: '1',
              name: 'read_users',
              description: 'Ver usuarios del sistema',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            },
            {
              id: '4',
              name: 'manage_tanks',
              description: 'Gestionar tanques de agua',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            },
            {
              id: '5',
              name: 'manage_pipes',
              description: 'Gestionar tuberías del sistema',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            }
          ],
          createdAt: '2024-01-14T16:00:00Z',
          updatedAt: '2024-01-20T10:30:00Z'
        },
        {
          id: '4',
          name: 'Analista Municipal',
          description: 'Análisis de datos, generación de reportes y consulta de información del sistema SIG',
          permissions: [
            {
              id: '9',
              name: 'view_dashboard',
              description: 'Acceder al dashboard principal del sistema',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            },
            {
              id: '10',
              name: 'view_map',
              description: 'Ver el mapa geográfico y ubicaciones',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            },
            {
              id: '6',
              name: 'read_reports',
              description: 'Ver reportes y análisis del sistema SIG',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            },
            {
              id: '11',
              name: 'export_data',
              description: 'Exportar datos e informes del sistema',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            }
          ],
          createdAt: '2024-01-16T11:00:00Z',
          updatedAt: '2024-01-16T11:00:00Z'
        },
        {
          id: '5',
          name: 'Coordinador de RRHH',
          description: 'Gestión de recursos humanos - empleados municipales del área de servicios públicos',
          permissions: [
            {
              id: '1',
              name: 'read_users',
              description: 'Ver usuarios del sistema',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            },
            {
              id: '2',
              name: 'write_users',
              description: 'Crear y editar usuarios',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            },
            {
              id: '7',
              name: 'manage_employees',
              description: 'Gestionar empleados',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            },
            {
              id: '6',
              name: 'read_reports',
              description: 'Ver reportes del sistema',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            }
          ],
          createdAt: '2024-01-18T14:00:00Z',
          updatedAt: '2024-01-18T14:00:00Z'
        },
        {
          id: '6',
          name: 'Director Municipal',
          description: 'Dirección general de servicios públicos municipales - acceso ejecutivo y supervisión',
          permissions: [
            {
              id: '9',
              name: 'view_dashboard',
              description: 'Acceder al dashboard principal del sistema',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            },
            {
              id: '6',
              name: 'read_reports',
              description: 'Ver reportes y análisis del sistema SIG',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            },
            {
              id: '11',
              name: 'export_data',
              description: 'Exportar datos e informes del sistema',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            },
            {
              id: '13',
              name: 'audit_logs',
              description: 'Ver registros de auditoría y logs del sistema',
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            }
          ],
          createdAt: '2024-01-20T08:00:00Z',
          updatedAt: '2024-01-20T08:00:00Z'
        }
      ];

      set({ rolesWithPermissions: mockRolesWithPermissions, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener roles y permisos';
      set({ error: errorMessage, loading: false });
      console.error('Error fetching roles with permissions:', error);
    }
  },

  // Obtener roles disponibles (simulado)
  fetchAvailableRoles: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const mockRoles: Rol[] = [
        {
          id_rol: 1,
          name: 'Administrador General',
          description: 'Acceso completo al sistema SIG Municipal - Control total de usuarios, infraestructura y reportes',
          status: 1,
          created_at: '2024-01-10T08:00:00Z',
          updated_at: '2024-01-15T14:30:00Z'
        },
        {
          id_rol: 2,
          name: 'Supervisor de Infraestructura',
          description: 'Supervisión y gestión de la infraestructura hídrica municipal (tanques, tuberías, redes)',
          status: 1,
          created_at: '2024-01-12T09:00:00Z',
          updated_at: '2024-01-18T11:15:00Z'
        },
        {
          id_rol: 3,
          name: 'Operador de Campo',
          description: 'Personal técnico para operaciones de mantenimiento y monitoreo in-situ de infraestructura',
          status: 1,
          created_at: '2024-01-14T16:00:00Z',
          updated_at: '2024-01-20T10:30:00Z'
        },
        {
          id_rol: 4,
          name: 'Analista Municipal',
          description: 'Análisis de datos, generación de reportes y consulta de información del sistema SIG',
          status: 1,
          created_at: '2024-01-16T11:00:00Z',
          updated_at: '2024-01-16T11:00:00Z'
        },
        {
          id_rol: 5,
          name: 'Coordinador de RRHH',
          description: 'Gestión de recursos humanos - empleados municipales del área de servicios públicos',
          status: 1,
          created_at: '2024-01-18T14:00:00Z',
          updated_at: '2024-01-18T14:00:00Z'
        },
        {
          id_rol: 6,
          name: 'Director Municipal',
          description: 'Dirección general de servicios públicos municipales - acceso ejecutivo y supervisión',
          status: 1,
          created_at: '2024-01-20T08:00:00Z',
          updated_at: '2024-01-20T08:00:00Z'
        },
        {
          id_rol: 7,
          name: 'Técnico en Mantenimiento',
          description: 'Especialista en mantenimiento preventivo y correctivo de infraestructura hídrica',
          status: 1,
          created_at: '2024-01-22T09:30:00Z',
          updated_at: '2024-01-22T09:30:00Z'
        },
        {
          id_rol: 8,
          name: 'Auditor Interno',
          description: 'Revisión y auditoría interna de procesos y registros del sistema SIG',
          status: 1,
          created_at: '2024-01-24T15:00:00Z',
          updated_at: '2024-01-24T15:00:00Z'
        }
      ];

      set({ availableRoles: mockRoles });
    } catch (error) {
      console.error('Error fetching available roles:', error);
    }
  },

  // Obtener permisos disponibles (simulado)
  fetchAvailablePermissions: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockPermissions: Permission[] = [
        {
          id: '1',
          name: 'read_users',
          description: 'Ver usuarios del sistema y sus perfiles',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'write_users',
          description: 'Crear y editar usuarios del sistema',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '3',
          name: 'delete_users',
          description: 'Eliminar usuarios del sistema',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '4',
          name: 'manage_tanks',
          description: 'Gestionar tanques de agua (crear, editar, eliminar)',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '5',
          name: 'manage_pipes',
          description: 'Gestionar tuberías del sistema hídrico municipal',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '6',
          name: 'read_reports',
          description: 'Ver reportes y análisis del sistema SIG',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '7',
          name: 'manage_employees',
          description: 'Gestionar empleados municipales del área',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '8',
          name: 'manage_roles',
          description: 'Gestionar roles y permisos del sistema',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '9',
          name: 'view_dashboard',
          description: 'Acceder al dashboard principal del sistema',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '10',
          name: 'view_map',
          description: 'Ver el mapa geográfico y ubicaciones',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '11',
          name: 'export_data',
          description: 'Exportar datos e informes del sistema',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '12',
          name: 'system_settings',
          description: 'Configurar ajustes del sistema',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '13',
          name: 'audit_logs',
          description: 'Ver registros de auditoría y logs del sistema',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '14',
          name: 'backup_restore',
          description: 'Realizar respaldos y restaurar datos',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '15',
          name: 'maintenance_mode',
          description: 'Activar modo de mantenimiento del sistema',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        }
      ];

      set({ availablePermissions: mockPermissions });
    } catch (error) {
      console.error('Error fetching available permissions:', error);
    }
  },

  // Asignar permiso a rol (simulado)
  assignPermissionToRole: async (roleId: string, permissionId: string): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const { rolesWithPermissions, availablePermissions } = get();
      
      // Buscar el rol
      const roleIndex = rolesWithPermissions.findIndex(r => r.id === roleId);
      if (roleIndex === -1) {
        throw new Error('Rol no encontrado');
      }

      // Buscar el permiso
      const permission = availablePermissions.find(p => p.id === permissionId);
      if (!permission) {
        throw new Error('Permiso no encontrado');
      }

      // Verificar si ya tiene el permiso
      const role = rolesWithPermissions[roleIndex];
      const hasPermission = role.permissions.some(p => p.id === permissionId);
      if (hasPermission) {
        throw new Error('El rol ya tiene este permiso asignado');
      }

      // Agregar permiso al rol
      const updatedRoles = [...rolesWithPermissions];
      updatedRoles[roleIndex] = {
        ...role,
        permissions: [...role.permissions, permission],
        updatedAt: new Date().toISOString()
      };

      set({ rolesWithPermissions: updatedRoles, loading: false });
      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al asignar permiso';
      set({ error: errorMessage, loading: false });
      console.error('Error assigning permission to role:', error);
      return false;
    }
  },

  // Remover permiso de rol (simulado)
  removePermissionFromRole: async (roleId: string, permissionId: string): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const rolesWithPermissions = get().rolesWithPermissions;
      
      // Buscar el rol
      const roleIndex = rolesWithPermissions.findIndex(r => r.id === roleId);
      if (roleIndex === -1) {
        throw new Error('Rol no encontrado');
      }

      const role = rolesWithPermissions[roleIndex];
      
      // Verificar si tiene el permiso
      const hasPermission = role.permissions.some(p => p.id === permissionId);
      if (!hasPermission) {
        throw new Error('El rol no tiene este permiso asignado');
      }

      // Remover permiso del rol
      const updatedRoles = [...rolesWithPermissions];
      updatedRoles[roleIndex] = {
        ...role,
        permissions: role.permissions.filter(p => p.id !== permissionId),
        updatedAt: new Date().toISOString()
      };

      set({ rolesWithPermissions: updatedRoles, loading: false });
      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al remover permiso';
      set({ error: errorMessage, loading: false });
      console.error('Error removing permission from role:', error);
      return false;
    }
  },

  // Asignar múltiples permisos a rol (simulado)
  assignMultiplePermissionsToRole: async (roleId: string, permissionIds: string[]): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const { rolesWithPermissions, availablePermissions } = get();
      
      // Buscar el rol
      const roleIndex = rolesWithPermissions.findIndex(r => r.id === roleId);
      if (roleIndex === -1) {
        throw new Error('Rol no encontrado');
      }

      const role = rolesWithPermissions[roleIndex];
      
      // Obtener permisos a agregar
      const permissionsToAdd = availablePermissions.filter(p => 
        permissionIds.includes(p.id) && 
        !role.permissions.some(rp => rp.id === p.id)
      );

      // Actualizar permisos del rol
      const updatedRoles = [...rolesWithPermissions];
      updatedRoles[roleIndex] = {
        ...role,
        permissions: [...role.permissions, ...permissionsToAdd],
        updatedAt: new Date().toISOString()
      };

      set({ rolesWithPermissions: updatedRoles, loading: false });
      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al asignar permisos';
      set({ error: errorMessage, loading: false });
      console.error('Error assigning multiple permissions to role:', error);
      return false;
    }
  },

  // Limpiar error
  clearError: () => set({ error: null }),

  // Establecer loading
  setLoading: (loading: boolean) => set({ loading }),
}));