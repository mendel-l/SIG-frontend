import { useState, useEffect } from 'react';
import { GitBranch, Search, Wrench } from 'lucide-react';
import PipeForm from '../components/forms/PipeForm';
import { useNotifications } from '../hooks/useNotifications';
import { useDebounce } from '../hooks/useDebounce';
import { ScrollableTable, TableRow, TableCell, EmptyState, StatsCards, PageHeader, SearchBar, StatCard, Pagination } from '../components/ui';
import ActionButtons from '../components/ui/ActionButtons';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import { 
  usePipes, 
  useCreatePipe, 
  useUpdatePipe,
  useDeletePipe,
  type Pipe,
  type PipeCreate,
  type PipeUpdate
} from '../queries/pipesQueries';

export default function PipesPage() {
  const { showSuccess, showError } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPipe, setEditingPipe] = useState<Pipe | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [confirmAction, setConfirmAction] = useState<{
    isOpen: boolean;
    pipe: Pipe | null;
  }>({
    isOpen: false,
    pipe: null
  });
  const [isConfirming, setIsConfirming] = useState(false);

  // Debounce del término de búsqueda para optimizar peticiones (300ms)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Resetear página a 1 cuando cambia el término de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // ✅ QUERY - Obtener tuberías con TanStack Query (búsqueda en backend)
  const { 
    data: pipesData,
    isLoading,
    error,
    isFetching,
    refetch,
  } = usePipes(currentPage, pageSize, debouncedSearchTerm || undefined);

  // ✅ QUERY ADICIONAL - Obtener total real (sin búsqueda) cuando hay búsqueda activa
  const hasSearch = debouncedSearchTerm.trim().length > 0;
  const { data: totalPipesData } = usePipes(1, 1, undefined, {
    enabled: hasSearch, // Solo ejecutar cuando hay búsqueda activa
  });

  // ✅ MUTATIONS - Acciones
  const createMutation = useCreatePipe();
  const updateMutation = useUpdatePipe();
  const deleteMutation = useDeletePipe();

  // Extraer datos y paginación
  const pipes = pipesData?.items || [];
  const pagination = pipesData?.pagination || { 
    page: 1, 
    limit: 25, 
    total_items: 0, 
    total_pages: 1,
    next_page: null,
    prev_page: null,
  };

  // Calcular total real: si hay búsqueda, usar la query adicional, sino usar pagination.total_items
  const totalPipes = hasSearch 
    ? (totalPipesData?.pagination?.total_items ?? pagination.total_items)
    : pagination.total_items;
  
  // Resultados de búsqueda: siempre usar pagination.total_items cuando hay búsqueda
  const searchResults = hasSearch ? pagination.total_items : 0;

  const toLonLat = (coords: [number, number][]) =>
    coords.map(([lat, lng]) => [lng, lat] as [number, number]);

  const toLatLng = (coords?: [number, number][]) =>
    Array.isArray(coords)
      ? coords.map(([lng, lat]) => [lat, lng] as [number, number])
      : [];

  const handleCreatePipe = async (data: any) => {
    try {
      if (!Array.isArray(data.coordinates) || data.coordinates.length !== 2) {
        showError('Error', 'Debes definir exactamente 2 puntos (inicio y fin)');
        return false;
      }
      
      const createData: PipeCreate = {
        material: data.material,
        diameter: data.diameter,
        size: data.size,
        active: data.active,
        installation_date: data.installation_date,
        coordinates: toLonLat(data.coordinates),
        observations: data.observations || '',
        tank_ids: data.tank_id ? [data.tank_id] : undefined,
        start_connection_id: data.start_connection_id,
        end_connection_id: data.end_connection_id,
      };
      await createMutation.mutateAsync(createData);
      setShowForm(false);
      showSuccess('Tubería registrada', 'La tubería ha sido registrada correctamente en el sistema');
      return true;
    } catch (error: any) {
      showError('Error', error.message || 'Error al crear la tubería');
      return false;
    }
  };

  const handleUpdatePipe = async (data: any) => {
    if (!editingPipe) return false;
    
    try {
      if (!Array.isArray(data.coordinates) || data.coordinates.length !== 2) {
        showError('Error', 'Debes definir exactamente 2 puntos (inicio y fin)');
        return false;
      }

      const updateData: PipeUpdate = {
        material: data.material,
        diameter: data.diameter,
        size: data.size,
        status: data.active,
        installation_date: data.installation_date,
        coordinates: toLonLat(data.coordinates),
        tank_ids: data.tank_id ? [data.tank_id] : undefined,
        start_connection_id: data.start_connection_id,
        end_connection_id: data.end_connection_id,
      };
      
      if (data.observations && data.observations.trim()) {
        updateData.observations = data.observations.trim();
      }
      
      await updateMutation.mutateAsync({
        id: editingPipe.id_pipes,
        data: updateData
      });
      setShowForm(false);
      setEditingPipe(null);
      showSuccess('Tubería actualizada', 'Los cambios han sido guardados exitosamente');
      return true;
    } catch (error: any) {
      showError('Error', error.message || 'Error al actualizar la tubería');
      return false;
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (editingPipe) {
      return await handleUpdatePipe(data);
    } else {
      return await handleCreatePipe(data);
    }
  };

  const handleEditPipe = (pipe: Pipe) => {
    setEditingPipe(pipe);
    setShowForm(true);
  };

  const handleToggleStatus = (pipe: Pipe) => {
    setConfirmAction({
      isOpen: true,
      pipe
    });
  };

  const confirmToggleStatus = async () => {
    if (!confirmAction.pipe) return;
    
    setIsConfirming(true);
    try {
      await deleteMutation.mutateAsync(confirmAction.pipe.id_pipes);
      const newStatus = !confirmAction.pipe.active;
      showSuccess(
        `Tubería ${newStatus ? 'activada' : 'desactivada'}`,
        `La tubería ha sido ${newStatus ? 'activada' : 'desactivada'} exitosamente`
      );
    } catch (error: any) {
      showError('Error', error.message || 'Error al cambiar estado de la tubería');
    } finally {
      setIsConfirming(false);
      setConfirmAction({ isOpen: false, pipe: null });
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPipe(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCoordinates = (lat: number | null | undefined, lng: number | null | undefined) => {
    if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) {
      return 'Sin coordenadas';
    }
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  const stats: StatCard[] = [
    {
      label: 'Total Tuberías',
      value: totalPipes,
      icon: GitBranch,
      iconColor: 'text-blue-600 dark:text-blue-500',
    },
    ...(hasSearch ? [{
      label: 'Resultados Búsqueda',
      value: searchResults,
      icon: Search,
      iconColor: 'text-purple-600 dark:text-purple-500',
    }] : []),
  ];

  const handleRefresh = () => {
    refetch();
    showSuccess('Actualizado', 'Lista de tuberías actualizada');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <PageHeader
          title="Gestión de Tuberías"
          subtitle="Administra la infraestructura de tuberías del sistema de distribución de agua"
          icon={Wrench}
          onRefresh={handleRefresh}
          onAdd={() => {
            if (showForm) {
              handleCancelForm();
            } else {
              setShowForm(true);
            }
          }}
          addLabel={editingPipe ? 'Editar Tubería' : 'Nueva Tubería'}
          isRefreshing={isFetching}
          showForm={showForm}
        />

        {showForm && (
          <div className="mb-8">
            <PipeForm
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
              loading={createMutation.isPending || updateMutation.isPending}
              initialData={editingPipe ? {
                material: editingPipe.material,
                diameter: editingPipe.diameter,
                size: editingPipe.size,
                active: editingPipe.active,
                installation_date: editingPipe.installation_date,
                coordinates: toLatLng(editingPipe.coordinates),
                observations: editingPipe.observations || '',
                tank_id: editingPipe.tanks && editingPipe.tanks.length > 0 ? editingPipe.tanks[0].id_tank : undefined,
              } : null}
              isEdit={!!editingPipe}
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
              placeholder="Buscar por material u observaciones..."
              value={searchTerm}
              onChange={setSearchTerm}
            />

            {/* Tabla */}
            <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
              <div className="p-6">
                {isLoading && pipes.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500 mx-auto"></div>
                      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Cargando tuberías...</p>
                    </div>
                  </div>
                ) : error ? (
                  // Verificar si es un error 404 o de datos no encontrados
                  (error instanceof Error && (error.message.includes('404') || error.message === 'NO_DATA')) ? (
                    <EmptyState
                      icon={<GitBranch className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />}
                      title="No hay información registrada"
                      message={debouncedSearchTerm
                        ? 'No se encontraron tuberías con los criterios de búsqueda'
                        : 'Por favor agrega información, ya sea tanques, bombas, tuberías o conexiones para comenzar.'
                      }
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
                            Error al cargar las tuberías
                          </h3>
                          <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                            <p>{error instanceof Error ? String(error.message) : 'Error desconocido'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                ) : pipes.length === 0 ? (
                  <EmptyState
                    icon={<GitBranch className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />}
                    title="No hay información registrada"
                    message={debouncedSearchTerm
                      ? 'No se encontraron tuberías con los criterios de búsqueda'
                      : 'Por favor agrega información, ya sea tanques, bombas, tuberías o conexiones para comenzar.'
                    }
                  />
                ) : (
                  <>
                    <ScrollableTable
                      columns={[
                        { key: 'pipe', label: 'Tubería', width: '200px' },
                        { key: 'coordinates', label: 'Coordenadas', width: '180px' },
                        { key: 'specs', label: 'Especificaciones', width: '180px' },
                        { key: 'installation', label: 'Instalación', width: '180px' },
                        { key: 'actions', label: 'Acciones', width: '100px', align: 'right' }
                      ]}
                      isLoading={isFetching}
                      loadingMessage="Actualizando tuberías..."
                      enablePagination={false}
                    >
                      {pipes.map((pipe) => (
                        <TableRow key={pipe.id_pipes}>
                          <TableCell className="whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500">
                                <GitBranch className="h-5 w-5 text-white" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {pipe.material}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  ID: {pipe.id_pipes}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {formatCoordinates(pipe.latitude, pipe.longitude)}
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              <div>Ø {pipe.diameter}mm</div>
                              <div className="text-gray-500 dark:text-gray-400">{pipe.size}m</div>
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {formatDate(pipe.installation_date)}
                            </div>
                          </TableCell>
                          <TableCell align="right" className="whitespace-nowrap">
                            <ActionButtons
                              onEdit={() => handleEditPipe(pipe)}
                              onToggleStatus={() => handleToggleStatus(pipe)}
                              isActive={pipe.active}
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

        <ConfirmationDialog
          isOpen={confirmAction.isOpen}
          title={confirmAction.pipe?.active ? 'Desactivar Tubería' : 'Activar Tubería'}
          message={
            confirmAction.pipe?.active
              ? `¿Estás seguro de que deseas desactivar esta tubería? El registro quedará inactivo.`
              : `¿Estás seguro de que deseas activar esta tubería?`
          }
          variant={confirmAction.pipe?.active ? 'danger' : 'info'}
          onConfirm={confirmToggleStatus}
          onClose={() => setConfirmAction({ isOpen: false, pipe: null })}
          loading={isConfirming}
        />
      </div>
    </div>
  );
}