/**
 * Stock search suggestion list.
 */

import type { CSSProperties } from 'react';
import type { StockSuggestion } from '../../types/stockIndex';
import { Badge } from '../common';
import { cn } from '../../utils/cn';

export interface SuggestionsListProps {
  /** Suggestion list */
  suggestions: StockSuggestion[];
  /** Highlighted index */
  highlightedIndex: number;
  /** Selection callback */
  onSelect: (suggestion: StockSuggestion) => void;
  /** Mouse hover callback */
  onMouseEnter: (index: number) => void;
  /** Custom style (for Portal fixed positioning) */
  style?: CSSProperties;
}

export function SuggestionsList({
  suggestions,
  highlightedIndex,
  onSelect,
  onMouseEnter,
  style,
}: SuggestionsListProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <ul
      id="suggestions-list"
      className="z-[100] border-x border-b rounded-b-lg rounded-t-none max-h-60 overflow-auto bg-surface/95 border-accent"
      style={{
        ...style,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3), -4px 0 15px -3px rgba(0, 0, 0, 0.2), 4px 0 15px -3px rgba(0, 0, 0, 0.2)',
      }}
      role="listbox"
    >
      {suggestions.map((suggestion, index) => (
        <li
          key={suggestion.canonicalCode}
          role="option"
          aria-selected={index === highlightedIndex}
          className={cn(
            'px-4 py-1 cursor-pointer flex items-center justify-between',
            'hover:bg-black/5',
            index === highlightedIndex && 'bg-black/5',
          )}
          onClick={() => onSelect(suggestion)}
          onMouseEnter={() => onMouseEnter(index)}
        >
          <div className="flex items-center gap-3">
            <MarketBadge market={suggestion.market} />

            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {suggestion.nameZh}
              </span>
              <span className="text-sm text-ink-muted">
                {suggestion.displayCode}
              </span>
            </div>
          </div>

          <MatchTypeBadge matchType={suggestion.matchType} />
        </li>
      ))}
    </ul>
  );
}

const MARKET_BADGE_CONFIG = {
  CN: { label: 'A股', className: 'border-negative/25 bg-negative/10 text-negative' },
  HK: { label: '港股', className: 'border-positive/25 bg-positive/10 text-positive' },
  US: { label: '美股', className: 'border-accent/25 bg-accent/10 text-accent' },
  JP: { label: '日股', className: 'border-indigo-500/25 bg-indigo-500/10 text-indigo-500' },
  KR: { label: '韩股', className: 'border-rose-500/25 bg-rose-500/10 text-rose-500' },
  INDEX: { label: '指数', className: 'border-accent/25 bg-accent/10 text-accent' },
  ETF: { label: 'ETF', className: 'border-caution/25 bg-caution/10 text-caution' },
  BSE: { label: '北交所', className: 'border-orange-500/25 bg-orange-500/10 text-orange-500' },
} as const;

function MarketBadge({ market }: { market: string }) {
  const config = MARKET_BADGE_CONFIG[market as keyof typeof MARKET_BADGE_CONFIG];

  if (!config) {
    throw new Error(`Unsupported market in stock suggestion: ${market}`);
  }

  return (
    <Badge variant="default" size="sm" className={cn('min-w-[3rem] justify-center shadow-none', config.className)}>
      {config.label}
    </Badge>
  );
}

function MatchTypeBadge({ matchType }: { matchType: string }) {
  const configMap = {
    exact: { label: '精确', className: 'border-accent/25 bg-accent/10 text-accent' },
    prefix: { label: '前缀', className: 'border-accent/25 bg-accent/10 text-accent' },
    contains: { label: '包含', className: 'border-caution/25 bg-caution/10 text-caution' },
    fuzzy: { label: '模糊', className: 'border-divider/55 bg-surface-2 text-ink-muted' },
  };

  const config = configMap[matchType as keyof typeof configMap] || configMap.fuzzy;

  return (
    <Badge variant="default" size="sm" className={cn('shrink-0 shadow-none', config.className)}>
      {config.label}
    </Badge>
  );
}

export default SuggestionsList;
