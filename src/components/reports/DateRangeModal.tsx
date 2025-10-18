import { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Calendar } from 'lucide-react';

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (start: string, end: string) => void;
  initialStart?: string;
  initialEnd?: string;
}

type PresetValue = 'today' | 'last7days' | 'thisMonth' | 'lastMonth' | 'last3months' | 'custom';

interface DatePreset {
  label: string;
  value: PresetValue;
  getRange: () => { start: string; end: string };
}

const presets: DatePreset[] = [
  {
    label: 'Hoy',
    value: 'today',
    getRange: () => {
      const today = new Date().toISOString().split('T')[0];
      return { start: today, end: today };
    },
  },
  {
    label: 'Últimos 7 días',
    value: 'last7days',
    getRange: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 7);
      return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
      };
    },
  },
  {
    label: 'Este mes',
    value: 'thisMonth',
    getRange: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
      };
    },
  },
  {
    label: 'Mes pasado',
    value: 'lastMonth',
    getRange: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
      };
    },
  },
  {
    label: 'Últimos 3 meses',
    value: 'last3months',
    getRange: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 3);
      return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
      };
    },
  },
  {
    label: 'Personalizado',
    value: 'custom',
    getRange: () => ({ start: '', end: '' }),
  },
];

export function DateRangeModal({
  isOpen,
  onClose,
  onApply,
  initialStart,
  initialEnd,
}: DateRangeModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<PresetValue>('last7days');
  const [startDate, setStartDate] = useState(initialStart || '');
  const [endDate, setEndDate] = useState(initialEnd || '');

  const handlePresetClick = (preset: DatePreset) => {
    setSelectedPreset(preset.value);
    if (preset.value !== 'custom') {
      const range = preset.getRange();
      setStartDate(range.start);
      setEndDate(range.end);
    }
  };

  const handleApply = () => {
    if (!startDate || !endDate) {
      return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
      alert('La fecha de inicio debe ser anterior a la fecha final');
      return;
    }

    onApply(startDate, endDate);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalHeader>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          <span>Seleccionar Rango de Fechas</span>
        </div>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-6">
          {/* Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Rápido
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handlePresetClick(preset)}
                  className={`px-4 py-2.5 text-sm font-medium rounded-lg border-2 transition-all ${
                    selectedPreset === preset.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom date inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Fecha de inicio"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setSelectedPreset('custom');
              }}
              max={endDate || undefined}
            />
            <Input
              type="date"
              label="Fecha final"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setSelectedPreset('custom');
              }}
              min={startDate || undefined}
            />
          </div>

          {startDate && endDate && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Rango seleccionado: </span>
                {new Date(startDate).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                -{' '}
                {new Date(endDate).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="secondary" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleApply}
          disabled={!startDate || !endDate}
        >
          Aplicar
        </Button>
      </ModalFooter>
    </Modal>
  );
}

