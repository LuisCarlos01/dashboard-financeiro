import { ReactNode } from 'react';

interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, message, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500 py-8">
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}
      {title && <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>}
      <p className="text-center text-gray-600 mb-4 max-w-md">{message}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

