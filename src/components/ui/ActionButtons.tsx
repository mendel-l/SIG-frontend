import React from 'react';
import { Edit, Power, Trash2, Eye, MoreVertical } from 'lucide-react';
import { Button } from './Button';
import { Tooltip } from './Tooltip';

export interface ActionButtonsProps {
  // Acciones básicas
  onEdit?: () => void;
  onToggleStatus?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  onMore?: () => void;
  
  // Estado y configuración
  isActive?: boolean;
  loading?: boolean;
  
  // Control de visibilidad
  showEdit?: boolean;
  showToggleStatus?: boolean;
  showDelete?: boolean;
  showView?: boolean;
  showMore?: boolean;
  
  // Personalización
  editLabel?: string;
  toggleStatusLabel?: string;
  deleteLabel?: string;
  viewLabel?: string;
  className?: string;
  
  // Variantes
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'icon-only';
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onEdit,
  onToggleStatus,
  onDelete,
  onView,
  onMore,
  isActive = true,
  loading = false,
  showEdit = true,
  showToggleStatus = true,
  showDelete = false,
  showView = false,
  showMore = false,
  editLabel = 'Editar',
  toggleStatusLabel,
  deleteLabel = 'Eliminar',
  viewLabel = 'Ver',
  className = '',
  size = 'sm',
  variant = 'default',
}) => {
  // Determinar etiqueta para toggle status
  const statusLabel = toggleStatusLabel || (isActive ? 'Desactivar' : 'Activar');
  
  // Tamaños de iconos
  const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6';
  const buttonPadding = size === 'sm' ? 'px-2 py-1' : size === 'md' ? 'px-3 py-1.5' : 'px-4 py-2';
  
  // Renderizar botón con tooltip
  const renderButton = (
    onClick: (() => void) | undefined,
    icon: React.ReactNode,
    label: string,
    buttonVariant: 'secondary' | 'danger' | 'success' | 'primary' = 'secondary',
    disabled: boolean = false
  ) => {
    if (!onClick) return null;
    
    const button = (
      <Button
        variant={buttonVariant}
        size={size}
        onClick={onClick}
        disabled={disabled || loading}
        className={`${buttonPadding} ${variant === 'minimal' ? 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700' : ''}`}
        aria-label={label}
      >
        {icon}
        {variant !== 'icon-only' && <span className="sr-only">{label}</span>}
      </Button>
    );
    
    // Si es variant minimal o icon-only, mostrar tooltip
    if (variant === 'minimal' || variant === 'icon-only') {
      return (
        <Tooltip content={label}>
          {button}
        </Tooltip>
      );
    }
    
    return button;
  };
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showView && renderButton(
        onView,
        <Eye className={iconSize} />,
        viewLabel,
        variant === 'minimal' ? 'secondary' : 'primary',
        loading
      )}
      
      {showEdit && renderButton(
        onEdit,
        <Edit className={iconSize} />,
        editLabel,
        variant === 'minimal' ? 'secondary' : 'secondary',
        loading
      )}
      
      {showToggleStatus && renderButton(
        onToggleStatus,
        <Power className={iconSize} />,
        statusLabel,
        variant === 'minimal' ? 'secondary' : (isActive ? 'danger' : 'success'),
        loading
      )}
      
      {showDelete && renderButton(
        onDelete,
        <Trash2 className={iconSize} />,
        deleteLabel,
        variant === 'minimal' ? 'secondary' : 'danger',
        loading
      )}
      
      {showMore && onMore && (
        <Tooltip content="Más opciones">
          <Button
            variant="secondary"
            size={size}
            onClick={onMore}
            disabled={loading}
            className={buttonPadding}
            aria-label="Más opciones"
          >
            <MoreVertical className={iconSize} />
          </Button>
        </Tooltip>
      )}
    </div>
  );
};

export default ActionButtons;