import React, { useState, useMemo } from 'react';
import {
  Palette,
  Pipette,
  Copy,
  Check,
  Heart,
  Download,
} from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { useElementlyData } from '../../hooks/useElementlyData';
import { ColorMetric } from '../../types/page-metrics';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/Input';

type ColorFormat = 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla';
type ColorFilter = 'all' | 'text' | 'background' | 'border' | 'gradient';

export const ColorInspector: React.FC = () => {
  const { t } = useI18n();
  const {
    pageColors,
    triggerEyedropper,
    favorites,
    addFavoriteColor,
    removeFavoriteColor,
  } = useElementlyData();

  const [search, setSearch] = useState('');
  const [activeFormat, setActiveFormat] = useState<ColorFormat>('hex');
  const [activeFilter, setActiveFilter] = useState<ColorFilter>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorMetric | null>(pageColors[0] || null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const isFavorite = (hex: string) => {
    return favorites.colors.some((c) => c.hex.toLowerCase() === hex.toLowerCase());
  };

  const toggleFavorite = (color: ColorMetric, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite(color.hex)) {
      removeFavoriteColor(color.hex);
    } else {
      addFavoriteColor(color);
    }
  };

  const filteredColors = useMemo(() => {
    return pageColors.filter((c) => {
      if (search && !c.hex.toLowerCase().includes(search.toLowerCase()) && !c.rgb.includes(search)) {
        return false;
      }
      if (activeFilter !== 'all' && !c.types.includes(activeFilter)) {
        return false;
      }
      return true;
    });
  }, [pageColors, search, activeFilter]);

  const getColorString = (c: ColorMetric, format: ColorFormat): string => {
    switch (format) {
      case 'hex':
        return c.hex;
      case 'rgb':
        return c.rgb;
      case 'rgba':
        return c.rgba;
      case 'hsl':
        return c.hsl;
      case 'hsla':
        return c.hsla;
    }
  };

  const handleExport = (exportType: 'css' | 'scss' | 'json' | 'tailwind') => {
    let output = '';
    if (exportType === 'css') {
      const vars = filteredColors
        .map((c, i) => `  --color-${i + 1}: ${c.hex}; /* ${c.count} uses */`)
        .join('\n');
      output = `:root {\n${vars}\n}`;
    } else if (exportType === 'scss') {
      output = filteredColors
        .map((c, i) => `$color-${i + 1}: ${c.hex}; // ${c.count} uses`)
        .join('\n');
    } else if (exportType === 'json') {
      const jsonMap = filteredColors.map((c, i) => ({
        name: `color-${i + 1}`,
        hex: c.hex,
        rgb: c.rgb,
        hsl: c.hsl,
        usages: c.count,
        types: c.types,
      }));
      output = JSON.stringify(jsonMap, null, 2);
    } else if (exportType === 'tailwind') {
      const twObj: Record<string, string> = {};
      filteredColors.forEach((c, i) => {
        twObj[`brand-${i + 1}`] = c.hex;
      });
      output = `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: ${JSON.stringify(twObj, null, 8)}\n    }\n  }\n};`;
    }

    copyToClipboard(output, `export-${exportType}`);
  };

  return (
    <div className="p-3.5 space-y-4 max-w-full">
      {/* Top Banner & Eyedropper Trigger */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{t('colors.title')}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">{t('colors.subtitle')}</p>
        </div>

        <Button
          size="sm"
          onClick={() => triggerEyedropper()}
          className="bg-violet-600 hover:bg-violet-500 text-white"
        >
          <Pipette className="w-3.5 h-3.5" />
          <span>{t('colors.eyedropper')}</span>
        </Button>
      </div>

      {/* Selected Color Inspector Detail Box */}
      {selectedColor && (
        <Card className="bg-white dark:bg-[#10121a]/95 border-slate-200/90 dark:border-white/[0.08]">
          <CardContent className="p-3.5 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl border border-slate-300 dark:border-white/[0.12] shadow-sm flex-shrink-0"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-zinc-100">
                      {selectedColor.hex}
                    </span>
                    <button
                      onClick={(e) => toggleFavorite(selectedColor, e)}
                      className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer transition-colors"
                      title={isFavorite(selectedColor.hex) ? t('colors.removeFromFavorites') : t('colors.addToFavorites')}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFavorite(selectedColor.hex) ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
                    {t('colors.usages', { count: selectedColor.count })}
                  </span>
                </div>
              </div>

              {/* Contrast with White/Black badges */}
              <div className="flex flex-col items-end gap-1 font-mono text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">vs White:</span>
                  <span className={`px-1.5 py-0.5 rounded ${selectedColor.contrastWithWhite >= 4.5 ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/15 text-rose-700 dark:text-rose-300'}`}>
                    {selectedColor.contrastWithWhite}:1
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">vs Black:</span>
                  <span className={`px-1.5 py-0.5 rounded ${selectedColor.contrastWithBlack >= 4.5 ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/15 text-rose-700 dark:text-rose-300'}`}>
                    {selectedColor.contrastWithBlack}:1
                  </span>
                </div>
              </div>
            </div>

            {/* Quick formats copy rows */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-white/[0.06] font-mono text-xs">
              <div
                onClick={() => copyToClipboard(selectedColor.rgb, 'sel-rgb')}
                className="p-1.5 rounded-lg bg-slate-50 dark:bg-black/35 border border-slate-200 dark:border-white/[0.06] flex items-center justify-between cursor-pointer hover:border-violet-500/40 transition-colors"
              >
                <span className="text-slate-400 dark:text-zinc-500 text-[10px]">RGB</span>
                <span className="text-slate-800 dark:text-zinc-200 truncate">{selectedColor.rgb}</span>
              </div>
              <div
                onClick={() => copyToClipboard(selectedColor.hsl, 'sel-hsl')}
                className="p-1.5 rounded-lg bg-slate-50 dark:bg-black/35 border border-slate-200 dark:border-white/[0.06] flex items-center justify-between cursor-pointer hover:border-violet-500/40 transition-colors"
              >
                <span className="text-slate-400 dark:text-zinc-500 text-[10px]">HSL</span>
                <span className="text-slate-800 dark:text-zinc-200 truncate">{selectedColor.hsl}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Format & Filter Controls */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          {/* Format pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/40 p-0.5 rounded-lg border border-slate-200 dark:border-white/[0.07] font-mono text-[11px]">
            {(['hex', 'rgb', 'rgba', 'hsl', 'hsla'] as ColorFormat[]).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setActiveFormat(fmt)}
                className={`px-2 py-0.5 rounded uppercase font-medium transition-colors cursor-pointer ${
                  activeFormat === fmt
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          {/* Export Menu Buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('css')}
              title="Copy as CSS Variables"
            >
              <Download className="w-3 h-3 text-violet-600 dark:text-violet-400" />
              <span>CSS</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('json')}
              title="Copy as JSON"
            >
              JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('tailwind')}
              title="Copy as Tailwind Colors"
            >
              Tailwind
            </Button>
          </div>
        </div>

        {/* Search & Type filter */}
        <div className="flex items-center gap-2">
          <SearchInput
            placeholder={t('common.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none text-[11px] py-1">
          {(['all', 'text', 'background', 'border', 'gradient'] as ColorFilter[]).map((flt) => (
            <button
              key={flt}
              onClick={() => setActiveFilter(flt)}
              className={`px-2 py-0.5 rounded capitalize whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === flt
                  ? 'bg-violet-600 text-white font-medium'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/[0.04]'
              }`}
            >
              {flt === 'all' ? t('common.all') : t(`colors.filter${flt.charAt(0).toUpperCase() + flt.slice(1)}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Colors Swatches List */}
      <div className="space-y-1.5 max-h-[460px] overflow-y-auto">
        {filteredColors.length === 0 ? (
          <div className="p-6 text-center text-slate-500 dark:text-zinc-500 text-xs">
            {t('common.noData')}
          </div>
        ) : (
          filteredColors.map((color) => {
            const displayStr = getColorString(color, activeFormat);
            const isSel = selectedColor?.hex === color.hex;

            return (
              <div
                key={color.hex}
                onClick={() => setSelectedColor(color)}
                className={`p-2 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                  isSel
                    ? 'bg-violet-600/10 dark:bg-violet-500/10 border-violet-500/50 shadow-xs'
                    : 'bg-white dark:bg-[#10121a]/90 hover:bg-slate-50 dark:hover:bg-[#141724] border-slate-200/80 dark:border-white/[0.07]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-7 h-7 rounded-lg border border-slate-300 dark:border-white/[0.12] shadow-xs flex-shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="min-w-0">
                    <span className="font-mono text-xs font-semibold text-slate-900 dark:text-zinc-200 block truncate">
                      {displayStr}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium">
                        {t('colors.usages', { count: color.count })}
                      </span>
                      {color.types.map((type) => (
                        <span
                          key={type}
                          className="text-[9px] uppercase font-mono px-1 rounded bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-white/[0.06]"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(displayStr, color.hex);
                    }}
                    className="p-1.5 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-white/[0.06] cursor-pointer transition-colors"
                    title={t('common.copy')}
                  >
                    {copiedKey === color.hex ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={(e) => toggleFavorite(color, e)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-md hover:bg-slate-100 dark:hover:bg-white/[0.06] cursor-pointer transition-colors"
                    title={isFavorite(color.hex) ? t('colors.removeFromFavorites') : t('colors.addToFavorites')}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isFavorite(color.hex) ? 'fill-rose-500 text-rose-500' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
