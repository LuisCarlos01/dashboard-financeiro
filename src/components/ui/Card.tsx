import { ReactNode } from 'react';

interface CardProps {
  variant?: 'default' | 'metric' | 'hover';
  borderAccent?: 'income' | 'expense' | 'primary';
  className?: string;
  children: ReactNode;
}

export function Card({ 
  variant = 'default', 
  borderAccent,
  className = '', 
  children 
}: CardProps) {
  const baseClasses = 'card';
  
  const variantClasses = {
    default: '',
    metric: 'card-metric',
    hover: 'card-hover',
  };

  const accentClasses = {
    income: 'border-l-income-600',
    expense: 'border-l-expense-600',
    primary: 'border-l-primary-600',
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    borderAccent ? accentClasses[borderAccent] : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
}

