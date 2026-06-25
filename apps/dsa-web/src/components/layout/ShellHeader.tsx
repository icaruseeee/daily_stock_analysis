import type React from 'react';
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useUiLanguage } from '../../contexts/UiLanguageContext';
import type { UiTextKey } from '../../i18n/uiText';
import { UiLanguageToggle } from '../i18n/UiLanguageToggle';
import { ThemeToggle } from '../theme/ThemeToggle';

type ShellHeaderProps = {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobileNav: () => void;
};

const TITLES: Record<string, { title: UiTextKey; description: UiTextKey }> = {
  '/': { title: 'layout.route.home.title', description: 'layout.route.home.description' },
  '/chat': { title: 'layout.route.chat.title', description: 'layout.route.chat.description' },
  '/portfolio': { title: 'layout.route.portfolio.title', description: 'layout.route.portfolio.description' },
  '/screening': { title: 'layout.route.screening.title', description: 'layout.route.screening.description' },
  '/backtest': { title: 'layout.route.backtest.title', description: 'layout.route.backtest.description' },
  '/alerts': { title: 'layout.route.alerts.title', description: 'layout.route.alerts.description' },
  '/usage': { title: 'layout.route.usage.title', description: 'layout.route.usage.description' },
  '/settings': { title: 'layout.route.settings.title', description: 'layout.route.settings.description' },
};

export const ShellHeader: React.FC<ShellHeaderProps> = ({
  collapsed,
  onToggleSidebar,
  onOpenMobileNav,
}) => {
  const location = useLocation();
  const { t } = useUiLanguage();
  const current = TITLES[location.pathname];

  return (
    <header className="sticky top-0 z-30 border-b border-divider bg-surface-2/80 backdrop-blur-xl">
      <div className="mx-auto flex h-12 w-full max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-divider bg-surface/70 text-ink-muted transition-colors hover:bg-black/5 lg:hidden"
          aria-label={t('layout.openNav')}
        >
          <Menu className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onToggleSidebar}
          className="hidden h-8 w-8 items-center justify-center rounded-full border border-divider bg-surface/70 text-ink-muted transition-colors hover:bg-black/5 lg:inline-flex"
          aria-label={collapsed ? t('layout.expandSidebar') : t('layout.collapseSidebar')}
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-body font-semibold">{current ? t(current.title) : t('layout.appFallbackTitle')}</p>
          <p className="truncate text-sm text-ink-muted">{current ? t(current.description) : t('layout.appFallbackDescription')}</p>
        </div>

        <UiLanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  );
};
