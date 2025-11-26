import { useState, useEffect } from 'react';
import { Upload, Search, FileSpreadsheet, DollarSign } from 'lucide-react';
import ExcelUploadForm from '../components/forms/ExcelUploadForm';
import { useNotifications } from '../hooks/useNotifications';
import { useDebounce } from '../hooks/useDebounce';
import { 
  useDataUploads, 
  useUploadExcel,
} from '../queries/dataUploadQueries';
import { ScrollableTable, TableRow, TableCell, EmptyState, Pagination, StatsCards, PageHeader, SearchBar, StatCard, ErrorMessage, ReportHeader } from '../components/ui';
import { getFriendlyErrorMessage, getContextualErrorMessage } from '../utils/errorMessages';

export function DataUploadPage() {
  const { showSuccess, showError, showWarning } = useNotifications();
  
  // Estado local de UI
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Debounce del término de búsqueda
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Resetear página cuando cambia el término de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // QUERY - Obtener registros de data upload
  const { 
    data: dataUploadsData,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useDataUploads(currentPage, pageSize);

  // MUTATIONS - Acciones
  const uploadMutation = useUploadExcel();

  // Filtrar datos localmente por búsqueda
  const filteredDataUploads = dataUploadsData?.items.filter(item => {
    if (!debouncedSearchTerm.trim()) return true;
    const search = debouncedSearchTerm.toLowerCase();
    return (
      item.taxpayer?.toLowerCase().includes(search) ||
      item.cologne?.toLowerCase().includes(search) ||
      item.identifier?.toLowerCase().includes(search) ||
      item.cat_service?.toLowerCase().includes(search)
    );
  }) || [];

  // Extraer datos y paginación
  const dataUploads = filteredDataUploads;
  
  // Si hay datos pero están vacíos, o si el error indica "no hay datos", mostrar estado vacío
  const hasData = dataUploadsData && dataUploadsData.items.length > 0;
  const hasRealError = error && !getFriendlyErrorMessage(error).toLowerCase().includes('no hay');
  const pagination = dataUploadsData?.pagination || { 
    page: 1, 
    limit: pageSize, 
    total_items: 0, 
    total_pages: 1,
    next_page: null,
    prev_page: null,
  };

  const handleUploadExcel = async (file: File) => {
    try {
      const result = await uploadMutation.mutateAsync(file);
      
      // Si hay errores pero también se crearon registros, mostrar advertencia
      if (result.errors && result.errors.length > 0 && result.created_records > 0) {
        showWarning(
          'Archivo procesado con advertencias',
          `Se procesaron ${result.total_processed} registros. ${result.created_records} nuevos registros creados. Revisa los errores en el formulario.`
        );
      } else if (result.errors && result.errors.length > 0) {
        // Si solo hay errores, mostrar error
        const errorDetails = result.errors.slice(0, 3).join('; ');
        showError(
          'Error al procesar el archivo',
          result.message || `El archivo no se pudo procesar correctamente. ${errorDetails}`
        );
      } else {
        // Éxito completo
        showSuccess(
          'Archivo procesado exitosamente', 
          `Se procesaron ${result.total_processed} registros. ${result.created_records} nuevos registros creados.`
        );
        setShowUploadForm(false);
      }
      
      return { success: result.created_records > 0, message: result.message || 'Procesamiento completado', data: result };
    } catch (error: any) {
      const friendlyMessage = getFriendlyErrorMessage(error, getContextualErrorMessage('upload'));
      showError('No se pudo procesar el archivo', friendlyMessage);
      return { success: false, message: friendlyMessage };
    }
  };


  const handleCancelForm = () => {
    setShowUploadForm(false);
  };

  const handleRefresh = () => {
    refetch();
    showSuccess('Actualizado', 'Lista de registros actualizada');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (amount: number) => {
    return new Intl.NumberFormat('es-GT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const totalDataUploads = pagination.total_items;
  const hasSearch = debouncedSearchTerm.trim().length > 0;

  const stats: StatCard[] = [
    {
      label: 'Total Registros',
      value: totalDataUploads,
      icon: FileSpreadsheet,
      iconColor: 'text-blue-600 dark:text-blue-500',
    },
    {
      label: 'Total Monto',
      value: formatCurrency(
        dataUploads.reduce((sum, item) => sum + (item.total || 0), 0)
      ),
      icon: DollarSign,
      iconColor: 'text-green-600 dark:text-green-500',
    },
    ...(hasSearch ? [{
      label: 'Resultados Búsqueda',
      value: filteredDataUploads.length,
      icon: Search,
      iconColor: 'text-purple-600 dark:text-purple-500',
    }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <PageHeader
          title="Carga de Datos"
          subtitle="Administra los registros de morosidad de servicios de agua cargados desde archivos Excel"
          icon={Upload}
          onRefresh={handleRefresh}
          onAdd={() => {
            if (showUploadForm) {
              handleCancelForm();
            } else {
              setShowUploadForm(true);
            }
          }}
          addLabel="Subir Excel"
          isRefreshing={isFetching}
          showForm={showUploadForm}
        />

        {/* Formulario para subir Excel */}
        {showUploadForm && (
          <ExcelUploadForm 
            onUpload={handleUploadExcel}
            onCancel={handleCancelForm}
            loading={uploadMutation.isPending}
            className="mb-6"
          />
        )}

        {/* Estadísticas y Búsqueda - Solo cuando NO hay formulario */}
        {!showUploadForm && (
          <>
            {/* Encabezado del Reporte - Mostrar si hay datos */}
            {hasData && dataUploads.length > 0 && (
              <ReportHeader
                siaf={dataUploads[0]?.siaf}
                municipality={dataUploads[0]?.municipality || undefined}
                department={dataUploads[0]?.department || undefined}
                institutionalClassification={dataUploads[0]?.institutional_classification}
                report={dataUploads[0]?.report}
                date={dataUploads[0]?.date}
                hour={dataUploads[0]?.hour}
                seriereport={dataUploads[0]?.seriereport}
                user={dataUploads[0]?.user}
              />
            )}

            {/* Stats Cards */}
            <StatsCards stats={stats} />

            {/* Búsqueda */}
            <SearchBar
              placeholder="Buscar por contribuyente, colonia, identificador o categoría..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </>
        )}

        {/* Lista de registros - Solo mostrar cuando no está el formulario */}
        {!showUploadForm && (
          <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
            <div className="p-6">
              {isLoading && !hasData ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Cargando registros...</p>
                  </div>
                </div>
              ) : hasRealError ? (
                <ErrorMessage
                  title="No se pudieron cargar los registros"
                  message={getFriendlyErrorMessage(error, getContextualErrorMessage('load', 'los registros'))}
                  onRetry={() => refetch()}
                />
              ) : !hasData || dataUploads.length === 0 ? (
                <EmptyState
                  icon={<FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />}
                  title={debouncedSearchTerm ? "No se encontraron registros" : "No hay registros disponibles"}
                  message={debouncedSearchTerm 
                    ? `No se encontraron registros que coincidan con "${debouncedSearchTerm}"`
                    : "No se encontraron registros en el sistema. Sube un archivo Excel para comenzar."
                  }
                />
              ) : (
                <>
                  <ScrollableTable
                    columns={[
                      { key: 'identifier', label: 'IDENTIFICA', width: '120px' },
                      { key: 'taxpayer', label: 'CONTRIBUYENTE', width: '220px' },
                      { key: 'cologne', label: 'COLONIA', width: '250px' },
                      { key: 'cat_service', label: 'CAT_SERVICIO', width: '180px' },
                      { key: 'cannon', label: 'CANON', width: '100px', align: 'right' },
                      { key: 'excess', label: 'EXCESO', width: '100px', align: 'right' },
                      { key: 'total', label: 'TOTAL', width: '120px', align: 'right' }
                    ]}
                    isLoading={isFetching}
                    loadingMessage="Actualizando registros..."
                    enablePagination={false}
                  >
                    {dataUploads.map((item, idx) => (
                      <TableRow key={item.identifier} className={idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}>
                        <TableCell className="font-semibold text-gray-900 dark:text-white whitespace-nowrap text-sm">
                          {item.identifier}
                        </TableCell>
                        <TableCell className="text-sm text-gray-900 dark:text-white">
                          {item.taxpayer}
                        </TableCell>
                        <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                          {item.cologne}
                        </TableCell>
                        <TableCell className="text-sm text-gray-900 dark:text-white">
                          {item.cat_service}
                        </TableCell>
                        <TableCell className="text-sm text-gray-900 dark:text-white text-right font-medium">
                          {formatNumber(item.cannon)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-900 dark:text-white text-right font-medium">
                          {formatNumber(item.excess)}
                        </TableCell>
                        <TableCell className="text-sm text-green-700 dark:text-green-400 text-right font-semibold">
                          {formatCurrency(item.total)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </ScrollableTable>
                  
                  {/* Paginación - Mostrar siempre si hay datos */}
                  {!isLoading && !error && pagination.total_items > 0 && (
                    <div className="mt-4">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.total_pages}
                        totalItems={pagination.total_items}
                        pageSize={pageSize}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={(newSize) => {
                          setPageSize(newSize);
                          setCurrentPage(1);
                        }}
                        isLoading={isFetching}
                        pageSizeOptions={[10, 25, 50, 100]}
                        showPageSizeSelector={true}
                        showPageInfo={true}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

