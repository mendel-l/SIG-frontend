import { useState, useEffect } from 'react';
import { GitBranch, Plus, RefreshCw } from 'lucide-react';
import PipeForm from '../components/forms/PipeForm';
import { usePipesStore } from '../stores/pipesStore';
import { useNotifications } from '../hooks/useNotifications';
import { ScrollableTable, TableRow, TableCell } from '../components/ui';
import ActionButtons from '../components/ui/ActionButtons';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';

interface Pipe {
  id_pipes: number;
  material: string;
  diameter: number;
  status: boolean;
  size: number;
  installation_date: string;
  latitude: number;
  longitude: number;
  observations: string;
  created_at: string;
  updated_at: string;
}

export default function PipesPage() {
  const { pipes, loading, error, fetchPipes, createPipe, updatePipe, deletePipe, clearError } = usePipesStore();
  const { showSuccess, showError } = useNotifications();

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPipe, setEditingPipe] = useState<Pipe | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    isOpen: boolean;
    pipe: Pipe | null;
  }>({
    isOpen: false,
    pipe: null
  });
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    fetchPipes();
  }, [fetchPipes]);

  useEffect(() => {
    if (error) {
      showError('Error', error);
      clearError();
    }
  }, [error, showError, clearError]);

  const handleCreatePipe = async (data: any) => {
    const success = await createPipe(data);
    if (success) {
      setShowForm(false);
      showSuccess('Tubería registrada', 'La tubería ha sido registrada correctamente en el sistema');
    }
    return success;
  };

  const handleUpdatePipe = async (data: any) => {
    if (!editingPipe) return false;
    
    const success = await updatePipe(editingPipe.id_pipes, data);
    if (success) {
      setEditingPipe(null);
      setShowForm(false);
      showSuccess('Tubería actualizada', 'Los cambios han sido guardados exitosamente');
    }
    return success;
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
    const success = await deletePipe(confirmAction.pipe.id_pipes);
    
    if (success) {
      const newStatus = !confirmAction.pipe.status;
      showSuccess(
        `Tubería ${newStatus ? 'activada' : 'desactivada'}`,
        `La tubería ha sido ${newStatus ? 'activada' : 'desactivada'} exitosamente`
      );
    }
    
    setIsConfirming(false);
    setConfirmAction({ isOpen: false, pipe: null });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPipe(null);
  };

  const filteredPipes = pipes.filter(pipe =>
    pipe.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pipe.observations.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  const totalPipes = pipes.length;
  const activePipes = pipes.filter(p => p.status).length;
  const inactivePipes = totalPipes - activePipes;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:truncate sm:text-3xl sm:tracking-tight">
              Gestión de Tuberías
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Administra la infraestructura de tuberías del sistema de distribución de agua
            </p>
          </div>
          
          <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
            <button
              onClick={() => fetchPipes()}
              disabled={loading}
              className="inline-flex items-center rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <RefreshCw className={`-ml-0.5 mr-1.5 h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
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
              className="inline-flex items-center rounded-md bg-blue-500 dark:bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 dark:hover:bg-blue-500"
            >
              <Plus className="-ml-0.5 mr-1.5 h-5 w-5" />
              {showForm ? 'Cancelar' : editingPipe ? 'Editar Tubería' : 'Nueva Tubería'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <GitBranch className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Tuberías
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {totalPipes}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Activas
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {activePipes}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Inactivas
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {inactivePipes}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="mb-8">
            <PipeForm
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
              loading={loading}
              initialData={editingPipe ? {
                material: editingPipe.material,
                diameter: editingPipe.diameter,
                size: editingPipe.size,
                status: editingPipe.status,
                installation_date: editingPipe.installation_date,
                latitude: editingPipe.latitude,
                longitude: editingPipe.longitude,
                observations: editingPipe.observations,
              } : null}
              isEdit={!!editingPipe}
            />
          </div>
        )}

        {!showForm && (
          <>
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por material u observaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent sm:text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <ScrollableTable
            columns={[
              { key: 'pipe', label: 'Tubería', width: '200px' },
              { key: 'coordinates', label: 'Coordenadas', width: '180px' },
              { key: 'specs', label: 'Especificaciones', width: '180px' },
              { key: 'installation', label: 'Instalación', width: '180px' },
              { key: 'status', label: 'Estado', width: '100px', align: 'center' },
              { key: 'actions', label: 'Acciones', width: '100px', align: 'right' }
            ]}
            isLoading={loading}
            loadingMessage="Cargando tuberías..."
          >
            {filteredPipes.map((pipe) => (
              <TableRow key={pipe.id_pipes}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                      <GitBranch className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {pipe.material}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ID: {pipe.id_pipes}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {formatCoordinates(pipe.latitude, pipe.longitude)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    <div>Ø {pipe.diameter}mm</div>
                    <div className="text-gray-500 dark:text-gray-400">{pipe.size}m</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {formatDate(pipe.installation_date)}
                  </div>
                </TableCell>
                <TableCell align="center" className="whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    pipe.status
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {pipe.status ? '✅ Activo' : '❌ Inactivo'}
                  </span>
                </TableCell>
                <TableCell align="right" className="whitespace-nowrap">
                  <ActionButtons
                    onEdit={() => handleEditPipe(pipe)}
                    onToggleStatus={() => handleToggleStatus(pipe)}
                    isActive={pipe.status}
                  />
                </TableCell>
              </TableRow>
            ))}
          </ScrollableTable>
        </div>
          </>
        )}

        <ConfirmationDialog
          isOpen={confirmAction.isOpen}
          title={confirmAction.pipe?.status ? 'Desactivar Tubería' : 'Activar Tubería'}
          message={
            confirmAction.pipe?.status
              ? `¿Estás seguro de que deseas desactivar esta tubería? El registro quedará inactivo.`
              : `¿Estás seguro de que deseas activar esta tubería?`
          }
          variant={confirmAction.pipe?.status ? 'danger' : 'info'}
          onConfirm={confirmToggleStatus}
          onClose={() => setConfirmAction({ isOpen: false, pipe: null })}
          loading={isConfirming}
        />
      </div>
    </div>
  );
}