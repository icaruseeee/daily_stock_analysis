import type React from 'react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  /** Metric label, such as "Total Return". */
  label: string;
  /** Metric value, including numbers or percentages. */
  value: React.ReactNode;
  /** Supporting text, such as "Up 5% vs last month". */
  hint?: React.ReactNode;
  /** Optional trailing icon. */
  icon?: React.ReactNode;
  /** Tone variant that affects the border color. */
  tone?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /** Optional extra className. */
  className?: string;
}

const toneStyles = {
  default: 'border-divider',
  primary: 'border-l-[3px] border-l-accent border-t border-r border-b border-divider',
  success: 'border-l-[3px] border-l-positive border-t border-r border-b border-divider',
  warning: 'border-l-[3px] border-l-caution border-t border-r border-b border-divider',
  danger: 'border-l-[3px] border-l-negative border-t border-r border-b border-divider',
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  hint,
  icon,
  tone = 'default',
  className = '',
}) => {
  return (
    <div className={cn('rounded-lg border bg-surface p-4', toneStyles[tone], className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-label uppercase tracking-[0.05em] text-ink-muted">{label}</p>
          <div className="mt-2 text-2xl font-semibold">{value}</div>
          {hint ? <div className="mt-2 text-body-sm text-ink-muted">{hint}</div> : null}
        </div>
        {icon ? <div className="text-accent">{icon}</div> : null}
      </div>
    </div>
  );
};
