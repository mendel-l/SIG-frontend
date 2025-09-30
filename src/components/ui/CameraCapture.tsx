import { useState, useRef, useEffect } from 'react';
import { Camera, X, Trash2, Download, ZoomIn } from 'lucide-react';
import { Camera as CameraPro } from 'react-camera-pro';
import { compressImage, CompressionResult } from '../../utils/imageCompression';

interface CameraCaptureProps {
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  className?: string;
  disabled?: boolean;
  initialPhotos?: string[];
}

export default function CameraCapture({ 
  onPhotosChange, 
  maxPhotos = 5, 
  className = '', 
  disabled = false,
  initialPhotos = []
}: CameraCaptureProps) {
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode] = useState<'user' | 'environment'>('environment');
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionStats, setCompressionStats] = useState<CompressionResult | null>(null);
  
  const cameraRef = useRef<any>(null);

  // Limpiar clase del body al desmontar el componente
  useEffect(() => {
    return () => {
      document.body.classList.remove('camera-modal-open');
    };
  }, []);

  // Manejar apertura/cierre de la cámara para controlar z-index del mapa
  const openCamera = () => {
    setIsCameraOpen(true);
    // Agregar clase al body para ocultar elementos del mapa
    document.body.classList.add('camera-modal-open');
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
    // Remover clase del body
    document.body.classList.remove('camera-modal-open');
  };

  // Capturar foto desde la cámara con compresión
  const takePhoto = async () => {
    if (cameraRef.current && !isCompressing) {
      setIsCompressing(true);
      
      try {
        const rawPhoto = cameraRef.current.takePhoto();
        console.log('📸 Foto capturada, iniciando compresión...');
        
        if (rawPhoto) {
          // Comprimir la imagen
          const compressionResult = await compressImage(rawPhoto, {
            maxWidth: 1920,
            maxHeight: 1080,
            quality: 0.87,
            maxSizeMB: 0.5,
            format: 'webp'
          });
          
          console.log('✅ Compresión completada:', {
            reducción: `${compressionResult.compressionRatio.toFixed(1)}%`,
            tamañoOriginal: `${(compressionResult.originalSize / 1024).toFixed(1)}KB`,
            tamañoFinal: `${(compressionResult.compressedSize / 1024).toFixed(1)}KB`,
            resolución: `${compressionResult.dimensions.width}x${compressionResult.dimensions.height}`
          });
          
          setCompressionStats(compressionResult);
          
          const updatedPhotos = [...photos, compressionResult.compressedImage];
          setPhotos(updatedPhotos);
          onPhotosChange(updatedPhotos);
          
          // Cerrar cámara si se alcanzó el máximo
          if (updatedPhotos.length >= maxPhotos) {
            closeCamera();
          }
        }
      } catch (error) {
        console.error('❌ Error al comprimir imagen:', error);
        // En caso de error, usar imagen original
        const rawPhoto = cameraRef.current.takePhoto();
        if (rawPhoto) {
          const updatedPhotos = [...photos, rawPhoto];
          setPhotos(updatedPhotos);
          onPhotosChange(updatedPhotos);
        }
      } finally {
        setIsCompressing(false);
      }
    }
  };

  // Eliminar foto
  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    onPhotosChange(newPhotos);
  };

  // Descargar foto
  const downloadPhoto = (base64: string, index: number) => {
    const link = document.createElement('a');
    link.href = base64;
    link.download = `tanque-foto-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Abrir/cerrar cámara
  const toggleCamera = () => {
    if (isCameraOpen) {
      closeCamera();
    } else {
      openCamera();
    }
  };

  return (
    <div className={className}>

      {/* Preview de fotos capturadas */}
      {photos.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Fotos capturadas ({photos.length}/{maxPhotos})
            </span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {photos.map((photo, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                  <img
                    src={photo}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Controles de foto */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPhoto(photo)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                    title="Ver foto"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadPhoto(photo, index)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                    title="Descargar"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="p-2 bg-red-500/70 hover:bg-red-500/90 rounded-full text-white transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Número de foto */}
                <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón para abrir cámara */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={toggleCamera}
          disabled={disabled || photos.length >= maxPhotos}
          className={`w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl border-2 border-dashed transition-all duration-200 ${
            disabled || photos.length >= maxPhotos
              ? 'border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
          }`}
        >
          <Camera className="h-5 w-5" />
          <span className="font-medium">
            {photos.length >= maxPhotos 
              ? `Máximo de ${maxPhotos} fotos alcanzado` 
              : 'Tomar Fotografía'
            }
          </span>
        </button>
        
        {photos.length > 0 && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setPhotos([]);
                onPhotosChange([]);
              }}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
            >
              Eliminar todas las fotos
            </button>
          </div>
        )}
      </div>

      {/* Modal de cámara */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden w-full max-w-4xl h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Capturar Fotografía ({photos.length}/{maxPhotos})
              </h3>
              <button
                type="button"
                onClick={closeCamera}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cerrar</span>
              </button>
            </div>

            {/* Contenido de la cámara */}
            <div className="flex-1 p-4">
              <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
                <CameraPro
                  ref={cameraRef}
                  aspectRatio={16 / 9}
                  facingMode={facingMode}
                  errorMessages={{
                    noCameraAccessible: 'No se puede acceder a la cámara. Verifica los permisos.',
                    permissionDenied: 'Permiso denegado. Por favor permite el acceso a la cámara.',
                    switchCamera: 'No es posible cambiar la cámara. Solo hay una cámara disponible.',
                    canvas: 'Canvas no soportado.'
                  }}
                />
              </div>
            </div>

            {/* Controles */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center space-x-4">
                <button
                  type="button"
                  onClick={takePhoto}
                  disabled={photos.length >= maxPhotos || isCompressing}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
                    photos.length >= maxPhotos || isCompressing
                      ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 hover:scale-105'
                  }`}
                >
                  {isCompressing ? (
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent"></div>
                  ) : (
                    <Camera className="h-10 w-10 text-white" />
                  )}
                </button>
              </div>
              
              <div className="text-center mt-3">
                {isCompressing ? (
                  <div className="space-y-1">
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      🔄 Optimizando imagen...
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Mejorando calidad y reduciendo tamaño
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {photos.length >= maxPhotos ? 
                        '¡Máximo de fotos alcanzado!' : 
                        'Toca el botón para capturar'
                      }
                    </p>
                    {photos.length < maxPhotos && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Fotos restantes: {maxPhotos - photos.length}
                      </p>
                    )}
                    {compressionStats && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        ✅ Última foto: -{compressionStats.compressionRatio.toFixed(0)}% tamaño, calidad mejorada
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de vista de foto */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4">
          <div className="relative max-w-4xl w-full">
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            
            <img
              src={selectedPhoto}
              alt="Vista ampliada"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}