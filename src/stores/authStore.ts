import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, LoginCredentials, RegisterData } from '@/types';
import { getFromStorage, setToStorage, removeFromStorage } from '@/utils';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

// Mock API functions (replace with real API calls)
const mockApi = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (credentials.email === 'admin@sig.com' && credentials.password === 'admin123') {
      return {
        id: '1',
        email: credentials.email,
        name: 'Administrador',
        role: 'admin',
        avatar: '/avatars/admin.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    
    throw new Error('Credenciales inválidas');
  },
  
  register: async (data: RegisterData): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (data.password !== data.confirmPassword) {
      throw new Error('Las contraseñas no coinciden');
    }
    
    return {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
  
  refreshToken: async (): Promise<User | null> => {
    // Check if user exists in localStorage
    const storedUser = getFromStorage('user', null);
    if (storedUser) {
      return storedUser;
    }
    return null;
  },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const user = await mockApi.login(credentials);
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false, 
            error: null 
          });
          setToStorage('user', user);
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
          const user = await mockApi.register(data);
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false, 
            error: null 
          });
          setToStorage('user', user);
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
        removeFromStorage('user');
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          set({ user: updatedUser });
          setToStorage('user', updatedUser);
        }
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: async () => {
        const currentState = get();
        if (currentState.isLoading) {
          console.log('⏳ Auth check already in progress, skipping...');
          return;
        }
        
        console.log('🔍 Starting auth check...');
        set({ isLoading: true });
        
        try {
          // Add a small delay to ensure localStorage is available
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const user = await mockApi.refreshToken();
          console.log('👤 User from storage:', user);
          if (user) {
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            });
            console.log('✅ User authenticated, isLoading set to false');
          } else {
            set({ 
              user: null, 
              isAuthenticated: false, 
              isLoading: false 
            });
            console.log('❌ No user found, isLoading set to false');
          }
        } catch (error) {
          console.error('🚨 Auth check error:', error);
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
      partialize: (state) => ({
        user: state.user,
      }),
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
