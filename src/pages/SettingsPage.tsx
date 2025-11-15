import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { useNotifications } from '@/hooks/useNotifications';
import { 
  Palette, 
  Bell, 
  Shield, 
  Database, 
  Download,
  Upload,
  Save,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { showSuccess, showInfo } = useNotifications();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showLastSeen: true,
    allowMessages: true,
  });

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as any);
    showSuccess('Tema actualizado', `El tema ha sido cambiado a ${newTheme === 'light' ? 'claro' : newTheme === 'dark' ? 'oscuro' : 'sistema'}`);
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    const notificationTypes = {
      email: 'notificaciones por email',
      push: 'notificaciones push',
      sms: 'notificaciones SMS'
    };
    showSuccess(
      'Configuración actualizada', 
      `Las ${notificationTypes[key as keyof typeof notificationTypes]} han sido ${value ? 'activadas' : 'desactivadas'}`
    );
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
    const privacyTypes = {
      profileVisible: 'visibilidad del perfil',
      showLastSeen: 'última conexión',
      allowMessages: 'mensajes directos'
    };
    showInfo(
      'Configuración de privacidad actualizada', 
      `La opción de ${privacyTypes[key as keyof typeof privacyTypes]} ha sido ${value ? 'activada' : 'desactivada'}`
    );
  };

  const handleExport = () => {
    showSuccess('Datos exportados exitosamente', 'Tu información ha sido descargada en formato JSON');
  };

  const handleImport = () => {
    showInfo('Datos importados exitosamente', 'Tu configuración ha sido restaurada desde el archivo');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Configuración
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Personaliza tu experiencia en el sistema
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Apariencia
            </CardTitle>
            <CardDescription>
              Personaliza el tema y colores del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="label mb-3 block">Tema</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    theme === 'light'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-gray-900 dark:text-gray-100'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <Sun className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm">Claro</span>
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    theme === 'dark'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-gray-900 dark:text-gray-100'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <Moon className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm">Oscuro</span>
                </button>
                <button
                  onClick={() => handleThemeChange('system')}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    theme === 'system'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-gray-900 dark:text-gray-100'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <Monitor className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm">Sistema</span>
                </button>
              </div>
            </div>

            <div>
              <label className="label mb-2 block">Color Primario</label>
              <div className="grid grid-cols-6 gap-2">
                {[
                  '#3b82f6', // Blue
                  '#ef4444', // Red
                  '#10b981', // Green
                  '#f59e0b', // Yellow
                  '#8b5cf6', // Purple
                  '#ec4899', // Pink
                ].map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notificaciones
            </CardTitle>
            <CardDescription>
              Configura cómo recibir notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Notificaciones por Email</p>
                  <p className="text-xs text-gray-500">Recibe notificaciones importantes por email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) => handleNotificationChange('email', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Notificaciones Push</p>
                  <p className="text-xs text-gray-500">Recibe notificaciones en tiempo real</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={(e) => handleNotificationChange('push', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Notificaciones SMS</p>
                  <p className="text-xs text-gray-500">Recibe notificaciones por mensaje de texto</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.sms}
                    onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Privacidad
            </CardTitle>
            <CardDescription>
              Controla tu privacidad y visibilidad
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Perfil Visible</p>
                  <p className="text-xs text-gray-500">Permite que otros usuarios vean tu perfil</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.profileVisible}
                    onChange={(e) => handlePrivacyChange('profileVisible', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Mostrar Última Conexión</p>
                  <p className="text-xs text-gray-500">Permite que otros vean cuándo estuviste en línea</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.showLastSeen}
                    onChange={(e) => handlePrivacyChange('showLastSeen', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Permitir Mensajes</p>
                  <p className="text-xs text-gray-500">Permite que otros usuarios te envíen mensajes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.allowMessages}
                    onChange={(e) => handlePrivacyChange('allowMessages', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Gestión de Datos
            </CardTitle>
            <CardDescription>
              Exporta o importa tus datos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button onClick={handleExport} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Exportar Datos
              </Button>
              <Button onClick={handleImport} variant="secondary" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Importar Datos
              </Button>
            </div>
            
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <p className="text-sm text-yellow-900 dark:text-yellow-100">
                <strong>Nota:</strong> La exportación incluye todos tus datos personales y configuraciones.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Guardar Todas las Configuraciones
        </Button>
      </div>
    </div>
  );
}
