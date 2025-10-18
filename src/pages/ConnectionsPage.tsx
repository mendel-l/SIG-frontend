import { useState, useEffect } from 'react';
import { Network, Plus, RefreshCw } from 'lucide-react';
import ConnectionForm from '../components/forms/ConnectionForm';
import { useConnectionsStore } from '../stores/connectionsStore';
import { useNotifications } from '../hooks/useNotifications';
import { ScrollableTable, TableRow, TableCell, EmptyState } from '../components/ui';
import ActionButtons from '../components/ui/ActionButtons';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import { Connection, ConnectionBase, ConnectionCreate } from '../types';

export function ConnectionsPage() {
  const { connections, loading, error, fetchConnections, createConnection, updateConnection, deleteConnection, clearError } = useConnectionsStore();
  const { showSuccess, showError } = useNotifications();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingConnection, setEditingConnection] = useState<Connection | null>(null);
  
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

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  useEffect(() => {
    if (error) {
      showError('Error', error);
      clearError();
    }
  }, [error, showError, clearError]);

  const handleCreateConnection = async (data: ConnectionCreate) => {
    const success = await createConnection(data);
    if (success) {
      setShowForm(false);
      showSuccess('Conexión registrada', 'La conexión ha sido registrada correctamente en el sistema');
    }
    return success;
  };

  const handleUpdateConnection = async (data: Partial<ConnectionBase>) => {
    if (!editingConnection) return false;
    
    const success = await updateConnection(editingConnection.id_connection, data);
    if (success) {
      setEditingConnection(null);
      setShowForm(false);
      showSuccess('Conexión actualizada', 'Los cambios han sido guardados exitosamente');
    }
    return success;
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
    const success = await deleteConnection(confirmAction.connection.id_connection);
    
    if (success) {
      const newStatus = !confirmAction.connection.state;
      showSuccess(
        `Conexión ${newStatus ? 'activada' : 'desactivada'}`,
        `La conexión ha sido ${newStatus ? 'activada' : 'desactivada'} exitosamente`
      );
    }
    
    setIsConfirming(false);
    setConfirmAction({ isOpen: false, connection: null, action: 'toggle' });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingConnection(null);
  };

  const handleRefresh = () => {
    fetchConnections();
    showSuccess('Actualizado', 'Lista de conexiones actualizada');
  };

  const filteredConnections = connections.filter(connection => {
    const search = searchTerm.toLowerCase();
    return (
      connection.material.toLowerCase().includes(search) ||
      connection.connection_type.toLowerCase().includes(search) ||
      connection.pressure_nominal.toLowerCase().includes(search) ||
      (connection.installed_by && connection.installed_by.toLowerCase().includes(search))
    );
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCoordinates = (lat: number, lon: number) => {
    return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
  };

  // Estadísticas
  const totalConnections = connections.length;
  const activeConnections = connections.filter(c => c.state).length;
  const resultsCount = filteredConnections.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
                <Network className="mr-3 h-8 w-8 text-blue-600 dark:text-blue-500" />
                Gestión de Conexiones
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Administra las conexiones de la red de distribución de agua
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center rounded-lg bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
              <button
                onClick={() => {
                  if (showForm) {
                    handleCancelForm();
                  } else {
                    setShowForm(true);
                  }
                }}
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                {showForm ? 'Cancelar' : editingConnection ? 'Editar Conexión' : 'Nueva Conexión'}
              </button>
            </div>
          </div>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="mb-6">
            <ConnectionForm
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
              loading={loading}
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
                state: editingConnection.state
              } : null}
              isEdit={!!editingConnection}
            />
          </div>
        )}

        {/* Estadísticas y Búsqueda - Solo cuando NO hay formulario */}
        {!showForm && (
          <>
            {/* Stats Cards */}
            <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Network className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                          Total Conexiones
                        </dt>
                        <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {totalConnections}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-600 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                          Conexiones Activas
                        </dt>
                        <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {activeConnections}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-purple-600 dark:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                          Resultados Búsqueda
                        </dt>
                        <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {resultsCount}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Búsqueda */}
            <div className="mb-6 flex items-center rounded-lg bg-white dark:bg-gray-800 p-4 shadow">
              <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por material, tipo, presión o instalador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ml-3 flex-1 border-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0"
              />
            </div>

            {/* Tabla */}
            <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
              <div className="p-6">
                {loading && connections.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <RefreshCw className="mx-auto h-12 w-12 animate-spin text-blue-600 dark:text-blue-500" />
                      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Cargando conexiones...</p>
                    </div>
                  </div>
                ) : filteredConnections.length === 0 ? (
                  <EmptyState
                    icon={
                      <Network className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                    }
                    title="No hay conexiones disponibles"
                    message={searchTerm ? 'No se encontraron conexiones con los criterios de búsqueda' : 'Comienza registrando tu primera conexión'}
                  />
                ) : (
                  <ScrollableTable
                    columns={[
                      { key: 'connection', label: 'Conexión', width: '200px' },
                      { key: 'coordinates', label: 'Coordenadas', width: '180px' },
                      { key: 'specs', label: 'Especificaciones', width: '200px' },
                      { key: 'installation', label: 'Instalación', width: '180px' },
                      { key: 'status', label: 'Estado', width: '100px', align: 'center' },
                      { key: 'actions', label: 'Acciones', width: '100px', align: 'right' }
                    ]}
                    isLoading={loading}
                    loadingMessage="Cargando conexiones..."
                  >
                    {filteredConnections.map((connection) => (
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
                            {formatCoordinates(connection.latitude, connection.longitude)}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Prof: {connection.depth_m}m
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
                            {formatDate(connection.installed_date)}
                          </div>
                          {connection.installed_by && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {connection.installed_by}
                            </div>
                          )}
                        </TableCell>
                        <TableCell align="center" className="whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            connection.state 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                          }`}>
                            {connection.state ? '✅ Activo' : '❌ Inactivo'}
                          </span>
                        </TableCell>
                        <TableCell align="right" className="whitespace-nowrap">
                          <ActionButtons
                            onEdit={() => handleEditConnection(connection)}
                            onToggleStatus={() => handleToggleStatus(connection)}
                            isActive={connection.state}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </ScrollableTable>
                )}
              </div>
            </div>
          </>
        )}

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={confirmAction.isOpen}
          title={confirmAction.connection?.state ? 'Desactivar Conexión' : 'Activar Conexión'}
          message={
            confirmAction.connection?.state
              ? `¿Estás seguro de que deseas desactivar esta conexión? El registro quedará inactivo.`
              : `¿Estás seguro de que deseas activar esta conexión?`
          }
          variant={confirmAction.connection?.state ? 'danger' : 'info'}
          onConfirm={confirmToggleStatus}
          onClose={() => setConfirmAction({ isOpen: false, connection: null, action: 'toggle' })}
          loading={isConfirming}
        />
      </div>
    </div>
  );
}
