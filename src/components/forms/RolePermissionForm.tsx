import React, { useState, useEffect } from 'react';
import { X, Users, Shield, CheckCircle, Plus } from 'lucide-react';
import { useRolePermissionsStore } from '../../stores/rolePermissionsStore';
import { RoleWithPermissions } from '../../types';
import { Button } from '../ui/Button';

interface RolePermissionFormProps {
  role: RoleWithPermissions | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

const RolePermissionForm: React.FC<RolePermissionFormProps> = ({
  role,
  isOpen,
  onClose,
  onSubmit
}) => {
  const {
    availablePermissions,
    assignPermissionToRole,
    removePermissionFromRole,
    assignMultiplePermissionsToRole,
    loading,
    error,
    fetchAvailablePermissions,
    clearError
  } = useRolePermissionsStore();

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (isOpen && availablePermissions.length === 0) {
      fetchAvailablePermissions();
    }
  }, [isOpen, availablePermissions.length, fetchAvailablePermissions]);

  useEffect(() => {
    if (isOpen && role) {
      setSelectedPermissions([]);
      clearError();
    }
  }, [isOpen, role, clearError]);

  if (!isOpen || !role) return null;

  // Obtener permisos no asignados al rol
  const unassignedPermissions = availablePermissions.filter(
    permission => !role.permissions.some(rp => rp.id === permission.id)
  );

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleRemovePermission = async (permissionId: string) => {
    if (!role) return;
    
    setLocalLoading(true);
    const success = await removePermissionFromRole(role.id, permissionId);
    
    if (success) {
      onSubmit?.();
    }
    setLocalLoading(false);
  };

  const handleAssignSelected = async () => {
    if (!role || selectedPermissions.length === 0) return;
    
    setLocalLoading(true);
    const success = await assignMultiplePermissionsToRole(role.id, selectedPermissions);
    
    if (success) {
      setSelectedPermissions([]);
      onSubmit?.();
    }
    setLocalLoading(false);
  };

  const handleAssignSingle = async (permissionId: string) => {
    if (!role) return;
    
    setLocalLoading(true);
    const success = await assignPermissionToRole(role.id, permissionId);
    
    if (success) {
      onSubmit?.();
    }
    setLocalLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Gestionar Permisos - {role.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{role.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            disabled={loading || localLoading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Permisos Asignados */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h3 className="font-medium text-green-800 dark:text-green-300">
                Permisos Asignados ({role.permissions.length})
              </h3>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {role.permissions.length === 0 ? (
                <p className="text-sm text-green-600 dark:text-green-400 italic">
                  No hay permisos asignados a este rol
                </p>
              ) : (
                role.permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between bg-white dark:bg-gray-700 p-3 rounded-lg border border-green-200 dark:border-green-700"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-gray-100">{permission.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{permission.description}</p>
                    </div>
                    <button
                      onClick={() => handleRemovePermission(permission.id)}
                      disabled={loading || localLoading}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1 rounded disabled:opacity-50"
                      title="Remover permiso"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Permisos Disponibles */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-medium text-blue-800 dark:text-blue-300">
                  Permisos Disponibles ({unassignedPermissions.length})
                </h3>
              </div>
              {selectedPermissions.length > 0 && (
                <Button
                  onClick={handleAssignSelected}
                  disabled={loading || localLoading}
                  className="text-sm px-3 py-1"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Asignar ({selectedPermissions.length})
                </Button>
              )}
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {unassignedPermissions.length === 0 ? (
                <p className="text-sm text-blue-600 dark:text-blue-400 italic">
                  Todos los permisos están asignados a este rol
                </p>
              ) : (
                unassignedPermissions.map((permission) => {
                  const isSelected = selectedPermissions.includes(permission.id);
                  return (
                    <div
                      key={permission.id}
                      className={`flex items-center justify-between bg-white dark:bg-gray-700 p-3 rounded-lg border transition-all ${
                        isSelected 
                          ? 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                          : 'border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleTogglePermission(permission.id)}
                            className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-400"
                          />
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-100">{permission.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{permission.description}</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAssignSingle(permission.id)}
                        disabled={loading || localLoading}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-1 rounded disabled:opacity-50"
                        title="Asignar permiso"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading || localLoading}
          >
            Cerrar
          </Button>
        </div>

        {/* Loading State */}
        {(loading || localLoading) && (
          <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Procesando...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RolePermissionForm;