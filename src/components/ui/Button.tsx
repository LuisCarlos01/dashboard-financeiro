import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'danger' | 'secondary' | 'outline';
  children: ReactNode;
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const variantClasses = {
    primary: 'btn-primary',
    success: 'btn-success',
    danger: 'btn-danger',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
  };

  return (
    <button
      className={`btn ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

