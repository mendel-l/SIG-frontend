import { useState } from 'react';
import { Search, Users, Briefcase } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { 
  useEmployees, 
  useCreateEmployee, 
  useUpdateEmployee,
  useDeleteEmployee,
  type Employee,
  type EmployeeCreate,
  type EmployeeUpdate 
} from '@/queries/employeesQueries';
import EmployeeForm from '@/components/forms/EmployeeForm';
import ActionButtons from '@/components/ui/ActionButtons';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { ScrollableTable, TableRow, TableCell, EmptyState, Pagination, StatsCards, PageHeader, SearchBar, StatCard } from '@/components/ui';

export function EmployeesPage() {
  const { showSuccess, showError } = useNotifications();
  
  // Estado local de UI
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    employee: Employee | null;
  }>({ isOpen: false, employee: null });

  // ✅ QUERY - Obtener empleados con TanStack Query
  const { 
    data: employeesData,
    isLoading,
    error,
    isFetching, // True cuando hace refetch en background
  } = useEmployees(currentPage, pageSize);

  // ✅ MUTATIONS - Acciones
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const deleteMutation = useDeleteEmployee();

  // Extraer datos y paginación
  const employees = employeesData?.items || [];
  const pagination = employeesData?.pagination || { 
    page: 1,
    limit: pageSize,
    total_items: 0,
    total_pages: 1,
    next_page: null,
    prev_page: null,
  };

  // Filtrar solo empleados activos por defecto y aplicar búsqueda
  const activeEmployees = employees.filter(employee => employee.state === true);
  const filteredEmployees = activeEmployees.filter(employee => {
    if (!searchTerm) return true;
    const fullName = `${employee.first_name} ${employee.last_name}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return (
      fullName.includes(search) ||
      (employee.phone_number?.toLowerCase() || '').includes(search)
    );
  });

  const totalEmployees = pagination.total_items;
  const resultsCount = filteredEmployees.length;

  const handleCreateEmployee = async (employeeData: EmployeeCreate) => {
    try {
      await createMutation.mutateAsync(employeeData);
      setShowForm(false);
      showSuccess('Empleado creado exitosamente', 'El nuevo empleado ha sido registrado correctamente en el sistema');
      return true;
    } catch (error: any) {
      showError('Error', error.message || 'Error al crear empleado');
      return false;
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleUpdateEmployee = async (employeeData: EmployeeUpdate) => {
    if (!editingEmployee) return false;
    
    try {
      await updateMutation.mutateAsync({
        id: editingEmployee.id_employee,
        data: employeeData
      });
      setShowForm(false);
      setEditingEmployee(null);
      showSuccess('Empleado actualizado exitosamente', 'Los datos del empleado han sido actualizados correctamente');
      return true;
    } catch (error: any) {
      showError('Error', error.message || 'Error al actualizar empleado');
      return false;
    }
  };

  const handleToggleStatus = (employee: Employee) => {
    setConfirmDialog({
      isOpen: true,
      employee,
    });
  };

  const confirmToggleStatus = async () => {
    if (!confirmDialog.employee) return;
    
    try {
      await deleteMutation.mutateAsync(confirmDialog.employee.id_employee);
      showSuccess(
        `Empleado ${confirmDialog.employee.state ? 'desactivado' : 'activado'} exitosamente`,
        `El estado de ${confirmDialog.employee.first_name} ${confirmDialog.employee.last_name} ha sido actualizado correctamente`
      );
    } catch (error: any) {
      showError('Error', error.message || 'Error al cambiar estado');
    } finally {
      setConfirmDialog({ isOpen: false, employee: null });
    }
  };

  const cancelToggleStatus = () => {
    setConfirmDialog({ isOpen: false, employee: null });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  const handleSubmitForm = editingEmployee ? handleUpdateEmployee : handleCreateEmployee;

  const formatRegistrationDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const hasSearch = searchTerm.trim().length > 0;
  const stats: StatCard[] = [
    {
      label: 'Total Empleados',
      value: totalEmployees,
      icon: Briefcase,
      iconColor: 'text-blue-600 dark:text-blue-500',
    },
    ...(hasSearch ? [{
      label: 'Resultados Búsqueda',
      value: resultsCount,
      icon: Search,
      iconColor: 'text-purple-600 dark:text-purple-500',
    }] : []),
  ];

  const handleRefresh = () => {
    // Refetch se maneja automáticamente con TanStack Query
    showSuccess('Actualizado', 'Lista de empleados actualizada');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <PageHeader
          title="Gestión de Empleados"
          subtitle="Administra los empleados del sistema"
          icon={Briefcase}
          onRefresh={handleRefresh}
          onAdd={() => {
            if (showForm) {
              handleCancelForm();
            } else {
              setShowForm(true);
            }
          }}
          addLabel={editingEmployee ? 'Editar Empleado' : 'Agregar Empleado'}
          isRefreshing={isFetching}
          showForm={showForm}
        />

        {/* Formulario para crear/editar empleado */}
        {showForm && (
          <EmployeeForm 
            onSubmit={handleSubmitForm}
            onCancel={handleCancelForm}
            loading={createMutation.isPending || updateMutation.isPending}
            className="mb-6"
            initialData={editingEmployee ? {
              first_name: editingEmployee.first_name,
              last_name: editingEmployee.last_name,
              phone_number: editingEmployee.phone_number || '',
              state: editingEmployee.state,
              id_type_employee: editingEmployee.id_type_employee,
            } : null}
            isEdit={!!editingEmployee}
          />
        )}

        {/* Estadísticas y Búsqueda - Solo cuando NO hay formulario */}
        {!showForm && (
          <>
            {/* Stats Cards */}
            <StatsCards stats={stats} />

            {/* Búsqueda */}
            <SearchBar
              placeholder="Buscar empleados por nombre o teléfono..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </>
        )}

        {/* Employees Table - Solo mostrar cuando no está el formulario */}
        {!showForm && (
          <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
            <div className="p-6">
              {isLoading && employees.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Cargando empleados...</p>
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
                        Error al cargar los empleados
                      </h3>
                      <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                        <p>{error.message}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : filteredEmployees.length === 0 ? (
                <EmptyState
                  icon={<Users className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />}
                  title="No hay empleados disponibles"
                  message={searchTerm ? 'No se encontraron empleados con los criterios de búsqueda' : 'Comienza registrando tu primer empleado'}
                />
              ) : (
                <>
                  <ScrollableTable
                    columns={[
                      { key: 'employee', label: 'Empleado', width: '250px' },
                      { key: 'phone', label: 'Teléfono', width: '150px' },
                      { key: 'date', label: 'Fecha de registro', width: '150px' },
                      { key: 'actions', label: 'Acciones', width: '100px', align: 'right' }
                    ]}
                    isLoading={isFetching}
                    loadingMessage="Actualizando empleados..."
                    enablePagination={false}
                  >
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id_employee}>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
                                <span className="text-sm font-medium text-white">
                                  {employee.first_name.charAt(0).toUpperCase()}{employee.last_name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                {employee.first_name} {employee.last_name}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium whitespace-nowrap">
                          {employee.phone_number || 'N/A'}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          {formatRegistrationDate(employee.created_at)}
                        </TableCell>
                        <TableCell align="right" className="whitespace-nowrap">
                          <ActionButtons
                            onEdit={() => handleEditEmployee(employee)}
                            onToggleStatus={() => handleToggleStatus(employee)}
                            isActive={employee.state}
                            loading={deleteMutation.isPending}
                            showEdit={true}
                            showToggleStatus={true}
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
          title={confirmDialog.employee?.state ? 'Desactivar Empleado' : 'Activar Empleado'}
          message={`¿Estás seguro de ${confirmDialog.employee?.state ? 'desactivar' : 'activar'} a ${confirmDialog.employee?.first_name} ${confirmDialog.employee?.last_name}?`}
          confirmText={confirmDialog.employee?.state ? 'Desactivar' : 'Activar'}
          cancelText="Cancelar"
          variant={confirmDialog.employee?.state ? 'danger' : 'info'}
          loading={deleteMutation.isPending}
        />
      </div>
    </div>
  );
}
