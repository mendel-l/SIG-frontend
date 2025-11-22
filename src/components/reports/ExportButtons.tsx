import { useState } from 'react';
import { FileDown, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ReportRecord, ReportFilters } from '@/types';
import { useNotifications } from '@/hooks/useNotifications';
import { exportTableToPDF } from '@/utils/pdfExport';

interface ExportButtonsProps {
  filteredRecords: ReportRecord[];
  filters?: ReportFilters;
  disabled?: boolean;
  tableRef?: React.RefObject<HTMLDivElement>;
  setShowAllRows?: (show: boolean) => void;
}

const MIN_EXPORT_ROWS = 1;

export function ExportButtons({ 
  filteredRecords,
  filters, 
  disabled = false,
  tableRef,
  setShowAllRows,
}: ExportButtonsProps) {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const { showSuccess, showError, showWarning } = useNotifications();

  const handleExportPDF = async () => {
    if (filteredRecords.length < MIN_EXPORT_ROWS) {
      showWarning(`Se requiere al menos ${MIN_EXPORT_ROWS} registro(s) para exportar`);
      return;
    }

    if (!tableRef?.current) {
      showError('Error al exportar', 'No se pudo acceder a la tabla');
      return;
    }

    setIsExportingPDF(true);
    
    try {
      // Invalidar paginación temporalmente para mostrar todos los datos
      if (setShowAllRows) {
        setShowAllRows(true);
      }
      
      // Esperar a que React renderice todos los datos
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Obtener el elemento de la tabla
      const tableElement = tableRef.current.querySelector('table');
      if (!tableElement) {
        throw new Error('No se encontró la tabla');
      }
      
      // Exportar a PDF
      await exportTableToPDF({
        tableElement: tableElement as HTMLElement,
        entityName: filters?.entity || 'Sistema',
        filters: filters,
        totalRecords: filteredRecords.length,
      });
      
      showSuccess(`Se exportaron ${filteredRecords.length} registros a PDF`);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      showError('Error al exportar', error instanceof Error ? error.message : 'No se pudo exportar a PDF');
    } finally {
      // Restaurar paginación
      if (setShowAllRows) {
        setShowAllRows(false);
      }
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="flex gap-3">
      <Button
        variant="secondary"
        onClick={handleExportPDF}
        disabled={disabled || isExportingPDF || filteredRecords.length === 0}
        loading={isExportingPDF}
        className="flex items-center gap-2"
      >
        {!isExportingPDF && <FileText className="h-4 w-4" />}
        {isExportingPDF ? 'Exportando...' : 'Exportar PDF'}
      </Button>

      {filteredRecords.length > 0 && (
        <div className="flex items-center gap-2 ml-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <FileDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {filteredRecords.length} registro{filteredRecords.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}

