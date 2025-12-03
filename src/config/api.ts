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
    
    // Bombas
    BOMBS: '/api/v1/bombs',
    
    // Tuberías
    PIPES: '/api/v1/pipes',
    
    // Conexiones
    CONNECTIONS: '/api/v1/connections',
    
    // Intervenciones
    INTERVENTIONS: '/api/v1/interventions',
    
    // Data Upload
    DATA_UPLOAD: '/api/v1/data-upload',
    
    // Dashboard
    DASHBOARD: {
      STATS: '/api/v1/dashboard/stats',
    },
    
    // Reportes
    REPORTS: {
      // Logs
      LOGS_SUMMARY: '/api/v1/report/logs/summary',
      LOGS_DETAIL: '/api/v1/report/logs/detail',
      ENTITIES: '/api/v1/report/entities',
      EXPORT_EXCEL: '/api/v1/report/logs/export-excel',
      // Tuberías
      PIPES_BY_SECTOR: '/api/v1/report/pipes/sector',
      PIPE_INTERVENTIONS: '/api/v1/report/pipes/interventions',
      // Conexiones
      CONNECTION_INTERVENTIONS: '/api/v1/report/connections/interventions',
      // Sectores
      SECTOR_COMPARATIVE: '/api/v1/report/sectors/comparative',
      // Intervenciones
      INTERVENTIONS: '/api/v1/report/interventions',
      INTERVENTIONS_BY_SECTOR: '/api/v1/report/interventions/sector',
      INTERVENTION_FREQUENCY: '/api/v1/report/interventions/frequency',
      // Tanques
      TANKS: '/api/v1/report/tanks',
      TANK_STATUS: '/api/v1/report/tanks/status',
      // Desvíos
      DEVIATIONS: '/api/v1/report/deviations',
      // Asignaciones
      ASSIGNMENTS: '/api/v1/report/assignments',
      ASSIGNMENTS_BY_STATUS: '/api/v1/report/assignments/status',
      // Empleados - Fontaneros
      PLUMBER_REPORT: '/api/v1/report/employees/plumber',
      TOP_PLUMBERS: '/api/v1/report/employees/plumbers/top',
      // Empleados - Operadores
      OPERATOR_REPORT: '/api/v1/report/employees/operator',
      TOP_OPERATORS: '/api/v1/report/employees/operators/top',
      // Empleados - Lectores
      READERS: '/api/v1/report/employees/readers',
      TOP_READERS: '/api/v1/report/employees/readers/top',
      // Empleados - Encargados de Limpieza
      CLEANERS: '/api/v1/report/employees/cleaners',
      TOP_CLEANERS: '/api/v1/report/employees/cleaners/top',
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
