import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { MapPipe } from '@/queries/mapQueries';

interface Tank {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  active: boolean;
  photos: string[];
  connectionsSummary: string;
  pipes?: MapPipe[];
}

interface TankPopupContentProps {
  tank: Tank;
}

export default function TankPopupContent({ tank }: TankPopupContentProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const hasPhotos = tank.photos && tank.photos.length > 0;
  const totalPhotos = hasPhotos ? tank.photos.length : 0;

  const totalPipes = tank.pipes?.length ?? 0;
  const totalConnections = useMemo(() => {
    if (!tank.pipes) return 0;
    return tank.pipes.reduce((sum, pipe) => sum + pipe.connections.length, 0);
  }, [tank.pipes]);

  const goToNextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % totalPhotos);
  };

  const goToPrevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + totalPhotos) % totalPhotos);
  };

  return (
    <div className="p-3 w-56 max-w-none">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm truncate">
        {tank.name}
      </h3>
      
      {hasPhotos ? (
        <div className="relative mb-2 rounded-lg overflow-hidden">
          <img 
            src={tank.photos[currentPhotoIndex]} 
            alt={`Foto ${currentPhotoIndex + 1} de ${tank.name}`} 
            className="w-full h-28 object-cover" 
          />
          {totalPhotos > 1 && (
            <>
              <button 
                onClick={goToPrevPhoto} 
                className="absolute left-0.5 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all z-10"
              >
                <ChevronLeft size={14} />
              </button>
              <button 
                onClick={goToNextPhoto} 
                className="absolute right-0.5 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all z-10"
              >
                <ChevronRight size={14} />
              </button>
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-white text-xs bg-black bg-opacity-50 px-2 py-0.5 rounded-full">
                {currentPhotoIndex + 1} / {totalPhotos}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="mb-2 h-28 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Sin fotos</p>
        </div>
      )}

      <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
        <p><strong>Estado:</strong> {tank.active ? 'Activo' : 'Inactivo'}</p>
        <p><strong>Resumen:</strong> {tank.connectionsSummary}</p>
        <p><strong>Tuberías:</strong> {totalPipes}</p>
        <p><strong>Conexiones:</strong> {totalConnections}</p>
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Lat: {tank.latitude.toFixed(6)}, Lon: {tank.longitude.toFixed(6)}
      </p>
    </div>
  );
}

