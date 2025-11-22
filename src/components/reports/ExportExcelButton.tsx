import { useState } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { apiService } from '@/services/api';
import { ReportFilters } from '@/types';
import { useNotifications } from '@/hooks/useNotifications';

interface ExportExcelButtonProps {
  filters: ReportFilters;
  disabled?: boolean;
}

/**
 * Botón de prueba para exportar reportes a Excel desde el backend
 * Botón distintivo con badge "PRUEBA" y excelente UX con estados de carga
 */
export function ExportExcelButton({ filters, disabled = false }: ExportExcelButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { showSuccess, showError, showWarning } = useNotifications();

  const handleExport = async () => {
    // Validar que haya filtros de fecha
    if (!filters.dateRange) {
      showWarning('Por favor selecciona un rango de fechas para exportar');
      return;
    }

    // Validar que haya entidad (requerido por el backend)
    if (!filters.entity) {
      showWarning('Por favor selecciona una entidad para exportar. El backend requiere este parámetro.');
      return;
    }

    setIsExporting(true);
    try {
      // Preparar filtros en el formato que espera el backend
      const backendFilters = {
        dateRange: filters.dateRange,
        entity: filters.entity,
      };
      
      const blob = await apiService.exportReportsToExcel(backendFilters);
      
      // Crear URL del blob y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generar nombre de archivo con fecha actual
      const currentDate = new Date().toISOString().split('T')[0];
      const entityName = filters.entity || 'reportes';
      link.download = `reporte-${entityName}-${currentDate}.xlsx`;
      
      // Descargar archivo
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Mostrar notificación de éxito
      showSuccess('Excel generado y descargado exitosamente');
      
      // Resetear estado después de un breve delay
      setTimeout(() => {
        setIsExporting(false);
      }, 1000);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'No se pudo exportar a Excel. Por favor intenta nuevamente.';
      showError('Error al exportar', errorMessage);
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="primary"
        onClick={handleExport}
        disabled={disabled || isExporting}
        loading={isExporting}
        className="relative flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {!isExporting && <FileSpreadsheet className="h-4 w-4" />}
        <span>{isExporting ? 'Generando Excel...' : 'Exportar a Excel'}</span>
      </Button>
      
      {!isExporting && (
        <Badge 
          variant="warning" 
          size="sm"
          className="animate-pulse"
        >
          PRUEBA
        </Badge>
      )}
    </div>
  );
}

