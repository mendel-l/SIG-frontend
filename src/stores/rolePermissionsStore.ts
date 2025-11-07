import { create } from 'zustand';
import { RoleWithPermissions, Permission, Rol } from '../types';
import { getAuthToken } from '../utils';
import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.API_BASE_URL;

interface RolePermissionsState {
  rolesWithPermissions: RoleWithPermissions[];
  availableRoles: Rol[];
  availablePermissions: Permission[];
  loading: boolean;
  error: string | null;
  
  fetchRolesWithPermissions: () => Promise<void>;
  fetchAvailableRoles: () => Promise<void>;
  fetchAvailablePermissions: () => Promise<void>;
  assignPermissionToRole: (roleId: string, permissionId: string) => Promise<boolean>;
  removePermissionFromRole: (roleId: string, permissionId: string) => Promise<boolean>;
  assignMultiplePermissionsToRole: (roleId: string, permissionIds: string[]) => Promise<boolean>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useRolePermissionsStore = create<RolePermissionsState>((set, get) => ({
  rolesWithPermissions: [],
  availableRoles: [],
  availablePermissions: [],
  loading: false,
  error: null,

  fetchRolesWithPermissions: async () => {
    set({ loading: true, error: null });
    
    try {
      const token = getAuthToken();
      
      const rolesResponse = await fetch(`${API_BASE_URL}/rol?page=1&limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!rolesResponse.ok) {
        throw new Error(`Error al obtener roles: ${rolesResponse.statusText}`);
      }

      const rolesData = await rolesResponse.json();
      const roles = rolesData.status === 'success' ? rolesData.data : rolesData;

      const rolesWithPerms: RoleWithPermissions[] = [];

      for (const rol of roles) {
        try {
          const permResponse = await fetch(`${API_BASE_URL}/rol/${rol.id_rol}/permisos`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (permResponse.ok) {
            const permData = await permResponse.json();
            const permisos = permData.status === 'success' ? permData.data.permisos : permData.permisos || {};

            const permissionsArray: Permission[] = Object.entries(permisos)
              .filter(([_, value]) => value === true)
              .map(([key, _], index) => ({
                id: String(index + 1),
                name: key,
                description: key.replace(/_/g, ' ').toUpperCase(),
                status: true,
                createdAt: rol.created_at,
                updatedAt: rol.updated_at
              }));

            rolesWithPerms.push({
              id: String(rol.id_rol),
              name: rol.name,
              description: rol.description,
              permissions: permissionsArray,
              createdAt: rol.created_at,
              updatedAt: rol.updated_at
            });
          }
        } catch (error) {
          console.error(`Error obteniendo permisos para rol ${rol.id_rol}:`, error);
          rolesWithPerms.push({
            id: String(rol.id_rol),
            name: rol.name,
            description: rol.description,
            permissions: [],
            createdAt: rol.created_at,
            updatedAt: rol.updated_at
          });
        }
      }

      set({ rolesWithPermissions: rolesWithPerms, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      set({ error: errorMessage, loading: false });
      console.error('Error fetching roles with permissions:', error);
    }
  },

  fetchAvailableRoles: async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/rol?page=1&limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener roles: ${response.statusText}`);
      }

      const data = await response.json();
      const roles = data.status === 'success' ? data.data : data;

      set({ availableRoles: roles });
    } catch (error) {
      console.error('Error fetching available roles:', error);
    }
  },

  fetchAvailablePermissions: async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/permissions?page=1&limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener permisos: ${response.statusText}`);
      }

      const data = await response.json();
      const permissions = data.status === 'success' ? data.data : data;

      const formattedPermissions: Permission[] = permissions.map((perm: any) => ({
        id: String(perm.id_permissions),
        name: perm.name,
        description: perm.description,
        status: perm.status,
        createdAt: perm.created_at,
        updatedAt: perm.updated_at
      }));

      set({ availablePermissions: formattedPermissions });
    } catch (error) {
      console.error('Error fetching available permissions:', error);
    }
  },

  assignPermissionToRole: async (roleId: string, permissionId: string): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const { rolesWithPermissions, availablePermissions } = get();
      
      const roleIndex = rolesWithPermissions.findIndex(r => r.id === roleId);
      if (roleIndex === -1) {
        throw new Error('Rol no encontrado');
      }

      const permission = availablePermissions.find(p => p.id === permissionId);
      if (!permission) {
        throw new Error('Permiso no encontrado');
      }

      const role = rolesWithPermissions[roleIndex];
      const hasPermission = role.permissions.some(p => p.id === permissionId);
      if (hasPermission) {
        throw new Error('El rol ya tiene este permiso asignado');
      }

      const updatedRoles = [...rolesWithPermissions];
      updatedRoles[roleIndex] = {
        ...role,
        permissions: [...role.permissions, permission],
        updatedAt: new Date().toISOString()
      };

      set({ rolesWithPermissions: updatedRoles, loading: false });
      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      set({ error: errorMessage, loading: false });
      console.error('Error assigning permission to role:', error);
      return false;
    }
  },

  removePermissionFromRole: async (roleId: string, permissionId: string): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const rolesWithPermissions = get().rolesWithPermissions;
      
      const roleIndex = rolesWithPermissions.findIndex(r => r.id === roleId);
      if (roleIndex === -1) {
        throw new Error('Rol no encontrado');
      }

      const role = rolesWithPermissions[roleIndex];
      
      const hasPermission = role.permissions.some(p => p.id === permissionId);
      if (!hasPermission) {
        throw new Error('El rol no tiene este permiso asignado');
      }

      const updatedRoles = [...rolesWithPermissions];
      updatedRoles[roleIndex] = {
        ...role,
        permissions: role.permissions.filter(p => p.id !== permissionId),
        updatedAt: new Date().toISOString()
      };

      set({ rolesWithPermissions: updatedRoles, loading: false });
      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      set({ error: errorMessage, loading: false });
      console.error('Error removing permission from role:', error);
      return false;
    }
  },

  assignMultiplePermissionsToRole: async (roleId: string, permissionIds: string[]): Promise<boolean> => {
    set({ loading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const { rolesWithPermissions, availablePermissions } = get();
      
      const roleIndex = rolesWithPermissions.findIndex(r => r.id === roleId);
      if (roleIndex === -1) {
        throw new Error('Rol no encontrado');
      }

      const role = rolesWithPermissions[roleIndex];
      
      const permissionsToAdd = availablePermissions.filter(p => 
        permissionIds.includes(p.id) && 
        !role.permissions.some(rp => rp.id === p.id)
      );

      const updatedRoles = [...rolesWithPermissions];
      updatedRoles[roleIndex] = {
        ...role,
        permissions: [...role.permissions, ...permissionsToAdd],
        updatedAt: new Date().toISOString()
      };

      set({ rolesWithPermissions: updatedRoles, loading: false });
      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      set({ error: errorMessage, loading: false });
      console.error('Error assigning multiple permissions to role:', error);
      return false;
    }
  },

  clearError: () => set({ error: null }),

  setLoading: (loading: boolean) => set({ loading }),
}));
