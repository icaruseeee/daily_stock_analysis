import type React from 'react';
import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { Drawer } from '../common/Drawer';
import { SidebarNav } from './SidebarNav';
import { cn } from '../../utils/cn';
import { ThemeToggle } from '../theme/ThemeToggle';
import { UiLanguageToggle } from '../i18n/UiLanguageToggle';
import { useUiLanguage } from '../../contexts/UiLanguageContext';

type ShellProps = {
  children?: React.ReactNode;
};

export const Shell: React.FC<ShellProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const collapsed = false;
  const { t } = useUiLanguage();

  useEffect(() => {
    if (!mobileOpen) {
      return undefined;
    }

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-surface-2">
      {/* Mobile header overlay */}
      <div className="pointer-events-none fixed inset-x-0 top-3 z-40 flex items-start justify-between px-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-divider bg-surface/85 text-ink-muted backdrop-blur-md transition-colors hover:bg-hover"
          aria-label={t('layout.openNav')}
        >
          <Menu className="h-4 w-4" />
        </button>
        <div className="pointer-events-auto flex items-center gap-2">
          <UiLanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] px-3 py-4 sm:px-4 lg:px-5">
        {/* Sidebar — pinned left */}
        <aside
          className={cn(
            'sticky top-4 z-40 hidden shrink-0 overflow-visible rounded-lg border border-divider bg-surface/80 p-2.5 backdrop-blur-sm transition-[width] duration-200 lg:flex',
            'max-h-[calc(100vh-2rem)] self-start',
            collapsed ? 'w-18' : 'w-50'
          )}
          aria-label={t('layout.desktopSidebar')}
        >
          <SidebarNav collapsed={collapsed} variant="rail" onNavigate={() => setMobileOpen(false)} />
        </aside>

        {/* Content */}
        <main className="min-h-0 min-w-0 flex-1 pt-14 lg:pl-6 lg:pt-0 touch-pan-y">
          <div className="w-full max-w-6xl">
          {children ?? <Outlet />}
          </div>
        </main>
      </div>

      <Drawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title={t('layout.navMenu')}
        width="max-w-xs"
        zIndex={90}
        side="left"
      >
        <SidebarNav onNavigate={() => setMobileOpen(false)} />
      </Drawer>
    </div>
  );
};
