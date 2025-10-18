import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { 
  X, 
  Home, 
  Map, 
  Users, 
  User, 
  Settings,
  Component,
  ChevronLeft,
  ChevronRight,
  Shield,
  Briefcase,
  FileText,
  Key,
  Wrench,
  UserCog,
  MapPin,
  Network,
  Layers
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils';

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
  
  // === SECCIÓN: GESTIÓN DE PERSONAS ===
  { name: 'Usuarios', href: '/users', icon: Users, section: 'personas' },
  { name: 'Empleados', href: '/employees', icon: Briefcase, section: 'personas' },
  
  // === SECCIÓN: ADMINISTRACIÓN Y CONFIGURACIÓN ===
  { name: 'Roles', href: '/roles', icon: Shield, section: 'admin' },
  { name: 'Permisos', href: '/permissions', icon: Key, section: 'admin' },
  { name: 'Roles-Permisos', href: '/role-permissions', icon: UserCog, section: 'admin' },
  { name: 'Tipos de Empleado', href: '/type-employee', icon: Layers, section: 'admin' },
  { name: 'Reportes', href: '/reports', icon: FileText, section: 'admin' },
  
  // === SECCIÓN: USUARIO Y SISTEMA ===
  { name: 'Perfil', href: '/profile', icon: User, section: 'sistema' },
  { name: 'Configuración', href: '/settings', icon: Settings, section: 'sistema' },
  { name: 'Componentes', href: '/components', icon: Component, section: 'sistema' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {

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
      <div className={cn(
        "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300",
        isCollapsed ? "lg:w-16" : "lg:w-64"
      )}>
        <SidebarContent 
          isCollapsed={isCollapsed} 
        />
      </div>

      {/* Floating Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className={cn(
          "hidden lg:block fixed top-4 z-50 p-2 rounded-full shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700",
          isCollapsed ? "left-16" : "left-60"
        )}
        title={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        )}
      </button>
    </>
  );
}

interface SidebarContentProps {
  isCollapsed: boolean;
}

function SidebarContent({ isCollapsed }: SidebarContentProps) {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 px-6 pb-4 shadow-lg">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center">
        <div className={cn("flex items-center transition-all duration-300", isCollapsed ? "space-x-0" : "space-x-3")}>
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="transition-all duration-300">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                SIG Municipal
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Palestina de Los Altos
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      location.pathname === item.href
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                        : 'text-gray-700 hover:text-primary-700 hover:bg-primary-50 dark:text-gray-300 dark:hover:text-primary-300 dark:hover:bg-primary-900/10',
                      'group flex rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-200',
                      isCollapsed ? 'justify-center' : 'gap-x-3'
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon
                      className={cn(
                        location.pathname === item.href
                          ? 'text-primary-700 dark:text-primary-300'
                          : 'text-gray-400 group-hover:text-primary-700 dark:text-gray-500 dark:group-hover:text-primary-300',
                        'h-6 w-6 shrink-0'
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
              ))}
            </ul>
          </li>

          {/* User info */}
          <li className="mt-auto">
            <div 
              className={cn(
                "flex items-center transition-all duration-200 cursor-pointer",
                isCollapsed ? "justify-center p-2" : "p-3 bg-gray-50 dark:bg-gray-700 rounded-lg space-x-3 hover:bg-gray-100 dark:hover:bg-gray-600"
              )}
              title={isCollapsed ? `${user?.name || 'Usuario'} - ${user?.email}` : undefined}
            >
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shrink-0">
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0 transition-all duration-200">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.name || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              )}
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}
