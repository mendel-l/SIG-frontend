import { Modal } from '../ui/Modal';
import ConnectionForm from '../forms/ConnectionForm';
import { useConnection, useUpdateConnection } from '@/queries/connectionsQueries';
import { useNotifications } from '@/hooks/useNotifications';
import { Loader2 } from 'lucide-react';

interface EditConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectionId: number;
  onSuccess?: () => void;
}

export default function EditConnectionModal({ 
  isOpen, 
  onClose, 
  connectionId,
  onSuccess 
}: EditConnectionModalProps) {
  const { data: connection, isLoading, error } = useConnection(connectionId);
  const updateMutation = useUpdateConnection();
  const { showSuccess, showError } = useNotifications();

  const handleSubmit = async (connectionData: {
    latitude: number;
    longitude: number;
    material: string;
    diameter_mn: number;
    pressure_nominal: string;
    connection_type: string;
    depth_m: number;
    installed_date: string;
    installed_by?: string;
    description?: string;
    state?: boolean;
    pipe_ids?: number[];
  }) => {
    try {
      await updateMutation.mutateAsync({
        id: connectionId,
        data: {
          latitude: connectionData.latitude,
          longitude: connectionData.longitude,
          material: connectionData.material,
          diameter_mn: connectionData.diameter_mn,
          pressure_nominal: connectionData.pressure_nominal,
          connection_type: connectionData.connection_type,
          depth_m: connectionData.depth_m,
          installed_date: connectionData.installed_date,
          installed_by: connectionData.installed_by,
          description: connectionData.description,
          active: connectionData.active,
        },
      });
      
      showSuccess('Conexión actualizada', 'Los cambios han sido guardados exitosamente');
      onSuccess?.();
      onClose();
      return true;
    } catch (error: any) {
      showError('Error', error.message || 'Error al actualizar la conexión');
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
            <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando datos de la conexión...</span>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
            {error instanceof Error ? error.message : 'Error al cargar la conexión'}
          </div>
        )}

        {connection && !isLoading && (
          <ConnectionForm
            onSubmit={handleSubmit}
            onCancel={onClose}
            loading={updateMutation.isPending}
            initialData={{
              latitude: connection.latitude,
              longitude: connection.longitude,
              material: connection.material,
              diameter_mn: connection.diameter_mn,
              pressure_nominal: connection.pressure_nominal,
              connection_type: connection.connection_type,
              depth_m: connection.depth_m,
              installed_date: connection.installed_date,
              installed_by: connection.installed_by || undefined,
              description: connection.description || undefined,
              active: connection.active,
            }}
            isEdit={true}
          />
        )}
      </div>
    </Modal>
  );
}

