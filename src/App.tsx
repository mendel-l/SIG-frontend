import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { MapPage } from '@/pages/MapPage';
import { UsersPage } from '@/pages/UsersPage';
import { EmployeesPage } from '@/pages/EmployeesPage';
import { TanksPage } from '@/pages/TanksPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { ComponentsExample } from '@/pages/ComponentsExample';
import RolesPage from '@/pages/RolesPage';
import ReportsPage from '@/pages/ReportsPage';
import { PermissionsPage } from '@/pages/PermissionsPage';
import PipesPage from '@/pages/PipesPage';
import TypeEmployeePage from '@/pages/TypeEmployeePage';
import { InterventionsPage } from '@/pages/InterventionsPage';
import { ConnectionsPage } from '@/pages/ConnectionsPage';

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
          }
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="map" element={<MapPage />} />
          
          {/* Infraestructura */}
          <Route path="tanks" element={<TanksPage />} />
          <Route path="pipes" element={<PipesPage />} />
          <Route path="connections" element={<ConnectionsPage />} />
          <Route path="interventions" element={<InterventionsPage />} />
          
          {/* Gestión de Personas */}
          <Route path="users" element={<UsersPage />} />
          <Route path="employees" element={<EmployeesPage />} />
          
          {/* Administración */}
          <Route path="roles" element={<RolesPage />} />
          <Route path="permissions" element={<PermissionsPage />} />
          <Route path="type-employee" element={<TypeEmployeePage />} />
          <Route path="reports" element={<ReportsPage />} />
          
          {/* Usuario y Sistema */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="components" element={<ComponentsExample />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;
