import { useState, useEffect } from 'react';
import { Search, MapPin, Droplet } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useDebounce } from '@/hooks/useDebounce';
import { 
  useTanks, 
  useCreateTank, 
  useUpdateTank,
  useDeleteTank,
  type Tank,
  type TankCreate,
  type TankUpdate 
} from '@/queries/tanksQueries';
import TankForm from '@/components/forms/TankForm';
import PhotoGallery from '@/components/ui/PhotoGallery';
import ActionButtons from '@/components/ui/ActionButtons';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { ScrollableTable, TableRow, TableCell, EmptyState, Pagination, StatsCards, PageHeader, SearchBar, StatCard } from '@/components/ui';

export function TanksPage() {
  const { showSuccess, showError } = useNotifications();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingTank, setEditingTank] = useState<Tank | null>(null);
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

  // Debounce del término de búsqueda para optimizar peticiones (300ms)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Resetear página a 1 cuando cambia el término de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const { 
    data: tanksData,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useTanks(currentPage, pageSize, debouncedSearchTerm || undefined);

  // ✅ QUERY ADICIONAL - Obtener total real (sin búsqueda) cuando hay búsqueda activa
  const hasSearch = debouncedSearchTerm.trim().length > 0;
  const { data: totalTanksData } = useTanks(1, 1, undefined, {
    enabled: hasSearch, // Solo ejecutar cuando hay búsqueda activa
  });

  const createMutation = useCreateTank();
  const updateMutation = useUpdateTank();
  const deleteMutation = useDeleteTank();

  const tanks = tanksData?.items || [];
  const pagination = tanksData?.pagination || { 
    page: 1, 
    limit: pageSize, 
    total_items: 0, 
    total_pages: 1,
    next_page: null,
    prev_page: null,
  };

  // Calcular total real: si hay búsqueda, usar la query adicional, sino usar pagination.total_items
  const totalTanks = hasSearch 
    ? (totalTanksData?.pagination?.total_items ?? pagination.total_items)
    : pagination.total_items;
  
  // Resultados de búsqueda: siempre usar pagination.total_items cuando hay búsqueda
  const searchResults = hasSearch ? pagination.total_items : 0;

  const handleCreateTank = async (tankData: any) => {
    try {
      const createData: TankCreate = {
        name: tankData.name,
        latitude: tankData.latitude,
        longitude: tankData.longitude,
        connections: tankData.connections || null,
        photos: Array.isArray(tankData.photos) ? tankData.photos : [],
        active: tankData.active === true || tankData.active === 1,
      };
      await createMutation.mutateAsync(createData);
      setShowForm(false);
      showSuccess('Tanque creado exitosamente', 'El tanque ha sido registrado en el sistema.');
      return true;
    } catch (error: any) {
      showError('Error', error.message || 'Error al crear tanque');
      return false;
    }
  };

  const handleUpdateTank = async (tankData: any) => {
    if (!editingTank) return false;
    
    try {
      const updateData: TankUpdate = {
        name: tankData.name,
        latitude: tankData.latitude,
        longitude: tankData.longitude,
        connections: tankData.connections || null,
        photos: Array.isArray(tankData.photos) ? tankData.photos : [],
        state: tankData.active === true || tankData.active === 1,
      };
      await updateMutation.mutateAsync({
        id: editingTank.id,
        data: updateData
      });
      setShowForm(false);
      setEditingTank(null);
      showSuccess('Tanque actualizado exitosamente', 'Los cambios han sido guardados correctamente.');
      return true;
    } catch (error: any) {
      showError('Error', error.message || 'Error al actualizar tanque');
      return false;
    }
  };

  const handleFormSubmit = async (tankData: any) => {
    if (editingTank) {
      return await handleUpdateTank(tankData);
    } else {
      return await handleCreateTank(tankData);
    }
  };

  const handleEdit = (tank: Tank) => {
    setEditingTank(tank);
    setShowForm(true);
  };

  const handleToggleStatus = (tank: Tank) => {
    const action = tank.active ? 'desactivar' : 'activar';
    const newStatus = tank.active ? 'inactivo' : 'activo';
    
    setConfirmAction({
      show: true,
      title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} tanque?`,
      message: `¿Estás seguro de que deseas ${action} el tanque "${tank.name}"? El tanque quedará ${newStatus}.`,
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync(tank.id);
          showSuccess(
            `Tanque ${tank.active ? 'desactivado' : 'activado'} exitosamente`,
            `El tanque "${tank.name}" ahora está ${newStatus}.`
          );
        } catch (error: any) {
          showError('Error', error.message || 'Error al cambiar estado del tanque');
        } finally {
          setConfirmAction(prev => ({ ...prev, show: false }));
        }
      }
    });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTank(null);
  };

  const stats: StatCard[] = [
    {
      label: 'Total Tanques',
      value: totalTanks,
      icon: Droplet,
      iconColor: 'text-blue-600 dark:text-blue-500',
    },
    ...(hasSearch ? [{
      label: 'Resultados Búsqueda',
      value: searchResults,
      icon: Search,
      iconColor: 'text-purple-600 dark:text-purple-500',
    }] : []),
  ];


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

  const formatCoordinates = (lat: number | undefined | null, lon: number | undefined | null) => {
    if (lat === null || lat === undefined || lon === null || lon === undefined || isNaN(lat) || isNaN(lon)) {
      return 'Sin coordenadas';
    }
    return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
  };

  const handleRefresh = () => {
    refetch();
    showSuccess('Actualizado', 'Lista de tanques actualizada');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <PageHeader
          title="Gestión de Tanques"
          subtitle="Administra los tanques de agua del sistema y su ubicación"
          icon={Droplet}
          onRefresh={handleRefresh}
          onAdd={() => {
            if (showForm) {
              handleCancelForm();
            } else {
              setShowForm(true);
            }
          }}
          addLabel={editingTank ? 'Editar Tanque' : 'Agregar Tanque'}
          isRefreshing={isFetching}
          showForm={showForm}
        />

        {/* Formulario para crear/editar tanque */}
        {showForm && (
          <TankForm 
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
            loading={createMutation.isPending || updateMutation.isPending}
            className="mb-6"
            initialData={editingTank ? {
              name: editingTank.name,
              latitude: editingTank.latitude,
              longitude: editingTank.longitude,
              connections: editingTank.connections || '',
              photos: editingTank.photos || editingTank.photography || [],
              state: editingTank.active
            } : null}
            isEdit={!!editingTank}
          />
        )}

        {/* Estadísticas y Búsqueda - Solo cuando NO hay formulario */}
        {!showForm && (
          <>
            {/* Stats Cards */}
            <StatsCards stats={stats} />

            {/* Búsqueda */}
            <SearchBar
              placeholder="Buscar tanques por nombre o conexiones..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </>
        )}

        {/* Lista de tanques - Solo mostrar cuando no está el formulario */}
        {!showForm && (
          <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
            <div className="p-6">
              {isLoading && tanks.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Cargando tanques...</p>
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
                        Error al cargar los tanques
                      </h3>
                      <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                        <p>{error instanceof Error ? error.message : 'Error desconocido'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : tanks.length === 0 ? (
                <EmptyState
                  icon={<Droplet className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />}
                  title="No hay tanques disponibles"
                  message={debouncedSearchTerm
                    ? 'No se encontraron tanques con los criterios de búsqueda'
                    : 'Comienza registrando tu primer tanque'
                  }
                />
              ) : (
                <>
                  <ScrollableTable
                    columns={[
                      { key: 'tank', label: 'Tanque', width: '200px' },
                      { key: 'coordinates', label: 'Coordenadas', width: '180px' },
                      { key: 'photos', label: 'Fotografías', width: '120px', align: 'center' },
                      { key: 'connections', label: 'Conexiones', width: '150px' },
                      { key: 'date', label: 'Fecha de creación', width: '150px' },
                      { key: 'actions', label: 'Acciones', width: '100px', align: 'right' }
                    ]}
                    isLoading={isFetching}
                    loadingMessage="Actualizando tanques..."
                    enablePagination={false}
                  >
                    {tanks.map((tank) => (
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
                          {(tank.latitude !== null && tank.latitude !== undefined && tank.longitude !== null && tank.longitude !== undefined && !isNaN(tank.latitude) && !isNaN(tank.longitude)) && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Lat: {tank.latitude.toFixed(6)}, Lon: {tank.longitude.toFixed(6)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <PhotoGallery
                            photos={tank.photos || tank.photography || []}
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
                        <TableCell className="whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {formatDate(tank.createdAt || tank.created_at)}
                        </TableCell>
                        <TableCell align="right" className="whitespace-nowrap">
                          <ActionButtons
                            onEdit={() => handleEdit(tank)}
                            onToggleStatus={() => handleToggleStatus(tank)}
                            isActive={tank.active}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </ScrollableTable>
                  
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
          isOpen={confirmAction.show}
          title={confirmAction.title}
          message={confirmAction.message}
          onConfirm={confirmAction.onConfirm}
          onClose={() => setConfirmAction(prev => ({ ...prev, show: false }))}
          variant="warning"
          loading={deleteMutation.isPending}
        />
      </div>
    </div>
  );
}