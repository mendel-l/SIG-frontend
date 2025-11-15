import { useState } from 'react';

/**
 * Hook personalizado para manejar sessionStorage
 * Similar a useLocalStorage pero usando sessionStorage para mayor seguridad
 */
export function useSessionStorage<T>(key: string, initialValue: T) {
  // State para almacenar nuestro valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to sessionStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to session storage
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

/**
 * Hook específico para manejar tokens de autenticación
 */
export function useAuthToken() {
  const [token, setToken] = useSessionStorage<string | null>('access_token', null);
  
  const clearToken = () => {
    setToken(null);
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('access_token');
    }
  };

  return [token, setToken, clearToken] as const;
}

/**
 * Hook específico para manejar datos de usuario autenticado
 */
export function useAuthUser() {
  const [user, setUser] = useSessionStorage<any | null>('user', null);
  
  const clearUser = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('user');
    }
  };

  return [user, setUser, clearUser] as const;
}
