import { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: ReactNode;
  action?: ReactNode;
  showAddButton?: boolean;
  onAddClick?: () => void;
}

export function EmptyState({ 
  title, 
  message, 
  icon, 
  action,
  showAddButton = false,
  onAddClick
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-neutral-500 py-8">
      {icon && (
        <div className="mb-4 text-neutral-400">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="text-lg font-semibold text-neutral-700 mb-2">
          {title}
        </h3>
      )}
      <p className="text-center text-neutral-600 mb-4 max-w-md text-sm">
        {message}
      </p>
      {action && <div className="mt-2">{action}</div>}
      {showAddButton && onAddClick && !action && (
        <Button variant="primary" onClick={onAddClick}>
          Adicionar Transação
        </Button>
      )}
    </div>
  );
}

