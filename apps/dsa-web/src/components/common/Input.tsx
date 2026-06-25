import type React from 'react';
import { useId, useState } from 'react';
import { Lock, Key } from 'lucide-react';
import { useUiLanguage } from '../../contexts/UiLanguageContext';
import { cn } from '../../utils/cn';
import { EyeToggleIcon } from './EyeToggleIcon';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  trailingAction?: React.ReactNode;
  /** Enables the built-in password visibility toggle. */
  allowTogglePassword?: boolean;
  /** Controls the leading icon style. */
  iconType?: 'password' | 'key' | 'none';
  /** Allows external visibility state control. */
  passwordVisible?: boolean;
  /** Notifies the parent when visibility changes in controlled mode. */
  onPasswordVisibleChange?: (visible: boolean) => void;
}

export const Input = ({
  label,
  hint,
  error,
  className = '',
  id,
  trailingAction,
  allowTogglePassword,
  iconType = 'none',
  passwordVisible,
  onPasswordVisibleChange,
  ...props
}: InputProps) => {
  const { t } = useUiLanguage();
  const generatedId = useId();
  const inputId = id ?? props.name ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [props['aria-describedby'], errorId ?? hintId].filter(Boolean).join(' ') || undefined;
  const ariaInvalid = props['aria-invalid'] ?? (error ? true : undefined);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordInput = props.type === 'password';
  const isVisibilityControlled = typeof passwordVisible === 'boolean';
  const visible = isVisibilityControlled ? passwordVisible : isPasswordVisible;
  const effectiveType = isPasswordInput && allowTogglePassword && visible ? 'text' : props.type;

  const renderLeadingIcon = () => {
    if (iconType === 'password') {
      return <Lock className="h-4 w-4 text-ink-muted" />;
    }
    if (iconType === 'key') {
      return <Key className="h-4 w-4 text-ink-muted" />;
    }
    return null;
  };

  const leadingIcon = renderLeadingIcon();

  const defaultTrailingAction = isPasswordInput && allowTogglePassword ? (
    <button
      type="button"
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30',
        visible
          ? 'border-accent/30 bg-accent/10 text-accent'
          : 'border-divider bg-surface text-ink-muted hover:border-accent/30 hover:text-accent'
      )}
      onClick={() => {
        const nextVisible = !visible;
        if (!isVisibilityControlled) {
          setIsPasswordVisible(nextVisible);
        }
        onPasswordVisibleChange?.(nextVisible);
      }}
      aria-label={visible ? t('common.hideContent') : t('common.showContent')}
      tabIndex={-1}
    >
      <EyeToggleIcon visible={visible} />
    </button>
  ) : null;

  const finalTrailingAction = trailingAction || defaultTrailingAction;

  return (
    <div className="flex flex-col">
      {label ? (
        <label
          htmlFor={inputId}
          className="mb-1.5 text-label font-medium"
        >
          {label}
        </label>
      ) : null}
      <div className="relative flex items-center">
        {leadingIcon && (
          <div className="absolute left-3.5 z-10 pointer-events-none">
            {leadingIcon}
          </div>
        )}
        <input
          id={inputId}
          aria-describedby={describedBy}
          aria-invalid={ariaInvalid}
          className={cn(
            'h-10 w-full rounded-md border border-divider bg-surface px-3 text-body transition-all placeholder:text-ink-muted',
            'focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/20',
            error ? 'border-negative focus:border-negative focus:ring-negative/20' : '',
            leadingIcon ? 'pl-10' : '',
            finalTrailingAction ? 'pr-12' : '',
            'disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-surface-2',
            className,
          )}
          {...props}
          type={effectiveType}
        />
        {finalTrailingAction ? (
          <div className="absolute inset-y-0 right-2 flex items-center">
            {finalTrailingAction}
          </div>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-label text-negative">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-2 text-label text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
};
