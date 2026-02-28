"use client"

/**
 * @deprecated Use @/components/ui/button instead
 * This component will be removed in the next major version.
 * Migration guide: /docs/migrations/button-migration.md
 */

import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * @deprecated Use @/components/ui/button instead
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth = false,
  className = '',
  ...props
}) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn('ButtonLegacy is deprecated. Use @/components/ui/button instead.');
  }
  const baseClasses = `btn btn-${variant} btn-${size} ${fullWidth ? 'w-full' : ''} ${className}`;

  return (
    <button className={baseClasses} {...props}>
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
};
