import React from 'react';
import {
  Target,
  Palette,
  Type,
  Image,
  ShieldCheck,
  Eye,
  Pipette,
  Layers,
  ArrowRight,
  ExternalLink,
  Command,
} from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { useElementlyData } from '../../hooks/useElementlyData';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { NavTabId } from '../../components/Navigation';

interface DashboardProps {
  onNavigate: (tab: NavTabId) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { t, formatNumber } = useI18n();
  const {
    pageOverview,
    pageColors,
    toggleInspect,
    isInspecting,
    triggerEyedropper,
    selectedElement,
  } = useElementlyData();

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
  };

  return (
    <div className="p-3.5 space-y-4 max-w-full">
      {/* Active Web Page Hero Card */}
      <Card className="bg-white dark:bg-[#10121a]/95 border-slate-200/90 dark:border-white/[0.08]">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  {t('dashboard.activePage')}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100 truncate" title={pageOverview.title}>
                {pageOverview.title || 'Untitled Document'}
              </h2>
              <a
                href={pageOverview.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 flex items-center gap-1 truncate max-w-md"
              >
                <span className="truncate">{pageOverview.url}</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            </div>

            <Badge variant="brand" className="font-mono text-xs">
              {pageOverview.viewportWidth} × {pageOverview.viewportHeight}
            </Badge>
          </div>

          {/* Quick Actions Row */}
          <div className="pt-2.5 border-t border-slate-100 dark:border-white/[0.06] flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              onClick={toggleInspect}
              className={isInspecting ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-violet-600 hover:bg-violet-500 text-white'}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isInspecting ? t('common.stopInspect') : t('dashboard.startInspect')}</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => triggerEyedropper()}
              title={t('colors.eyedropperTip')}
            >
              <Pipette className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <span>{t('dashboard.pickColor')}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('accessibility')}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t('dashboard.analyzeA11y')}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {/* DOM Elements */}
        <div
          onClick={() => onNavigate('domExplorer')}
          className="bg-white dark:bg-[#10121a]/90 hover:bg-slate-50 dark:hover:bg-[#141724] border border-slate-200/80 dark:border-white/[0.07] rounded-xl p-3 cursor-pointer transition-all hover:border-violet-500/35 group shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-1">
            <Layers className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-700 dark:text-zinc-300" />
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-zinc-100 font-mono">
            {formatNumber(pageOverview.domNodeCount)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
            {t('dashboard.statElements')}
          </div>
        </div>

        {/* Colors */}
        <div
          onClick={() => onNavigate('colors')}
          className="bg-white dark:bg-[#10121a]/90 hover:bg-slate-50 dark:hover:bg-[#141724] border border-slate-200/80 dark:border-white/[0.07] rounded-xl p-3 cursor-pointer transition-all hover:border-violet-500/35 group shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-1">
            <Palette className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-700 dark:text-zinc-300" />
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-zinc-100 font-mono">
            {formatNumber(pageOverview.colorsCount)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
            {t('dashboard.statColors')}
          </div>
        </div>

        {/* Fonts */}
        <div
          onClick={() => onNavigate('typography')}
          className="bg-white dark:bg-[#10121a]/90 hover:bg-slate-50 dark:hover:bg-[#141724] border border-slate-200/80 dark:border-white/[0.07] rounded-xl p-3 cursor-pointer transition-all hover:border-violet-500/35 group shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-1">
            <Type className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-700 dark:text-zinc-300" />
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-zinc-100 font-mono">
            {formatNumber(pageOverview.fontsCount)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
            {t('dashboard.statFonts')}
          </div>
        </div>

        {/* Assets */}
        <div
          onClick={() => onNavigate('assets')}
          className="bg-white dark:bg-[#10121a]/90 hover:bg-slate-50 dark:hover:bg-[#141724] border border-slate-200/80 dark:border-white/[0.07] rounded-xl p-3 cursor-pointer transition-all hover:border-violet-500/35 group shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-1">
            <Image className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-700 dark:text-zinc-300" />
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-zinc-100 font-mono">
            {formatNumber(pageOverview.assetsCount)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
            {t('dashboard.statAssets')}
          </div>
        </div>
      </div>

      {/* Recent Colors Swatches */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-2.5">
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{t('dashboard.recentColors')}</span>
          </CardTitle>
          <button
            onClick={() => onNavigate('colors')}
            className="text-[11px] text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            {t('common.view')}
            <ArrowRight className="w-3 h-3" />
          </button>
        </CardHeader>
        <CardContent className="p-3">
          <div className="flex items-center gap-2 flex-wrap">
            {pageColors.slice(0, 10).map((c) => (
              <div
                key={c.hex}
                onClick={() => handleCopyColor(c.hex)}
                className="group relative cursor-pointer"
                title={`${c.hex} (Click to copy)`}
              >
                <div
                  className="w-7 h-7 rounded-lg border border-slate-300 dark:border-white/[0.12] shadow-xs transition-transform group-hover:scale-110 flex items-center justify-center"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="sr-only">{c.hex}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Element Quick Preview */}
      {selectedElement && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-2.5">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <span>{t('inspector.selectedElement')}</span>
            </CardTitle>
            <button
              onClick={() => onNavigate('inspector')}
              className="text-[11px] text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              {t('common.view')}
              <ArrowRight className="w-3 h-3" />
            </button>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-violet-700 dark:text-violet-300 bg-violet-600/10 dark:bg-violet-500/15 border border-violet-500/30 px-2 py-0.5 rounded">
                &lt;{selectedElement.tagName}
                {selectedElement.id ? `#${selectedElement.id}` : ''}&gt;
              </span>
              <span className="font-mono text-xs text-slate-500 dark:text-zinc-400">
                {selectedElement.dimensions.width} × {selectedElement.dimensions.height}px
              </span>
            </div>
            <p className="font-mono text-[11px] text-slate-700 dark:text-zinc-400 truncate bg-slate-100 dark:bg-black/40 p-1.5 rounded-lg border border-slate-200 dark:border-white/[0.05]">
              {selectedElement.selector}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Helpful Shortcuts & Tips */}
      <Card className="bg-slate-100/70 dark:bg-[#10121a]/60 border-slate-200/80 dark:border-white/[0.05]">
        <CardContent className="p-3 flex items-center justify-between gap-3 text-xs text-slate-600 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <Command className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span>{t('dashboard.shortcutInspect')}</span>
          </div>
          <Badge variant="outline" className="font-mono text-[10px]">
            ESC to exit
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};
