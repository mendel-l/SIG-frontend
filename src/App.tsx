import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PermissionRoute } from '@/components/auth/PermissionRoute';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { MapPage } from '@/pages/MapPage';
import { UsersPage } from '@/pages/UsersPage';
import { EmployeesPage } from '@/pages/EmployeesPage';
import { TanksPage } from '@/pages/TanksPage';
import { BombsPage } from '@/pages/BombsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { ComponentsExample } from '@/pages/ComponentsExample';
import RolesPage from '@/pages/RolesPage';
import ReportsIndexPage from '@/pages/reports/ReportsIndexPage';
import LogsReportsPage from '@/pages/reports/logs/LogsReportsPage';
import TanksReportPage from '@/pages/reports/tanks/TanksReportPage';
import SectorComparativePage from '@/pages/reports/sectors/SectorComparativePage';
import InterventionsGeneralPage from '@/pages/reports/interventions/InterventionsGeneralPage';
import InterventionFrequencyPage from '@/pages/reports/interventions/InterventionFrequencyPage';
import InterventionsBySectorPage from '@/pages/reports/interventions/InterventionsBySectorPage';
import PipesBySectorPage from '@/pages/reports/pipes/PipesBySectorPage';
import PipeInterventionsPage from '@/pages/reports/pipes/PipeInterventionsPage';
import ConnectionInterventionsPage from '@/pages/reports/connections/ConnectionInterventionsPage';
import TankStatusPage from '@/pages/reports/tanks/TankStatusPage';
import DeviationsPage from '@/pages/reports/deviations/DeviationsPage';
import AssignmentsPage from '@/pages/reports/assignments/AssignmentsPage';
import AssignmentsByStatusPage from '@/pages/reports/assignments/AssignmentsByStatusPage';
import PlumberReportPage from '@/pages/reports/employees/plumbers/PlumberReportPage';
import TopPlumbersPage from '@/pages/reports/employees/plumbers/TopPlumbersPage';
import OperatorReportPage from '@/pages/reports/employees/operators/OperatorReportPage';
import TopOperatorsPage from '@/pages/reports/employees/operators/TopOperatorsPage';
import ReadersPage from '@/pages/reports/employees/readers/ReadersPage';
import TopReadersPage from '@/pages/reports/employees/readers/TopReadersPage';
import CleanersPage from '@/pages/reports/employees/cleaners/CleanersPage';
import TopCleanersPage from '@/pages/reports/employees/cleaners/TopCleanersPage';
import { PermissionsPage } from '@/pages/PermissionsPage';
import PipesPage from '@/pages/PipesPage';
import TypeEmployeePage from '@/pages/TypeEmployeePage';
import { InterventionsPage } from '@/pages/InterventionsPage';
import { ConnectionsPage } from '@/pages/ConnectionsPage';
import { DataUploadPage } from '@/pages/DataUploadPage';
import { ManualsPage } from '@/pages/ManualsPage';

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
          <Route path="dashboard" element={<PermissionRoute permission="leer_tanques"><DashboardPage /></PermissionRoute>} />
          <Route path="map" element={<PermissionRoute permission="leer_tanques"><MapPage /></PermissionRoute>} />
          
          {/* Infraestructura */}
          <Route path="tanks" element={<PermissionRoute permission="leer_tanques"><TanksPage /></PermissionRoute>} />
          <Route path="bombs" element={<PermissionRoute permission="leer_tanques"><BombsPage /></PermissionRoute>} />
          <Route path="pipes" element={<PermissionRoute permission="leer_tuberias"><PipesPage /></PermissionRoute>} />
          <Route path="connections" element={<PermissionRoute permission="leer_conexiones"><ConnectionsPage /></PermissionRoute>} />
          <Route path="interventions" element={<PermissionRoute permission="leer_intervenciones"><InterventionsPage /></PermissionRoute>} />
          <Route path="data-upload" element={<PermissionRoute permission="leer_intervenciones"><DataUploadPage /></PermissionRoute>} />
          
          {/* Gestión de Personas */}
          <Route path="users" element={<PermissionRoute permission="leer_usuarios"><UsersPage /></PermissionRoute>} />
          <Route path="employees" element={<PermissionRoute permission="leer_empleados"><EmployeesPage /></PermissionRoute>} />
          
          {/* Administración */}
          <Route path="roles" element={<PermissionRoute permission="leer_roles"><RolesPage /></PermissionRoute>} />
          <Route path="permissions" element={<PermissionRoute permission="leer_roles"><PermissionsPage /></PermissionRoute>} />
          <Route path="type-employee" element={<PermissionRoute permission="leer_empleados"><TypeEmployeePage /></PermissionRoute>} />
          {/* Reportes */}
          <Route path="reports" element={<PermissionRoute permission="leer_intervenciones"><ReportsIndexPage /></PermissionRoute>} />
          <Route path="reports/logs" element={<PermissionRoute permission="leer_intervenciones"><LogsReportsPage /></PermissionRoute>} />
          <Route path="reports/tanks" element={<PermissionRoute permission="leer_intervenciones"><TanksReportPage /></PermissionRoute>} />
          <Route path="reports/sectors/comparative" element={<PermissionRoute permission="leer_intervenciones"><SectorComparativePage /></PermissionRoute>} />
          <Route path="reports/interventions" element={<PermissionRoute permission="leer_intervenciones"><InterventionsGeneralPage /></PermissionRoute>} />
          <Route path="reports/interventions/sector" element={<PermissionRoute permission="leer_intervenciones"><InterventionsBySectorPage /></PermissionRoute>} />
          <Route path="reports/interventions/frequency" element={<PermissionRoute permission="leer_intervenciones"><InterventionFrequencyPage /></PermissionRoute>} />
          <Route path="reports/pipes/sector" element={<PermissionRoute permission="leer_intervenciones"><PipesBySectorPage /></PermissionRoute>} />
          <Route path="reports/pipes/interventions" element={<PermissionRoute permission="leer_intervenciones"><PipeInterventionsPage /></PermissionRoute>} />
          <Route path="reports/connections/interventions" element={<PermissionRoute permission="leer_intervenciones"><ConnectionInterventionsPage /></PermissionRoute>} />
          <Route path="reports/tanks/status" element={<PermissionRoute permission="leer_intervenciones"><TankStatusPage /></PermissionRoute>} />
          <Route path="reports/deviations" element={<PermissionRoute permission="leer_intervenciones"><DeviationsPage /></PermissionRoute>} />
          <Route path="reports/assignments" element={<PermissionRoute permission="leer_intervenciones"><AssignmentsPage /></PermissionRoute>} />
          <Route path="reports/assignments/status" element={<PermissionRoute permission="leer_intervenciones"><AssignmentsByStatusPage /></PermissionRoute>} />
          <Route path="reports/employees/plumbers/report" element={<PermissionRoute permission="leer_intervenciones"><PlumberReportPage /></PermissionRoute>} />
          <Route path="reports/employees/plumbers/top" element={<PermissionRoute permission="leer_intervenciones"><TopPlumbersPage /></PermissionRoute>} />
          <Route path="reports/employees/operators/report" element={<PermissionRoute permission="leer_intervenciones"><OperatorReportPage /></PermissionRoute>} />
          <Route path="reports/employees/operators/top" element={<PermissionRoute permission="leer_intervenciones"><TopOperatorsPage /></PermissionRoute>} />
          <Route path="reports/employees/readers" element={<PermissionRoute permission="leer_intervenciones"><ReadersPage /></PermissionRoute>} />
          <Route path="reports/employees/readers/top" element={<PermissionRoute permission="leer_intervenciones"><TopReadersPage /></PermissionRoute>} />
          <Route path="reports/employees/cleaners" element={<PermissionRoute permission="leer_intervenciones"><CleanersPage /></PermissionRoute>} />
          <Route path="reports/employees/cleaners/top" element={<PermissionRoute permission="leer_intervenciones"><TopCleanersPage /></PermissionRoute>} />
          
          {/* Usuario y Sistema */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="manuals" element={<ManualsPage />} />
          <Route path="components" element={<ComponentsExample />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;
