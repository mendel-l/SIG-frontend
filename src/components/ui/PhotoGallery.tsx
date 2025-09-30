import { useState } from 'react';
import { Camera, X, Download, ZoomIn } from 'lucide-react';

interface PhotoGalleryProps {
  photos: string[];
  tankName: string;
  maxPreview?: number;
  className?: string;
}

export default function PhotoGallery({ 
  photos, 
  tankName, 
  maxPreview = 3, 
  className = '' 
}: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showGallery, setShowGallery] = useState(false);

  // Si no hay fotos, mostrar placeholder
  if (!photos || photos.length === 0) {
    return (
      <div className={`flex items-center justify-center p-2 ${className}`}>
        <div className="flex items-center space-x-2 text-gray-400 dark:text-gray-500">
          <Camera className="h-4 w-4" />
          <span className="text-xs">Sin fotos</span>
        </div>
      </div>
    );
  }

  const handlePhotoClick = (photo: string, index: number) => {
    setSelectedPhoto(photo);
    setSelectedIndex(index);
    setShowGallery(true);
  };

  const nextPhoto = () => {
    const nextIndex = (selectedIndex + 1) % photos.length;
    setSelectedIndex(nextIndex);
    setSelectedPhoto(photos[nextIndex]);
  };

  const prevPhoto = () => {
    const prevIndex = selectedIndex === 0 ? photos.length - 1 : selectedIndex - 1;
    setSelectedIndex(prevIndex);
    setSelectedPhoto(photos[prevIndex]);
  };

  const downloadPhoto = (photo: string, index: number) => {
    const link = document.createElement('a');
    link.href = photo;
    link.download = `${tankName}-foto-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const closeGallery = () => {
    setShowGallery(false);
    setSelectedPhoto(null);
  };

  // Fotos para mostrar en preview
  const previewPhotos = photos.slice(0, maxPreview);
  const remainingCount = photos.length - maxPreview;

  return (
    <>
      <div className={`space-y-2 ${className}`}>
        {/* Grid de fotos preview */}
        <div className="grid grid-cols-3 gap-1">
          {previewPhotos.map((photo, index) => (
            <div
              key={index}
              className="relative group cursor-pointer"
              onClick={() => handlePhotoClick(photo, index)}
            >
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded overflow-hidden border border-gray-200 dark:border-gray-600">
                <img
                  src={photo}
                  alt={`${tankName} - Foto ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                />
              </div>
              
              {/* Overlay al hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded flex items-center justify-center">
                <ZoomIn className="h-4 w-4 text-white" />
              </div>
            </div>
          ))}
          
          {/* Indicador de fotos adicionales */}
          {remainingCount > 0 && (
            <div
              className="aspect-square bg-gray-200 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              onClick={() => handlePhotoClick(photos[maxPreview], maxPreview)}
            >
              <div className="text-center">
                <Camera className="h-4 w-4 text-gray-500 dark:text-gray-400 mx-auto mb-1" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  +{remainingCount}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Contador de fotos */}
        <div className="text-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {photos.length} foto{photos.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Modal de galería */}
      {showGallery && selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="relative max-w-7xl w-full h-full flex flex-col">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-4 text-white">
              <div className="flex items-center space-x-3">
                <Camera className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold">{tankName}</h3>
                  <p className="text-sm text-gray-300">
                    Foto {selectedIndex + 1} de {photos.length}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => downloadPhoto(selectedPhoto, selectedIndex)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Descargar foto"
                >
                  <Download className="h-5 w-5" />
                </button>
                <button
                  onClick={closeGallery}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Contenedor de la imagen */}
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="relative max-w-full max-h-full">
                <img
                  src={selectedPhoto}
                  alt={`${tankName} - Foto ${selectedIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
                
                {/* Controles de navegación */}
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                      title="Foto anterior"
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextPhoto}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                      title="Foto siguiente"
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {photos.length > 1 && (
              <div className="p-4 bg-black/50">
                <div className="flex justify-center space-x-2 overflow-x-auto">
                  {photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => handlePhotoClick(photo, index)}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                        index === selectedIndex
                          ? 'border-white scale-110'
                          : 'border-transparent hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}