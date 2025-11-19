import React from 'react';
import { Permission, GroupedPermissions } from '../../queries/rolesQueries';

interface PermissionSelectorProps {
  groupedPermissions: GroupedPermissions;
  selectedPermissionIds: number[];
  onSelectionChange: (ids: number[]) => void;
  loading?: boolean;
  className?: string;
}

const PermissionSelector: React.FC<PermissionSelectorProps> = ({
  groupedPermissions,
  selectedPermissionIds,
  onSelectionChange,
  loading = false,
  className = '',
}) => {
  const handleTogglePermission = (permissionId: number) => {
    if (loading) return;
    
    const newSelection = selectedPermissionIds.includes(permissionId)
      ? selectedPermissionIds.filter(id => id !== permissionId)
      : [...selectedPermissionIds, permissionId];
    
    onSelectionChange(newSelection);
  };

  const handleToggleCategory = (categoryPermissions: Permission[]) => {
    if (loading) return;
    
    const categoryIds = categoryPermissions.map(p => p.id_permissions);
    const allSelected = categoryIds.every(id => selectedPermissionIds.includes(id));
    
    const newSelection = allSelected
      ? selectedPermissionIds.filter(id => !categoryIds.includes(id))
      : [...new Set([...selectedPermissionIds, ...categoryIds])];
    
    onSelectionChange(newSelection);
  };

  const getActionLabel = (permissionName: string): string => {
    if (permissionName.startsWith('crear_')) return 'Crear';
    if (permissionName.startsWith('leer_')) return 'Leer';
    if (permissionName.startsWith('actualizar_')) return 'Actualizar';
    if (permissionName.startsWith('eliminar_')) return 'Eliminar';
    return permissionName;
  };

  // Convertir objeto agrupado a array para poder dividirlo en columnas
  const categories = Object.entries(groupedPermissions);
  
  // Dividir categorías en 3 columnas
  const columns: Array<Array<[string, Permission[]]>> = [[], [], []];
  categories.forEach((category, index) => {
    columns[index % 3].push(category);
  });

  if (categories.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 dark:text-gray-400 ${className}`}>
        <p>No hay permisos disponibles</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Permisos del Rol
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {selectedPermissionIds.length} de {categories.reduce((sum, [, perms]) => sum + perms.length, 0)} seleccionados
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="space-y-6">
            {column.map(([categoryName, permissions]) => {
              const categoryIds = permissions.map(p => p.id_permissions);
              const allSelected = categoryIds.every(id => selectedPermissionIds.includes(id));
              const someSelected = categoryIds.some(id => selectedPermissionIds.includes(id));

              return (
                <div
                  key={categoryName}
                  className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  {/* Header de categoría con checkbox para seleccionar todos */}
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <label className="flex items-center space-x-2 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={(input) => {
                          if (input) input.indeterminate = someSelected && !allSelected;
                        }}
                        onChange={() => handleToggleCategory(permissions)}
                        disabled={loading}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer disabled:opacity-50"
                      />
                      <span className="font-semibold text-sm text-gray-900 dark:text-white uppercase tracking-wide">
                        {categoryName}
                      </span>
                    </label>
                  </div>

                  {/* Lista de permisos */}
                  <div className="space-y-2">
                    {permissions.map((permission) => {
                      const isSelected = selectedPermissionIds.includes(permission.id_permissions);
                      const actionLabel = getActionLabel(permission.name);

                      return (
                        <label
                          key={permission.id_permissions}
                          className="flex items-start space-x-2 cursor-pointer group hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded px-2 py-1.5 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleTogglePermission(permission.id_permissions)}
                            disabled={loading}
                            className="mt-0.5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer disabled:opacity-50"
                          />
                          <div className="flex-1 min-w-0">
                            <span className={`text-sm ${isSelected ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                              • {actionLabel}
                            </span>
                            {permission.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                                {permission.description}
                              </p>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermissionSelector;

