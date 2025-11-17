import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Filter, Route, Share2 } from 'lucide-react';
import MapboxMap from '@/components/maps/MapboxMap';
import TankIcon from '@/assets/icons/TankIcon';
import { useMapData } from '@/queries/mapQueries';
import EditPipeModal from '@/components/modals/EditPipeModal';
import EditConnectionModal from '@/components/modals/EditConnectionModal';

export function MapPage() {
  const { data: tanksData = [], isLoading, error, refetch } = useMapData();
  const [selectedState, setSelectedState] = useState<string>('all');
  const [showPipes, setShowPipes] = useState(true);
  const [showConnections, setShowConnections] = useState(true);
  const [editingPipeId, setEditingPipeId] = useState<number | null>(null);
  const [editingConnectionId, setEditingConnectionId] = useState<number | null>(null);

  const filteredTanks = useMemo(() => {
    return tanksData.filter((tank) => {
      if (selectedState === 'all') return true;
      if (selectedState === 'active') return tank.state;
      if (selectedState === 'inactive') return !tank.state;
      return true;
    });
  }, [tanksData, selectedState]);

  return (
    <div className="space-y-4 lg:space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Mapa Interactivo de Infraestructura
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Vista 3D de tanques, tuberías y conexiones
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Button variant="outline" onClick={() => refetch()} disabled={isLoading} className="flex-1 sm:flex-none">
            Actualizar
          </Button>
          <Button onClick={() => window.location.href = '/tanques'} className="flex-1 sm:flex-none">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Agregar Tanque</span>
            <span className="sm:hidden">Agregar</span>
          </Button>
        </div>
      </div>

      {/* Estado de carga o error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
          Ocurrió un error al cargar los datos del mapa. {error instanceof Error ? error.message : 'Intenta nuevamente.'}
        </div>
      )}

      {/* Map Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Controles del Mapa</CardTitle>
          <CardDescription className="text-sm">
            Filtra los elementos según su estado ({filteredTanks.length} de {tanksData.length})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="input text-sm"
                disabled={isLoading}
              >
                <option value="all">Todos los estados</option>
                <option value="active">Solo activos</option>
                <option value="inactive">Solo inactivos</option>
              </select>
            </div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {isLoading ? 'Cargando datos...' : `${filteredTanks.length} tanque${filteredTanks.length === 1 ? '' : 's'} visibles`}
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <label className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                <Route className="h-4 w-4 text-blue-500" />
                <input
                  type="checkbox"
                  checked={showPipes}
                  onChange={(e) => setShowPipes(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="hidden sm:inline">Mostrar tuberías</span>
                <span className="sm:hidden">Tuberías</span>
              </label>
              <label className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                <Share2 className="h-4 w-4 text-purple-500" />
                <input
                  type="checkbox"
                  checked={showConnections}
                  onChange={(e) => setShowConnections(e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="hidden sm:inline">Mostrar conexiones</span>
                <span className="sm:hidden">Conexiones</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map and Legend Side by Side */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full">
        {/* Map */}
        <Card className="flex-1 min-w-0">
          <CardContent className="p-0">
            <div className="h-[500px] sm:h-[600px] lg:h-[700px] xl:h-[calc(100vh-250px)] 2xl:h-[calc(100vh-220px)] w-full overflow-hidden rounded-lg">
              <MapboxMap
                tanks={filteredTanks}
                isLoading={isLoading}
                showPipes={showPipes}
                showConnections={showConnections}
                onPipeClick={(pipeId) => setEditingPipeId(pipeId)}
                onConnectionClick={(connectionId) => setEditingConnectionId(connectionId)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Map Legend */}
        <Card className="lg:w-80 xl:w-96 flex-shrink-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base lg:text-lg">Leyenda</CardTitle>
            <CardDescription className="text-xs">
              Referencias visuales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 lg:space-y-5">
              {/* Tanques */}
              <div>
                <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">Tanques</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <TankIcon state={true} size={20} />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Activos
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TankIcon state={false} size={20} />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Inactivos
                    </span>
                  </div>
                </div>
              </div>

              {/* Tuberías por Material */}
              <div>
                <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">Tuberías</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-1 rounded flex-shrink-0" style={{ backgroundColor: '#3b82f6' }}></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">PVC</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-1 rounded flex-shrink-0" style={{ backgroundColor: '#10b981' }}></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Polietileno</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-1 rounded flex-shrink-0" style={{ backgroundColor: '#f59e0b' }}></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Hierro Galvanizado</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-1 rounded flex-shrink-0" style={{ backgroundColor: '#ef4444' }}></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Acero</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-1 rounded flex-shrink-0" style={{ backgroundColor: '#8b5cf6' }}></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Cobre</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-1 rounded flex-shrink-0" style={{ backgroundColor: '#6b7280' }}></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Concreto</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-1 rounded flex-shrink-0" style={{ backgroundColor: '#dc2626' }}></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Asbesto</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-1 rounded flex-shrink-0" style={{ backgroundColor: '#9ca3af' }}></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Inactivas</span>
                  </div>
                </div>
              </div>

              {/* Conexiones */}
              <div>
                <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">Conexiones</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#3b82f6' }}></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Activas
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#f97316' }}></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Inactivas
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  💡 Haz clic en cualquier elemento para ver detalles.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modales de edición */}
      <EditPipeModal
        isOpen={editingPipeId !== null}
        onClose={() => setEditingPipeId(null)}
        pipeId={editingPipeId || 0}
        onSuccess={() => {
          refetch();
          setEditingPipeId(null);
        }}
      />

      <EditConnectionModal
        isOpen={editingConnectionId !== null}
        onClose={() => setEditingConnectionId(null)}
        connectionId={editingConnectionId || 0}
        onSuccess={() => {
          refetch();
          setEditingConnectionId(null);
        }}
      />
    </div>
  );
}
