import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Filter } from 'lucide-react';
import MapboxMap from '@/components/maps/MapboxMap';
import { useTanks } from '@/hooks/useTanks';
import TankIcon from '@/assets/icons/TankIcon';

export function MapPage() {
  const { tanks } = useTanks();
  const [selectedState, setSelectedState] = useState<string>('all');

  // Filtrar tanques según estado
  const filteredTanks = tanks.filter(tank => {
    const matchesState = selectedState === 'all' || 
                        (selectedState === 'active' && tank.state) ||
                        (selectedState === 'inactive' && !tank.state);
    
    return matchesState;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mapa Interactivo de Tanques
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Vista 3D del relieve - Palestina de Los Altos
          </p>
        </div>
        <Button onClick={() => window.location.href = '/tanques'}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Tanque
        </Button>
      </div>

      {/* Map Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Controles del Mapa</CardTitle>
          <CardDescription>
            Filtrar tanques por estado ({filteredTanks.length} {filteredTanks.length === 1 ? 'tanque' : 'tanques'} {selectedState !== 'all' ? 'filtrados' : 'en total'})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="input"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Solo activos</option>
              <option value="inactive">Solo inactivos</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardContent className="p-0">
          <div className="h-[600px] w-full overflow-hidden rounded-lg">
            <MapboxMap tanks={filteredTanks} />
          </div>
        </CardContent>
      </Card>

      {/* Map Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Leyenda</CardTitle>
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
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                💡 <strong>Tip:</strong> Haz clic en cualquier marcador para ver detalles
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
