import { useState } from 'react';
import { FileDown, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { apiService } from '@/services/api';
import { ReportRecord, ReportFilters } from '@/types';
import { useNotifications } from '@/hooks/useNotifications';

interface ExportButtonsProps {
  data: ReportRecord[];
  filters?: ReportFilters;
  disabled?: boolean;
}

const MIN_EXPORT_ROWS = 1;

export function ExportButtons({ data, filters, disabled = false }: ExportButtonsProps) {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const { showSuccess, showError, showWarning } = useNotifications();

  const handleExportPDF = async () => {
    if (data.length < MIN_EXPORT_ROWS) {
      showWarning(`Se requiere al menos ${MIN_EXPORT_ROWS} registro(s) para exportar`);
      return;
    }

    setIsExportingPDF(true);
    try {
      const blob = await apiService.exportToPDF(data, filters);
      
      // Download the file
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showSuccess(`Se exportaron ${data.length} registros a PDF`);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      showError('Error al exportar', error instanceof Error ? error.message : 'No se pudo exportar a PDF');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportExcel = async () => {
    if (data.length < MIN_EXPORT_ROWS) {
      showWarning(`Se requiere al menos ${MIN_EXPORT_ROWS} registro(s) para exportar`);
      return;
    }

    setIsExportingExcel(true);
    try {
      const blob = await apiService.exportToExcel(data, filters);
      
      // Download the file
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showSuccess(`Se exportaron ${data.length} registros a Excel`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      showError('Error al exportar', error instanceof Error ? error.message : 'No se pudo exportar a Excel');
    } finally {
      setIsExportingExcel(false);
    }
  };

  return (
    <div className="flex gap-3">
      <Button
        variant="secondary"
        onClick={handleExportPDF}
        disabled={disabled || isExportingPDF || isExportingExcel || data.length === 0}
        loading={isExportingPDF}
        className="flex items-center gap-2"
      >
        {!isExportingPDF && <FileText className="h-4 w-4" />}
        {isExportingPDF ? 'Exportando...' : 'Exportar PDF'}
      </Button>

      <Button
        variant="secondary"
        onClick={handleExportExcel}
        disabled={disabled || isExportingPDF || isExportingExcel || data.length === 0}
        loading={isExportingExcel}
        className="flex items-center gap-2"
      >
        {!isExportingExcel && <FileSpreadsheet className="h-4 w-4" />}
        {isExportingExcel ? 'Exportando...' : 'Exportar Excel'}
      </Button>

      {data.length > 0 && (
        <div className="flex items-center gap-2 ml-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <FileDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {data.length} registro{data.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}

