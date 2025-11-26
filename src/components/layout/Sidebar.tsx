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
  Upload
} from 'lucide-react';
import { cn } from '@/utils';
import { usePermissions } from '@/hooks/usePermissions';
import { getRoutePermission } from '@/config/permissions';

// Estructura de navegación jerárquica
const navigation = [
  // === SECCIÓN: PRINCIPAL ===
  { name: 'Dashboard', href: '/dashboard', icon: Home, section: 'principal' },
  { name: 'Mapa', href: '/map', icon: Map, section: 'principal' },
  
  // === SECCIÓN: INFRAESTRUCTURA (Tablas Fuertes) ===
  { name: 'Tanques', href: '/tanks', icon: MapPin, section: 'infraestructura' },
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
  { name: 'Reportes', href: '/reports', icon: FileText, section: 'admin' },
  
  // === SECCIÓN: USUARIO Y SISTEMA ===
  { name: 'Perfil', href: '/profile', icon: User, section: 'sistema' },
  { name: 'Configuración', href: '/settings', icon: Settings, section: 'sistema' }
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
  
  // Filtrar navegación según permisos del usuario
  const filteredNavigation = useMemo(() => {
    return navigation.filter((item) => {
      // Rutas de usuario y sistema siempre accesibles si está autenticado
      if (item.section === 'sistema') {
        return true;
      }
      
      // Obtener permiso requerido para la ruta
      const requiredPermission = getRoutePermission(item.href);
      
      // Si no hay permiso requerido definido, permitir acceso (por seguridad, mejor denegar)
      if (!requiredPermission) {
        return false;
      }
      
      // Verificar si el usuario tiene el permiso
      return hasPermission(requiredPermission);
    });
  }, [hasPermission]);

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
              {filteredNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        "group relative flex items-center px-3 py-2.5 text-sm font-semibold leading-6 transition-all duration-200",
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
                        <span className="transition-all duration-200">
                          {item.name}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}
