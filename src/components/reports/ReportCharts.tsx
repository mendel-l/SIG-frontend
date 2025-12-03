import { Card } from '@/components/ui/Card';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ReportChartsProps {
  data: ChartDataPoint[];
  title?: string;
  type?: 'bar' | 'pie' | 'line';
  height?: number;
}

export function ReportCharts({ data, title, type = 'bar', height = 300 }: ReportChartsProps) {
  if (data.length === 0) {
    return (
      <Card className="p-8">
        <p className="text-center text-gray-500 dark:text-gray-400">No hay datos para mostrar</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      )}
      <div style={{ height: `${height}px` }} className="flex items-center justify-center">
        {/* Placeholder para gráficos - En producción se puede integrar Chart.js, Recharts, etc. */}
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="mb-2">Gráfico {type}</p>
          <p className="text-sm">Integrar librería de gráficos (Chart.js, Recharts, etc.)</p>
        </div>
      </div>
    </Card>
  );
}

