import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatsCards, StatCard } from '@/components/ui/StatsCards';
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
  const statCards: StatCard[] = [
    { label: 'Total Usuarios', value: stats.totalUsers.toLocaleString(), icon: Users },
    { label: 'Proyectos Activos', value: stats.totalProjects, icon: Building2 },
    { label: 'Ingresos Totales', value: `Q${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp },
    { label: 'Tasa de Crecimiento', value: `${stats.growthRate}%`, icon: CheckCircle },
  ];

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setStats(mockStats);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle="Bienvenido al Sistema de Información Geográfica"
        icon={MapPin}
      />

      <StatsCards stats={statCards} />

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
                <div key={activity.id} className="flex items-center space-x-3 rounded-2xl border border-white/30 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-mint-100 to-aqua-100 flex items-center justify-center">
                      <activity.icon className="h-5 w-5 text-mint-600" />
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
                <div key={event.id} className="flex items-center space-x-3 rounded-2xl border border-white/30 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-aqua-100 to-mint-50 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-aqua-600" />
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
              className="flex items-center space-x-3 rounded-2xl border border-white/40 bg-white/80 p-4 shadow-card-soft transition-all duration-300 hover:-translate-y-1 hover:bg-white dark:border-white/10 dark:bg-gray-900/60"
            >
              <MapPin className="h-6 w-6 text-mint-600 dark:text-white" />
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
              className="flex items-center space-x-3 rounded-2xl border border-white/40 bg-white/80 p-4 shadow-card-soft transition-all duration-300 hover:-translate-y-1 hover:bg-white dark:border-white/10 dark:bg-gray-900/60"
            >
              <Users className="h-6 w-6 text-mint-600 dark:text-white" />
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
              className="flex items-center space-x-3 rounded-2xl border border-white/40 bg-white/80 p-4 shadow-card-soft transition-all duration-300 hover:-translate-y-1 hover:bg-white dark:border-white/10 dark:bg-gray-900/60"
            >
              <Shield className="h-6 w-6 text-mint-600 dark:text-white" />
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
              className="flex items-center space-x-3 rounded-2xl border border-white/40 bg-white/80 p-4 shadow-card-soft transition-all duration-300 hover:-translate-y-1 hover:bg-white dark:border-white/10 dark:bg-gray-900/60"
            >
              <Clock className="h-6 w-6 text-mint-600 dark:text-white" />
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
