import React, { useState } from 'react';
import { Type, Copy, Check, Heart, ExternalLink } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { useElementlyData } from '../../hooks/useElementlyData';
import { FontMetric } from '../../types/page-metrics';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

export const TypographyInspector: React.FC = () => {
  const { t } = useI18n();
  const {
    pageFonts,
    selectedElement,
    favorites,
    addFavoriteFont,
    removeFavoriteFont,
  } = useElementlyData();

  const [previewText, setPreviewText] = useState('Explore Every Element with Elemently.');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const isFavorite = (family: string) => {
    return favorites.fonts.some((f) => f.family.toLowerCase() === family.toLowerCase());
  };

  const toggleFavorite = (font: FontMetric, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite(font.family)) {
      removeFavoriteFont(font.family);
    } else {
      addFavoriteFont(font);
    }
  };

  // Selected element typography values
  const selTypography = selectedElement
    ? {
        fontFamily: selectedElement.computedStyles['font-family'] || 'inherit',
        fontSize: selectedElement.computedStyles['font-size'] || 'inherit',
        fontWeight: selectedElement.computedStyles['font-weight'] || 'normal',
        lineHeight: selectedElement.computedStyles['line-height'] || 'normal',
        letterSpacing: selectedElement.computedStyles['letter-spacing'] || 'normal',
        textTransform: selectedElement.computedStyles['text-transform'] || 'none',
        textAlign: selectedElement.computedStyles['text-align'] || 'start',
        color: selectedElement.computedStyles['color'] || 'inherit',
      }
    : null;

  return (
    <div className="p-3.5 space-y-4 max-w-full">
      {/* Title */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
          <Type className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>{t('typography.title')}</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400">{t('typography.subtitle')}</p>
      </div>

      {/* Selected Element Typography Card */}
      {selTypography && (
        <Card className="border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#10121a]/95">
          <CardHeader className="py-2.5 flex flex-row items-center justify-between">
            <CardTitle className="text-violet-700 dark:text-violet-300">
              {t('typography.selectedTypography')}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const rule = `font-family: ${selTypography.fontFamily};\nfont-size: ${selTypography.fontSize};\nfont-weight: ${selTypography.fontWeight};\nline-height: ${selTypography.lineHeight};\nletter-spacing: ${selTypography.letterSpacing};\ncolor: ${selTypography.color};`;
                copyToClipboard(rule, 'sel-typo');
              }}
              title={t('typography.copyFontRule')}
            >
              {copiedKey === 'sel-typo' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />}
            </Button>
          </CardHeader>
          <CardContent className="p-3 space-y-2.5">
            {/* Live Render Preview */}
            <div
              className="p-3 rounded-lg bg-slate-100 dark:bg-black/35 border border-slate-200 dark:border-white/[0.06] text-slate-900 dark:text-zinc-100 truncate"
              style={{
                fontFamily: selTypography.fontFamily,
                fontSize: selTypography.fontSize,
                fontWeight: selTypography.fontWeight,
                lineHeight: selTypography.lineHeight,
                letterSpacing: selTypography.letterSpacing,
                color: selTypography.color,
              }}
            >
              {selectedElement?.textContent || previewText}
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-50 dark:bg-black/30 p-2 rounded-lg border border-slate-200 dark:border-white/[0.05]">
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 block font-sans uppercase">
                  {t('typography.fontFamily')}
                </span>
                <span className="text-violet-700 dark:text-violet-300 font-semibold truncate block">
                  {selTypography.fontFamily.split(',')[0]}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-black/30 p-2 rounded-lg border border-slate-200 dark:border-white/[0.05]">
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 block font-sans uppercase">
                  {t('typography.fontSize')} / Weight
                </span>
                <span className="text-slate-800 dark:text-zinc-200 font-semibold">
                  {selTypography.fontSize} • {selTypography.fontWeight}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-black/30 p-2 rounded-lg border border-slate-200 dark:border-white/[0.05]">
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 block font-sans uppercase">
                  {t('typography.lineHeight')}
                </span>
                <span className="text-slate-800 dark:text-zinc-200 font-semibold">
                  {selTypography.lineHeight}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-black/30 p-2 rounded-lg border border-slate-200 dark:border-white/[0.05]">
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 block font-sans uppercase">
                  {t('typography.textColor')}
                </span>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded-full border border-slate-300 dark:border-white/[0.15] flex-shrink-0"
                    style={{ backgroundColor: selTypography.color }}
                  />
                  <span className="text-slate-800 dark:text-zinc-200 truncate">{selTypography.color}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom Preview Text Input */}
      <div className="space-y-1">
        <label className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
          {t('typography.previewTextPlaceholder')}
        </label>
        <Input
          value={previewText}
          onChange={(e) => setPreviewText(e.target.value)}
          placeholder="Preview sample text..."
        />
      </div>

      {/* Fonts Catalog List */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
          {t('typography.fontsUsed', { count: pageFonts.length })}
        </h3>

        {pageFonts.map((font) => (
          <Card key={font.family} className="overflow-hidden hover:border-slate-300 dark:hover:border-white/[0.12] transition-colors">
            <CardContent className="p-3.5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 font-mono">{font.family}</h4>
                    <Badge
                      variant={
                        font.category === 'google'
                          ? 'brand'
                          : font.category === 'system'
                          ? 'secondary'
                          : 'default'
                      }
                    >
                      {font.category === 'google'
                        ? 'Google Font'
                        : font.category === 'system'
                        ? 'System'
                        : 'Web Font'}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 block">
                    {t('typography.elementsUsing', { count: font.elementsCount })}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {font.googleFontsUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`<link rel="stylesheet" href="${font.googleFontsUrl}">`, `gf-${font.family}`)}
                      title={t('typography.getGoogleFontsUrl')}
                    >
                      {copiedKey === `gf-${font.family}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <ExternalLink className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                      )}
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(`font-family: '${font.family}', sans-serif;`, `css-${font.family}`)}
                    title={t('typography.copyFontRule')}
                  >
                    {copiedKey === `css-${font.family}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => toggleFavorite(font, e)}
                    title={isFavorite(font.family) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isFavorite(font.family) ? 'fill-rose-500 text-rose-500' : 'text-slate-400 dark:text-zinc-400'
                      }`}
                    />
                  </Button>
                </div>
              </div>

              {/* Sample Preview Text in this font */}
              <div
                className="p-3 bg-slate-100 dark:bg-black/35 border border-slate-200 dark:border-white/[0.06] rounded-lg text-slate-800 dark:text-zinc-200 text-base leading-relaxed break-words"
                style={{ fontFamily: font.family }}
              >
                {previewText}
              </div>

              {/* Weights and Sizes tags */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-zinc-400 pt-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] uppercase font-sans text-slate-400 dark:text-zinc-500">
                    {t('typography.weightsUsed')}:
                  </span>
                  {font.weights.map((w) => (
                    <span key={w} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.05] text-slate-700 dark:text-zinc-300 text-[10px] border border-slate-200 dark:border-white/[0.05]">
                      {w}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] uppercase font-sans text-slate-400 dark:text-zinc-500">
                    {t('typography.sizesUsed')}:
                  </span>
                  {font.sizes.slice(0, 3).map((s) => (
                    <span key={s} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.05] text-slate-700 dark:text-zinc-300 text-[10px] border border-slate-200 dark:border-white/[0.05]">
                      {s}
                    </span>
                  ))}
                  {font.sizes.length > 3 && (
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">+{font.sizes.length - 3}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
