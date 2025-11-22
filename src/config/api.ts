const resolveBaseUrl = (): string => {
  const envBase = (import.meta as any).env?.VITE_API_URL;
  const mode = ((import.meta as any).env?.MODE || 'development').toLowerCase();
  const fallback = mode === 'production' ? '/api' : 'http://localhost:8000';
  const base = envBase || fallback;
  return base.endsWith('/') ? base.slice(0, -1) : base;
};

const BASE_URL = resolveBaseUrl();

// Configuración centralizada de la API
export const API_CONFIG = {
  // URL base del backend
  BASE_URL,
  
  // URL completa del API con versión
  API_BASE_URL: `${BASE_URL}/api/v1`,
  
  // Timeout para las peticiones (en milisegundos)
  TIMEOUT: 10000,
  
  // Endpoints del API
  ENDPOINTS: {
    // Autenticación
    AUTH: {
      LOGIN: '/api/v1/auth/token',
      ME: '/api/v1/auth/me',
      LOGOUT: '/api/v1/auth/logout',
    },
    
    // Usuarios
    USERS: '/api/v1/user',
    
    // Empleados
    EMPLOYEES: '/api/v1/employee',
    
    // Tipos de Empleado
    TYPE_EMPLOYEE: '/api/v1/type_employee',
    
    // Roles
    ROLES: '/api/v1/rol',
    
    // Permisos
    PERMISSIONS: '/api/v1/premissions',
    
    // Tanques
    TANKS: '/api/v1/tank',
    
    // Tuberías
    PIPES: '/api/v1/pipes',
    
    // Conexiones
    CONNECTIONS: '/api/v1/connections',
    
    // Intervenciones
    INTERVENTIONS: '/api/v1/interventions',
    
    // Dashboard
    DASHBOARD: {
      STATS: '/api/v1/dashboard/stats',
    },
    
    // Reportes
    REPORTS: {
      LOGS_SUMMARY: '/api/v1/report/logs/summary',
      LOGS_DETAIL: '/api/v1/report/logs/detail',
      ENTITIES: '/api/v1/report/entities',
      EXPORT_EXCEL: '/api/v1/report/logs/export-excel',
    },
  },
} as const;

// Configuración de la aplicación
export const APP_CONFIG = {
  NAME: (import.meta as any).env?.VITE_APP_NAME || 'SIG Municipal',
  VERSION: (import.meta as any).env?.VITE_APP_VERSION || '1.0.0',
  DEBUG: (import.meta as any).env?.VITE_DEBUG === 'true',
  ENVIRONMENT: (import.meta as any).env?.MODE || 'development',
} as const;

// Helper para construir URLs completas
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper para obtener headers con autenticación
export const getAuthHeaders = (): HeadersInit => {
  const token = sessionStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};
