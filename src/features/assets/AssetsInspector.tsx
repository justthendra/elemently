import React, { useState, useMemo } from 'react';
import {
  Image as ImageIcon,
  Copy,
  Check,
  Download,
  Eye,
  FileCode,
  Video,
} from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { useElementlyData } from '../../hooks/useElementlyData';
import { AssetMetric } from '../../types/page-metrics';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { SearchInput } from '../../components/ui/Input';

type AssetFilter = 'all' | 'image' | 'svg' | 'background' | 'video' | 'audio';

export const AssetsInspector: React.FC = () => {
  const { t } = useI18n();
  const { pageAssets, scrollToElement } = useElementlyData();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<AssetFilter>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const filteredAssets = useMemo(() => {
    return pageAssets.filter((a) => {
      if (search && !a.url.toLowerCase().includes(search.toLowerCase()) && !a.alt?.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (activeFilter !== 'all' && a.type !== activeFilter) {
        return false;
      }
      return true;
    });
  }, [pageAssets, search, activeFilter]);

  const handleDownload = (asset: AssetMetric) => {
    if (asset.type === 'svg' && asset.url.startsWith('Inline')) {
      alert('Inline SVG can be inspected or copied directly from Inspector outer HTML');
      return;
    }
    const a = document.createElement('a');
    a.href = asset.url;
    a.download = asset.url.split('/').pop()?.split('?')[0] || 'asset';
    a.target = '_blank';
    a.click();
  };

  return (
    <div className="p-3.5 space-y-4 max-w-full">
      {/* Title */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{t('assets.title')}</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400">{t('assets.subtitle')}</p>
      </div>

      {/* Controls */}
      <div className="space-y-2">
        <SearchInput
          placeholder={t('common.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filter buttons */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1 text-[11px]">
          {(['all', 'image', 'svg', 'background', 'video'] as AssetFilter[]).map((flt) => (
            <button
              key={flt}
              onClick={() => setActiveFilter(flt)}
              className={`px-2 py-0.5 rounded capitalize whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === flt
                  ? 'bg-violet-600 text-white font-medium shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/[0.04]'
              }`}
            >
              {flt === 'all' ? t('common.all') : t(`assets.${flt === 'image' ? 'images' : flt === 'svg' ? 'svgs' : flt === 'background' ? 'backgrounds' : 'media'}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Grid List */}
      <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
        {filteredAssets.length === 0 ? (
          <div className="p-8 text-center text-slate-400 dark:text-zinc-500 text-xs">
            {t('common.noData')}
          </div>
        ) : (
          filteredAssets.map((asset) => (
            <Card key={asset.id} className="overflow-hidden hover:border-slate-300 dark:hover:border-white/[0.12] transition-colors">
              <CardContent className="p-3 flex items-start gap-3">
                {/* Thumbnail / Icon */}
                <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/[0.08] flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                  {asset.type === 'svg' ? (
                    <FileCode className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                  ) : asset.type === 'video' || asset.type === 'audio' ? (
                    <Video className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  ) : (
                    <img
                      src={asset.url}
                      alt={asset.alt || 'Asset thumbnail'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  )}
                  <span className="absolute bottom-0.5 right-0.5 text-[9px] font-mono bg-slate-900/80 text-white dark:bg-black/80 dark:text-zinc-300 px-1 rounded">
                    {asset.format}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-xs text-slate-800 dark:text-zinc-200 font-medium truncate block" title={asset.url}>
                      {asset.url.split('/').pop()?.split('?')[0] || asset.url}
                    </span>
                    <Badge variant={asset.type === 'svg' ? 'brand' : 'default'} className="flex-shrink-0">
                      {asset.type}
                    </Badge>
                  </div>

                  {asset.alt && (
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate italic">
                      "{asset.alt}"
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-zinc-400">
                    <span>
                      Rendered: {asset.renderedWidth} × {asset.renderedHeight}px
                    </span>
                    {asset.naturalWidth && (
                      <span>
                        • Natural: {asset.naturalWidth} × {asset.naturalHeight}px
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => copyToClipboard(asset.url, `url-${asset.id}`)}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-zinc-300 dark:border-white/[0.06] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedKey === `url-${asset.id}` ? (
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{t('assets.copyUrl')}</span>
                    </button>

                    {!asset.url.startsWith('Inline') && (
                      <button
                        onClick={() => handleDownload(asset)}
                        className="px-2 py-0.5 rounded text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-zinc-300 dark:border-white/[0.06] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        <span>{t('assets.downloadAsset')}</span>
                      </button>
                    )}

                    {asset.selector && (
                      <button
                        onClick={() => scrollToElement(asset.selector!)}
                        className="px-2 py-0.5 rounded text-[11px] bg-slate-100 hover:bg-slate-200 text-violet-700 border border-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-violet-300 dark:border-white/[0.06] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>{t('assets.inspectOnPage')}</span>
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
