import React, { useState } from 'react';
import { Shield, Search } from 'lucide-react';
import RoleForm from '../components/forms/RoleForm';
import { useNotifications } from '../hooks/useNotifications';
import { 
  useRoles, 
  useCreateRole,
  type Rol,
  type RolCreate
} from '../queries/rolesQueries';
import { ScrollableTable, TableRow, TableCell, EmptyState, Pagination, StatsCards, PageHeader, SearchBar, StatCard } from '../components/ui';

const RolesPage: React.FC = () => {
  const { showSuccess, showError } = useNotifications();
  
  // Estado local de UI
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [showForm, setShowForm] = useState(false);

  // ✅ QUERY - Obtener roles con TanStack Query
  const { 
    data: rolesData,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useRoles(currentPage, pageSize);

  // ✅ MUTATIONS - Acciones
  const createMutation = useCreateRole();

  // Extraer datos y paginación
  const roles = rolesData?.items || [];
  const pagination = rolesData?.pagination || { 
    page: 1, 
    limit: pageSize, 
    total_items: 0, 
    total_pages: 1,
    next_page: null,
    prev_page: null,
  };

  const handleCreateRole = async (roleData: any) => {
    try {
      // Convertir status de number (1/0) a boolean
      const createData: RolCreate = {
        name: roleData.name,
        description: roleData.description || null,
        status: roleData.status === 1 || roleData.status === true,
      };
      await createMutation.mutateAsync(createData);
      setShowForm(false);
      showSuccess('Rol creado exitosamente', 'El nuevo rol ha sido guardado correctamente en el sistema');
      return true;
    } catch (error: any) {
      showError('Error', error.message || 'Error al crear rol');
      return false;
    }
  };

  const handleRefresh = () => {
    refetch();
    showSuccess('Actualizado', 'Lista de roles actualizada');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtrar roles activos por defecto y aplicar búsqueda/filtros
  const activeRoles = roles.filter(rol => rol.status === true);
  const filteredRoles = activeRoles.filter(rol => {
    // Búsqueda por texto
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const matchesSearch = 
        rol.name.toLowerCase().includes(search) ||
        (rol.description?.toLowerCase() || '').includes(search);
      if (!matchesSearch) return false;
    }
    
    // Filtro por estado
    if (statusFilter !== 'all') {
      const statusMatch = statusFilter === 'active' ? rol.status === true : rol.status === false;
      if (!statusMatch) return false;
    }
    
    return true;
  });

  const totalRoles = pagination.total_items;
  const resultsCount = filteredRoles.length;
  const hasSearch = searchTerm.trim().length > 0 || statusFilter !== 'all';

  const stats: StatCard[] = [
    {
      label: 'Total Roles',
      value: totalRoles,
      icon: Shield,
      iconColor: 'text-blue-600 dark:text-blue-500',
    },
    ...(hasSearch ? [{
      label: 'Resultados Búsqueda',
      value: resultsCount,
      icon: Search,
      iconColor: 'text-purple-600 dark:text-purple-500',
    }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <PageHeader
          title="Gestión de Roles"
          subtitle="Administra los roles del sistema y sus permisos"
          icon={Shield}
          onRefresh={handleRefresh}
          onAdd={() => {
            if (showForm) {
              setShowForm(false);
            } else {
              setShowForm(true);
            }
          }}
          addLabel="Nuevo Rol"
          isRefreshing={isFetching}
          showForm={showForm}
        />

        {/* Formulario para crear rol */}
        {showForm && (
          <RoleForm 
            onSubmit={handleCreateRole}
            onCancel={() => setShowForm(false)}
            loading={createMutation.isPending}
            className="mb-6"
          />
        )}

        {/* Estadísticas y Búsqueda - Solo cuando NO hay formulario */}
        {!showForm && (
          <>
            {/* Stats Cards */}
            <StatsCards stats={stats} />

            {/* Búsqueda y Filtros */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg mb-6 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Búsqueda */}
                <SearchBar
                  placeholder="Buscar roles por nombre o descripción..."
                  value={searchTerm}
                  onChange={setSearchTerm}
                />

                {/* Filtro por estado */}
                <div className="flex items-center space-x-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="active">✅ Solo activos</option>
                    <option value="inactive">❌ Solo inactivos</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Lista de roles - Solo mostrar cuando no está el formulario */}
        {!showForm && (
          <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
            <div className="p-6">
              {isLoading && roles.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Cargando roles...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                        Error al cargar los roles
                      </h3>
                      <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                        <p>{error instanceof Error ? error.message : 'Error desconocido'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : filteredRoles.length === 0 ? (
                <EmptyState
                  icon={<Shield className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />}
                  title="No hay roles disponibles"
                  message={searchTerm || statusFilter !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'No se encontraron roles en el sistema. Crea el primer rol para comenzar.'
                  }
                />
              ) : (
                <>
                  <ScrollableTable
                    columns={[
                      { key: 'id', label: 'ID', width: '80px' },
                      { key: 'name', label: 'Nombre', width: '150px' },
                      { key: 'description', label: 'Descripción' },
                      { key: 'created', label: 'Creado', width: '150px' },
                      { key: 'updated', label: 'Actualizado', width: '150px' }
                    ]}
                    isLoading={isFetching}
                    loadingMessage="Actualizando roles..."
                    enablePagination={false}
                  >
                    {filteredRoles.map((rol: Rol) => (
                      <TableRow key={rol.id_rol}>
                        <TableCell className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                          {rol.id_rol}
                        </TableCell>
                        <TableCell className="font-medium whitespace-nowrap">
                          {rol.name}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate" title={rol.description || ''}>
                            {rol.description || 'Sin descripción'}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          {formatDate(rol.created_at)}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          {formatDate(rol.updated_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </ScrollableTable>
                  
                  {/* Paginación del backend - Mostrar siempre si hay datos */}
                  {!isLoading && !error && pagination.total_items > 0 && (
                    <div className="mt-4">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.total_pages}
                        totalItems={pagination.total_items}
                        pageSize={pageSize}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={(newSize) => {
                          setPageSize(newSize);
                          setCurrentPage(1);
                        }}
                        isLoading={isFetching}
                        pageSizeOptions={[10, 25, 50, 100]}
                        showPageSizeSelector={true}
                        showPageInfo={true}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RolesPage;