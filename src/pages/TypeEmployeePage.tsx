import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, RefreshCw } from 'lucide-react';
import TypeEmployeeForm from '../components/forms/TypeEmployeeForm';
import { useTypeEmployeeStore } from '../stores/typeEmployeeStore';
import { useNotifications } from '../hooks/useNotifications';
import { ScrollableTable, TableRow, TableCell, EmptyState } from '../components/ui';
import ActionButtons from '../components/ui/ActionButtons';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import { TypeEmployeeBase } from '../types';

const TypeEmployeePage: React.FC = () => {
  const { typeEmployees, loading, error, fetchTypeEmployees, createTypeEmployee, updateTypeEmployee, deleteTypeEmployee, clearError } = useTypeEmployeeStore();
  const { showSuccess, showError } = useNotifications();
  const [showForm, setShowForm] = useState(false);
  const [editingTypeEmployee, setEditingTypeEmployee] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    typeEmployee: any | null;
    loading: boolean;
  }>({ isOpen: false, typeEmployee: null, loading: false });

  // Cargar tipos de empleado al montar el componente
  useEffect(() => {
    fetchTypeEmployees();
  }, [fetchTypeEmployees]);

  // Mostrar errores como notificación
  useEffect(() => {
    if (error) {
      showError('Error', error);
      clearError();
    }
  }, [error, showError, clearError]);

  const handleCreateTypeEmployee = async (data: TypeEmployeeBase) => {
    const success = await createTypeEmployee(data);
    if (success) {
      setShowForm(false);
      showSuccess('Tipo de empleado creado', 'El nuevo tipo de empleado ha sido guardado correctamente');
    }
    return success;
  };

  const handleEditTypeEmployee = (typeEmployee: any) => {
    setEditingTypeEmployee(typeEmployee);
    setShowForm(true);
  };

  const handleUpdateTypeEmployee = async (data: TypeEmployeeBase) => {
    if (!editingTypeEmployee) return false;
    
    const success = await updateTypeEmployee(editingTypeEmployee.id_type_employee, data);
    if (success) {
      setShowForm(false);
      setEditingTypeEmployee(null);
      showSuccess('Tipo de empleado actualizado', 'Los cambios han sido guardados correctamente');
    }
    return success;
  };

  const handleToggleStatus = (typeEmployee: any) => {
    setConfirmDialog({
      isOpen: true,
      typeEmployee,
      loading: false,
    });
  };

  const confirmToggleStatus = async () => {
    if (!confirmDialog.typeEmployee) return;
    
    setConfirmDialog(prev => ({ ...prev, loading: true }));
    
    const success = await deleteTypeEmployee(confirmDialog.typeEmployee.id_type_employee);
    if (success) {
      showSuccess(
        `Tipo de empleado ${confirmDialog.typeEmployee.state ? 'desactivado' : 'activado'} exitosamente`,
        `El estado de "${confirmDialog.typeEmployee.name}" ha sido actualizado correctamente`
      );
    }
    
    setConfirmDialog({ isOpen: false, typeEmployee: null, loading: false });
  };

  const cancelToggleStatus = () => {
    setConfirmDialog({ isOpen: false, typeEmployee: null, loading: false });
  };

  const handleRefresh = () => {
    fetchTypeEmployees();
    showSuccess('Lista actualizada', 'Los tipos de empleado han sido actualizados correctamente');
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTypeEmployee(null);
  };

  const handleSubmitForm = editingTypeEmployee ? handleUpdateTypeEmployee : handleCreateTypeEmployee;

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
        {/* Header con estadísticas */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white">
                    Tipos de Empleado
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Administra las categorías y clasificaciones de empleados
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`-ml-0.5 mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
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
                disabled={loading}
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="-ml-0.5 mr-1.5 h-5 w-5" />
                {showForm ? 'Cancelar' : editingTypeEmployee ? 'Editar Tipo' : 'Nuevo Tipo'}
              </button>
            </div>
          </div>

          {/* Estadísticas rápidas - Solo mostrar cuando no está el formulario */}
          {!showForm && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tipos</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                    {typeEmployees.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Activos</p>
                  <p className="text-2xl font-semibold text-green-600 dark:text-green-400 mt-1">
                    {typeEmployees.filter(te => te.state).length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inactivos</p>
                  <p className="text-2xl font-semibold text-red-600 dark:text-red-400 mt-1">
                    {typeEmployees.filter(te => !te.state).length}
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Formulario para crear/editar tipo de empleado */}
        {showForm && (
          <TypeEmployeeForm 
            onSubmit={handleSubmitForm}
            onCancel={handleCancelForm}
            loading={loading}
            className="mb-6"
            initialData={editingTypeEmployee ? {
              name: editingTypeEmployee.name,
              description: editingTypeEmployee.description,
              state: editingTypeEmployee.state,
            } : undefined}
          />
        )}

        {/* Lista de tipos de empleado - Solo mostrar cuando no está el formulario */}
        {!showForm && error && !loading ? (
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
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleRefresh}
                    className="bg-red-100 dark:bg-red-800 px-2 py-1 rounded text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : typeEmployees.length === 0 && !loading && !showForm ? (
          <EmptyState
            title="No hay tipos de empleado disponibles"
            message="No se encontraron tipos de empleado en el sistema. Crea el primer tipo para comenzar."
          />
        ) : !loading && !showForm && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Lista de Tipos de Empleado ({typeEmployees.length})
              </h3>
            </div>
            
            <ScrollableTable
              columns={[
                { key: 'id', label: 'ID', width: '80px' },
                { key: 'name', label: 'Nombre', width: '200px' },
                { key: 'description', label: 'Descripción' },
                { key: 'state', label: 'Estado', width: '120px', align: 'center' },
                { key: 'created', label: 'Creado', width: '180px' },
                { key: 'actions', label: 'Acciones', width: '120px', align: 'right' }
              ]}
              isLoading={loading && !showForm}
              loadingMessage="Cargando tipos de empleado..."
              enablePagination={true}
              defaultPageSize={25}
              pageSizeOptions={[10, 25, 50, 100]}
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
                    <div className="max-w-md truncate" title={typeEmployee.description}>
                      {typeEmployee.description}
                    </div>
                  </TableCell>
                  <TableCell align="center" className="whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      typeEmployee.state
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {typeEmployee.state ? '✅ Activo' : '❌ Inactivo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {formatDate(typeEmployee.created_at)}
                  </TableCell>
                  <TableCell align="right" className="whitespace-nowrap">
                    <ActionButtons
                      onEdit={() => handleEditTypeEmployee(typeEmployee)}
                      onToggleStatus={() => handleToggleStatus(typeEmployee)}
                      isActive={typeEmployee.state}
                      loading={loading}
                      showEdit={true}
                      showToggleStatus={true}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </ScrollableTable>
          </div>
        )}

        {/* Diálogo de confirmación para cambio de estado */}
        <ConfirmationDialog
          isOpen={confirmDialog.isOpen}
          onClose={cancelToggleStatus}
          onConfirm={confirmToggleStatus}
          title={confirmDialog.typeEmployee?.state ? 'Desactivar Tipo de Empleado' : 'Activar Tipo de Empleado'}
          message={`¿Estás seguro de ${confirmDialog.typeEmployee?.state ? 'desactivar' : 'activar'} el tipo de empleado "${confirmDialog.typeEmployee?.name}"?`}
          confirmText={confirmDialog.typeEmployee?.state ? 'Desactivar' : 'Activar'}
          cancelText="Cancelar"
          variant={confirmDialog.typeEmployee?.state ? 'danger' : 'info'}
          loading={confirmDialog.loading}
        />
      </div>
    </div>
  );
};

export default TypeEmployeePage;
