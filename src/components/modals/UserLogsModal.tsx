import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Badge } from '@/components/ui/Badge';
import { useLogs } from '@/hooks/useLogs';

interface UserLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export function UserLogsModal({ isOpen, onClose, userName }: UserLogsModalProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'logs'>('summary');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 días atrás
    end: new Date().toISOString().split('T')[0] // hoy
  });
  const [selectedEntity, setSelectedEntity] = useState('users');
  
  // Usar el hook de Zustand
  const {
    logs,
    summary,
    availableEntities,
    isLoading,
    loadLogsData,
    reset
  } = useLogs({ autoFetch: false });

  // Cargar datos cuando el modal se abre o cambian los filtros
  useEffect(() => {
    if (!isOpen) return;
    
    loadLogsData(dateRange.start, dateRange.end, selectedEntity).catch((error) => {
      console.error('Error loading logs:', error);
    });
    
    // ESLint ignore porque loadLogsData es estable desde el hook
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, dateRange.start, dateRange.end, selectedEntity]);

  // Limpiar estado cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
    // ESLint ignore porque reset es estable desde el hook
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleRefresh = async () => {
    await loadLogsData(dateRange.start, dateRange.end, selectedEntity);
  };

  const formatDate = (dateString: string) => {
    try {
      // Manejar diferentes formatos de fecha que puede devolver el backend
      const date = new Date(dateString);
      
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        console.warn('Fecha inválida recibida:', dateString);
        return 'Fecha inválida';
      }
      
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      console.error('Error formateando fecha:', dateString, error);
      return 'Error de fecha';
    }
  };

  const getActionBadgeColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
        return 'success';
      case 'logout':
        return 'warning';
      case 'create':
        return 'primary';
      case 'update':
        return 'secondary';
      case 'delete':
        return 'danger';
      case 'read':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  // Función para traducir las acciones al español
  const translateAction = (action: string) => {
    switch (action.toLowerCase()) {
      case 'read':
        return 'LISTAR';
      case 'create':
        return 'CREAR';
      case 'update':
        return 'ACTUALIZAR';
      case 'delete':
        return 'ELIMINAR';
      case 'login':
        return 'INICIAR SESIÓN';
      case 'logout':
        return 'CERRAR SESIÓN';
      default:
        return action.toUpperCase();
    }
  };

  const renderSummary = () => {
    if (!summary) return null;

    return (
      <div className="space-y-6">
        {/* Información del rango de fechas y entidad */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-2">Filtros aplicados</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Entidad:</span> {summary.entity || selectedEntity}
            </div>
            <div>
              <span className="font-medium">Desde:</span> {summary.date_range?.start ? formatDate(summary.date_range.start) : dateRange.start}
            </div>
            <div>
              <span className="font-medium">Hasta:</span> {summary.date_range?.finish ? formatDate(summary.date_range.finish) : dateRange.end}
            </div>
          </div>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {summary.total_logs || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total de Registros
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {summary.actions_summary?.length || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Tipos de Acciones
            </div>
          </div>
        </div>

        {/* Resumen de acciones */}
        {summary.actions_summary && summary.actions_summary.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-3">Resumen por Acciones</h4>
            <div className="space-y-2">
              {summary.actions_summary.map((action: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Badge variant={getActionBadgeColor(action.action)}>
                      {translateAction(action.action)}
                    </Badge>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {action.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderLogs = () => {
    if (logs.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="text-gray-500 dark:text-gray-400">
            No hay logs disponibles para este usuario
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {logs.map((log, index) => {
          console.log('🔍 Log data:', log, 'log_id:', log.log_id);
          return (
          <div key={log.log_id || `log-${index}`} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={getActionBadgeColor(log.action)}>
                    {translateAction(log.action)}
                  </Badge>
                  {log.entity && (
                    <Badge variant="secondary">
                      {log.entity.toUpperCase()}
                    </Badge>
                  )}
                </div>
                
                {log.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {log.description}
                  </p>
                )}
                
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {log.created_at ? formatDate(log.created_at) : 'Sin fecha'}
                </div>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="space-y-6">
        {/* Título del modal */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Logs de {userName}
          </h2>
        </div>
        {/* Controles de filtro */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold">Filtros</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Selector de entidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Entidad
              </label>
              <select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {availableEntities.map((entity) => (
                  <option key={entity} value={entity}>
                    {entity.charAt(0).toUpperCase() + entity.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha inicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Fecha fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha Fin
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleRefresh}
              disabled={isLoading}
              variant="primary"
              size="sm"
            >
              {isLoading ? 'Cargando...' : 'Actualizar'}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'summary'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Resumen
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'logs'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Logs Detallados
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {activeTab === 'summary' && renderSummary()}
            {activeTab === 'logs' && renderLogs()}
          </>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
