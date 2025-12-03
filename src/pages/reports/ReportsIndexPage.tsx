import { Link } from 'react-router-dom';
import { FileText, Activity, Wrench, Network, BarChart3, Settings, Database, AlertTriangle, ClipboardList, Users } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function ReportsIndexPage() {
  const reportCategories = [
    {
      title: 'Logs y Actividad',
      description: 'Reportes de actividad del sistema y logs de usuarios',
      icon: Activity,
      href: '/reports/logs',
      color: 'primary',
    },
    {
      title: 'Tuberías',
      description: 'Reportes de tuberías por sector e intervenciones',
      icon: Wrench,
      href: '/reports/pipes',
      color: 'secondary',
      children: [
        { name: 'Tuberías por Sector', href: '/reports/pipes/sector' },
        { name: 'Intervenciones en Tuberías', href: '/reports/pipes/interventions' },
      ],
    },
    {
      title: 'Conexiones',
      description: 'Reportes de intervenciones en conexiones',
      icon: Network,
      href: '/reports/connections/interventions',
      color: 'primary',
    },
    {
      title: 'Sectores',
      description: 'Reportes comparativos entre sectores',
      icon: BarChart3,
      href: '/reports/sectors/comparative',
      color: 'secondary',
    },
    {
      title: 'Intervenciones',
      description: 'Reportes generales, por sector y frecuencia de intervenciones',
      icon: Settings,
      href: '/reports/interventions',
      color: 'primary',
      children: [
        { name: 'Intervenciones General', href: '/reports/interventions' },
        { name: 'Intervenciones por Sector', href: '/reports/interventions/sector' },
        { name: 'Frecuencia de Intervenciones', href: '/reports/interventions/frequency' },
      ],
    },
    {
      title: 'Tanques',
      description: 'Reportes de tanques y su estado',
      icon: Database,
      href: '/reports/tanks',
      color: 'secondary',
      children: [
        { name: 'Reporte de Tanques', href: '/reports/tanks' },
        { name: 'Estado de Tanques', href: '/reports/tanks/status' },
      ],
    },
    {
      title: 'Asignaciones',
      description: 'Reportes de trabajos asignados y por estado',
      icon: ClipboardList,
      href: '/reports/assignments',
      color: 'primary',
      children: [
        { name: 'Trabajos Asignados', href: '/reports/assignments' },
        { name: 'Trabajos por Estado', href: '/reports/assignments/status' },
      ],
    },
    {
      title: 'Desvíos',
      description: 'Reporte de conexiones (desvíos)',
      icon: AlertTriangle,
      href: '/reports/deviations',
      color: 'secondary',
    },
    {
      title: 'Empleados',
      description: 'Reportes de actividad de empleados por tipo',
      icon: Users,
      href: '/reports/employees',
      color: 'primary',
      children: [
        { name: 'Fontaneros', href: '/reports/employees/plumbers/top' },
        { name: 'Operadores', href: '/reports/employees/operators/top' },
        { name: 'Lectores', href: '/reports/employees/readers' },
        { name: 'Encargados de Limpieza', href: '/reports/employees/cleaners' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
            <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reportes
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Selecciona una categoría de reporte para comenzar
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportCategories.map((category) => (
          <Link key={category.title} to={category.href}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg bg-${category.color}-100 dark:bg-${category.color}-900/30`}>
                  <category.icon className={`h-6 w-6 text-${category.color}-600 dark:text-${category.color}-400`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {category.description}
                  </p>
                  {category.children && (
                    <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                      {category.children.map((child) => (
                        <li key={child.name}>• {child.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

