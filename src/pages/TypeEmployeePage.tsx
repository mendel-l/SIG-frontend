import React, { useState, useEffect } from 'react';
import { Briefcase, Search } from 'lucide-react';
import TypeEmployeeForm from '../components/forms/TypeEmployeeForm';
import { useNotifications } from '../hooks/useNotifications';
import { useDebounce } from '../hooks/useDebounce';
import { 
  useTypeEmployees, 
  useCreateTypeEmployee, 
  useUpdateTypeEmployee,
  useDeleteTypeEmployee,
  type TypeEmployee,
  type TypeEmployeeCreate,
  type TypeEmployeeUpdate 
} from '../queries/typeEmployeeQueries';
import { ScrollableTable, TableRow, TableCell, EmptyState, Pagination, StatsCards, PageHeader, SearchBar, StatCard } from '../components/ui';
import ActionButtons from '../components/ui/ActionButtons';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';

const TypeEmployeePage: React.FC = () => {
  const { showSuccess, showError } = useNotifications();
  
  // Estado local de UI
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingTypeEmployee, setEditingTypeEmployee] = useState<TypeEmployee | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    typeEmployee: TypeEmployee | null;
  }>({ isOpen: false, typeEmployee: null });

  // Debounce del término de búsqueda para optimizar peticiones (300ms)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Resetear página a 1 cuando cambia el término de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // ✅ QUERY - Obtener tipos de empleado con TanStack Query (búsqueda en backend)
  const { 
    data: typeEmployeesData,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useTypeEmployees(currentPage, pageSize, debouncedSearchTerm || undefined);

  // ✅ MUTATIONS - Acciones
  const createMutation = useCreateTypeEmployee();
  const updateMutation = useUpdateTypeEmployee();
  const deleteMutation = useDeleteTypeEmployee();

  // Extraer datos y paginación
  const typeEmployees = typeEmployeesData?.items || [];
  const pagination = typeEmployeesData?.pagination || { 
    page: 1, 
    limit: pageSize, 
    total_items: 0, 
    total_pages: 1,
    next_page: null,
    prev_page: null,
  };

  const handleCreateTypeEmployee = async (data: any) => {
    try {
      // Convertir state de number (1/0) a boolean
      const createData: TypeEmployeeCreate = {
        name: data.name,
        description: data.description || null,
        active: data.active === true || data.active === 1,
      };
      await createMutation.mutateAsync(createData);
      setShowForm(false);
      showSuccess('Tipo de empleado creado', 'El nuevo tipo de empleado ha sido guardado correctamente');
      return true;
    } catch (error: any) {
      showError('Error', error.message || 'Error al crear tipo de empleado');
      return false;
    }
  };

  const handleEditTypeEmployee = (typeEmployee: TypeEmployee) => {
    setEditingTypeEmployee(typeEmployee);
    setShowForm(true);
  };

  const handleUpdateTypeEmployee = async (data: any) => {
    if (!editingTypeEmployee) return false;
    
    try {
      // Convertir state de number (1/0) a boolean
      const updateData: TypeEmployeeUpdate = {
        name: data.name,
        description: data.description || null,
        active: data.active === true || data.active === 1,
      };
      await updateMutation.mutateAsync({
        id: editingTypeEmployee.id_type_employee,
        data: updateData
      });
      setShowForm(false);
      setEditingTypeEmployee(null);
      showSuccess('Tipo de empleado actualizado', 'Los cambios han sido guardados correctamente');
      return true;
    } catch (error: any) {
      showError('Error', error.message || 'Error al actualizar tipo de empleado');
      return false;
    }
  };

  const handleToggleStatus = (typeEmployee: TypeEmployee) => {
    setConfirmDialog({
      isOpen: true,
      typeEmployee,
    });
  };

  const confirmToggleStatus = async () => {
    if (!confirmDialog.typeEmployee) return;
    
    try {
      await deleteMutation.mutateAsync(confirmDialog.typeEmployee.id_type_employee);
      showSuccess(
        `Tipo de empleado ${confirmDialog.typeEmployee.active ? 'desactivado' : 'activado'} exitosamente`,
        `El estado de "${confirmDialog.typeEmployee.name}" ha sido actualizado correctamente`
      );
    } catch (error: any) {
      showError('Error', error.message || 'Error al cambiar estado del tipo de empleado');
    } finally {
      setConfirmDialog({ isOpen: false, typeEmployee: null });
    }
  };

  const cancelToggleStatus = () => {
    setConfirmDialog({ isOpen: false, typeEmployee: null });
  };

  const handleRefresh = () => {
    refetch();
    showSuccess('Actualizado', 'Lista de tipos de empleado actualizada');
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTypeEmployee(null);
  };

  const handleSubmitForm = editingTypeEmployee ? handleUpdateTypeEmployee : handleCreateTypeEmployee;

  // Los datos ya vienen filtrados del backend, no necesitamos filtrado local
  const totalTypeEmployees = pagination.total_items;
  const hasSearch = debouncedSearchTerm.trim().length > 0;

  const stats: StatCard[] = [
    {
      label: 'Total Tipos',
      value: totalTypeEmployees,
      icon: Briefcase,
      iconColor: 'text-blue-600 dark:text-blue-500',
    },
    ...(hasSearch ? [{
      label: 'Resultados Búsqueda',
      value: totalTypeEmployees,
      icon: Search,
      iconColor: 'text-purple-600 dark:text-purple-500',
    }] : []),
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <PageHeader
          title="Tipos de Empleado"
          subtitle="Administra las categorías y clasificaciones de empleados"
          icon={Briefcase}
          onRefresh={handleRefresh}
          onAdd={() => {
            if (showForm) {
              handleCancelForm();
            } else {
              setShowForm(true);
            }
          }}
          addLabel={editingTypeEmployee ? 'Editar Tipo' : 'Nuevo Tipo'}
          isRefreshing={isFetching}
          showForm={showForm}
        />

        {/* Formulario para crear/editar tipo de empleado */}
        {showForm && (
          <TypeEmployeeForm 
            onSubmit={handleSubmitForm}
            onCancel={handleCancelForm}
            loading={createMutation.isPending || updateMutation.isPending}
            className="mb-6"
            initialData={editingTypeEmployee ? {
              name: editingTypeEmployee.name,
              description: editingTypeEmployee.description || '',
              active: editingTypeEmployee.active,
            } : undefined}
          />
        )}

        {/* Estadísticas y Búsqueda - Solo cuando NO hay formulario */}
        {!showForm && (
          <>
            {/* Stats Cards */}
            <StatsCards stats={stats} />

            {/* Búsqueda */}
            <SearchBar
              placeholder="Buscar tipos de empleado por nombre o descripción..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </>
        )}

        {/* Lista de tipos de empleado - Solo mostrar cuando no está el formulario */}
        {!showForm && (
          <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
            <div className="p-6">
              {isLoading && typeEmployees.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Cargando tipos de empleado...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                        Error al cargar los tipos de empleado
                      </h3>
                      <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                        <p>{error instanceof Error ? error.message : 'Error desconocido'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : typeEmployees.length === 0 ? (
                <EmptyState
                  icon={<Briefcase className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />}
                  title="No hay tipos de empleado disponibles"
                  message={debouncedSearchTerm 
                    ? 'No se encontraron tipos de empleado con los criterios de búsqueda'
                    : "Comienza creando tu primer tipo de empleado"
                  }
                />
              ) : (
                <>
                  <ScrollableTable
                    columns={[
                      { key: 'id', label: 'ID', width: '80px' },
                      { key: 'name', label: 'Nombre', width: '200px' },
                      { key: 'description', label: 'Descripción' },
                      { key: 'created', label: 'Creado', width: '180px' },
                      { key: 'actions', label: 'Acciones', width: '120px', align: 'right' }
                    ]}
                    isLoading={isFetching}
                    loadingMessage="Actualizando tipos de empleado..."
                    enablePagination={false}
                  >
                    {typeEmployees.map((typeEmployee) => (
                      <TableRow key={typeEmployee.id_type_employee}>
                        <TableCell className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                          #{typeEmployee.id_type_employee}
                        </TableCell>
                        <TableCell className="font-medium whitespace-nowrap">
                          {typeEmployee.name}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-md truncate" title={typeEmployee.description || ''}>
                            {typeEmployee.description || 'Sin descripción'}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          {formatDate(typeEmployee.created_at)}
                        </TableCell>
                        <TableCell align="right" className="whitespace-nowrap">
                          <ActionButtons
                            onEdit={() => handleEditTypeEmployee(typeEmployee)}
                            onToggleStatus={() => handleToggleStatus(typeEmployee)}
                            isActive={typeEmployee.active}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </ScrollableTable>
                  
                  {/* Paginación del backend - Mostrar siempre si hay datos */}
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

        {/* Diálogo de confirmación para cambio de estado */}
        <ConfirmationDialog
          isOpen={confirmDialog.isOpen}
          onClose={cancelToggleStatus}
          onConfirm={confirmToggleStatus}
          title={confirmDialog.typeEmployee?.active ? 'Desactivar Tipo de Empleado' : 'Activar Tipo de Empleado'}
          message={`¿Estás seguro de ${confirmDialog.typeEmployee?.active ? 'desactivar' : 'activar'} el tipo de empleado "${confirmDialog.typeEmployee?.name}"?`}
          confirmText={confirmDialog.typeEmployee?.active ? 'Desactivar' : 'Activar'}
          cancelText="Cancelar"
          variant={confirmDialog.typeEmployee?.active ? 'danger' : 'info'}
          loading={deleteMutation.isPending}
        />
      </div>
    </div>
  );
};

export default TypeEmployeePage;
