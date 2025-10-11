import { useState, useEffect } from 'react';
import { Search, Wrench } from 'lucide-react';
import { usePipesStore } from '@/stores/pipesStore';
import { useNotifications } from '@/hooks/useNotifications';
import PipeForm from '@/components/forms/PipeForm';
import ActionButtons from '@/components/ui/ActionButtons';
import UnderDevelopmentModal from '@/components/ui/UnderDevelopmentModal';
import { ScrollableTable, TableRow, TableCell, EmptyState } from '@/components/ui';

export function PipesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingPipe, setEditingPipe] = useState<any>(null);
  const [showDevelopmentModal, setShowDevelopmentModal] = useState(false);
  const [developmentFeature, setDevelopmentFeature] = useState('');
  
  // Zustand store
  const {
    pipes,
    loading,
    error,
    fetchPipes,
    createPipe,
    updatePipe,
    togglePipeStatus,
    deletePipe,
    clearError
  } = usePipesStore();
  
  const { showSuccess } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Cargar tuberías al montar el componente
  useEffect(() => {
    fetchPipes();
  }, [fetchPipes]);

  // Limpiar error cuando se desmonte
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleCreatePipe = async (pipeData: any) => {
    const success = await createPipe(pipeData);
    if (success) {
      setShowForm(false);
      showSuccess('Tubería registrada exitosamente', 'La nueva tubería ha sido agregada al sistema.');
    }
    return success;
  };

  const handleUpdatePipe = async (pipeData: any) => {
    if (!editingPipe) return false;
    
    const success = await updatePipe(editingPipe.id, pipeData);
    if (success) {
      setShowForm(false);
      setEditingPipe(null);
      showSuccess('Tubería actualizada exitosamente', 'Los cambios han sido guardados correctamente.');
    }
    return success;
  };

  const handleFormSubmit = async (pipeData: any) => {
    if (editingPipe) {
      return await handleUpdatePipe(pipeData);
    } else {
      return await handleCreatePipe(pipeData);
    }
  };

  const handleEdit = (pipe: any) => {
    setEditingPipe(pipe);
    setShowForm(true);
  };

  const handleToggleStatus = async (pipe: any) => {
    const success = await togglePipeStatus(pipe.id);
    if (success) {
      const newStatus = !pipe.status ? 'operacional' : 'fuera de servicio';
      showSuccess(
        `Estado de tubería actualizado`,
        `La tubería en "${pipe.location}" ahora está ${newStatus}.`
      );
    }
  };

  const handleDelete = (pipe: any) => {
    setDevelopmentFeature(`la eliminación permanente de la tubería en "${pipe.location}"`);
    setShowDevelopmentModal(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPipe(null);
  };

  const handleRefresh = () => {
    fetchPipes();
  };

  const filteredPipes = pipes.filter(pipe => {
    const matchesSearch = 
      pipe.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pipe.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pipe.observations.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && pipe.status) ||
                         (statusFilter === 'inactive' && !pipe.status);
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadgeColor = (status: boolean) => {
    return status 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
  };

  const getMaterialIcon = (material: string) => {
    const materialLower = material.toLowerCase();
    if (materialLower.includes('pvc')) return '🔵';
    if (materialLower.includes('hierro')) return '🔶';
    if (materialLower.includes('polietileno')) return '🟢';
    if (materialLower.includes('cobre')) return '🟠';
    if (materialLower.includes('acero')) return '⚪';
    return '🔧';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:truncate sm:text-3xl sm:tracking-tight">
              Gestión de Tuberías
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Administra la infraestructura de tuberías del sistema de distribución de agua
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
              {showForm ? 'Cancelar' : editingPipe ? 'Editar Tubería' : 'Agregar Tubería'}
            </button>
          </div>
        </div>

        {/* Formulario para crear/editar tubería */}
        {showForm && (
          <PipeForm 
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
            loading={loading}
            className="mb-6"
            initialData={editingPipe ? {
              material: editingPipe.material,
              diameter: editingPipe.diameter,
              length: editingPipe.length,
              status: editingPipe.status,
              installationDate: editingPipe.installationDate,
              location: editingPipe.location,
              observations: editingPipe.observations
            } : null}
            isEdit={!!editingPipe}
          />
        )}

        {/* Filtros - Solo mostrar cuando NO hay formulario */}
        {!showForm && (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border-0 mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                  Filtros y Búsqueda
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Encuentra tuberías específicas
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Buscar por material, ubicación o notas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <Wrench className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="active">Operacionales</option>
                    <option value="inactive">Fuera de Servicio</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pipes Table - Solo mostrar cuando NO hay formulario */}
        {!showForm && (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border-0">
            <div className="px-6 py-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Red de Tuberías ({filteredPipes.length})
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Sistema simulado - Los datos se cargan desde el store local
                  </p>
                </div>
                <button
                  onClick={handleRefresh}
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
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando tuberías...</span>
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
                        Error al cargar las tuberías
                      </h3>
                      <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                        <p>{error}</p>
                      </div>
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={handleRefresh}
                          className="bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded text-sm font-medium text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/40"
                        >
                          Reintentar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : filteredPipes.length === 0 ? (
                <EmptyState
                  icon={
                    <Wrench className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                  }
                  title="No hay tuberías registradas"
                  message={searchTerm || statusFilter !== 'all'
                    ? 'No se encontraron tuberías que coincidan con los filtros'
                    : 'Comienza agregando la primera tubería del sistema.'
                  }
                />
              ) : (
                <ScrollableTable
                  columns={[
                    { key: 'pipe', label: 'Tubería', width: '200px' },
                    { key: 'specs', label: 'Especificaciones', width: '180px' },
                    { key: 'location', label: 'Ubicación', width: '200px' },
                    { key: 'status', label: 'Estado', width: '120px', align: 'center' },
                    { key: 'installation', label: 'Instalación', width: '120px' },
                    { key: 'actions', label: 'Acciones', width: '120px', align: 'right' }
                  ]}
                  isLoading={loading}
                  loadingMessage="Cargando tuberías..."
                >
                  {filteredPipes.map((pipe) => (
                    <TableRow key={pipe.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
                              <span className="text-lg">{getMaterialIcon(pipe.material)}</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {pipe.material}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              ID: {pipe.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          ⌀ {pipe.diameter}mm
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          📏 {pipe.length}m
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100 max-w-40 truncate" title={pipe.location}>
                          {pipe.location}
                        </div>
                      </TableCell>
                      <TableCell align="center" className="whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(pipe.status)}`}>
                          {pipe.status ? 'Operacional' : 'Fuera de Servicio'}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-gray-500 dark:text-gray-400">
                        {formatDate(pipe.installationDate)}
                      </TableCell>
                      <TableCell align="right" className="whitespace-nowrap">
                        <ActionButtons
                          onEdit={() => handleEdit(pipe)}
                          onToggleStatus={() => handleToggleStatus(pipe)}
                          isActive={pipe.status}
                          loading={loading}
                          showEdit={true}
                          showToggleStatus={true}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </ScrollableTable>
              )}
            </div>
          </div>
        )}

        {/* Under Development Modal */}
        <UnderDevelopmentModal
          isOpen={showDevelopmentModal}
          onClose={() => setShowDevelopmentModal(false)}
          feature={developmentFeature}
          title="Funcionalidad en Desarrollo"
          message={`${developmentFeature} está siendo implementada y no está disponible por el momento. Nuestro equipo está trabajando para tenerla lista pronto.`}
        />
      </div>
    </div>
  );
}