import { useState, useMemo } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Users, Search, Check } from 'lucide-react';
import { cn } from '@/utils';

interface Employee {
  id: number;
  name: string;
  role: string;
  email?: string;
}

interface EmployeeFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (selectedIds: number[]) => void;
  employees: Employee[];
  initialSelected?: number[];
}

export function EmployeeFilterModal({
  isOpen,
  onClose,
  onApply,
  employees,
  initialSelected = [],
}: EmployeeFilterModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>(initialSelected);

  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return employees;

    const query = searchQuery.toLowerCase();
    return employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(query) ||
        emp.role.toLowerCase().includes(query) ||
        emp.email?.toLowerCase().includes(query)
    );
  }, [employees, searchQuery]);

  const handleToggle = (empId: number) => {
    setSelectedIds((prev) =>
      prev.includes(empId) ? prev.filter((id) => id !== empId) : [...prev, empId]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(filteredEmployees.map((emp) => emp.id));
  };

  const handleClearAll = () => {
    setSelectedIds([]);
  };

  const handleApply = () => {
    onApply(selectedIds);
    onClose();
  };

  const handleCancel = () => {
    setSelectedIds(initialSelected);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          <span>Filtrar por Empleado</span>
        </div>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-4">
          {/* Search */}
          <Input
            type="text"
            placeholder="Buscar por nombre, rol o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search />}
          />

          {/* Actions */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {selectedIds.length} de {employees.length} seleccionados
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleSelectAll}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                Seleccionar todo
              </button>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <button
                onClick={handleClearAll}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
              >
                Limpiar
              </button>
            </div>
          </div>

          {/* Employee List */}
          <div className="max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
            {filteredEmployees.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No se encontraron empleados</p>
              </div>
            ) : (
              filteredEmployees.map((employee) => {
                const isSelected = selectedIds.includes(employee.id);
                return (
                  <button
                    key={employee.id}
                    onClick={() => handleToggle(employee.id)}
                    className={cn(
                      'w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
                      isSelected && 'bg-primary-50 dark:bg-primary-900/20'
                    )}
                  >
                    <div className="flex items-center gap-3 flex-1 text-left">
                      <div
                        className={cn(
                          'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                          isSelected
                            ? 'bg-primary-600 border-primary-600'
                            : 'border-gray-300 dark:border-gray-600'
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {employee.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {employee.role}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="secondary" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleApply}>
          Aplicar ({selectedIds.length})
        </Button>
      </ModalFooter>
    </Modal>
  );
}

