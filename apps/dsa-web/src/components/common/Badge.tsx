import React from 'react';
import { cn } from '../../utils/cn';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'history';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'border-divider/50 bg-surface-2 text-ink-muted',
  success: 'border-positive/25 bg-positive/10 text-positive',
  warning: 'border-caution/25 bg-caution/10 text-caution',
  danger: 'border-negative/25 bg-negative/10 text-negative',
  info: 'border-accent/30 bg-accent/10 text-accent',
  history: 'border-divider/50 bg-surface-2 text-ink-muted-80',
};

/**
 * Badge component with Apple-inspired clean styling.
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  style,
  ...rest
}) => {
  const sizeStyles = size === 'sm' ? 'px-2.5 py-0.5 text-label' : 'px-3 py-1 text-body-sm';

  return (
    <span
      {...rest}
      style={style}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        sizeStyles,
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
};
