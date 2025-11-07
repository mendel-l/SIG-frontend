import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.tsx'
import './index.css'

// 🔒 Interceptor global de fetch para manejar errores de autenticación
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  
  // Si el backend responde 401 o 403, significa que no hay acceso
  if (response.status === 401 || response.status === 403) {
    const url = typeof args[0] === 'string' ? args[0] : args[0].url;
    
    // No redirigir si es el endpoint de login (para mostrar el error)
    if (!url.includes('/auth/token')) {
      // Limpiar toda la sesión
      sessionStorage.clear();
      localStorage.clear();
      // Redirigir al login (replace para no agregar al historial)
      window.location.replace('/login');
    }
  }
  
  return response;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)
