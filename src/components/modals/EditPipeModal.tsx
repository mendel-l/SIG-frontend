import { Modal } from '../ui/Modal';
import PipeForm from '../forms/PipeForm';
import { usePipe, useUpdatePipe } from '@/queries/pipesQueries';
import { useNotifications } from '@/hooks/useNotifications';
import { Loader2 } from 'lucide-react';

interface EditPipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  pipeId: number;
  onSuccess?: () => void;
}

export default function EditPipeModal({ 
  isOpen, 
  onClose, 
  pipeId,
  onSuccess 
}: EditPipeModalProps) {
  const { data: pipe, isLoading, error } = usePipe(pipeId);
  const updateMutation = useUpdatePipe();
  const { showSuccess, showError } = useNotifications();

  const handleSubmit = async (pipeData: {
    material: string;
    diameter: number;
    size: number;
    active: boolean;
    installation_date: string;
    coordinates: [number, number][];
    observations?: string;
    tank_id?: number;
    start_connection_id?: number;
    end_connection_id?: number;
  }) => {
    try {
      // Convertir coordenadas de [lat, lon] a [lon, lat] para el backend
      const backendCoordinates: [number, number][] = pipeData.coordinates.map(
        ([lat, lon]) => [lon, lat] as [number, number]
      );

      await updateMutation.mutateAsync({
        id: pipeId,
        data: {
          material: pipeData.material,
          diameter: pipeData.diameter,
          size: pipeData.size,
          active: pipeData.active,
          installation_date: pipeData.installation_date,
          coordinates: backendCoordinates,
          observations: pipeData.observations,
          tank_ids: pipeData.tank_id ? [pipeData.tank_id] : undefined,
          start_connection_id: pipeData.start_connection_id,
          end_connection_id: pipeData.end_connection_id,
        },
      });
      
      showSuccess('Tubería actualizada', 'Los cambios han sido guardados exitosamente');
      onSuccess?.();
      onClose();
      return true;
    } catch (error: any) {
      showError('Error', error.message || 'Error al actualizar la tubería');
      return false;
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" className="max-h-[90vh] overflow-y-auto">
      <div className="p-1">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando datos de la tubería...</span>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
            {error instanceof Error ? error.message : 'Error al cargar la tubería'}
          </div>
        )}

        {pipe && !isLoading && (
          <PipeForm
            onSubmit={handleSubmit}
            onCancel={onClose}
            loading={updateMutation.isPending}
            initialData={{
              material: pipe.material,
              diameter: pipe.diameter,
              size: pipe.size,
              active: pipe.active,
              installation_date: pipe.installation_date,
              coordinates: pipe.coordinates || [],
              observations: pipe.observations || undefined,
              tank_id: pipe.tanks && pipe.tanks.length > 0 ? pipe.tanks[0].id_tank : undefined,
              start_connection_id: pipe.start_connection_id != null ? pipe.start_connection_id : undefined,
              end_connection_id: pipe.end_connection_id != null ? pipe.end_connection_id : undefined,
            }}
            isEdit={true}
          />
        )}
      </div>
    </Modal>
  );
}

