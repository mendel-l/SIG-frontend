import { useState, useEffect } from 'react';
import { Wrench, Search } from 'lucide-react';
import InterventionForm from '../components/forms/InterventionForm';
import { useNotifications } from '../hooks/useNotifications';
import { useDebounce } from '../hooks/useDebounce';
import { 
  useInterventions, 
  useCreateIntervention, 
  useUpdateIntervention,
  useDeleteIntervention,
  type Intervention,
  type InterventionCreate,
  type InterventionUpdate 
} from '../queries/interventionsQueries';
import { ScrollableTable, TableRow, TableCell, EmptyState, Pagination, StatsCards, PageHeader, SearchBar, StatCard } from '../components/ui';
import ActionButtons from '../components/ui/ActionButtons';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import PhotoGallery from '../components/ui/PhotoGallery';

export function InterventionsPage() {
  const { showSuccess, showError } = useNotifications();
  
  // Estado local de UI
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingIntervention, setEditingIntervention] = useState<Intervention | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    isOpen: boolean;
    intervention: Intervention | null;
  }>({
    isOpen: false,
    intervention: null,
  });

  // Debounce del término de búsqueda para optimizar peticiones (300ms)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Resetear página a 1 cuando cambia el término de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // ✅ QUERY - Obtener intervenciones con TanStack Query (búsqueda en backend)
  const { 
    data: interventionsData,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useInterventions(currentPage, pageSize, debouncedSearchTerm || undefined);

  // ✅ MUTATIONS - Acciones
  const createMutation = useCreateIntervention();
  const updateMutation = useUpdateIntervention();
  const deleteMutation = useDeleteIntervention();

  // Extraer datos y paginación
  const interventions = interventionsData?.items || [];
  const pagination = interventionsData?.pagination || { 
    page: 1, 
    limit: pageSize, 
    total_items: 0, 
    total_pages: 1,
    next_page: null,
    prev_page: null,
  };

  const handleCreateIntervention = async (data: InterventionCreate) => {
    try {
      await createMutation.mutateAsync(data);
      setShowForm(false);
      showSuccess('Intervención registrada', 'La intervención ha sido registrada correctamente en el sistema');
      return true;
    } catch (error: any) {
      showError('Error', error.message || 'Error al crear intervención');
      return false;
    }
  };

  const handleUpdateIntervention = async (data: InterventionUpdate) => {
    if (!editingIntervention) return false;
    
    try {
      await updateMutation.mutateAsync({
        id: editingIntervention.id_interventions,
        data
      });
      setShowForm(false);
      setEditingIntervention(null);
      showSuccess('Intervención actualizada', 'Los cambios han sido guardados correctamente');
      return true;
    } catch (error: any) {
      showError('Error', error.message || 'Error al actualizar intervención');
      return false;
    }
  };

  const handleEditIntervention = (intervention: Intervention) => {
    setEditingIntervention(intervention);
    setShowForm(true);
  };

  const handleToggleStatus = (intervention: Intervention) => {
    setConfirmAction({
      isOpen: true,
      intervention,
    });
  };

  const confirmToggleStatus = async () => {
    if (!confirmAction.intervention) return;
    
    try {
      await deleteMutation.mutateAsync(confirmAction.intervention.id_interventions);
      const newStatus = !confirmAction.intervention.status;
      showSuccess(
        `Intervención ${newStatus ? 'activada' : 'desactivada'}`,
        `La intervención ha sido ${newStatus ? 'activada' : 'desactivada'} correctamente`
      );
    } catch (error: any) {
      showError('Error', error.message || 'Error al cambiar estado de la intervención');
    } finally {
      setConfirmAction({ isOpen: false, intervention: null });
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingIntervention(null);
  };

  const handleRefresh = () => {
    refetch();
    showSuccess('Actualizado', 'Lista de intervenciones actualizada');
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

  // Los datos ya vienen filtrados del backend, no necesitamos filtrado local
  const totalInterventions = pagination.total_items;
  const hasSearch = debouncedSearchTerm.trim().length > 0;

  const stats: StatCard[] = [
    {
      label: 'Total Intervenciones',
      value: totalInterventions,
      icon: Wrench,
      iconColor: 'text-orange-600 dark:text-orange-500',
    },
    ...(hasSearch ? [{
      label: 'Resultados Búsqueda',
      value: totalInterventions,
      icon: Search,
      iconColor: 'text-purple-600 dark:text-purple-500',
    }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <PageHeader
          title="Intervenciones del Sistema"
          subtitle="Administra las intervenciones realizadas en tanques, tuberías y conexiones"
          icon={Wrench}
          onRefresh={handleRefresh}
          onAdd={() => {
            if (showForm) {
              handleCancelForm();
            } else {
              setShowForm(true);
            }
          }}
          addLabel={editingIntervention ? 'Editar Intervención' : 'Nueva Intervención'}
          isRefreshing={isFetching}
          showForm={showForm}
        />

        {/* Formulario para crear/editar intervención */}
        {showForm && (
          <InterventionForm 
            onSubmit={editingIntervention ? handleUpdateIntervention : handleCreateIntervention}
            onCancel={handleCancelForm}
            loading={createMutation.isPending || updateMutation.isPending}
            className="mb-6"
            initialData={editingIntervention ? {
              description: editingIntervention.description,
              start_date: editingIntervention.start_date,
              end_date: editingIntervention.end_date,
              status: editingIntervention.status,
              photography: editingIntervention.photography || []
            } : undefined}
            isEdit={!!editingIntervention}
          />
        )}

        {/* Estadísticas y Búsqueda - Solo cuando NO hay formulario */}
        {!showForm && (
          <>
            {/* Stats Cards */}
            <StatsCards stats={stats} />

            {/* Búsqueda */}
            <SearchBar
              placeholder="Buscar intervenciones por descripción..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </>
        )}

        {/* Lista de intervenciones - Solo mostrar cuando no está el formulario */}
        {!showForm && (
          <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
            <div className="p-6">
              {isLoading && interventions.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 dark:border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Cargando intervenciones...</p>
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
                        Error al cargar las intervenciones
                      </h3>
                      <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                        <p>{error instanceof Error ? error.message : 'Error desconocido'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : interventions.length === 0 ? (
                <EmptyState
                  icon={<Wrench className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />}
                  title={debouncedSearchTerm ? "No se encontraron intervenciones" : "No hay intervenciones disponibles"}
                  message={debouncedSearchTerm 
                    ? `No se encontraron intervenciones que coincidan con "${debouncedSearchTerm}"`
                    : "No se encontraron intervenciones en el sistema. Registra la primera intervención para comenzar."
                  }
                />
              ) : (
                <>
                  <ScrollableTable
                    columns={[
                      { key: 'id', label: 'ID', width: '80px' },
                      { key: 'description', label: 'Descripción', width: '300px' },
                      { key: 'dates', label: 'Fechas', width: '200px' },
                      { key: 'duration', label: 'Duración', width: '100px' },
                      { key: 'photos', label: 'Fotos', width: '80px' },
                      { key: 'actions', label: 'Acciones', width: '120px' }
                    ]}
                    isLoading={isFetching}
                    loadingMessage="Actualizando intervenciones..."
                    enablePagination={false}
                  >
                    {interventions.map((intervention) => (
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
          onClose={() => setConfirmAction({ isOpen: false, intervention: null })}
          loading={deleteMutation.isPending}
        />
      </div>
    </div>
  );
}
