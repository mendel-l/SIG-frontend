import { useState, useEffect } from 'react';
import { Wrench, Plus, RefreshCw } from 'lucide-react';
import InterventionForm from '../components/forms/InterventionForm';
import { useInterventionsStore } from '../stores/interventionsStore';
import { useNotifications } from '../hooks/useNotifications';
import { ScrollableTable, TableRow, TableCell, EmptyState } from '../components/ui';
import ActionButtons from '../components/ui/ActionButtons';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import PhotoGallery from '../components/ui/PhotoGallery';
import { Intervention, InterventionBase, InterventionCreate } from '../types';

export function InterventionsPage() {
  const { interventions, loading, error, fetchInterventions, createIntervention, updateIntervention, deleteIntervention, clearError } = useInterventionsStore();
  const { showSuccess, showError } = useNotifications();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIntervention, setEditingIntervention] = useState<Intervention | null>(null);
  
  // Estado para confirmación de toggle
  const [confirmAction, setConfirmAction] = useState<{
    isOpen: boolean;
    intervention: Intervention | null;
    action: 'toggle';
  }>({
    isOpen: false,
    intervention: null,
    action: 'toggle'
  });
  const [isConfirming, setIsConfirming] = useState(false);

  // Cargar intervenciones al montar el componente
  useEffect(() => {
    fetchInterventions();
  }, [fetchInterventions]);

  // Mostrar errores como notificación
  useEffect(() => {
    if (error) {
      showError('Error', error);
      clearError();
    }
  }, [error, showError, clearError]);

  const handleCreateIntervention = async (data: InterventionCreate) => {
    const success = await createIntervention(data);
    if (success) {
      setShowForm(false);
      showSuccess('Intervención registrada', 'La intervención ha sido registrada correctamente en el sistema');
    }
    return success;
  };

  const handleUpdateIntervention = async (data: InterventionBase) => {
    if (!editingIntervention) return false;
    
    const success = await updateIntervention(editingIntervention.id_interventions, data);
    if (success) {
      setShowForm(false);
      setEditingIntervention(null);
      showSuccess('Intervención actualizada', 'Los cambios han sido guardados correctamente');
    }
    return success;
  };

  const handleEditIntervention = (intervention: Intervention) => {
    setEditingIntervention(intervention);
    setShowForm(true);
  };

  const handleToggleStatus = (intervention: Intervention) => {
    setConfirmAction({
      isOpen: true,
      intervention,
      action: 'toggle'
    });
  };

  const confirmToggleStatus = async () => {
    if (!confirmAction.intervention) return;

    setIsConfirming(true);
    const success = await deleteIntervention(confirmAction.intervention.id_interventions);
    
    if (success) {
      const newStatus = !confirmAction.intervention.status;
      showSuccess(
        `Intervención ${newStatus ? 'activada' : 'desactivada'}`,
        `La intervención ha sido ${newStatus ? 'activada' : 'desactivada'} correctamente`
      );
    }
    
    setIsConfirming(false);
    setConfirmAction({ isOpen: false, intervention: null, action: 'toggle' });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingIntervention(null);
  };

  const handleRefresh = () => {
    fetchInterventions();
    showSuccess('Lista actualizada', 'Las intervenciones han sido actualizadas correctamente');
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

  const formatDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours % 24}h`;
    }
    return `${diffHours}h`;
  };

  // Filtrar intervenciones por búsqueda
  const filteredInterventions = interventions.filter(intervention =>
    intervention.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Contar intervenciones activas
  const activeInterventionsCount = interventions.filter(i => i.status).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header con estadísticas */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Wrench className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white">
                    Intervenciones del Sistema
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Administra las intervenciones realizadas en tanques, tuberías y conexiones
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`-ml-0.5 mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
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
                disabled={loading}
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="-ml-0.5 mr-1.5 h-5 w-5" />
                {showForm ? 'Cancelar' : 'Nueva Intervención'}
              </button>
            </div>
          </div>

          {/* Estadísticas rápidas - Solo mostrar cuando no está el formulario */}
          {!showForm && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Intervenciones</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                    {interventions.length}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <Wrench className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Intervenciones Activas</p>
                  <p className="text-2xl font-semibold text-green-600 dark:text-green-400 mt-1">
                    {activeInterventionsCount}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resultados Búsqueda</p>
                  <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mt-1">
                    {filteredInterventions.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Formulario para crear/editar intervención */}
        {showForm && (
          <InterventionForm 
            onSubmit={editingIntervention ? handleUpdateIntervention : handleCreateIntervention}
            onCancel={handleCancelForm}
            loading={loading}
            className="mb-6"
            initialData={editingIntervention ? {
              description: editingIntervention.description,
              start_date: editingIntervention.start_date,
              end_date: editingIntervention.end_date,
              status: editingIntervention.status,
              photography: editingIntervention.photography
            } : undefined}
            isEdit={!!editingIntervention}
          />
        )}

        {/* Barra de búsqueda - Solo mostrar cuando no está el formulario */}
        {!showForm && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6 border border-gray-200 dark:border-gray-700 p-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar intervenciones por descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>
          </div>
        )}

        {/* Lista de intervenciones - Solo mostrar cuando no está el formulario */}
        {!showForm && error && !loading ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                  Error al cargar las intervenciones
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleRefresh}
                    className="bg-red-100 dark:bg-red-800 px-2 py-1 rounded text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : !showForm && filteredInterventions.length === 0 && !loading ? (
          <EmptyState
            title={searchTerm ? "No se encontraron intervenciones" : "No hay intervenciones disponibles"}
            message={searchTerm 
              ? `No se encontraron intervenciones que coincidan con "${searchTerm}"`
              : "No se encontraron intervenciones en el sistema. Registra la primera intervención para comenzar."
            }
          />
        ) : !showForm && !loading && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Lista de Intervenciones ({filteredInterventions.length})
              </h3>
            </div>
            
            <ScrollableTable
              columns={[
                { key: 'id', label: 'ID', width: '80px' },
                { key: 'description', label: 'Descripción', width: '300px' },
                { key: 'dates', label: 'Fechas', width: '200px' },
                { key: 'duration', label: 'Duración', width: '100px' },
                { key: 'status', label: 'Estado', width: '120px' },
                { key: 'photos', label: 'Fotos', width: '80px' },
                { key: 'actions', label: 'Acciones', width: '120px' }
              ]}
              isLoading={loading}
              loadingMessage="Cargando intervenciones..."
              enablePagination={true}
              defaultPageSize={25}
              pageSizeOptions={[10, 25, 50, 100]}
            >
              {filteredInterventions.map((intervention) => (
                <TableRow key={intervention.id_interventions}>
                  <TableCell className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                    #{intervention.id_interventions}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full ${
                        intervention.status 
                          ? 'bg-orange-600 dark:bg-orange-500' 
                          : 'bg-gray-400 dark:bg-gray-600'
                      }`}>
                        <Wrench className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                          {intervention.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="space-y-1">
                      <div className="text-gray-900 dark:text-white">
                        <span className="font-medium">Inicio:</span> {formatDate(intervention.start_date)}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Fin:</span> {formatDate(intervention.end_date)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      {formatDuration(intervention.start_date, intervention.end_date)}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      intervention.status 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {intervention.status ? '✅ Activo' : '❌ Inactivo'}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <PhotoGallery
                      photos={intervention.photography || []}
                      tankName={`Intervención #${intervention.id_interventions}`}
                      maxPreview={2}
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <ActionButtons
                      onEdit={() => handleEditIntervention(intervention)}
                      onToggleStatus={() => handleToggleStatus(intervention)}
                      isActive={intervention.status}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </ScrollableTable>
          </div>
        )}

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={confirmAction.isOpen}
          title={confirmAction.intervention?.status ? 'Desactivar Intervención' : 'Activar Intervención'}
          message={
            confirmAction.intervention?.status
              ? `¿Estás seguro de que deseas desactivar esta intervención? El registro quedará inactivo pero se mantendrá en el historial.`
              : `¿Estás seguro de que deseas activar esta intervención?`
          }
          variant={confirmAction.intervention?.status ? 'danger' : 'info'}
          onConfirm={confirmToggleStatus}
          onClose={() => setConfirmAction({ isOpen: false, intervention: null, action: 'toggle' })}
          loading={isConfirming}
        />
      </div>
    </div>
  );
}
