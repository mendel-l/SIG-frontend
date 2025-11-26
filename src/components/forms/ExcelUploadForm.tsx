import { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Upload, FileSpreadsheet, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface ExcelUploadFormProps {
  onUpload: (file: File) => Promise<{ success: boolean; message?: string; data?: any }>;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
  acceptedFormats?: string[];
  maxSizeMB?: number;
}

export default function ExcelUploadForm({ 
  onUpload, 
  onCancel, 
  loading = false, 
  className = '',
  acceptedFormats = ['.xlsx', '.xls'],
  maxSizeMB = 10
}: ExcelUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string; data?: any } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setError(null);
    setUploadResult(null);

    // Validar formato
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFormats.includes(fileExtension)) {
      setError(`Formato no válido. Solo se permiten archivos: ${acceptedFormats.join(', ')}`);
      return;
    }

    // Validar tamaño
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`El archivo es demasiado grande. Tamaño máximo: ${maxSizeMB}MB`);
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Por favor selecciona un archivo');
      return;
    }

    setError(null);
    try {
      const result = await onUpload(selectedFile);
      // Asegurar que siempre haya un mensaje
      setUploadResult({
        ...result,
        message: result.message || (result.success ? 'Archivo procesado exitosamente' : 'Error al procesar el archivo')
      });
      
      if (result.success) {
        // Limpiar después de un éxito
        setTimeout(() => {
          setSelectedFile(null);
          setUploadResult(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Error al subir el archivo');
      setUploadResult(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Upload className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle>Subir Archivo Excel</CardTitle>
              <CardDescription>
                Sube un archivo Excel (.xlsx, .xls) para procesar datos de morosidad
              </CardDescription>
            </div>
          </div>
          {onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={loading}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Zona de arrastrar y soltar */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${dragActive 
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50'
              }
              ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-green-400'}
            `}
            onClick={() => !loading && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedFormats.join(',')}
              onChange={handleFileInputChange}
              disabled={loading}
              className="hidden"
            />
            
            {!selectedFile ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <FileSpreadsheet className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Arrastra y suelta tu archivo aquí
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    o haz clic para seleccionar
                  </p>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Formatos aceptados: {acceptedFormats.join(', ')} • Tamaño máximo: {maxSizeMB}MB
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <FileSpreadsheet className="w-8 h-8 text-green-600 dark:text-green-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  {!loading && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                      className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mensajes de error */}
          {error && (
            <div className="flex items-start space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Resultado de carga */}
          {uploadResult && (
            <div className={`flex items-start space-x-2 p-3 rounded-md ${
              uploadResult.success 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}>
              {uploadResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  uploadResult.success 
                    ? 'text-green-700 dark:text-green-300' 
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  {uploadResult.message}
                </p>
                {uploadResult.data && (
                  <div className={`mt-2 text-xs space-y-1 ${
                    uploadResult.success 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {uploadResult.success && uploadResult.data.created_records !== undefined && (
                      <p>Registros creados: {uploadResult.data.created_records}</p>
                    )}
                    {uploadResult.success && uploadResult.data.total_processed !== undefined && (
                      <p>Total procesados: {uploadResult.data.total_processed}</p>
                    )}
                    {uploadResult.data.errors && uploadResult.data.errors.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium">
                          {uploadResult.success ? 'Advertencias encontradas:' : 'Errores encontrados:'}
                        </p>
                        <ul className="list-disc list-inside space-y-1 max-h-40 overflow-y-auto">
                          {uploadResult.data.errors.slice(0, 10).map((err: string, idx: number) => (
                            <li key={idx} className="break-words">{err}</li>
                          ))}
                          {uploadResult.data.errors.length > 10 && (
                            <li className="font-medium">... y {uploadResult.data.errors.length - 10} más</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
            )}
            <Button
              type="button"
              variant="primary"
              onClick={handleUpload}
              disabled={!selectedFile || loading}
              loading={loading}
            >
              {loading ? 'Subiendo...' : 'Subir Archivo'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

