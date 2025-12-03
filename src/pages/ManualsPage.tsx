import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Download, FileText, BookOpen, Loader2 } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

interface Manual {
  id: string;
  title: string;
  description: string;
  filename: string;
  icon: typeof FileText;
  size?: string;
}

const manuals: Manual[] = [
  {
    id: 'user',
    title: 'Manual de Usuario',
    description: 'Documentación completa para usuarios del sistema. Incluye guías paso a paso, explicación de funcionalidades y casos de uso.',
    filename: 'Manual usuario.pdf',
    icon: BookOpen,
    size: '9.9 MB'
  },
  {
    id: 'technical',
    title: 'Manual Técnico',
    description: 'Documentación técnica del sistema. Arquitectura, configuración, APIs, base de datos y guías para desarrolladores.',
    filename: 'Manual tecnico.pdf',
    icon: FileText,
    size: '12 MB'
  }
];

export function ManualsPage() {
  const { showSuccess, showError } = useNotifications();
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (manual: Manual) => {
    setDownloading(manual.id);
    
    try {
      // Codificar el nombre del archivo para la URL (manejar espacios y caracteres especiales)
      const encodedFilename = encodeURIComponent(manual.filename);
      const url = `/manuales/${encodedFilename}`;
      
      // Crear un enlace de descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = manual.filename;
      
      // Agregar el enlace al DOM, hacer click y removerlo
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Mostrar notificación de éxito después de un pequeño delay
      setTimeout(() => {
        showSuccess(`Descarga iniciada: ${manual.title}`);
        setDownloading(null);
      }, 500);
      
    } catch (error) {
      console.error('Error al descargar manual:', error);
      showError(
        'Error al descargar', 
        `No se pudo descargar ${manual.title}. Por favor, intenta nuevamente.`
      );
      setDownloading(null);
    }
  };

  const handleView = (manual: Manual) => {
    // Codificar el nombre del archivo para la URL
    const encodedFilename = encodeURIComponent(manual.filename);
    // Abrir el PDF en una nueva pestaña
    window.open(`/manuales/${encodedFilename}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manuales del Sistema"
        subtitle="Descarga los manuales de usuario y técnico para obtener documentación completa del sistema."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {manuals.map((manual) => {
          const Icon = manual.icon;
          const isDownloading = downloading === manual.id;

          return (
            <Card
              key={manual.id}
              className="flex flex-col hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  {manual.size && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {manual.size}
                    </span>
                  )}
                </div>
                <CardTitle className="text-xl">{manual.title}</CardTitle>
                <CardDescription className="mt-2">
                  {manual.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col justify-end pt-0">
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    onClick={() => handleDownload(manual)}
                    disabled={isDownloading}
                    className="flex-1"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Descargando...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Descargar PDF
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleView(manual)}
                    disabled={isDownloading}
                    className="flex-1"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Ver en nueva pestaña
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Información adicional */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Información sobre los manuales
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Los manuales están disponibles en formato PDF. Puedes descargarlos para consultarlos 
                sin conexión a internet o verlos directamente en tu navegador. Si tienes alguna pregunta 
                o sugerencia sobre la documentación, por favor contacta al administrador del sistema.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
