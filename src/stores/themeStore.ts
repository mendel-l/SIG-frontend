import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme, ThemeConfig } from '@/types';

interface ThemeStore extends ThemeConfig {
  // Actions
  setTheme: (theme: Theme) => void;
  setPrimaryColor: (color: string) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const defaultTheme: ThemeConfig = {
  theme: 'light',
  primaryColor: '#3b82f6',
  sidebarCollapsed: false,
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      ...defaultTheme,

      setTheme: (theme) => {
        set({ theme });
        
        // Apply theme to document
        const root = document.documentElement;
        
        if (theme === 'dark') {
          root.classList.add('dark');
        } else if (theme === 'light') {
          root.classList.remove('dark');
        } else {
          // System theme
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          if (systemTheme === 'dark') {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        }
      },

      setPrimaryColor: (color) => {
        set({ primaryColor: color });
        
        // Apply primary color to CSS variables
        document.documentElement.style.setProperty('--color-primary', color);
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Apply theme when rehydrating
          const root = document.documentElement;
          
          if (state.theme === 'dark') {
            root.classList.add('dark');
          } else if (state.theme === 'light') {
            root.classList.remove('dark');
          } else {
            // System theme
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            if (systemTheme === 'dark') {
              root.classList.add('dark');
            } else {
              root.classList.remove('dark');
            }
          }
        }
      },
    }
  )
);
