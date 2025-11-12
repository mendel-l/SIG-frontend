import { useState } from 'react';
import { Search, Filter, Users } from 'lucide-react';
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
import { ScrollableTable, TableRow, TableCell, EmptyState, Pagination } from '@/components/ui';

export function EmployeesPage() {
  const { showSuccess, showError } = useNotifications();
  
  // Estado local de UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
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

  // Filtrado local (se podría mover al backend)
  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.first_name} ${employee.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         (employee.phone_number?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && employee.state) ||
                         (selectedStatus === 'inactive' && !employee.state);
    
    return matchesSearch && matchesStatus;
  });

  // ============================================
  // HANDLERS
  // ============================================

  const handleCreateEmployee = async (employeeData: EmployeeCreate) => {
    try {
      await createMutation.mutateAsync(employeeData);
      setShowForm(false);
      showSuccess('Empleado creado exitosamente', 'El nuevo empleado ha sido registrado correctamente en el sistema');
    } catch (error: any) {
      showError('Error', error.message || 'Error al crear empleado');
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleUpdateEmployee = async (employeeData: EmployeeUpdate) => {
    if (!editingEmployee) return;
    
    try {
      await updateMutation.mutateAsync({
        id: editingEmployee.id_employee,
        data: employeeData
      });
      setShowForm(false);
      setEditingEmployee(null);
      showSuccess('Empleado actualizado exitosamente', 'Los datos del empleado han sido actualizados correctamente');
    } catch (error: any) {
      showError('Error', error.message || 'Error al actualizar empleado');
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

  // ============================================
  // UTILIDADES
  // ============================================

  const getStatusBadgeColor = (state: boolean) => {
    return state 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
  };

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

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
              Gestión de Empleados
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Administra los empleados del sistema
              {isFetching && !isLoading && (
                <span className="ml-2 text-blue-600 dark:text-blue-400">🔄 Actualizando...</span>
              )}
            </p>
          </div>
          
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <svg className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              Exportar
            </button>
            <button
              type="button"
              onClick={() => {
                if (showForm) {
                  handleCancelForm();
                } else {
                  setShowForm(true);
                }
              }}
              className="ml-3 inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              {showForm ? 'Cancelar' : editingEmployee ? 'Editar Empleado' : 'Agregar Empleado'}
            </button>
          </div>
        </div>

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
              phone_number: editingEmployee.phone_number,
              state: editingEmployee.state,
              id_type_employee: editingEmployee.id_type_employee,
            } : null}
            isEdit={!!editingEmployee}
          />
        )}

        {/* Filters - Solo mostrar cuando no está el formulario */}
        {!showForm && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6 border border-gray-200 dark:border-gray-700">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Filtros y Búsqueda
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Encuentra empleados específicos
                </p>
              </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar empleados..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Employees Table - Solo mostrar cuando no está el formulario */}
        {!showForm && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Lista de Empleados
              </h3>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando empleados...</span>
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
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                      Error al cargar los empleados
                    </h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                      <p>{error.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <EmptyState
                icon={<Users className="mx-auto h-12 w-12 text-gray-400" />}
                title="No hay empleados disponibles"
                message={searchTerm || selectedStatus !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'No se encontraron empleados en el sistema.'
                }
              />
            ) : (
              <ScrollableTable
                columns={[
                  { key: 'employee', label: 'Empleado', width: '250px' },
                  { key: 'phone', label: 'Teléfono', width: '150px' },
                  { key: 'status', label: 'Estado', width: '120px', align: 'center' },
                  { key: 'date', label: 'Fecha de registro', width: '150px' },
                  { key: 'actions', label: 'Acciones', width: '100px', align: 'right' }
                ]}
                isLoading={isFetching}
                loadingMessage="Actualizando empleados..."
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
                    <TableCell align="center" className="whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(employee.state)}`}>
                        {employee.state ? '✅ Activo' : '❌ Inactivo'}
                      </span>
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
            )}
            
            {/* Paginación profesional */}
            {!isLoading && !error && filteredEmployees.length > 0 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.total_pages}
                totalItems={pagination.total_items}
                pageSize={pagination.limit}
                onPageChange={setCurrentPage}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setCurrentPage(1); // Reset a primera página al cambiar tamaño
                }}
                isLoading={isFetching}
                showPageSizeSelector={true}
                showPageInfo={true}
                pageSizeOptions={[10, 25, 50, 100]}
              />
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
