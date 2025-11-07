import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, LoginCredentials, RegisterData } from '@/types';
import { 
  getAuthToken, 
  setAuthToken, 
  setAuthUser,
  clearAuth 
} from '@/utils';
import { apiService, BackendUser, BackendEmployee, BackendRol, handleApiError } from '@/services/api';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

// Función para convertir usuario del backend al formato del frontend
function mapBackendUserToFrontend(backendUser: BackendUser, employee?: BackendEmployee, role?: BackendRol): User {
  return {
    id: backendUser.id_user.toString(),
    email: backendUser.email, // Usar el email directamente del backend
    name: employee ? `${employee.first_name} ${employee.last_name}` : backendUser.user,
    role: role?.name === 'admin' ? 'admin' : 'user',
    avatar: undefined,
    createdAt: backendUser.created_at,
    updatedAt: backendUser.updated_at,
  };
}

// API real functions
const realApi = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    try {
      // El backend espera 'username' en lugar de 'email'
      const loginResponse = await apiService.login({
        username: credentials.email, // Usar email como username
        password: credentials.password,
      });

      // Guardar token en sessionStorage
      setAuthToken(loginResponse.access_token);

      // Obtener información del usuario actual
      const backendUser = await apiService.getCurrentUser();
      
      // Obtener información del empleado y rol
      const employeesResponse = await apiService.getEmployees();
      const rolesResponse = await apiService.getRoles();
      
      const employees = employeesResponse.data || [];
      const roles = rolesResponse.data || [];
      
      const employee = employees.find((emp: BackendEmployee) => emp.id_employee === backendUser.employee_id);
      const role = roles.find((r: BackendRol) => r.id_rol === backendUser.rol_id);

      const user = mapBackendUserToFrontend(backendUser, employee, role);
      
      // Guardar usuario en sessionStorage
      setAuthUser(user);
      
      return user;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },
  
  register: async (data: RegisterData): Promise<User> => {
    try {
      // Validar que las contraseñas coincidan
      if (data.password !== data.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      // Crear empleado primero
      const employee = await apiService.createEmployee({
        first_name: data.name.split(' ')[0] || data.name,
        last_name: data.name.split(' ').slice(1).join(' ') || '',
        email: data.email,
      });

      // Obtener rol por defecto (asumimos que existe un rol 'user')
      const rolesResponse = await apiService.getRoles();
      const roles = rolesResponse.data || [];
      const defaultRole = roles.find((r: BackendRol) => r.name === 'user') || roles[0];

      if (!defaultRole) {
        throw new Error('No se encontró un rol por defecto');
      }

      // Crear usuario
      const backendUser = await apiService.createUser({
        user: data.email, // Usar email como username
        password_hash: data.password, // El backend lo hasheará
        employee_id: employee.id_employee,
        rol_id: defaultRole.id_rol,
        status: 1, // Activo
      });

      const user = mapBackendUserToFrontend(backendUser, employee, defaultRole);
      
      // Guardar usuario en sessionStorage
      setAuthUser(user);
      
      return user;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },
  
  refreshToken: async (): Promise<User | null> => {
    try {
      const token = getAuthToken();
      if (!token) {
        return null;
      }

      // Verificar que el token siga siendo válido
      const backendUser = await apiService.getCurrentUser();
      
      // Obtener información del empleado y rol
      const employeesResponse = await apiService.getEmployees();
      const rolesResponse = await apiService.getRoles();
      
      const employees = employeesResponse.data || [];
      const roles = rolesResponse.data || [];
      
      const employee = employees.find((emp: BackendEmployee) => emp.id_employee === backendUser.employee_id);
      const role = roles.find((r: BackendRol) => r.id_rol === backendUser.rol_id);

      const user = mapBackendUserToFrontend(backendUser, employee, role);
      
      setAuthUser(user);
      
      return user;
    } catch (error) {
      clearAuth();
      return null;
    }
  },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const user = await realApi.login(credentials);
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false, 
            error: null 
          });
          setAuthUser(user);
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al iniciar sesión',
            isLoading: false 
          });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        
        try {
          const user = await realApi.register(data);
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false, 
            error: null 
          });
          setAuthUser(user);
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al registrarse',
            isLoading: false 
          });
          throw error;
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null 
        });

        clearAuth();
        sessionStorage.removeItem('auth-storage');
        localStorage.clear();
        window.location.replace('/login');
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          set({ user: updatedUser });
          setAuthUser(updatedUser);
        }
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: async () => {
        const currentState = get();
        if (currentState.isLoading) {
          return;
        }
        
        set({ isLoading: true });
        
        try {
          // Add a small delay to ensure sessionStorage is available
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const user = await realApi.refreshToken();
          if (user) {
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            });
          } else {
            set({ 
              user: null, 
              isAuthenticated: false, 
              isLoading: false 
            });
          }
        } catch (error) {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null 
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      } as any),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // When rehydrating, set auth status based on user
          state.isAuthenticated = !!state.user;
          state.isLoading = false;
        }
      },
    }
  )
);
