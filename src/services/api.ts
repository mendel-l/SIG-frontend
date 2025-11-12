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

export interface BackendLog {
  log_id: number;
  user_id: number;
  action: string;
  entity?: string;
  entity_id?: number;
  description?: string;
  created_at: string;
}

export interface BackendLogSummary {
  user_id: number;
  total_logins: number;
  last_login?: string;
  first_login?: string;
  login_dates: string[];
}

export interface ApiEnvelope<T> {
  status: string;
  message: string;
  data: T;
}

export type ApiResponse<T> = ApiEnvelope<T>;

export interface PaginationMeta {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: PaginationMeta;
}

function normalizePaginationMeta(meta: any): PaginationMeta {
  return {
    page: meta?.page ?? 1,
    limit: meta?.limit ?? meta?.page_size ?? meta?.per_page ?? 0,
    total_items: meta?.total_items ?? meta?.total ?? 0,
    total_pages: meta?.total_pages ?? meta?.totalPages ?? 1,
    next_page: meta?.next_page ?? meta?.nextPage ?? null,
    prev_page: meta?.prev_page ?? meta?.prevPage ?? null,
  };
}

function extractPaginatedResult<T>(envelope: ApiEnvelope<any>): PaginatedResult<T> {
  if (envelope.status !== 'success') {
    throw new Error(envelope.message || 'Error al procesar la respuesta');
  }

  const data = envelope.data ?? {};
  const items = Array.isArray(data.items) ? data.items : Array.isArray(data) ? data : [];
  const pagination = normalizePaginationMeta(data.pagination);

  // Ajustar limit por defecto si no se envió desde el backend
  const inferredLimit = pagination.limit || items.length;
  return {
    items,
    pagination: {
      ...pagination,
      limit: inferredLimit,
    },
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
        // Verificar si es un error de autenticación o autorización
        if (error.response?.status === 401 || error.response?.status === 403) {
          // Solo redirigir si NO es el endpoint de login
          const isLoginEndpoint = error.config?.url?.includes('/auth/token');
          
          if (!isLoginEndpoint) {
            // Token expirado, inválido o sin permisos - limpiar todo y redirigir al login
            removeAuthToken();
            removeAuthUser();
            // Limpiar también el store de Zustand
            sessionStorage.removeItem('auth-storage');
            localStorage.clear();
            // Redirigir al login inmediatamente (replace para no agregar al historial)
            window.location.replace('/login');
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
  async getUsers(page: number = 1, limit: number = 10): Promise<PaginatedResult<BackendUser>> {
    const response = await this.api.get<ApiEnvelope<any>>('/api/v1/user', {
      params: { page, limit },
    });
    return extractPaginatedResult<BackendUser>(response.data);
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
  async getEmployees(page: number = 1, limit: number = 100): Promise<PaginatedResult<BackendEmployee>> {
    const response = await this.api.get<ApiEnvelope<any>>('/api/v1/employee', {
      params: { page, limit },
    });
    return extractPaginatedResult<BackendEmployee>(response.data);
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
  async getRoles(page: number = 1, limit: number = 100): Promise<PaginatedResult<BackendRol>> {
    const response = await this.api.get<ApiEnvelope<any>>('/api/v1/rol', {
      params: { page, limit },
    });
    return extractPaginatedResult<BackendRol>(response.data);
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

  // Métodos de logs - rutas corregidas para apuntar al controlador de report
  async getLogsSummary(dateStart: string, dateFinish: string, nameEntity: string): Promise<{ success: boolean; data: any }> {
    const response = await this.api.get(`/api/v1/report/logs/summary?date_start=${dateStart}&date_finish=${dateFinish}&name_entity=${nameEntity}`);
    // El backend devuelve los datos directamente, no envueltos en {status, data, message}
    // Entonces response.data YA SON los datos que necesitamos
    return { success: true, data: response.data };
  }

  async getLogsDetail(dateStart: string, dateFinish: string, nameEntity: string): Promise<{ success: boolean; data: BackendLog[] }> {
    const response = await this.api.get(`/api/v1/report/logs/detail?date_start=${dateStart}&date_finish=${dateFinish}&name_entity=${nameEntity}`);
    // El backend devuelve los datos directamente, no envueltos en {status, data, message}
    console.log('🔧 API Response raw:', response);
    console.log('🔧 API Response.data:', response.data);
    return { success: true, data: response.data };
  }

  async getAvailableEntities(): Promise<{ success: boolean; data: string[] }> {
    const response = await this.api.get('/api/v1/report/entities');
    // El backend devuelve los datos directamente
    return { success: true, data: response.data };
  }

  // Export functions (client-side)
  async exportToPDF(data: any[], _filters?: any): Promise<Blob> {
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real implementation, you would use a library like jsPDF
    // For now, we'll create a simple blob
    const content = JSON.stringify({ data, filters: _filters, exportedAt: new Date().toISOString() }, null, 2);
    return new Blob([content], { type: 'application/pdf' });
  }

  async exportToExcel(data: any[], _filters?: any): Promise<Blob> {
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real implementation, you would use a library like xlsx
    // For now, we'll create a CSV
    if (data.length === 0) {
      throw new Error('No hay datos para exportar');
    }

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    
    return new Blob([csv], { type: 'text/csv' });
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
