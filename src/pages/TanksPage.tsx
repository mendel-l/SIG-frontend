import { useState } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import { useTanks } from '@/hooks/useTanks';
import { useNotifications } from '@/hooks/useNotifications';
import TankForm from '@/components/forms/TankForm';
import PhotoGallery from '@/components/ui/PhotoGallery';
import ActionButtons from '@/components/ui/ActionButtons';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { ScrollableTable, TableRow, TableCell, EmptyState } from '@/components/ui';

export function TanksPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingTank, setEditingTank] = useState<any>(null);
  const [confirmAction, setConfirmAction] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    show: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });
  
  const { tanks, loading, error, createTank, updateTank, toggleTankStatus, refreshTanks } = useTanks();
  const { showSuccess } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const handleCreateTank = async (tankData: any) => {
    const success = await createTank(tankData);
    if (success) {
      setShowForm(false);
      showSuccess('Tanque creado exitosamente', 'El tanque ha sido registrado en el sistema.');
    }
    return success;
  };

  const handleUpdateTank = async (tankData: any) => {
    if (!editingTank) return false;
    
    const success = await updateTank(editingTank.id, tankData);
    if (success) {
      setShowForm(false);
      setEditingTank(null);
      showSuccess('Tanque actualizado exitosamente', 'Los cambios han sido guardados correctamente.');
    }
    return success;
  };

  const handleFormSubmit = async (tankData: any) => {
    if (editingTank) {
      return await handleUpdateTank(tankData);
    } else {
      return await handleCreateTank(tankData);
    }
  };

  const handleEdit = (tank: any) => {
    setEditingTank(tank);
    setShowForm(true);
  };

  const handleToggleStatus = (tank: any) => {
    const action = tank.state ? 'desactivar' : 'activar';
    const newStatus = tank.state ? 'inactivo' : 'activo';
    
    setConfirmAction({
      show: true,
      title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} tanque?`,
      message: `¿Estás seguro de que deseas ${action} el tanque "${tank.name}"? El tanque quedará ${newStatus}.`,
      onConfirm: async () => {
        const success = await toggleTankStatus(tank.id);
        if (success) {
          showSuccess(
            `Tanque ${tank.state ? 'desactivado' : 'activado'} exitosamente`,
            `El tanque "${tank.name}" ahora está ${newStatus}.`
          );
        }
        setConfirmAction(prev => ({ ...prev, show: false }));
      }
    });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTank(null);
  };

  const filteredTanks = tanks.filter(tank => {
    const matchesSearch = tank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tank.connections.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || tank.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCoordinates = (lat: number, lon: number) => {
    return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:truncate sm:text-3xl sm:tracking-tight">
              Gestión de Tanques
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Administra los tanques de agua del sistema y su ubicación
            </p>
          </div>
          
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <svg className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              Exportar
            </button>
            <button
              type="button"
              onClick={() => {
                if (showForm) {
                  handleCancelForm();
                } else {
                  setShowForm(true);
                }
              }}
              className="ml-3 inline-flex items-center rounded-md bg-blue-500 dark:bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 dark:hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:focus-visible:outline-blue-600"
            >
              <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              {showForm ? 'Cancelar' : editingTank ? 'Editar Tanque' : 'Agregar Tanque'}
            </button>
          </div>
        </div>

        {/* Formulario para crear/editar tanque */}
        {showForm && (
          <TankForm 
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
            loading={loading}
            className="mb-6"
            initialData={editingTank ? {
              name: editingTank.name,
              latitude: editingTank.latitude,
              longitude: editingTank.longitude,
              connections: editingTank.connections,
              photos: editingTank.photos,
              state: editingTank.state
            } : null}
            isEdit={!!editingTank}
          />
        )}

        {/* Filters - Solo mostrar cuando NO hay formulario */}
        {!showForm && (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border-0 mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                  Filtros y Búsqueda
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Encuentra tanques específicos
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Buscar tanques..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="active">Activos</option>
                    <option value="inactive">Inactivos</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tanks Table - Solo mostrar cuando NO hay formulario */}
        {!showForm && (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border-0">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Lista de Tanques ({filteredTanks.length})
                </h3>
              </div>
              <button
                onClick={refreshTanks}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualizar
              </button>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando tanques...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400 dark:text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                      Error al cargar los tanques
                    </h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                      <p>{error}</p>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded text-sm font-medium text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/40"
                      >
                        Reintentar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : filteredTanks.length === 0 ? (
              <EmptyState
                icon={
                  <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                }
                title="No hay tanques disponibles"
                message={searchTerm || selectedStatus !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'No se encontraron tanques en el sistema.'
                }
              />
            ) : (
              <ScrollableTable
                columns={[
                  { key: 'tank', label: 'Tanque', width: '200px' },
                  { key: 'coordinates', label: 'Coordenadas', width: '180px' },
                  { key: 'photos', label: 'Fotografías', width: '120px', align: 'center' },
                  { key: 'connections', label: 'Conexiones', width: '150px' },
                  { key: 'status', label: 'Estado', width: '100px', align: 'center' },
                  { key: 'date', label: 'Fecha de creación', width: '150px' },
                  { key: 'actions', label: 'Acciones', width: '100px', align: 'right' }
                ]}
                isLoading={loading}
                loadingMessage="Cargando tanques..."
              >
                {filteredTanks.map((tank) => (
                  <TableRow key={tank.id}>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {tank.name}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {formatCoordinates(tank.latitude, tank.longitude)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Lat: {tank.latitude.toFixed(6)}, Lon: {tank.longitude.toFixed(6)}
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <PhotoGallery
                        photos={tank.photos}
                        tankName={tank.name}
                        maxPreview={2}
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {tank.connections || 'Sin conexiones'}
                      </div>
                    </TableCell>
                    <TableCell align="center" className="whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(tank.status)}`}>
                        {tank.status === 'active' ? '✅ Activo' : '❌ Inactivo'}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {formatDate(tank.createdAt)}
                    </TableCell>
                    <TableCell align="right" className="whitespace-nowrap">
                      <ActionButtons
                        onEdit={() => handleEdit(tank)}
                        onToggleStatus={() => handleToggleStatus(tank)}
                        isActive={tank.state}
                        loading={loading}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </ScrollableTable>
            )}
          </div>
        </div>
        )}

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={confirmAction.show}
          title={confirmAction.title}
          message={confirmAction.message}
          onConfirm={confirmAction.onConfirm}
          onClose={() => setConfirmAction(prev => ({ ...prev, show: false }))}
          variant="warning"
        />
      </div>
    </div>
  );
}