import type React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'default' | 'bordered';
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Card component with Apple-inspired clean styling.
 */
export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className = '',
  style,
  variant = 'default',
  hoverable = false,
  padding = 'md',
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  const variantStyles = {
    default: 'bg-surface border border-divider',
    bordered: 'bg-surface border-2 border-accent',
  };

  const hoverStyles = hoverable
    ? 'cursor-pointer transition-shadow duration-200'
    : '';

  return (
    <div
      style={style}
      className={cn('rounded-lg', variantStyles[variant], hoverStyles, paddingStyles[padding], className)}
    >
      {(title || subtitle) && (
        <div className="mb-3">
          {subtitle ? <span className="text-label font-semibold uppercase tracking-[0.05em] text-ink-muted">{subtitle}</span> : null}
          {title ? <h3 className="mt-1 text-body font-semibold">{title}</h3> : null}
        </div>
      )}
      {children}
    </div>
  );
};
