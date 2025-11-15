import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatsCards, StatCard } from '@/components/ui/StatsCards';
import { useDashboardStats } from '@/queries/dashboardQueries';
import { 
  Users, 
  MapPin, 
  Building2, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  Loader2
} from 'lucide-react';

export function DashboardPage() {
  const { data: stats, isLoading, error } = useDashboardStats();

  // Función para mapear el action a un mensaje legible
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE':
        return CheckCircle;
      case 'UPDATE':
        return TrendingUp;
      case 'DELETE':
        return AlertTriangle;
      case 'TOGGLE':
        return Clock;
      default:
        return Building2;
    }
  };

  // Función para formatear el tiempo transcurrido
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seg`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hora${Math.floor(diffInSeconds / 3600) > 1 ? 's' : ''}`;
    return `${Math.floor(diffInSeconds / 86400)} día${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''}`;
  };

  // Cards de estadísticas
  const statCards: StatCard[] = stats ? [
    { 
      label: 'Usuarios Activos', 
      value: stats.users.active.toLocaleString(), 
      icon: Users 
    },
    { 
      label: 'Empleados Activos', 
      value: stats.employees.active.toLocaleString(), 
      icon: Shield 
    },
    { 
      label: 'Tanques Activos', 
      value: stats.infrastructure.tanks.active.toLocaleString(), 
      icon: Building2 
    },
    { 
      label: 'Tuberías Activas', 
      value: stats.infrastructure.pipes.active.toLocaleString(), 
      icon: MapPin 
    },
    { 
      label: 'Conexiones Activas', 
      value: stats.infrastructure.connections.active.toLocaleString(), 
      icon: TrendingUp 
    },
    { 
      label: 'Intervenciones Activas', 
      value: stats.interventions.active.toLocaleString(), 
      icon: CheckCircle 
    },
  ] : [];

  // Mostrar estado de carga
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-mint-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">
            Error al cargar estadísticas: {error.message}
          </p>
        </div>
      </div>
    );
  }

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
              {stats?.recent_activity && stats.recent_activity.length > 0 ? (
                stats.recent_activity.map((activity) => {
                  const ActivityIcon = getActionIcon(activity.action);
                  return (
                    <div 
                      key={activity.log_id} 
                      className="flex items-center space-x-3 rounded-2xl border border-white/30 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-mint-100 to-aqua-100 flex items-center justify-center">
                          <ActivityIcon className="h-5 w-5 text-mint-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.description || `${activity.user} realizó ${activity.action} en ${activity.entity}`}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Hace {getTimeAgo(activity.created_at)} • {activity.user}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No hay actividad reciente
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Intervenciones por Entidad */}
        <Card>
          <CardHeader>
            <CardTitle>Intervenciones por Tipo</CardTitle>
            <CardDescription>
              Distribución de intervenciones activas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.interventions.by_entity && (
                <>
                  <div className="flex items-center justify-between rounded-2xl border border-white/30 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Tanques
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Intervenciones activas
                        </p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {stats.interventions.by_entity.tanks}
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-white/30 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Tuberías
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Intervenciones activas
                        </p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {stats.interventions.by_entity.pipes}
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-white/30 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Conexiones
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Intervenciones activas
                        </p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {stats.interventions.by_entity.connections}
                    </div>
                  </div>
                </>
              )}
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
