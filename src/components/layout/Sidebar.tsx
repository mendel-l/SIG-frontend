import { Fragment, useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import {
  X,
  Home,
  Map,
  Users,
  User,
  Settings,
  Shield,
  Briefcase,
  FileText,
  Key,
  Wrench,
  MapPin,
  Network,
  Layers,
  Upload,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Zap
} from 'lucide-react';
import { cn } from '@/utils';
import { usePermissions } from '@/hooks/usePermissions';
import { getRoutePermission } from '@/config/permissions';

// Tipos para navegación con submenús
interface NavItemWithChildren {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  section: string;
  children?: NavItem[];
}

interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  section: string;
}

// Estructura de navegación jerárquica
const navigation: (NavItem | NavItemWithChildren)[] = [
  // === SECCIÓN: PRINCIPAL ===
  { name: 'Dashboard', href: '/dashboard', icon: Home, section: 'principal' },
  { name: 'Mapa', href: '/map', icon: Map, section: 'principal' },
  
  // === SECCIÓN: INFRAESTRUCTURA (Tablas Fuertes) ===
  { name: 'Tanques', href: '/tanks', icon: MapPin, section: 'infraestructura' },
  { name: 'Bombas', href: '/bombs', icon: Zap, section: 'infraestructura' },
  { name: 'Tuberías', href: '/pipes', icon: Wrench, section: 'infraestructura' },
  { name: 'Conexiones', href: '/connections', icon: Network, section: 'infraestructura' },
  { name: 'Intervenciones', href: '/interventions', icon: Wrench, section: 'infraestructura' },
  { name: 'Carga de Datos', href: '/data-upload', icon: Upload, section: 'infraestructura' },
  
  // === SECCIÓN: GESTIÓN DE PERSONAS ===
  { name: 'Usuarios', href: '/users', icon: Users, section: 'personas' },
  { name: 'Empleados', href: '/employees', icon: Briefcase, section: 'personas' },
  
  // === SECCIÓN: ADMINISTRACIÓN Y CONFIGURACIÓN ===
  { name: 'Roles', href: '/roles', icon: Shield, section: 'admin' },
  { name: 'Permisos', href: '/permissions', icon: Key, section: 'admin' },
  { name: 'Tipos de Empleado', href: '/type-employee', icon: Layers, section: 'admin' },
  {
    name: 'Reportes',
    icon: FileText,
    section: 'admin',
    children: [
      // Logs y Actividad
      { name: 'Logs y Actividad', href: '/reports/logs', section: 'admin' },
      
      // Tuberías
      { name: 'Tuberías por Sector', href: '/reports/pipes/sector', section: 'admin' },
      { name: 'Intervenciones en Tuberías', href: '/reports/pipes/interventions', section: 'admin' },
      
      // Conexiones
      { name: 'Intervenciones en Conexiones', href: '/reports/connections/interventions', section: 'admin' },
      
      // Sectores
      { name: 'Comparativo entre Sectores', href: '/reports/sectors/comparative', section: 'admin' },
      
      // Intervenciones
      { name: 'Intervenciones General', href: '/reports/interventions', section: 'admin' },
      { name: 'Intervenciones por Sector', href: '/reports/interventions/sector', section: 'admin' },
      { name: 'Frecuencia de Intervenciones', href: '/reports/interventions/frequency', section: 'admin' },
      
      // Tanques
      { name: 'Reporte de Tanques', href: '/reports/tanks', section: 'admin' },
      { name: 'Estado de Tanques', href: '/reports/tanks/status', section: 'admin' },
      
      // Asignaciones
      { name: 'Trabajos Asignados', href: '/reports/assignments', section: 'admin' },
      { name: 'Trabajos por Estado', href: '/reports/assignments/status', section: 'admin' },
      
      // Desvíos
      { name: 'Reporte de Desvíos', href: '/reports/deviations', section: 'admin' },
      
      // Empleados - Fontaneros
      { name: 'Reporte por Fontanero', href: '/reports/employees/plumbers/report', section: 'admin' },
      { name: 'Top Fontaneros', href: '/reports/employees/plumbers/top', section: 'admin' },
      
      // Empleados - Operadores
      { name: 'Reporte por Operador', href: '/reports/employees/operators/report', section: 'admin' },
      { name: 'Top Operadores', href: '/reports/employees/operators/top', section: 'admin' },
      
      // Empleados - Lectores
      { name: 'Reporte de Lectores', href: '/reports/employees/readers', section: 'admin' },
      { name: 'Top Lectores', href: '/reports/employees/readers/top', section: 'admin' },
      
      // Empleados - Encargados de Limpieza
      { name: 'Lista de Encargados', href: '/reports/employees/cleaners', section: 'admin' },
      { name: 'Top Encargados', href: '/reports/employees/cleaners/top', section: 'admin' }
    ]
  },
  
  // === SECCIÓN: USUARIO Y SISTEMA ===
  { name: 'Perfil', href: '/profile', icon: User, section: 'sistema' },
  { name: 'Configuración', href: '/settings', icon: Settings, section: 'sistema' },
  { name: 'Descargar Manuales', href: '/manuals', icon: BookOpen, section: 'sistema' }
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isCollapsed = !isExpanded;

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={onClose}>
                      <span className="sr-only">Cerrar sidebar</span>
                      <X className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <SidebarContent isCollapsed={false} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div
        className={cn(
          "hidden lg:fixed lg:top-8 lg:bottom-8 lg:left-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300",
          isCollapsed ? "lg:w-16" : "lg:w-64"
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <SidebarContent
          isCollapsed={isCollapsed}
        />
      </div>
    </>
  );
}

interface SidebarContentProps {
  isCollapsed: boolean;
}

function SidebarContent({ isCollapsed }: SidebarContentProps) {
  const location = useLocation();
  const { hasPermission } = usePermissions();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  // Filtrar navegación según permisos del usuario
  const filteredNavigation = useMemo(() => {
    return navigation.filter((item) => {
      // Rutas de usuario y sistema siempre accesibles si está autenticado
      if (item.section === 'sistema') {
        return true;
      }
      
      // Si tiene hijos, verificar permisos de los hijos
      if ('children' in item && item.children) {
        const hasVisibleChild = item.children.some(child => {
          const requiredPermission = getRoutePermission(child.href);
          return !requiredPermission || hasPermission(requiredPermission);
        });
        return hasVisibleChild;
      }
      
      // Obtener permiso requerido para la ruta
      const requiredPermission = getRoutePermission(item.href || '');
      
      // Si no hay permiso requerido definido, permitir acceso (por seguridad, mejor denegar)
      if (!requiredPermission) {
        return false;
      }
      
      // Verificar si el usuario tiene el permiso
      return hasPermission(requiredPermission);
    });
  }, [hasPermission]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
      } else {
        newSet.add(itemName);
      }
      return newSet;
    });
  };

  const isItemExpanded = (itemName: string) => expandedItems.has(itemName);
  const isItemActive = (item: NavItem | NavItemWithChildren) => {
    if ('href' in item && item.href) {
      return location.pathname === item.href;
    }
    if ('children' in item && item.children) {
      return item.children.some(child => location.pathname === child.href);
    }
    return false;
  };

  const renderNavItem = (item: NavItem | NavItemWithChildren) => {
    const hasChildren = 'children' in item && item.children && item.children.length > 0;
    const isActive = isItemActive(item);
    const isExpanded = hasChildren ? isItemExpanded(item.name) : false;
    const itemKey = item.name;

    // Filtrar hijos según permisos
    const visibleChildren = hasChildren && 'children' in item 
      ? item.children!.filter(child => {
          const requiredPermission = getRoutePermission(child.href);
          return !requiredPermission || hasPermission(requiredPermission);
        })
      : [];

    if (hasChildren && visibleChildren.length === 0) {
      return null;
    }

    return (
      <li key={itemKey}>
        {hasChildren ? (
          <>
            <button
              onClick={() => toggleExpanded(item.name)}
              className={cn(
                "group relative flex items-center w-full px-3 py-2.5 text-sm font-semibold leading-6 transition-all duration-200",
                isCollapsed ? "justify-center rounded-full" : "gap-x-3 rounded-full",
                isActive
                  ? "text-slate-900 bg-[#fdfefc] shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                  : "text-white/80 hover:text-white hover:bg-white/5"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  isActive ? "text-[#1c2a36]" : "text-white/70 group-hover:text-white"
                )}
                aria-hidden="true"
              />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left transition-all duration-200">
                    {item.name}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  )}
                </>
              )}
            </button>
            {!isCollapsed && isExpanded && visibleChildren.length > 0 && (
              <ul className="ml-4 mt-1 space-y-1">
                {visibleChildren.map((child) => {
                  const isChildActive = location.pathname === child.href;
                  return (
                    <li key={child.href}>
                      <Link
                        to={child.href}
                        className={cn(
                          "group relative flex items-center px-3 py-2 text-sm font-medium leading-6 transition-all duration-200 rounded-lg",
                          isChildActive
                            ? "text-slate-900 bg-[#fdfefc] shadow-[0_5px_15px_rgba(0,0,0,0.15)]"
                            : "text-white/70 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <span className="transition-all duration-200">
                          {child.name}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        ) : (
          <Link
            to={'href' in item ? item.href! : '#'}
            className={cn(
              "group relative flex items-center px-3 py-2.5 text-sm font-semibold leading-6 transition-all duration-200",
              isCollapsed ? "justify-center rounded-full" : "gap-x-3 rounded-full",
              isActive
                ? "text-slate-900 bg-[#fdfefc] shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                : "text-white/80 hover:text-white hover:bg-white/5"
            )}
            title={isCollapsed ? item.name : undefined}
          >
            {'icon' in item && item.icon && (
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  isActive ? "text-[#1c2a36]" : "text-white/70 group-hover:text-white"
                )}
                aria-hidden="true"
              />
            )}
            {!isCollapsed && (
              <span className="transition-all duration-200">
                {item.name}
              </span>
            )}
          </Link>
        )}
      </li>
    );
  };

  // Expandir automáticamente el menú de reportes si estamos en una ruta de reporte
  useMemo(() => {
    if (location.pathname.startsWith('/reports')) {
      setExpandedItems(prev => {
        const newSet = new Set(prev);
        newSet.add('Reportes');
        return newSet;
      });
    }
  }, [location.pathname]);

  return (
    <div
      className={cn(
        "flex grow flex-col gap-y-4 overflow-y-auto px-4 pb-4 pt-16 rounded-r-[2.5rem]",
        "bg-gradient-to-b from-[#2c4349] via-[#314f57] to-[#4f7f88]",
        "dark:from-[#0b141f] dark:via-[#0f1c2a] dark:to-[#192a39]",
        "backdrop-blur-2xl shadow-[inset_6px_0_18px_rgba(0,0,0,0.35)]",
        "[&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
      )}
      style={{ msOverflowStyle: 'none' } as React.CSSProperties}
    >
      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col">
          <li>
            <ul role="list" className="-mx-2 space-y-1.5">
              {filteredNavigation.map(renderNavItem)}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}
