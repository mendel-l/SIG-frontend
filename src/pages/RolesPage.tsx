import React, { useState } from 'react';
import RoleList from '../components/forms/RoleList';
import RoleForm from '../components/forms/RoleForm';
import { useRoles } from '../hooks/useRoles';

const RolesPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const { roles, loading, error, createRole, refreshRoles } = useRoles();

  const handleCreateRole = async (roleData: any) => {
    const success = await createRole(roleData);
    if (success) {
      setShowForm(false); // Ocultar el formulario después de crear exitosamente
    }
    return success;
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Gestión de Roles
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Administra los roles del sistema y sus permisos
            </p>
          </div>
          
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <svg className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              Exportar
            </button>
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="ml-3 inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              {showForm ? 'Cancelar' : 'Nuevo Rol'}
            </button>
          </div>
        </div>

        {/* Formulario para crear rol */}
        {showForm && (
          <RoleForm 
            onSubmit={handleCreateRole}
            onCancel={() => setShowForm(false)}
            loading={loading}
            className="mb-6"
          />
        )}

        {/* Lista de roles */}
        <RoleList 
          roles={roles}
          loading={loading}
          error={error}
          onRefresh={refreshRoles}
        />
      </div>
    </div>
  );
};

export default RolesPage;