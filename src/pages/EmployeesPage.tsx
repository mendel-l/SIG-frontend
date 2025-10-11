import { useState } from 'react';
import { Search, Filter, Users } from 'lucide-react';
import { useEmployees } from '@/hooks/useEmployees';
import { useNotifications } from '@/hooks/useNotifications';
import EmployeeForm from '@/components/forms/EmployeeForm';
import ActionButtons from '@/components/ui/ActionButtons';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { ScrollableTable, TableRow, TableCell, EmptyState } from '@/components/ui';

export function EmployeesPage() {
  const { employees, loading, error, refreshEmployees, createEmployee, updateEmployee, toggleEmployeeStatus } = useEmployees();
  const { showSuccess } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    employee: any | null;
    loading: boolean;
  }>({ isOpen: false, employee: null, loading: false });

  const handleCreateEmployee = async (employeeData: any) => {
    const success = await createEmployee(employeeData);
    if (success) {
      setShowForm(false); // Ocultar el formulario después de crear exitosamente
      showSuccess('Empleado creado exitosamente', 'El nuevo empleado ha sido registrado correctamente en el sistema');
    }
    return success;
  };

  const handleEditEmployee = (employee: any) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleUpdateEmployee = async (employeeData: any) => {
    if (!editingEmployee) return false;
    
    const success = await updateEmployee(editingEmployee.id, employeeData);
    if (success) {
      setShowForm(false);
      setEditingEmployee(null);
      showSuccess('Empleado actualizado exitosamente', 'Los datos del empleado han sido actualizados correctamente');
    }
    return success;
  };

  const handleToggleStatus = (employee: any) => {
    setConfirmDialog({
      isOpen: true,
      employee,
      loading: false,
    });
  };

  const confirmToggleStatus = async () => {
    if (!confirmDialog.employee) return;
    
    setConfirmDialog(prev => ({ ...prev, loading: true }));
    
    const success = await toggleEmployeeStatus(confirmDialog.employee.id);
    if (success) {
      showSuccess(
        `Empleado ${confirmDialog.employee.state ? 'desactivado' : 'activado'} exitosamente`,
        `El estado de ${confirmDialog.employee.fullName} ha sido actualizado correctamente`
      );
    }
    
    setConfirmDialog({ isOpen: false, employee: null, loading: false });
  };

  const cancelToggleStatus = () => {
    setConfirmDialog({ isOpen: false, employee: null, loading: false });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  const handleSubmitForm = editingEmployee ? handleUpdateEmployee : handleCreateEmployee;

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || employee.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
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
            loading={loading}
            className="mb-6"
            initialData={editingEmployee ? {
              first_name: editingEmployee.firstName,
              last_name: editingEmployee.lastName,
              phone_number: editingEmployee.phoneNumber,
              state: editingEmployee.state,
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
                Lista de Empleados ({filteredEmployees.length})
              </h3>
              <button
                onClick={refreshEmployees}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualizar
              </button>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Cargando empleados...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error al cargar los empleados
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="bg-red-100 px-2 py-1 rounded text-sm font-medium text-red-800 hover:bg-red-200"
                      >
                        Reintentar
                      </button>
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
                isLoading={loading}
                loadingMessage="Cargando empleados..."
              >
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
                            <span className="text-sm font-medium text-white">
                              {employee.firstName.charAt(0).toUpperCase()}{employee.lastName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {employee.fullName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap">
                      {employee.phoneNumber}
                    </TableCell>
                    <TableCell align="center" className="whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusBadgeColor(employee.status)}`}>
                        {employee.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {formatRegistrationDate(employee.createdAt)}
                    </TableCell>
                    <TableCell align="right" className="whitespace-nowrap">
                      <ActionButtons
                        onEdit={() => handleEditEmployee(employee)}
                        onToggleStatus={() => handleToggleStatus(employee)}
                        isActive={employee.state}
                        loading={loading}
                        showEdit={true}
                        showToggleStatus={true}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </ScrollableTable>
            )}
            
            {filteredEmployees.length > 0 && (
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Mostrando {filteredEmployees.length} empleado{filteredEmployees.length !== 1 ? 's' : ''}
              </div>
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
          message={`¿Estás seguro de ${confirmDialog.employee?.state ? 'desactivar' : 'activar'} a ${confirmDialog.employee?.fullName}?`}
          confirmText={confirmDialog.employee?.state ? 'Desactivar' : 'Activar'}
          cancelText="Cancelar"
          variant={confirmDialog.employee?.state ? 'danger' : 'info'}
          loading={confirmDialog.loading}
        />
      </div>
    </div>
  );
}