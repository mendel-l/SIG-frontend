import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Users, 
  MapPin, 
  Building2, 
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield
} from 'lucide-react';

// Mock data - replace with real API calls
const mockStats = {
  totalUsers: 1247,
  totalProjects: 89,
  totalRevenue: 125000,
  growthRate: 12.5,
  recentActivity: [
    { id: 1, type: 'user_registered', message: 'Nuevo usuario registrado', time: '2 min', icon: Users },
    { id: 2, type: 'project_created', message: 'Proyecto "Centro Comercial" creado', time: '15 min', icon: Building2 },
    { id: 3, type: 'map_updated', message: 'Mapa actualizado con nuevas ubicaciones', time: '1 hora', icon: MapPin },
    { id: 4, type: 'system_alert', message: 'Alerta del sistema resuelta', time: '2 horas', icon: AlertTriangle },
  ],
  upcomingEvents: [
    { id: 1, title: 'Reunión de planificación', date: '2024-01-15', time: '10:00' },
    { id: 2, title: 'Auditoría de proyectos', date: '2024-01-18', time: '14:00' },
    { id: 3, title: 'Actualización del sistema', date: '2024-01-20', time: '09:00' },
  ],
};

export function DashboardPage() {
  const [stats, setStats] = useState(mockStats);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setStats(mockStats);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bienvenido al Sistema de Información Geográfica
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{stats.growthRate}% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              En diferentes ubicaciones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Q{stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Crecimiento</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.growthRate}%</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Crecimiento positivo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimas actividades en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <activity.icon className="h-4 w-4 text-primary-600 dark:text-primary-300" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Hace {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
            <CardDescription>
              Eventos y reuniones programadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(event.date).toLocaleDateString('es-GT')} a las {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Accede rápidamente a las funciones principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href="/map"
              className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 dark:border-gray-700 dark:hover:border-primary-600 dark:hover:bg-primary-900/20 transition-colors"
            >
              <MapPin className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Ver Mapa
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Explorar ubicaciones
                </p>
              </div>
            </a>

            <a
              href="/users"
              className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 dark:border-gray-700 dark:hover:border-primary-600 dark:hover:bg-primary-900/20 transition-colors"
            >
              <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Gestionar Usuarios
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Administrar cuentas
                </p>
              </div>
            </a>

            <a
              href="/roles"
              className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 dark:border-gray-700 dark:hover:border-primary-600 dark:hover:bg-primary-900/20 transition-colors"
            >
              <Shield className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Gestionar Roles
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Permisos del sistema
                </p>
              </div>
            </a>

            <a
              href="/settings"
              className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 dark:border-gray-700 dark:hover:border-primary-600 dark:hover:bg-primary-900/20 transition-colors"
            >
              <Clock className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Configuración
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Ajustar sistema
                </p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
