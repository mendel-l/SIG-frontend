import { ReportRecord, AssetType, EventType, StatusType, ZoneType } from '@/types';

const empleados = [
  { nombre: 'Juan Pérez', rol: 'Técnico' },
  { nombre: 'María García', rol: 'Ingeniero' },
  { nombre: 'Carlos López', rol: 'Supervisor' },
  { nombre: 'Ana Martínez', rol: 'Técnico' },
  { nombre: 'Luis Rodríguez', rol: 'Operador' },
  { nombre: 'Elena Fernández', rol: 'Ingeniero' },
  { nombre: 'Pedro Sánchez', rol: 'Técnico' },
  { nombre: 'Laura González', rol: 'Supervisor' },
  { nombre: 'Miguel Torres', rol: 'Operador' },
  { nombre: 'Isabel Ramírez', rol: 'Técnico' },
  { nombre: 'Roberto Flores', rol: 'Ingeniero' },
  { nombre: 'Carmen Díaz', rol: 'Técnico' },
  { nombre: 'Javier Castro', rol: 'Operador' },
  { nombre: 'Sofía Morales', rol: 'Supervisor' },
  { nombre: 'Diego Ruiz', rol: 'Técnico' },
];

const activos = {
  Tanque: [
    'Tanque Central A1',
    'Tanque Norte B2',
    'Tanque Sur C3',
    'Tanque Este D4',
    'Tanque Oeste E5',
    'Tanque Reserva F6',
    'Tanque Principal G7',
    'Tanque Secundario H8',
  ],
  Tubería: [
    'Tubería Principal Línea 1',
    'Tubería Secundaria Línea 2',
    'Tubería Distribución A',
    'Tubería Distribución B',
    'Tubería Conexión Norte',
    'Tubería Conexión Sur',
    'Tubería Principal Línea 3',
    'Tubería Ramal Este',
    'Tubería Ramal Oeste',
    'Tubería Conexión Centro',
  ],
  Plomero: [
    'Válvula Reguladora 001',
    'Válvula Reguladora 002',
    'Medidor Principal M1',
    'Medidor Principal M2',
    'Válvula Control Norte',
    'Válvula Control Sur',
    'Medidor Secundario M3',
    'Válvula Seguridad V1',
  ],
};

const observaciones = [
  'Revisión rutinaria completada sin incidencias',
  'Se detectó fuga menor, reparada en sitio',
  'Presión dentro de parámetros normales',
  'Requiere seguimiento en próxima inspección',
  'Mantenimiento preventivo realizado correctamente',
  'Se reemplazaron componentes desgastados',
  'Limpieza y calibración completada',
  'Sistema operando óptimamente',
  'Se ajustó presión según especificaciones',
  'Revisión de seguridad aprobada',
  'Pendiente instalación de nuevos sensores',
  'Reparación mayor programada para próxima semana',
  'Inspección visual sin anomalías',
  'Se actualizaron registros de mantenimiento',
  'Pruebas de funcionamiento satisfactorias',
];

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomDate(daysBack: number = 90): string {
  const date = new Date();
  const randomDays = Math.floor(Math.random() * daysBack);
  date.setDate(date.getDate() - randomDays);
  return date.toISOString().split('T')[0];
}

function randomDuration(): number {
  const durations = [15, 30, 45, 60, 90, 120, 150, 180, 240, 300];
  return randomItem(durations);
}

export function generateMockReportData(count: number): ReportRecord[] {
  const records: ReportRecord[] = [];
  const assetTypes: AssetType[] = ['Tanque', 'Tubería', 'Plomero'];
  const eventTypes: EventType[] = ['Inspección', 'Mantenimiento', 'Reparación', 'Lectura'];
  const statusTypes: StatusType[] = ['OK', 'Pendiente', 'En curso', 'Cerrado'];
  const zoneTypes: ZoneType[] = ['Norte', 'Centro', 'Sur', 'Este', 'Oeste'];

  for (let i = 1; i <= count; i++) {
    const empleado = randomItem(empleados);
    const activoTipo = randomItem(assetTypes);
    const activoNombre = randomItem(activos[activoTipo]);
    const evento = randomItem(eventTypes);
    const estado = randomItem(statusTypes);
    const zona = randomItem(zoneTypes);

    records.push({
      id: i,
      fecha: randomDate(90),
      empleado_nombre: empleado.nombre,
      empleado_rol: empleado.rol,
      activo_tipo: activoTipo,
      activo_nombre: activoNombre,
      evento,
      duracion_minutos: randomDuration(),
      estado,
      zona,
      observaciones: randomItem(observaciones),
    });
  }

  // Sort by date descending
  records.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  return records;
}

export function getUniqueEmployees(records: ReportRecord[]) {
  const unique = new Map<string, { nombre: string; rol: string }>();
  
  records.forEach(record => {
    if (!unique.has(record.empleado_nombre)) {
      unique.set(record.empleado_nombre, {
        nombre: record.empleado_nombre,
        rol: record.empleado_rol,
      });
    }
  });

  return Array.from(unique.values());
}

export function getUniqueAssets(records: ReportRecord[], type?: AssetType) {
  const unique = new Map<string, { nombre: string; tipo: AssetType; zona: ZoneType }>();
  
  records.forEach(record => {
    if (!type || record.activo_tipo === type) {
      const key = `${record.activo_tipo}-${record.activo_nombre}`;
      if (!unique.has(key)) {
        unique.set(key, {
          nombre: record.activo_nombre,
          tipo: record.activo_tipo,
          zona: record.zona,
        });
      }
    }
  });

  return Array.from(unique.values());
}

