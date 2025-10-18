# 📊 UI Kit de Reportería - Guía de Integración

## 🎯 Descripción General

Este UI Kit profesional de reportería proporciona una solución completa para consultar, filtrar y exportar datos operacionales del sistema de gestión de redes de agua potable.

## ✨ Características Principales

### 🔍 Filtrado Avanzado
- **Rango de fechas** con presets rápidos (Hoy, Últimos 7 días, Este mes, etc.)
- **Filtro por empleado** con búsqueda y selección múltiple
- **Filtro por activos** (Tanques, Tuberías, Plomeros) con tabs y búsqueda
- **Chips removibles** para visualizar y quitar filtros activos

### 📋 Tabla de Datos
- Visualización de 120+ registros mock generados
- Paginación configurable (10/25/50/100 registros por página)
- Ordenamiento por columnas (ascendente/descendente)
- Búsqueda rápida con debounce (300ms)
- Estados: loading, empty, error

### 📤 Exportación
- Exportación a **PDF** (simulada)
- Exportación a **Excel/CSV** (simulada)
- Validación de datos antes de exportar
- Estados de carga con feedback visual
- Notificaciones de éxito/error

### 🎨 UI/UX Profesional
- Diseño moderno estilo **shadcn/ui**
- Modo oscuro integrado
- Responsive design (móvil, tablet, desktop)
- Animaciones suaves y micro-interacciones
- Accesibilidad (ARIA, navegación por teclado)

## 📁 Estructura de Archivos

```
SIG-frontend/
├── src/
│   ├── components/
│   │   └── reports/
│   │       ├── index.ts                    # Exportaciones
│   │       ├── FilterChips.tsx             # Chips de filtros activos
│   │       ├── DateRangeModal.tsx          # Modal de selección de fechas
│   │       ├── EmployeeFilterModal.tsx     # Modal de filtro por empleado
│   │       ├── AssetFilterModal.tsx        # Modal de filtro por activos
│   │       ├── ExportButtons.tsx           # Botones de exportación
│   │       ├── ReportsTable.tsx            # Tabla de reportes
│   │       └── FilterBar.tsx               # Barra de filtros principal
│   ├── hooks/
│   │   └── useReports.ts                   # Hook de gestión de reportes
│   ├── pages/
│   │   └── ReportsPage.tsx                 # Página principal
│   ├── types/
│   │   └── index.ts                        # Tipos extendidos
│   ├── utils/
│   │   └── mockReportData.ts               # Generador de datos mock
│   └── services/
│       └── api.ts                          # Funciones de exportación
```

## 🚀 Integración en la Aplicación

### Paso 1: Agregar la Ruta

Edita tu archivo de rutas (ej. `App.tsx` o el router que uses):

```tsx
import ReportsPage from '@/pages/ReportsPage';

// Dentro de tus rutas protegidas:
<Route path="/reports" element={<ReportsPage />} />
```

### Paso 2: Agregar el Enlace en el Sidebar

Edita `src/components/layout/Sidebar.tsx`:

```tsx
import { FileText } from 'lucide-react';

// En tu array de navItems:
{
  id: 'reports',
  label: 'Reportes',
  href: '/reports',
  icon: FileText,
}
```

### Paso 3: Verificar Dependencias

Asegúrate de tener instaladas estas dependencias (ya deberían estar):

```json
{
  "@headlessui/react": "^1.7.x",
  "lucide-react": "^0.x.x",
  "axios": "^1.x.x"
}
```

## 🎨 Personalización

### Cambiar Colores de los Estados

En `ReportsTable.tsx`, puedes personalizar los colores de los badges:

```tsx
const statusVariants: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  'OK': 'success',
  'Pendiente': 'warning',
  'En curso': 'primary',
  'Cerrado': 'default',
};
```

### Ajustar Columnas de la Tabla

En `ReportsTable.tsx`, modifica el array `columns`:

```tsx
const columns = [
  { key: 'fecha', label: 'Fecha', sortable: true, width: 'w-28' },
  // ... agregar, quitar o modificar columnas
];
```

### Cambiar Presets de Fechas

En `DateRangeModal.tsx`, personaliza los presets:

```tsx
const presets: DatePreset[] = [
  {
    label: 'Hoy',
    value: 'today',
    getRange: () => { /* ... */ }
  },
  // ... agregar más presets
];
```

## 📊 Datos Mock vs. Datos Reales

### Datos Mock (Actual)

El sistema actualmente usa datos generados por `generateMockReportData(120)` que crea 120 registros ficticios con:
- Fechas de los últimos 90 días
- Empleados variados con roles
- Diferentes tipos de activos
- Eventos y estados aleatorios
- Observaciones realistas

### Migración a Datos Reales

Para conectar con tu backend:

1. **Actualizar el hook `useReports.ts`:**

