import { useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';

export function useTheme() {
  const {
    theme,
    primaryColor,
    sidebarCollapsed,
    setTheme,
    setPrimaryColor,
    toggleSidebar,
    setSidebarCollapsed,
  } = useThemeStore();

  // Apply theme on mount and when theme changes
  useEffect(() => {
    // Don't call setTheme here as it creates a loop
    // The theme is already set in the store
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        setTheme('system');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, setTheme]);

  // Apply primary color on mount
  useEffect(() => {
    setPrimaryColor(primaryColor);
  }, [primaryColor, setPrimaryColor]);

  return {
    theme,
    primaryColor,
    sidebarCollapsed,
    setTheme,
    setPrimaryColor,
    toggleSidebar,
    setSidebarCollapsed,
  };
}
