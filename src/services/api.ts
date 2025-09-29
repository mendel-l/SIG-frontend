import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { getAuthToken, removeAuthToken, removeAuthUser } from '@/utils';

// Tipos para las respuestas del backend
export interface BackendUser {
  id_user: number;
  user: string;
  email: string;
  employee_id: number;
  rol_id: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface BackendEmployee {
  id_employee: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  created_at: string;
  updated_at: string;
  state: boolean;
}

export interface BackendRol {
  id_rol: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  status: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    // Configurar la URL base del backend
    this.baseURL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Interceptor para agregar token de autenticación
    this.api.interceptors.request.use(
      (config) => {
        const token = getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para manejar respuestas y errores
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Solo redirigir si NO es el endpoint de login
          const isLoginEndpoint = error.config?.url?.includes('/auth/token');
          
          if (!isLoginEndpoint) {
            // Token expirado o inválido - limpiar sessionStorage
            removeAuthToken();
            removeAuthUser();
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos de autenticación
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await this.api.post('/api/v1/auth/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  }

  async getCurrentUser(): Promise<BackendUser> {
    const response = await this.api.get('/api/v1/auth/me');
    return response.data;
  }

  // Métodos de usuarios
  async getUsers(page: number = 1, limit: number = 10): Promise<PaginatedResponse<BackendUser>> {
    const response = await this.api.get(`/api/v1/user?page=${page}&limit=${limit}`);
    return response.data;
  }

  async createUser(userData: {
    user: string;
    password_hash: string;
    employee_id: number;
    rol_id: number;
    status: number;
  }): Promise<BackendUser> {
    const response = await this.api.post('/api/v1/user', userData);
    return response.data;
  }

  // Métodos de empleados
  async getEmployees(): Promise<ApiResponse<BackendEmployee[]>> {
    const response = await this.api.get('/api/v1/employee');
    return response.data;
  }

  async createEmployee(employeeData: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
  }): Promise<BackendEmployee> {
    const response = await this.api.post('/api/v1/employee', employeeData);
    return response.data;
  }

  // Métodos de roles
  async getRoles(): Promise<ApiResponse<BackendRol[]>> {
    const response = await this.api.get('/api/v1/rol');
    return response.data;
  }

  async createRole(roleData: {
    name: string;
    description?: string;
  }): Promise<BackendRol> {
    const response = await this.api.post('/api/v1/rol', roleData);
    return response.data;
  }

  // Métodos de tanques
  async getTanks(): Promise<any[]> {
    const response = await this.api.get('/api/v1/tank');
    return response.data;
  }

  async createTank(tankData: {
    name: string;
    coordinates: string;
    connections?: string;
    photography?: string;
  }): Promise<any> {
    const response = await this.api.post('/api/v1/tank', tankData);
    return response.data;
  }
}

// Instancia singleton del servicio API
export const apiService = new ApiService();

// Funciones de utilidad para manejo de errores
export function handleApiError(error: AxiosError): string {
  if (error.response?.data) {
    const data = error.response.data as any;
    
    // Manejar errores específicos de autenticación
    if (error.response.status === 401) {
      return data.detail || 'Credenciales incorrectas. Verifica tu email y contraseña.';
    }
    
    return data.detail || data.message || 'Error del servidor';
  }
  
  if (error.request) {
    return 'Error de conexión. Verifica que el servidor esté ejecutándose.';
  }
  
  return 'Error inesperado';
}

export function isNetworkError(error: AxiosError): boolean {
  return !error.response && error.request;
}
