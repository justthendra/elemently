import React, { useState } from 'react';
import {
  Settings,
  Globe,
  Sun,
  Moon,
  Monitor,
  Download,
  Trash2,
  Check,
} from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { useTheme } from '../../hooks/useTheme';
import { SUPPORTED_LOCALES } from '../../locales';
import { InterfaceDensity } from '../../types/storage';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StorageService } from '../../services/storage-service';

export const SettingsManager: React.FC = () => {
  const { t, locale, setLocale } = useI18n();
  const { theme, setTheme, density, setDensity, accentColor, setAccentColor } = useTheme();

  // Overlay settings state
  const [hoverHighlight, setHoverHighlight] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [showBreadcrumbs, setShowBreadcrumbs] = useState(true);

  const ACCENT_COLORS = [
    { label: 'Violet', value: '#8b5cf6' },
    { label: 'Indigo', value: '#6366f1' },
    { label: 'Purple', value: '#a855f7' },
    { label: 'Pink', value: '#ec4899' },
    { label: 'Emerald', value: '#10b981' },
    { label: 'Sky', value: '#0ea5e9' },
  ];

  const handleExport = async () => {
    const data = await StorageService.exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elemently-settings-backup.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = async () => {
    if (confirm(t('settings.confirmReset'))) {
      await StorageService.clearAllData();
      window.location.reload();
    }
  };

  return (
    <div className="p-3.5 space-y-4 max-w-full">
      {/* Title */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
          <Settings className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          <span>{t('settings.title')}</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400">{t('settings.subtitle')}</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader className="py-2.5">
          <CardTitle>{t('settings.general')}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 space-y-3">
          {/* Language Selector */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <span>{t('settings.language')}</span>
            </label>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">{t('settings.languageDesc')}</p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {SUPPORTED_LOCALES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLocale(l.code)}
                  className={`p-2 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                    locale === l.code
                      ? 'bg-violet-600/10 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300 border-violet-500/40 font-semibold'
                      : 'bg-slate-50 dark:bg-black/30 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-white/[0.06] hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/[0.12]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{l.nativeName}</span>
                    {locale === l.code && <Check className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">{l.label}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader className="py-2.5">
          <CardTitle>Appearance & Theme</CardTitle>
        </CardHeader>
        <CardContent className="p-3 space-y-3">
          {/* Dark / Light / System Mode */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
              {t('settings.theme')}
            </label>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {(
                [
                  { id: 'dark', label: t('settings.dark'), icon: Moon },
                  { id: 'light', label: t('settings.light'), icon: Sun },
                  { id: 'system', label: t('settings.system'), icon: Monitor },
                ] as const
              ).map((mode) => {
                const Icon = mode.icon;
                const isSelected = theme === mode.id;

                return (
                  <button
                    key={mode.id}
                    onClick={() => setTheme(mode.id)}
                    className={`p-2 rounded-lg border text-center text-xs flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-violet-600/10 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300 border-violet-500/40 font-semibold'
                        : 'bg-slate-50 dark:bg-black/30 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-white/[0.06] hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accent Color Selection */}
          <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
              {t('settings.accentColor')}
            </label>
            <div className="flex items-center gap-2 pt-1">
              {ACCENT_COLORS.map((col) => (
                <button
                  key={col.value}
                  onClick={() => setAccentColor(col.value)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                    accentColor === col.value ? 'scale-110 border-slate-900 dark:border-white shadow-xs' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: col.value }}
                  title={col.label}
                >
                  {accentColor === col.value && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Interface Density */}
          <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
              {t('settings.density')}
            </label>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {(['comfortable', 'compact'] as InterfaceDensity[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDensity(d)}
                  className={`p-2 rounded-lg border text-center text-xs capitalize transition-colors cursor-pointer ${
                    density === d
                      ? 'bg-violet-600/10 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300 border-violet-500/40 font-semibold'
                      : 'bg-slate-50 dark:bg-black/30 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-white/[0.06] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t(`settings.${d}`)}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inspector Overlay Behavior */}
      <Card>
        <CardHeader className="py-2.5">
          <CardTitle>{t('settings.inspectorSettings')}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 space-y-3 text-xs">
          {/* Hover highlight toggle */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="font-semibold text-slate-900 dark:text-zinc-200 block">
                {t('settings.hoverHighlight')}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                {t('settings.hoverHighlightDesc')}
              </span>
            </div>
            <input
              type="checkbox"
              checked={hoverHighlight}
              onChange={(e) => setHoverHighlight(e.target.checked)}
              className="w-4 h-4 accent-violet-600 cursor-pointer"
            />
          </div>

          {/* Show dimensions toggle */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
            <div>
              <span className="font-semibold text-slate-900 dark:text-zinc-200 block">
                {t('settings.showDimensions')}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                {t('settings.showDimensionsDesc')}
              </span>
            </div>
            <input
              type="checkbox"
              checked={showDimensions}
              onChange={(e) => setShowDimensions(e.target.checked)}
              className="w-4 h-4 accent-violet-600 cursor-pointer"
            />
          </div>

          {/* Show breadcrumbs toggle */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
            <div>
              <span className="font-semibold text-slate-900 dark:text-zinc-200 block">
                {t('settings.showBreadcrumbs')}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                {t('settings.showBreadcrumbsDesc')}
              </span>
            </div>
            <input
              type="checkbox"
              checked={showBreadcrumbs}
              onChange={(e) => setShowBreadcrumbs(e.target.checked)}
              className="w-4 h-4 accent-violet-600 cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management & Reset */}
      <Card>
        <CardHeader className="py-2.5">
          <CardTitle>{t('settings.dataManagement')}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 space-y-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="w-full">
            <Download className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            <span>{t('settings.exportAll')}</span>
          </Button>

          <Button variant="destructive" size="sm" onClick={handleReset} className="w-full">
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('settings.resetDefaults')}</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