```tsx
// Reemplazar en el useEffect:
useEffect(() => {
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Llamar a tu API real
      const response = await apiService.getReports(filters);
      setRecords(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los reportes');
    } finally {
      setIsLoading(false);
    }
  };
  loadData();
}, [filters]); // Recargar cuando cambien los filtros
```

2. **Crear el endpoint en `services/api.ts`:**

```tsx
async getReports(filters?: ReportFilters): Promise<ApiResponse<ReportRecord[]>> {
  const params = new URLSearchParams();
  
  if (filters?.dateRange) {
    params.append('date_start', filters.dateRange.start);
    params.append('date_end', filters.dateRange.end);
  }
  
  // ... agregar más parámetros según filtros
  
  const response = await this.api.get(`/api/v1/reports?${params.toString()}`);
  return response.data;
}
```

3. **Actualizar `FilterBar.tsx`** para obtener empleados/activos del backend:

```tsx
// Reemplazar los datos mock por llamadas reales:
const { data: employees } = useEmployees();
const { data: tanks } = useTanks();
// ... etc.
```

## 🔧 Exportación Real (PDF/Excel)

Para implementar exportación real, instala estas librerías:

### Para PDF:
```bash
npm install jspdf jspdf-autotable
```

```tsx
// En api.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

async exportToPDF(data: ReportRecord[], filters?: any): Promise<Blob> {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('Reporte Operacional', 14, 22);
  
  autoTable(doc, {
    head: [['Fecha', 'Empleado', 'Activo', 'Evento', 'Estado']],
    body: data.map(row => [
      row.fecha,
      row.empleado_nombre,
      row.activo_nombre,
      row.evento,
      row.estado
    ]),
  });
  
  return doc.output('blob');
}
```

### Para Excel:
```bash
npm install xlsx
```

```tsx
// En api.ts
import * as XLSX from 'xlsx';

async exportToExcel(data: ReportRecord[]): Promise<Blob> {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reportes');
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}
```

## 🧪 Testing

Para probar el sistema:

1. **Navegación**: Ve a `/reports` en tu aplicación
2. **Filtros**: Prueba cada modal de filtros
3. **Búsqueda**: Usa la búsqueda rápida
4. **Ordenamiento**: Haz clic en los encabezados de columna
5. **Paginación**: Cambia el tamaño de página y navega
6. **Exportación**: Intenta exportar a PDF y Excel
7. **Responsive**: Prueba en diferentes tamaños de pantalla
8. **Dark Mode**: Alterna entre modo claro y oscuro

## 🎯 Casos de Uso

### Caso 1: Reporte Mensual de Tanques
1. Abrir modal de fechas → Seleccionar "Este mes"
2. Abrir modal de activos → Seleccionar tipo "Tanque"
3. Aplicar filtros
4. Exportar a PDF

### Caso 2: Inspecciones de un Empleado
1. Abrir modal de empleados → Buscar y seleccionar empleado
2. Abrir modal de fechas → "Últimos 7 días"
3. En la búsqueda rápida escribir "Inspección"
4. Exportar a Excel

### Caso 3: Estado de Reparaciones Pendientes
1. Sin usar modales, utilizar la búsqueda rápida
2. Escribir "Pendiente"
3. Ordenar por fecha (descendente)
4. Revisar resultados

## 📈 Métricas de Rendimiento

- **Carga inicial**: ~800ms (simulado)
- **Filtrado**: Instantáneo (client-side)
- **Búsqueda**: 300ms debounce
- **Ordenamiento**: Instantáneo
- **Exportación**: ~1.5s (simulado)

## 🔐 Seguridad

- Todos los endpoints requieren autenticación (Bearer token)
- Validación de datos en cliente y servidor
- Sanitización de inputs en búsqueda
- Control de permisos por rol (configurable)

## 🐛 Solución de Problemas

### Problema: La tabla no muestra datos
**Solución**: Verifica que el hook `useReports` se esté ejecutando correctamente y que los datos mock se estén generando.

### Problema: Los filtros no funcionan
**Solución**: Revisa que los tipos de datos en `filters` coincidan con los tipos definidos en `types/index.ts`.

### Problema: La exportación falla
**Solución**: Verifica que haya al menos 1 registro para exportar y que el servicio `apiService` esté importado correctamente.

### Problema: Estilos rotos
**Solución**: Asegúrate de que Tailwind esté configurado correctamente y que los componentes UI base existan.

## 📞 Soporte

Para más información o problemas:
- Revisa la consola del navegador para errores
- Verifica que todas las dependencias estén instaladas
- Asegúrate de que el modo dark funcione correctamente
- Comprueba que los hooks personalizados estén disponibles

## 🎉 ¡Listo para Usar!

El UI Kit está completamente funcional con datos mock. Simplemente agrega la ruta y el enlace en el sidebar para empezar a usarlo.

Para conectar con datos reales del backend, sigue las instrucciones en la sección "Migración a Datos Reales".

---

**Versión**: 1.0.0  
**Última actualización**: 2025-10-11  
**Autor**: Sistema de Gestión de Redes de Agua (UMES)

