import { Pencil } from 'lucide-react';

interface Pipe {
  id: number;
  material: string;
  diameter: number;
  active: boolean;
  size: number;
  tankName?: string;
  installationDate?: string | null;
  observations?: string;
}

interface PipePopupContentProps {
  pipe: Pipe;
  onEdit?: (pipeId: number) => void;
}

export default function PipePopupContent({ pipe, onEdit }: PipePopupContentProps) {
  return (
    <div className="p-3 w-64 max-w-none">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
        Tubería #{pipe.id}
      </h3>
      
      <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300 mb-3">
        <p><strong>Material:</strong> {pipe.material || 'N/A'}</p>
        <p><strong>Diámetro:</strong> {pipe.diameter}mm</p>
        <p><strong>Tamaño:</strong> {pipe.size}m</p>
        {pipe.tankName && (
          <p><strong>Tanque asociado:</strong> {pipe.tankName}</p>
        )}
        {pipe.installationDate && (
          <p><strong>Fecha instalación:</strong> {new Date(pipe.installationDate).toLocaleDateString('es-ES')}</p>
        )}
        {pipe.observations && (
          <p><strong>Observaciones:</strong> {pipe.observations}</p>
        )}
        <p><strong>Estado:</strong> 
          <span className={pipe.active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
            {' '}{pipe.active ? 'Activo' : 'Inactivo'}
          </span>
        </p>
      </div>

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
              onEdit(pipe.id);
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

