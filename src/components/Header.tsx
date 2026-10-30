import React, { useState } from 'react';
import { Target, RefreshCw, Sun, Moon, Globe, Check, Eye } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { useTheme } from '../hooks/useTheme';
import { useElementlyData } from '../hooks/useElementlyData';
import { SUPPORTED_LOCALES } from '../locales';
import { Button } from './ui/Button';

export const Header: React.FC = () => {
  const { t, locale, setLocale } = useI18n();
  const { theme, setTheme, isDark } = useTheme();
  const { isInspecting, toggleInspect, refreshPageData, isLoading, pageOverview } = useElementlyData();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#090a0f]/95 border-b border-slate-200 dark:border-white/[0.08] backdrop-blur-md px-3 py-2 flex flex-col gap-2 select-none transition-colors duration-150">
      <div className="flex items-center justify-between gap-2">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-violet-600/10 dark:bg-violet-600/20 border border-violet-500/30 dark:border-violet-500/35 flex items-center justify-center shadow-xs flex-shrink-0">
            <Target className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-900 dark:text-zinc-100 tracking-tight">
                Elemently
              </span>
              <span className="text-[10px] font-mono text-violet-700 dark:text-violet-400 bg-violet-600/10 dark:bg-violet-500/10 border border-violet-500/25 px-1 py-0.2 rounded font-semibold">
                v1.0
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate max-w-[140px]" title={pageOverview.url}>
              {pageOverview.title || 'Ready to inspect'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Main Inspect Toggle */}
          <Button
            size="sm"
            onClick={toggleInspect}
            className={
              isInspecting
                ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-rose-500/30'
                : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-500/25'
            }
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="font-semibold text-xs">
              {isInspecting ? t('common.stopInspect') : t('common.inspect')}
            </span>
          </Button>

          {/* Refresh Page Scan */}
          <Button
            variant="ghost"
            size="icon"
            onClick={refreshPageData}
            disabled={isLoading}
            title={t('common.refresh')}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-violet-500 dark:text-violet-400' : 'text-slate-500 dark:text-zinc-400'}`} />
          </Button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowLangMenu(!showLangMenu)}
              title={t('settings.language')}
            >
              <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
            </Button>

            {showLangMenu && (
              <>
                <div
                  className="fixed inset-0 z-50"
                  onClick={() => setShowLangMenu(false)}
                />
                <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-[#11131c] border border-slate-200 dark:border-white/[0.09] rounded-xl shadow-xl p-1 z-50 transition-colors">
                  {SUPPORTED_LOCALES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLocale(l.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                        locale === l.code
                          ? 'bg-violet-600/10 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 font-semibold'
                          : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
                      }`}
                    >
                      <span>{l.nativeName}</span>
                      {locale === l.code && <Check className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={isDark ? t('settings.light') : t('settings.dark')}
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
          </Button>
        </div>
      </div>
    </header>
  );
};
