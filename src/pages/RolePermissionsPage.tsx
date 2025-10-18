import React, { useState, useEffect } from 'react';
import { Users, Shield, Plus, Settings, AlertTriangle, Eye } from 'lucide-react';
import { useRolePermissionsStore } from '../stores/rolePermissionsStore';
import { RoleWithPermissions } from '../types';
import RolePermissionForm from '../components/forms/RolePermissionForm';
import UnderDevelopmentModal from '../components/ui/UnderDevelopmentModal';
import { Button } from '../components/ui/Button';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import { useNotifications } from '../hooks/useNotifications';

const RolePermissionsPage: React.FC = () => {
  const {
    rolesWithPermissions,
    availablePermissions,
    loading,
    error,
    fetchRolesWithPermissions,
    fetchAvailableRoles,
    fetchAvailablePermissions,
    clearError
  } = useRolePermissionsStore();

  const { showSuccess: addNotification } = useNotifications();

  // Estados locales
  const [selectedRole, setSelectedRole] = useState<RoleWithPermissions | null>(null);
  const [showPermissionForm, setShowPermissionForm] = useState(false);
  const [showUnderDevelopment, setShowUnderDevelopment] = useState(false);
  const [developmentFeature, setDevelopmentFeature] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionToConfirm] = useState<() => void>(() => {});

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchRolesWithPermissions(),
        fetchAvailableRoles(),
        fetchAvailablePermissions()
      ]);
    };
    loadData();
  }, [fetchRolesWithPermissions, fetchAvailableRoles, fetchAvailablePermissions]);

  // Limpiar error cuando se muestre
  useEffect(() => {
    if (error) {
      addNotification('error', error);
      clearError();
    }
  }, [error, addNotification, clearError]);

  const handleManagePermissions = (role: RoleWithPermissions) => {
    setSelectedRole(role);
    setShowPermissionForm(true);
  };

  const handleFormSubmit = () => {
    fetchRolesWithPermissions();
    addNotification('success', 'Permisos actualizados correctamente');
  };

  const handleCloseForm = () => {
    setShowPermissionForm(false);
    setSelectedRole(null);
  };

  const showDevelopmentModal = (feature: string) => {
    setDevelopmentFeature(feature);
    setShowUnderDevelopment(true);
  };

  const handleViewDetails = (role: RoleWithPermissions) => {
    showDevelopmentModal(`Vista detallada del rol "${role.name}"`);
  };

  const handleCreateRole = () => {
    showDevelopmentModal('Creación de nuevos roles');
  };

  const handleEditRole = (role: RoleWithPermissions) => {
    showDevelopmentModal(`Edición del rol "${role.name}"`);
  };



  const handleBulkAssignment = () => {
    showDevelopmentModal('Asignación masiva de permisos');
  };

  const handleExportReport = () => {
    showDevelopmentModal('Exportar reporte de roles y permisos');
  };

  // Estadísticas rápidas
  const totalRoles = rolesWithPermissions.length;
  const totalPermissions = availablePermissions.length;
  const averagePermissionsPerRole = totalRoles > 0 
    ? Math.round(rolesWithPermissions.reduce((sum, role) => sum + role.permissions.length, 0) / totalRoles)
    : 0;

  const renderRoleRow = (role: RoleWithPermissions) => (
    <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
      <td className="px-6 py-4">
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">{role.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{role.description}</div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1">
          {role.permissions.slice(0, 3).map((permission) => (
            <span
              key={permission.id}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
            >
              {permission.name}
            </span>
          ))}
          {role.permissions.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
              +{role.permissions.length - 3} más
            </span>
          )}
          {role.permissions.length === 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
              Sin permisos
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-medium">
          {role.permissions.length}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(role.updatedAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleViewDetails(role)}
            className="px-2 py-1"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleManagePermissions(role)}
            className="px-2 py-1"
          >
            <Shield className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEditRole(role)}
            className="px-2 py-1"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Gestión de Roles y Permisos
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Administra roles y sus permisos asociados
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={handleBulkAssignment}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Asignación Masiva
          </Button>
          <Button
            onClick={handleCreateRole}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nuevo Rol
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Roles</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalRoles}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Permisos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalPermissions}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Promedio por Rol</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{averagePermissionsPerRole}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <Button
                onClick={handleExportReport}
                variant="secondary"
                className="w-full flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Ver Reporte
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Roles */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Roles del Sistema ({rolesWithPermissions.length})
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Shield className="h-4 w-4" />
              <span>Gestión de permisos activa</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Cargando roles y permisos...</p>
          </div>
        ) : rolesWithPermissions.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-4">No hay roles configurados</p>
            <Button onClick={handleCreateRole} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Crear Primer Rol
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Permisos Asignados
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total Permisos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Última Actualización
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {rolesWithPermissions.map(role => renderRoleRow(role))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Formulario de Gestión de Permisos */}
      <RolePermissionForm
        role={selectedRole}
        isOpen={showPermissionForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
      />

      {/* Modal de Desarrollo */}
      <UnderDevelopmentModal
        isOpen={showUnderDevelopment}
        onClose={() => setShowUnderDevelopment(false)}
        feature={developmentFeature}
      />

      {/* Diálogo de Confirmación */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={actionToConfirm}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar este rol? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
};

export default RolePermissionsPage;