import { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'income' | 'expense' | 'warning' | 'success' | 'default';
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const variantClasses = {
    default: 'bg-neutral-100 text-neutral-700',
    income: 'badge-income',
    expense: 'badge-expense',
    warning: 'badge-warning',
    success: 'badge-success',
  };

  return (
    <span className={`badge ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}

