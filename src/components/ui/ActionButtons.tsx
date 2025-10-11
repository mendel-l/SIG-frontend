import React from 'react';
import { Edit, Power } from 'lucide-react';
import { Button } from './Button';

export interface ActionButtonsProps {
  onEdit?: () => void;
  onToggleStatus?: () => void;
  isActive?: boolean;
  loading?: boolean;
  showEdit?: boolean;
  showToggleStatus?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onEdit,
  onToggleStatus,
  isActive = true,
  loading = false,
  showEdit = true,
  showToggleStatus = true,
}) => {
  return (
    <div className="flex items-center space-x-2">
      {showEdit && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onEdit}
          disabled={loading}
          className="px-2 py-1"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      
      {showToggleStatus && (
        <Button
          variant={isActive ? "danger" : "success"}
          size="sm"
          onClick={onToggleStatus}
          disabled={loading}
          className="px-2 py-1"
        >
          <Power className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;