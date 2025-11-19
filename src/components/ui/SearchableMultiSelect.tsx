import { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronDown, Check } from 'lucide-react';

interface Option {
  value: number | string;
  label: string;
}

interface SearchableMultiSelectProps {
  options: Option[];
  selectedValues: (number | string)[];
  onChange: (values: (number | string)[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  error?: string;
  loading?: boolean;
  className?: string;
}

export default function SearchableMultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder = 'Seleccionar...',
  searchPlaceholder = 'Buscar...',
  disabled = false,
  error = '',
  loading = false,
  className = '',
}: SearchableMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filtrar opciones basado en el término de búsqueda
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Enfocar el input de búsqueda cuando se abre
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleSelection = (value: number | string) => {
    if (disabled) return;

    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    
    onChange(newValues);
  };

  const removeSelection = (value: number | string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    
    onChange(selectedValues.filter(v => v !== value));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    
    onChange([]);
  };

  const selectedLabels = selectedValues
    .map(val => options.find(opt => opt.value === val)?.label)
    .filter(Boolean) as string[];

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Input trigger */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
          focus:outline-none focus:ring-0 text-gray-900 dark:text-white
          cursor-pointer
          ${error
            ? 'border-red-300 dark:border-red-600 focus:border-red-500 bg-red-50 dark:bg-red-900/20'
            : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isOpen ? 'border-blue-500 dark:border-blue-400' : ''}
        `}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 flex items-center gap-2 flex-wrap min-h-[24px]">
            {selectedValues.length === 0 ? (
              <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
            ) : (
              <>
                {selectedLabels.slice(0, 2).map((label, idx) => {
                  const value = selectedValues[idx];
                  return (
                    <span
                      key={value}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-md text-sm"
                    >
                      {label}
                      {!disabled && (
                        <button
                          type="button"
                          onClick={(e) => removeSelection(value, e)}
                          className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  );
                })}
                {selectedValues.length > 2 && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    +{selectedValues.length - 2} más
                  </span>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-1">
            {selectedValues.length > 0 && !disabled && (
              <button
                type="button"
                onClick={clearAll}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
            )}
            <ChevronDown
              className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${
                isOpen ? 'transform rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-lg max-h-80 overflow-hidden flex flex-col">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Options list */}
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Cargando...
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                {searchTerm ? 'No se encontraron resultados' : 'No hay opciones disponibles'}
              </div>
            ) : (
              <div className="py-1">
                {filteredOptions.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      onClick={() => toggleSelection(option.value)}
                      className={`
                        px-4 py-2 cursor-pointer flex items-center justify-between
                        hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                        ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                      `}
                    >
                      <span className="text-gray-900 dark:text-gray-100">
                        {option.label}
                      </span>
                      {isSelected && (
                        <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

