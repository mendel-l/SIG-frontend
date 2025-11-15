import { ReactNode, useState, useRef, useEffect } from 'react';
import { cn } from '@/utils';
import { BaseComponentProps } from '@/types';

interface DropdownProps extends BaseComponentProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right';
}

export function Dropdown({ trigger, children, align = 'left', className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignClasses = {
    left: 'left-0',
    right: 'right-0',
  };

  return (
    <div className={cn('relative inline-block', className)} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div className={cn(
          'absolute z-50 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1',
          alignClasses[align]
        )}>
          {children}
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps extends BaseComponentProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
}

export function DropdownItem({ 
  children, 
  onClick, 
  disabled = false, 
  icon, 
  className 
}: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {icon && <span className="mr-3 h-4 w-4">{icon}</span>}
      {children}
    </button>
  );
}

interface DropdownSeparatorProps extends BaseComponentProps {}

export function DropdownSeparator({ className }: DropdownSeparatorProps) {
  return (
    <div className={cn('my-1 border-t border-gray-200 dark:border-gray-600', className)} />
  );
}

interface DropdownLabelProps extends BaseComponentProps {
  children: ReactNode;
}

export function DropdownLabel({ children, className }: DropdownLabelProps) {
  return (
    <div className={cn('px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide', className)}>
      {children}
    </div>
  );
}
