interface ReportHeaderProps {
  siaf?: string;
  municipality?: string;
  department?: string;
  institutionalClassification?: number;
  report?: string;
  date?: string;
  hour?: string;
  seriereport?: string;
  user?: string;
  className?: string;
}

export function ReportHeader({
  siaf,
  municipality,
  department,
  institutionalClassification,
  report,
  date,
  hour,
  seriereport,
  user,
  className = ''
}: ReportHeaderProps) {
  // No mostrar el componente si no hay datos requeridos
  if (!siaf || !report || !institutionalClassification) {
    return null;
  }

  // Formatear fecha si viene como string ISO
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-GT', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Formatear hora si viene como string
  const formatHour = (hourStr?: string) => {
    if (!hourStr) return '';
    // Si viene como "HH:MM:SS" o "HH:MM"
    if (hourStr.includes(':')) {
      return hourStr.substring(0, 5); // Tomar solo HH:MM
    }
    return hourStr;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
        {/* Lado izquierdo */}
        <div className="space-y-0.5">
          <div className="text-sm font-bold text-gray-900 dark:text-white">
            SIAF: {siaf}
          </div>
          <div className="text-sm font-bold text-gray-900 dark:text-white">
            MUNICIPALIDAD DE {municipality || 'PALESTINA DE LOS ALTOS'}
          </div>
          <div className="text-sm font-bold text-gray-900 dark:text-white">
            DEPARTAMENTO DE {department || 'QUETZALTENANGO'}
          </div>
          <div className="text-sm font-bold text-gray-900 dark:text-white">
            Clasificación institucional: {institutionalClassification}
          </div>
          <div className="text-sm font-bold text-gray-900 dark:text-white">
            Reporte: {report}
          </div>
        </div>

        {/* Lado derecho */}
        <div className="space-y-0.5">
          <div className="text-sm font-bold text-gray-900 dark:text-white">
            Fecha: {formatDate(date)}
          </div>
          <div className="text-sm font-bold text-gray-900 dark:text-white">
            Hora: {formatHour(hour)}
          </div>
          <div className="text-sm font-bold text-gray-900 dark:text-white">
            Reporte: {seriereport}
          </div>
          {user && (
            <div className="text-sm font-bold text-gray-900 dark:text-white">
              Usuario: {user}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

