/**
 * Utilidad para exportar tablas HTML a PDF usando html2pdf.js
 * Preserva todos los estilos CSS automáticamente
 */
import html2pdf from 'html2pdf.js';

// Traducción de entidades al español
const ENTITY_TRANSLATIONS: Record<string, string> = {
  'user': 'Usuarios',
  'users': 'Usuarios',
  'User': 'Usuarios',
  'Users': 'Usuarios',
  'employee': 'Empleados',
  'employees': 'Empleados',
  'Employee': 'Empleados',
  'Employees': 'Empleados',
  'tank': 'Tanques',
  'tanks': 'Tanques',
  'Tank': 'Tanques',
  'Tanks': 'Tanques',
  'pipe': 'Tuberías',
  'pipes': 'Tuberías',
  'Pipe': 'Tuberías',
  'Pipes': 'Tuberías',
  'connection': 'Conexiones',
  'connections': 'Conexiones',
  'Connection': 'Conexiones',
  'Connections': 'Conexiones',
  'intervention': 'Intervenciones',
  'interventions': 'Intervenciones',
  'Intervention': 'Intervenciones',
  'Interventions': 'Intervenciones',
  'rol': 'Roles',
  'roles': 'Roles',
  'Rol': 'Roles',
  'Roles': 'Roles',
  'permission': 'Permisos',
  'permissions': 'Permisos',
  'Permission': 'Permisos',
  'Permissions': 'Permisos',
};

function translateEntity(entityName: string): string {
  return ENTITY_TRANSLATIONS[entityName] || entityName.charAt(0).toUpperCase() + entityName.slice(1);
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return dateString;
  }
}

interface ExportTableToPDFOptions {
  tableElement: HTMLElement;
  entityName?: string;
  filters?: {
    dateRange?: {
      start: string;
      end: string;
    };
    entity?: string;
  };
  totalRecords: number;
}

/**
 * Exporta una tabla HTML a PDF con encabezado profesional
 */
export async function exportTableToPDF({
  tableElement,
  entityName = 'Sistema',
  filters,
  totalRecords,
}: ExportTableToPDFOptions): Promise<void> {
  // Traducir nombre de entidad
  const entitySpanish = translateEntity(entityName);
  
  // Formatear fechas
  const genDate = new Date().toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
  
  let periodText = '';
  if (filters?.dateRange) {
    const start = formatDate(filters.dateRange.start);
    const end = formatDate(filters.dateRange.end);
    periodText = `${start} - ${end}`;
  }
  
  // Crear contenedor con encabezado y tabla
  const container = document.createElement('div');
  container.style.padding = '20px';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.backgroundColor = '#ffffff';
  
  // Encabezado del PDF
  const headerHTML = `
    <div style="
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: #ffffff;
      padding: 20px;
      text-align: center;
      border-radius: 8px;
      margin-bottom: 20px;
    ">
      <h1 style="margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 1px;">
        REPORTE DE LOGS - ${entitySpanish.toUpperCase()}
      </h1>
    </div>
    
    <div style="
      background-color: #f8fafc;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 20px;
      text-align: center;
      font-size: 11px;
      color: #6b7280;
    ">
      <div style="margin: 5px 0;">
        <strong style="color: #3b82f6;">Fecha de generación:</strong> ${genDate}
      </div>
      ${periodText ? `
        <div style="margin: 5px 0;">
          <strong style="color: #3b82f6;">Período:</strong> ${periodText}
        </div>
      ` : ''}
      <div style="margin: 5px 0;">
        <strong style="color: #3b82f6;">Total de registros:</strong> ${totalRecords}
      </div>
    </div>
  `;
  
  container.innerHTML = headerHTML;
  
  // Clonar la tabla y agregarla al contenedor
  const clonedTable = tableElement.cloneNode(true) as HTMLElement;
  clonedTable.style.width = '100%';
  clonedTable.style.marginTop = '10px';
  
  // Asegurar que la tabla tenga estilos para PDF
  const table = clonedTable.querySelector('table');
  if (table) {
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.fontSize = '9px';
  }
  
  container.appendChild(clonedTable);
  
  // Footer
  const footer = document.createElement('div');
  footer.style.marginTop = '20px';
  footer.style.textAlign = 'center';
  footer.style.fontSize = '9px';
  footer.style.color = '#6b7280';
  footer.style.borderTop = '2px solid #e2e8f0';
  footer.style.paddingTop = '10px';
  footer.innerHTML = `
    <p style="margin: 5px 0;">Sistema de Información Geográfica</p>
    <p style="margin: 5px 0;">Municipalidad de Palestina de Los Altos</p>
  `;
  container.appendChild(footer);
  
  // Configuración de PDF
  const options = {
    margin: [10, 10, 10, 10],
    filename: `reporte-${entityName}-${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      logging: false,
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'landscape' as const,
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };
  
  // Generar PDF
  await html2pdf().set(options).from(container).save();
}

