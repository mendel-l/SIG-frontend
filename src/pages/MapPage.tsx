import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Plus, Search, Filter } from 'lucide-react';

// Mock data for markers
const mockMarkers = [
  {
    id: 1,
    position: [14.6349, -90.5069], // Guatemala City coordinates
    title: 'Oficina Municipal',
    description: 'Edificio principal de la municipalidad',
    type: 'building'
  },
  {
    id: 2,
    position: [14.6359, -90.5079],
    title: 'Centro de Salud',
    description: 'Centro de salud comunitario',
    type: 'service'
  },
  {
    id: 3,
    position: [14.6369, -90.5089],
    title: 'Escuela Primaria',
    description: 'Escuela primaria del municipio',
    type: 'service'
  },
  {
    id: 4,
    position: [14.6379, -90.5099],
    title: 'Parque Central',
    description: 'Parque principal del municipio',
    type: 'landmark'
  }
];

export function MapPage() {
  const [markers] = useState(mockMarkers);
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredMarkers = selectedType === 'all' 
    ? markers 
    : markers.filter(marker => marker.type === selectedType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mapa Interactivo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explora las ubicaciones del municipio
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Ubicación
        </Button>
      </div>

      {/* Map Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Controles del Mapa</CardTitle>
          <CardDescription>
            Filtra y busca ubicaciones específicas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar ubicaciones..."
                  className="input pl-10 w-full"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="input"
              >
                <option value="all">Todos los tipos</option>
                <option value="building">Edificios</option>
                <option value="service">Servicios</option>
                <option value="landmark">Puntos de interés</option>
                <option value="emergency">Emergencias</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardContent className="p-0">
          <div className="h-96 w-full">
            <MapContainer
              center={[14.6349, -90.5069]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              className="rounded-lg"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {filteredMarkers.map((marker) => (
                <Marker key={marker.id} position={marker.position as [number, number]}>
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {marker.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {marker.description}
                      </p>
                      <div className="mt-2 flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-primary-600" />
                        <span className="text-xs text-primary-600">
                          {marker.type}
                        </span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* Map Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Leyenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Edificios</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Servicios</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Puntos de interés</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Emergencias</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
