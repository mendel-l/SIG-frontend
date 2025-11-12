import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchBar({
  placeholder = 'Buscar...',
  value,
  onChange,
  className = ''
}: SearchBarProps) {
  return (
    <div className={`mb-6 flex items-center rounded-lg bg-white dark:bg-gray-800 p-4 shadow ${className}`}>
      <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="ml-3 flex-1 border-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0"
      />
    </div>
  );
}

