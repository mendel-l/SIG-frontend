import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';

interface Option {
  value: number | string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: number | string | undefined;
  onChange: (value: number | string | undefined) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  error?: string;
  loading?: boolean;
  className?: string;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  searchPlaceholder = 'Buscar...',
  disabled = false,
  error = '',
  loading = false,
  className = '',
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filtrar opciones basado en el término de búsqueda
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obtener la etiqueta de la opción seleccionada
  const selectedOption = options.find(opt => opt.value === value);

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

  const handleSelect = (optionValue: number | string) => {
    if (disabled) return;
    
    // Si se selecciona el mismo valor, deseleccionar
    if (value === optionValue) {
      onChange(undefined);
    } else {
      onChange(optionValue);
    }
    
    setIsOpen(false);
    setSearchTerm('');
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    
    onChange(undefined);
  };

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
          <span className={selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className="flex items-center gap-1">
            {value !== undefined && !disabled && (
              <button
                type="button"
                onClick={clearSelection}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
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
                  const isSelected = value === option.value;
                  return (
                    <div
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
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

