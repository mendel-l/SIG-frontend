// Configuración de Mapbox
export const MAPBOX_TOKEN = 'pk.eyJ1Ijoid2lsYjEyMyIsImEiOiJjbHZ2YjUya24xczFyMnFteDUwYnhqOG9vIn0.IDNtcBuRALkvGsQoyksisQ';

// Coordenadas de Palestina de Los Altos, Quetzaltenango
// Coordenadas: 14°55'55" N, 91°41'38" W
export const PALESTINA_COORDS: [number, number] = [-91.6944, 14.9319];

// Zoom inicial para el municipio (más cercano para ver el área completa)
export const INITIAL_ZOOM = 16;

// Estilo 3D de Mapbox
export const MAPBOX_STYLE = 'mapbox://styles/mapbox/standard';

// Estilos personalizados para el mapa
export const MAP_STYLES = {
  container: 'map-container',
  style: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
} as const;

