import React, { useState } from 'react';
import {
  LayoutGrid,
  Boxes,
  Monitor,
} from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { useElementlyData } from '../../hooks/useElementlyData';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { BoxModelVisualizer } from '../../components/ui/BoxModelVisualizer';
import { Badge } from '../../components/ui/Badge';

export const LayoutInspector: React.FC = () => {
  const { t } = useI18n();
  const { selectedElement, pageOverview } = useElementlyData();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const computed = selectedElement?.computedStyles || {};

  const display = computed['display'] || 'block';
  const isFlex = display.includes('flex');
  const isGrid = display.includes('grid');
  const position = computed['position'] || 'static';
  const zIndex = computed['z-index'] || 'auto';
  const overflow = computed['overflow'] || 'visible';

  // Responsive breakpoints detection for current viewport width
  const vpWidth = pageOverview.viewportWidth || 1440;
  const breakpoints = [
    { name: 'sm', min: 640, active: vpWidth >= 640 },
    { name: 'md', min: 768, active: vpWidth >= 768 },
    { name: 'lg', min: 1024, active: vpWidth >= 1024 },
    { name: 'xl', min: 1280, active: vpWidth >= 1280 },
    { name: '2xl', min: 1536, active: vpWidth >= 1536 },
  ];

  return (
    <div className="p-3.5 space-y-4 max-w-full">
      {/* Title */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          <span>{t('layout.title')}</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400">{t('layout.subtitle')}</p>
      </div>

      {/* Viewport & Active Breakpoint */}
      <Card className="bg-white dark:bg-[#10121a]/95 border-slate-200/90 dark:border-white/[0.08]">
        <CardContent className="p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <span>{t('layout.currentViewport')}</span>
            </span>
            <span className="font-mono text-xs font-bold text-violet-700 dark:text-violet-300 bg-violet-600/10 dark:bg-violet-500/15 border border-violet-500/30 px-2 py-0.5 rounded">
              {vpWidth} × {pageOverview.viewportHeight || 900}px
            </span>
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            {breakpoints.map((bp) => (
              <div
                key={bp.name}
                className={`flex-1 py-1 rounded text-center font-mono text-[11px] border transition-colors ${
                  bp.active
                    ? 'bg-violet-600/10 dark:bg-violet-500/15 text-violet-700 dark:text-violet-200 border-violet-500/40 font-bold'
                    : 'bg-slate-100 dark:bg-black/30 text-slate-400 dark:text-zinc-500 border-slate-200 dark:border-white/[0.05]'
                }`}
              >
                {bp.name} ({bp.min})
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Box Model Visualizer */}
      {selectedElement && (
        <Card>
          <CardHeader className="py-2.5">
            <CardTitle>{t('layout.boxModel')}</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <BoxModelVisualizer
              boxModel={selectedElement.boxModel}
              onCopyValue={(label, val) => copyToClipboard(val, label)}
            />
          </CardContent>
        </Card>
      )}

      {/* Positioning & Stacking */}
      <Card>
        <CardHeader className="py-2.5">
          <CardTitle>{t('layout.positioning')}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 grid grid-cols-2 gap-2 font-mono text-xs">
          <div className="bg-slate-50 dark:bg-black/35 p-2.5 rounded-lg border border-slate-200 dark:border-white/[0.06]">
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 block font-sans uppercase">
              {t('layout.display')}
            </span>
            <span className="text-violet-700 dark:text-violet-300 font-bold text-sm">{display}</span>
          </div>
          <div className="bg-slate-50 dark:bg-black/35 p-2.5 rounded-lg border border-slate-200 dark:border-white/[0.06]">
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 block font-sans uppercase">
              {t('layout.position')}
            </span>
            <span className="text-indigo-700 dark:text-indigo-300 font-bold text-sm">{position}</span>
          </div>
          <div className="bg-slate-50 dark:bg-black/35 p-2.5 rounded-lg border border-slate-200 dark:border-white/[0.06]">
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 block font-sans uppercase">
              {t('layout.zIndex')}
            </span>
            <span className="text-emerald-700 dark:text-emerald-300 font-bold text-sm">{zIndex}</span>
          </div>
          <div className="bg-slate-50 dark:bg-black/35 p-2.5 rounded-lg border border-slate-200 dark:border-white/[0.06]">
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 block font-sans uppercase">
              Overflow
            </span>
            <span className="text-amber-700 dark:text-amber-300 font-bold text-sm">{overflow}</span>
          </div>
        </CardContent>
      </Card>

      {/* Flexbox Details */}
      <Card className={isFlex ? 'border-violet-500/35' : 'opacity-80'}>
        <CardHeader className="py-2.5 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span>{t('layout.flexbox')}</span>
          </CardTitle>
          <Badge variant={isFlex ? 'brand' : 'default'}>
            {isFlex ? 'Active Flex' : 'Not Flex'}
          </Badge>
        </CardHeader>
        <CardContent className="p-3 space-y-2 font-mono text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 dark:bg-black/30 p-2 rounded-lg border border-slate-200 dark:border-white/[0.05]">
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 block font-sans uppercase">{t('layout.direction')}</span>
              <span className="text-slate-800 dark:text-zinc-200">{computed['flex-direction'] || 'row'}</span>
            </div>
            <div className="bg-slate-50 dark:bg-black/30 p-2 rounded-lg border border-slate-200 dark:border-white/[0.05]">
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 block font-sans uppercase">{t('layout.justify')}</span>
              <span className="text-slate-800 dark:text-zinc-200">{computed['justify-content'] || 'flex-start'}</span>
            </div>
            <div className="bg-slate-50 dark:bg-black/30 p-2 rounded-lg border border-slate-200 dark:border-white/[0.05]">
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 block font-sans uppercase">{t('layout.align')}</span>
              <span className="text-slate-800 dark:text-zinc-200">{computed['align-items'] || 'stretch'}</span>
            </div>
            <div className="bg-slate-50 dark:bg-black/30 p-2 rounded-lg border border-slate-200 dark:border-white/[0.05]">
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 block font-sans uppercase">{t('layout.gap')}</span>
              <span className="text-slate-800 dark:text-zinc-200">{computed['gap'] || '0px'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CSS Grid Details */}
      <Card className={isGrid ? 'border-violet-500/35' : 'opacity-80'}>
        <CardHeader className="py-2.5 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>{t('layout.cssGrid')}</span>
          </CardTitle>
          <Badge variant={isGrid ? 'brand' : 'default'}>
            {isGrid ? 'Active Grid' : 'Not Grid'}
          </Badge>
        </CardHeader>
        <CardContent className="p-3 space-y-2 font-mono text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 dark:bg-black/30 p-2 rounded-lg border border-slate-200 dark:border-white/[0.05]">
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 block font-sans uppercase">{t('layout.columns')}</span>
              <span className="text-slate-800 dark:text-zinc-200 truncate block">{computed['grid-template-columns'] || 'none'}</span>
            </div>
            <div className="bg-slate-50 dark:bg-black/30 p-2 rounded-lg border border-slate-200 dark:border-white/[0.05]">
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 block font-sans uppercase">{t('layout.rows')}</span>
              <span className="text-slate-800 dark:text-zinc-200 truncate block">{computed['grid-template-rows'] || 'none'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
