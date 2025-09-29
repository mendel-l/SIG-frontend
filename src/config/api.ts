// Configuración de la API
export const API_CONFIG = {
  BASE_URL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000',
  TIMEOUT: 10000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/v1/auth/token',
      ME: '/api/v1/auth/me',
    },
    USERS: '/api/v1/user',
    EMPLOYEES: '/api/v1/employee',
    ROLES: '/api/v1/rol',
    TANKS: '/api/v1/tank',
  },
} as const;

// Configuración de la aplicación
export const APP_CONFIG = {
  NAME: (import.meta as any).env?.VITE_APP_NAME || 'SIG Municipal',
  VERSION: (import.meta as any).env?.VITE_APP_VERSION || '1.0.0',
  DEBUG: (import.meta as any).env?.VITE_DEBUG === 'true',
} as const;
