import React from 'react';
import { useUiLanguage } from '../../contexts/UiLanguageContext';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'danger-subtle';
  size?: 'xsm' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  /** Custom loading text. */
  loadingText?: string;
}

const BUTTON_SIZE_STYLES = {
  xsm: 'h-6 rounded-full px-2.5 text-label',
  sm: 'h-7 rounded-full px-3 text-body-sm',
  md: 'h-9 rounded-full px-4 text-body',
  lg: 'h-10 rounded-full px-5 text-body',
  xl: 'h-11 rounded-full px-6 text-body',
} as const;

const BUTTON_VARIANT_STYLES = {
  primary: 'border border-accent bg-accent text-on-accent hover:brightness-90 active:scale-95',
  secondary: 'border border-divider bg-surface hover:bg-surface-2 active:scale-95',
  outline: 'border border-accent/30 bg-transparent text-accent hover:bg-accent/8 active:scale-95',
  ghost: 'border border-transparent bg-transparent text-ink-muted hover:bg-surface-2 active:scale-95',
  danger: 'border border-negative/40 bg-negative text-white hover:brightness-90 active:scale-95',
  'danger-subtle': 'border border-negative/50 bg-negative/10 text-negative hover:bg-negative/15 active:scale-95',
} as const;

/**
 * Button component with multiple variants and terminal-inspired styling.
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  className = '',
  disabled,
  type = 'button',
  ...props
}) => {
  const { t } = useUiLanguage();

  return (
    <button
      type={type}
      aria-busy={isLoading || undefined}
      data-variant={variant}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-2 font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30 focus-visible:ring-offset-0',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none',
        BUTTON_SIZE_STYLES[size],
        BUTTON_VARIANT_STYLES[variant],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="h-4 w-4 animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingText ?? t('common.processing')}
        </span>
      ) : (
        children
      )}
    </button>
  );
};
