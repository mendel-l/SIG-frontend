import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Filter, Route, Share2 } from 'lucide-react';
import MapboxMap from '@/components/maps/MapboxMap';
import TankIcon from '@/assets/icons/TankIcon';
import { useMapData } from '@/queries/mapQueries';

export function MapPage() {
  const { data: tanksData = [], isLoading, error, refetch } = useMapData();
  const [selectedState, setSelectedState] = useState<string>('all');
  const [showPipes, setShowPipes] = useState(true);
  const [showConnections, setShowConnections] = useState(true);

  const filteredTanks = useMemo(() => {
    return tanksData.filter((tank) => {
      if (selectedState === 'all') return true;
      if (selectedState === 'active') return tank.state;
      if (selectedState === 'inactive') return !tank.state;
      return true;
    });
  }, [tanksData, selectedState]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mapa Interactivo de Infraestructura
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Vista 3D de tanques, tuberías y conexiones
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
            Actualizar
          </Button>
          <Button onClick={() => window.location.href = '/tanques'}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Tanque
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
        <CardHeader>
          <CardTitle>Controles del Mapa</CardTitle>
          <CardDescription>
            Filtra los elementos según su estado ({filteredTanks.length} de {tanksData.length})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="input"
                disabled={isLoading}
              >
                <option value="all">Todos los estados</option>
                <option value="active">Solo activos</option>
                <option value="inactive">Solo inactivos</option>
              </select>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {isLoading ? 'Cargando datos...' : `${filteredTanks.length} tanque${filteredTanks.length === 1 ? '' : 's'} visibles`}
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                <Route className="h-4 w-4 text-blue-500" />
                <input
                  type="checkbox"
                  checked={showPipes}
                  onChange={(e) => setShowPipes(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Mostrar tuberías
              </label>
              <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                <Share2 className="h-4 w-4 text-purple-500" />
                <input
                  type="checkbox"
                  checked={showConnections}
                  onChange={(e) => setShowConnections(e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                Mostrar conexiones
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardContent className="p-0">
          <div className="h-[600px] w-full overflow-hidden rounded-lg">
            <MapboxMap
              tanks={filteredTanks}
              isLoading={isLoading}
              showPipes={showPipes}
              showConnections={showConnections}
            />
          </div>
        </CardContent>
      </Card>

      {/* Map Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Leyenda</CardTitle>
          <CardDescription>
            Referencias visuales para entender el mapa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="flex items-center space-x-2">
              <TankIcon state={true} size={24} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Tanques Activos</strong>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <TankIcon state={false} size={24} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Tanques Inactivos</strong>
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              💡 <strong>Tip:</strong> Haz clic en cualquier marcador para ver detalles.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
