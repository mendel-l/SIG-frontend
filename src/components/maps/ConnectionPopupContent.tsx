import { Pencil } from 'lucide-react';

interface Connection {
  id: number;
  latitude: number;
  longitude: number;
  material: string;
  pressureNominal: string;
  connectionType: string;
  depth?: number;
  installedBy: string;
  state: boolean;
  pipes?: Array<{
    id: number;
    material: string;
    diameter: number;
    status: boolean;
    size: number;
  }>;
}

interface ConnectionPopupContentProps {
  connection: Connection;
  onEdit?: (connectionId: number) => void;
}

export default function ConnectionPopupContent({ connection, onEdit }: ConnectionPopupContentProps) {
  const totalPipes = connection.pipes?.length ?? 0;

  return (
    <div className="p-3 w-64 max-w-none">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
        Conexión #{connection.id}
      </h3>
      
      <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300 mb-3">
        <p><strong>Tipo:</strong> {connection.connectionType || 'Sin tipo'}</p>
        <p><strong>Material:</strong> {connection.material || 'N/A'}</p>
        <p><strong>Presión Nominal:</strong> {connection.pressureNominal || 'N/A'}</p>
        {connection.depth && (
          <p><strong>Profundidad:</strong> {connection.depth}m</p>
        )}
        <p><strong>Instalado por:</strong> {connection.installedBy || 'N/A'}</p>
        <p><strong>Estado:</strong> 
          <span className={connection.state ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
            {' '}{connection.state ? 'Activo' : 'Inactivo'}
          </span>
        </p>
      </div>

      {totalPipes > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 mb-3">
          <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
            Tuberías asociadas ({totalPipes}):
          </p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {connection.pipes?.map((pipe) => (
              <div key={pipe.id} className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-1.5 rounded">
                <p><strong>ID:</strong> {pipe.id}</p>
                <p><strong>Material:</strong> {pipe.material}</p>
                <p><strong>Diámetro:</strong> {pipe.diameter}mm</p>
                <p><strong>Tamaño:</strong> {pipe.size}m</p>
                <p><strong>Estado:</strong> 
                  <span className={pipe.status ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    {' '}{pipe.status ? 'Activo' : 'Inactivo'}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 pt-2 border-t border-gray-200 dark:border-gray-700">
        Lat: {connection.latitude.toFixed(6)}, Lon: {connection.longitude.toFixed(6)}
      </p>

      {onEdit && (
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Cerrar el popup de Mapbox
              const popup = document.querySelector('.mapboxgl-popup');
              if (popup) {
                const closeButton = popup.querySelector('.mapboxgl-popup-close-button') as HTMLElement;
                if (closeButton) {
                  closeButton.click();
                }
              }
              onEdit(connection.id);
            }}
            className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <Pencil className="h-3 w-3" />
            Editar
          </button>
        </div>
      )}
    </div>
  );
}

