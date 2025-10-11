import { useState, useEffect } from 'react';
import { getAuthToken } from '../utils';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Tipos de datos del frontend
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string; // Nombre completo para mostrar
  phoneNumber: string;
  state: boolean;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeBase {
  first_name: string;
  last_name: string;
  phone_number: string;
  state: boolean;
}

export interface EmployeeUpdate {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  state?: boolean;
}

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async (page: number = 1, limit: number = 10) => {
    setLoading(true);
    setError(null);

    try {
      // Obtener el token del sessionStorage
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/employee?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: any = await response.json();
      
      console.log('Respuesta del backend (empleados):', data); // Para debug
      
      if (data.status === 'success') {
        // Mapear empleados del backend al formato del frontend
        const mappedEmployees = data.data.map((backendEmployee: any) => ({
          id: backendEmployee.id_employee.toString(),
          firstName: backendEmployee.first_name,
          lastName: backendEmployee.last_name,
          fullName: `${backendEmployee.first_name} ${backendEmployee.last_name}`,
          phoneNumber: backendEmployee.phone_number,
          state: backendEmployee.state,
          status: backendEmployee.state ? 'active' : 'inactive',
          createdAt: backendEmployee.created_at,
          updatedAt: backendEmployee.updated_at,
        }));
        setEmployees(mappedEmployees);
      } else {
        setError(data.message || 'Error al obtener los empleados');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching employees:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshEmployees = () => {
    fetchEmployees();
  };

  const createEmployee = async (employeeData: EmployeeBase): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Obtener el token del sessionStorage
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/employee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: any = await response.json();
      
      console.log('Respuesta del backend (crear empleado):', data); // Para debug
      
      if (data.status === 'success') {
        // Refrescar la lista de empleados después de crear uno nuevo
        await fetchEmployees();
        return true;
      } else {
        setError(data.message || 'Error al crear el empleado');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error creating employee:', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (id: string, employeeData: EmployeeUpdate): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Obtener el token del sessionStorage
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/employee/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: any = await response.json();
      
      console.log('Respuesta del backend (actualizar empleado):', data); // Para debug
      
      if (data.status === 'success') {
        // Refrescar la lista de empleados después de actualizar
        await fetchEmployees();
        return true;
      } else {
        setError(data.message || 'Error al actualizar el empleado');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error updating employee:', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleEmployeeStatus = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Obtener el token del sessionStorage
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/employee/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: any = await response.json();
      
      console.log('Respuesta del backend (cambiar estado empleado):', data); // Para debug
      
      if (data.status === 'success') {
        // Refrescar la lista de empleados después del cambio de estado
        await fetchEmployees();
        return true;
      } else {
        setError(data.message || 'Error al cambiar el estado del empleado');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error toggling employee status:', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar empleados automáticamente al montar el componente
  useEffect(() => {
    fetchEmployees();
  }, []);

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    refreshEmployees,
    createEmployee,
    updateEmployee,
    toggleEmployeeStatus,
  };
};