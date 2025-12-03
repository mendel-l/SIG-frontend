import { useState, useEffect } from 'react';
import { Network, Search } from 'lucide-react';
import ConnectionForm from '../components/forms/ConnectionForm';
import { useNotifications } from '../hooks/useNotifications';
import { useDebounce } from '../hooks/useDebounce';
import { ScrollableTable, TableRow, TableCell, EmptyState, StatsCards, PageHeader, SearchBar, StatCard, Pagination } from '../components/ui';
import ActionButtons from '../components/ui/ActionButtons';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import { Connection, ConnectionBase, ConnectionCreate } from '../types';
import { 
  useConnections, 
  useCreateConnection, 
  useUpdateConnection,
  useDeleteConnection,
} from '../queries/connectionsQueries';

export function ConnectionsPage() {
  const { showSuccess, showError } = useNotifications();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingConnection, setEditingConnection] = useState<Connection | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [confirmAction, setConfirmAction] = useState<{
    isOpen: boolean;
    connection: Connection | null;
    action: 'toggle';
  }>({
    isOpen: false,
    connection: null,
    action: 'toggle'
  });
  const [isConfirming, setIsConfirming] = useState(false);

  // Debounce del término de búsqueda para optimizar peticiones (300ms)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Resetear página a 1 cuando cambia el término de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const { 
    data: connectionsData,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useConnections(currentPage, pageSize, debouncedSearchTerm || undefined);

  // ✅ QUERY ADICIONAL - Obtener total real (sin búsqueda) cuando hay búsqueda activa
  const hasSearch = debouncedSearchTerm.trim().length > 0;
  const { data: totalConnectionsData } = useConnections(1, 1, undefined, {
    enabled: hasSearch, // Solo ejecutar cuando hay búsqueda activa
  });

  const createMutation = useCreateConnection();
  const updateMutation = useUpdateConnection();
  const deleteMutation = useDeleteConnection();

  const connections = connectionsData?.items || [];
  const pagination = connectionsData?.pagination || { 
    page: 1, 
    limit: 25, 
    total_items: 0, 
    total_pages: 1,
    next_page: null,
    prev_page: null,
  };

  // Calcular total real: si hay búsqueda, usar la query adicional, sino usar pagination.total_items
  const totalConnections = hasSearch 
    ? (totalConnectionsData?.pagination?.total_items ?? pagination.total_items)
    : pagination.total_items;
  
  // Resultados de búsqueda: siempre usar pagination.total_items cuando hay búsqueda
  const searchResults = hasSearch ? pagination.total_items : 0;

  const handleCreateConnection = async (data: ConnectionCreate) => {
    try {
      await createMutation.mutateAsync(data);
      setShowForm(false);
      showSuccess('Conexión registrada', 'La conexión ha sido registrada correctamente en el sistema');
      return true;
    } catch (error: any) {
      showError('Error', error.message || 'Error al crear la conexión');
      return false;
    }
  };

  const handleUpdateConnection = async (data: Partial<ConnectionBase>) => {
    if (!editingConnection) return false;
    
    try {
      await updateMutation.mutateAsync({
        id: editingConnection.id_connection,
        data
      });
      setShowForm(false);
      setEditingConnection(null);
      showSuccess('Conexión actualizada', 'Los cambios han sido guardados exitosamente');
      return true;
    } catch (error: any) {
      showError('Error', error.message || 'Error al actualizar la conexión');
      return false;
    }
  };

  const handleFormSubmit = async (data: ConnectionCreate | Partial<ConnectionBase>) => {
    if (editingConnection) {
      return await handleUpdateConnection(data);
    } else {
      return await handleCreateConnection(data as ConnectionCreate);
    }
  };

  const handleEditConnection = (connection: Connection) => {
    setEditingConnection(connection);
    setShowForm(true);
  };

  const handleToggleStatus = (connection: Connection) => {
    setConfirmAction({
      isOpen: true,
      connection,
      action: 'toggle'
    });
  };

  const confirmToggleStatus = async () => {
    if (!confirmAction.connection) return;
    
    setIsConfirming(true);
    try {
      await deleteMutation.mutateAsync(confirmAction.connection.id_connection);
      const newStatus = !confirmAction.connection.active;
      showSuccess(
        `Conexión ${newStatus ? 'activada' : 'desactivada'}`,
        `La conexión ha sido ${newStatus ? 'activada' : 'desactivada'} exitosamente`
      );
    } catch (error: any) {
      showError('Error', error.message || 'Error al cambiar estado de la conexión');
    } finally {
      setIsConfirming(false);
      setConfirmAction({ isOpen: false, connection: null, action: 'toggle' });
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingConnection(null);
  };

  const handleRefresh = () => {
    refetch();
    showSuccess('Actualizado', 'Lista de conexiones actualizada');
  };


  const stats: StatCard[] = [
    {
      label: 'Total Conexiones',
      value: totalConnections,
      icon: Network,
      iconColor: 'text-blue-600 dark:text-blue-500',
    },
    ...(hasSearch ? [{
      label: 'Resultados Búsqueda',
      value: searchResults,
      icon: Search,
      iconColor: 'text-purple-600 dark:text-purple-500',
    }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <PageHeader
          title="Gestión de Conexiones"
          subtitle="Administra las conexiones de la red de distribución de agua"
          icon={Network}
          onRefresh={handleRefresh}
          onAdd={() => {
            if (showForm) {
              handleCancelForm();
            } else {
              setShowForm(true);
            }
          }}
          addLabel={editingConnection ? 'Editar Conexión' : 'Nueva Conexión'}
          isRefreshing={isFetching}
          showForm={showForm}
        />

        {/* Formulario */}
        {showForm && (
          <div className="mb-6">
            <ConnectionForm
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
              loading={createMutation.isPending || updateMutation.isPending}
              initialData={editingConnection ? {
                latitude: editingConnection.latitude,
                longitude: editingConnection.longitude,
                material: editingConnection.material,
                diameter_mn: editingConnection.diameter_mn,
                pressure_nominal: editingConnection.pressure_nominal,
                connection_type: editingConnection.connection_type,
                depth_m: editingConnection.depth_m,
                installed_date: editingConnection.installed_date,
                installed_by: editingConnection.installed_by || undefined,
                description: editingConnection.description || undefined,
                active: editingConnection.active
              } : null}
              isEdit={!!editingConnection}
            />
          </div>
        )}

        {/* Estadísticas y Búsqueda - Solo cuando NO hay formulario */}
        {!showForm && (
          <>
            {/* Stats Cards */}
            <StatsCards stats={stats} />

            {/* Búsqueda */}
            <SearchBar
              placeholder="Buscar por material, tipo, presión o instalador..."
              value={searchTerm}
              onChange={setSearchTerm}
            />

            {/* Tabla */}
            <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
              <div className="p-6">
                {isLoading && connections.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500 mx-auto"></div>
                      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Cargando conexiones...</p>
                    </div>
                  </div>
                ) : error ? (
                  // Verificar si es un error 404 o de datos no encontrados
                  (error instanceof Error && (error.message.includes('404') || error.message === 'NO_DATA')) ? (
                    <EmptyState
                      icon={<Network className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />}
                      title="No hay información registrada"
                      message={debouncedSearchTerm 
                        ? 'No se encontraron conexiones con los criterios de búsqueda' 
                        : 'Por favor agrega información, ya sea tanques, bombas, tuberías o conexiones para comenzar.'}
                    />
                  ) : (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                            Error al cargar las conexiones
                          </h3>
                          <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                            <p>{error instanceof Error ? String(error.message) : 'Error desconocido'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                ) : connections.length === 0 ? (
                  <EmptyState
                    icon={<Network className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />}
                    title="No hay información registrada"
                    message={debouncedSearchTerm 
                      ? 'No se encontraron conexiones con los criterios de búsqueda' 
                      : 'Por favor agrega información, ya sea tanques, bombas, tuberías o conexiones para comenzar.'}
                  />
                ) : (
                  <>
                    <ScrollableTable
                      columns={[
                        { key: 'connection', label: 'Conexión', width: '200px' },
                        { key: 'specs', label: 'Especificaciones', width: '200px' },
                        { key: 'description', label: 'Descripción', width: '250px' },
                        { key: 'actions', label: 'Acciones', width: '100px', align: 'right' }
                      ]}
                      isLoading={isFetching}
                      loadingMessage="Actualizando conexiones..."
                      enablePagination={false}
                    >
                      {connections.map((connection) => (
                        <TableRow key={connection.id_connection}>
                          <TableCell className="whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500">
                                  <Network className="h-5 w-5 text-white" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {connection.connection_type}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  ID: {connection.id_connection}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {connection.material} - Ø{connection.diameter_mn}mm
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {connection.pressure_nominal}
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {connection.description || 'Sin descripción'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Estado: {connection.active ? 'Activo' : 'Inactivo'}
                            </div>
                          </TableCell>
                          <TableCell align="right" className="whitespace-nowrap">
                            <ActionButtons
                              onEdit={() => handleEditConnection(connection)}
                              onToggleStatus={() => handleToggleStatus(connection)}
                              isActive={connection.active}
                            />
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
          </>
        )}

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={confirmAction.isOpen}
          title={confirmAction.connection?.active ? 'Desactivar Conexión' : 'Activar Conexión'}
          message={
            confirmAction.connection?.active
              ? `¿Estás seguro de que deseas desactivar esta conexión? El registro quedará inactivo.`
              : `¿Estás seguro de que deseas activar esta conexión?`
          }
          variant={confirmAction.connection?.active ? 'danger' : 'info'}
          onConfirm={confirmToggleStatus}
          onClose={() => setConfirmAction({ isOpen: false, connection: null, action: 'toggle' })}
          loading={isConfirming}
        />
      </div>
    </div>
  );
}
