import { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Menu as MenuIcon, Bell, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [notifications] = useState([
    { id: 1, title: 'Nueva actualización disponible', time: '2 min' },
    { id: 2, title: 'Usuario registrado', time: '5 min' },
  ]);

  const handleLogout = () => {
    logout();
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 rounded-3xl border border-white/30 bg-white/80 px-4 shadow-card-soft backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/70 sm:gap-x-6 sm:px-6 lg:mx-4 lg:mt-4 lg:px-8">
      {/* Mobile menu button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden dark:text-gray-300"
        onClick={onMenuClick}
      >
        <span className="sr-only">Abrir sidebar</span>
        <MenuIcon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden dark:bg-gray-700" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1" />
        
        {/* Right side */}
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Theme toggle */}
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleTheme}
            className="hidden sm:flex"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Notifications */}
          <Menu as="div" className="relative">
            <Menu.Button className="relative rounded-full bg-white/70 p-1 text-gray-400 shadow-sm ring-1 ring-white/50 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-mint-400 focus:ring-offset-2 dark:bg-gray-800/70 dark:ring-white/10 dark:hover:text-gray-200">
              <span className="absolute -inset-1.5" />
              <span className="sr-only">Ver notificaciones</span>
              <Bell className="h-6 w-6" aria-hidden="true" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </Menu.Button>
            <Transition
              as="div"
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-2xl border border-white/20 bg-white/90 p-1 shadow-card-soft backdrop-blur-xl focus:outline-none dark:border-white/10 dark:bg-gray-900/90">
                <div className="px-4 py-2 border-b border-white/40 dark:border-white/10">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Notificaciones
                  </h3>
                </div>
                {notifications.map((notification) => (
                  <Menu.Item key={notification.id}>
                    {({ active }) => (
                      <div
                        className={`px-4 py-3 text-sm rounded-xl ${
                          active
                            ? 'bg-white/80 dark:bg-white/10'
                            : 'bg-transparent'
                        }`}
                      >
                        <p className="text-gray-900 dark:text-white">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Hace {notification.time}
                        </p>
                      </div>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-white/40 dark:lg:bg-white/10" />

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-3 rounded-full bg-white/70 p-1 text-sm shadow-sm ring-1 ring-white/40 focus:outline-none focus:ring-2 focus:ring-mint-400 focus:ring-offset-2 dark:bg-gray-900/80 dark:ring-white/10">
              <span className="sr-only">Abrir menú de usuario</span>
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role || 'Usuario'}
                </p>
              </div>
            </Menu.Button>
            <Transition
              as="div"
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-2xl border border-white/30 bg-white/90 py-2 shadow-card-soft backdrop-blur-xl focus:outline-none dark:border-white/10 dark:bg-gray-900/90">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="/profile"
                      className={`block px-4 py-2 text-sm rounded-xl ${
                        active
                          ? 'bg-white/80 dark:bg-white/10'
                          : 'bg-transparent'
                      } text-gray-700 dark:text-gray-200`}
                    >
                      Tu perfil
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="/settings"
                      className={`block px-4 py-2 text-sm rounded-xl ${
                        active
                          ? 'bg-white/80 dark:bg-white/10'
                          : 'bg-transparent'
                      } text-gray-700 dark:text-gray-200`}
                    >
                      Configuración
                    </a>
                  )}
                </Menu.Item>
                <div className="my-2 border-t border-white/40 dark:border-white/10" />
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`block w-full text-left px-4 py-2 text-sm rounded-xl ${
                        active
                          ? 'bg-white/80 dark:bg-white/10'
                          : 'bg-transparent'
                      } text-gray-700 dark:text-gray-200`}
                    >
                      Cerrar sesión
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
}
