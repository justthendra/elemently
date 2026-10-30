import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  Target,
  Palette,
  Type,
  LayoutGrid,
  Image,
  ShieldCheck,
  FolderTree,
  Wrench,
  Smartphone,
  Bookmark,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { useElementlyData } from '../hooks/useElementlyData';

export type NavTabId =
  | 'dashboard'
  | 'inspector'
  | 'colors'
  | 'typography'
  | 'layout'
  | 'assets'
  | 'accessibility'
  | 'domExplorer'
  | 'tools'
  | 'responsive'
  | 'favorites'
  | 'settings';

interface NavigationProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab }) => {
  const { t } = useI18n();
  const { pageA11y, favorites, pageColors } = useElementlyData();
  const navRef = useRef<HTMLElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const navItems: {
    id: NavTabId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'inspector', label: t('nav.inspector'), icon: Target },
    { id: 'colors', label: t('nav.colors'), icon: Palette, badge: pageColors.length },
    { id: 'typography', label: t('nav.typography'), icon: Type },
    { id: 'layout', label: t('nav.layout'), icon: LayoutGrid },
    { id: 'assets', label: t('nav.assets'), icon: Image },
    {
      id: 'accessibility',
      label: t('nav.accessibility'),
      icon: ShieldCheck,
      badge: `${pageA11y.score}%`,
      badgeColor: pageA11y.score >= 80 ? 'text-emerald-500 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400',
    },
    { id: 'domExplorer', label: t('nav.domExplorer'), icon: FolderTree },
    { id: 'tools', label: t('nav.tools'), icon: Wrench },
    { id: 'responsive', label: t('nav.responsive'), icon: Smartphone },
    {
      id: 'favorites',
      label: t('nav.favorites'),
      icon: Bookmark,
      badge: favorites.colors.length + favorites.fonts.length + favorites.snippets.length,
    },
    { id: 'settings', label: t('nav.settings'), icon: Settings },
  ];

  const checkScroll = useCallback(() => {
    const el = navRef.current;
    if (!el) return;

    const hasOverflow = el.scrollWidth > el.clientWidth + 2;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll]);

  // Scroll active tab into view when selected
  useEffect(() => {
    if (activeBtnRef.current) {
      activeBtnRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'nearest',
        block: 'nearest',
      });
    }
    checkScroll();
  }, [activeTab, checkScroll]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = navRef.current;
    if (!el) return;

    const offset = direction === 'left' ? -180 : 180;
    el.scrollBy({ left: offset, behavior: 'smooth' });
    setTimeout(checkScroll, 250);
  };

  // Convert vertical mouse wheel into horizontal scroll on the tabs bar
  const handleWheel = (e: React.WheelEvent<HTMLElement>) => {
    const el = navRef.current;
    if (!el) return;

    if (e.deltaY !== 0) {
      el.scrollLeft += e.deltaY;
      checkScroll();
    }
  };

  return (
    <div className="relative bg-slate-100/90 dark:bg-[#0c0d14]/95 border-b border-slate-200 dark:border-white/[0.06] select-none flex items-center group transition-colors duration-150">
      {/* Scroll Left Button */}
      {canScrollLeft && (
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-0 z-20 h-full px-1.5 bg-gradient-to-r from-slate-100 via-slate-100/90 to-transparent dark:from-[#0c0d14] dark:via-[#0c0d14]/90 dark:to-transparent flex items-center justify-center text-slate-700 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          title="Scroll Left"
        >
          <div className="w-5 h-5 rounded-md bg-white dark:bg-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.14] border border-slate-300 dark:border-white/[0.1] flex items-center justify-center shadow-xs">
            <ChevronLeft className="w-3.5 h-3.5" />
          </div>
        </button>
      )}

      {/* Tabs List */}
      <nav
        ref={navRef}
        onWheel={handleWheel}
        onScroll={checkScroll}
        className="px-2 py-1.5 overflow-x-auto flex items-center gap-1 scroll-smooth w-full scrollbar-none"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              ref={isActive ? (el) => { activeBtnRef.current = el; } : undefined}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 cursor-pointer flex-shrink-0 ${
                isActive
                  ? 'bg-violet-600/10 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 border border-violet-500/30 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-200/60 dark:hover:bg-white/[0.04] border border-transparent'
              }`}
              title={item.label}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-violet-600 dark:text-violet-400' : 'text-slate-500 dark:text-zinc-400'}`} />
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge !== 0 && (
                <span
                  className={`text-[10px] font-mono px-1 rounded bg-slate-200 dark:bg-black/40 border border-slate-300 dark:border-white/[0.08] ${
                    item.badgeColor || 'text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Scroll Right Button */}
      {canScrollRight && (
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-0 z-20 h-full px-1.5 bg-gradient-to-l from-slate-100 via-slate-100/90 to-transparent dark:from-[#0c0d14] dark:via-[#0c0d14]/90 dark:to-transparent flex items-center justify-center text-slate-700 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          title="Scroll Right"
        >
          <div className="w-5 h-5 rounded-md bg-white dark:bg-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.14] border border-slate-300 dark:border-white/[0.1] flex items-center justify-center shadow-xs">
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>
      )}
    </div>
  );
};
