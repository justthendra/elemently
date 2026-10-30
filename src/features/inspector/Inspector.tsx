import React, { useState, useMemo } from 'react';
import {
  Target,
  Copy,
  Check,
  ChevronRight,
  ArrowUpRight,
  Eye,
} from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { useElementlyData } from '../../hooks/useElementlyData';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SearchInput } from '../../components/ui/Input';
import { BoxModelVisualizer } from '../../components/ui/BoxModelVisualizer';

type StyleCategory = 'all' | 'layout' | 'typography' | 'box' | 'visuals' | 'animation';

export const Inspector: React.FC = () => {
  const { t } = useI18n();
  const {
    selectedElement,
    isInspecting,
    toggleInspect,
    selectElementBySelector,
    scrollToElement,
  } = useElementlyData();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [styleSearch, setStyleSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<StyleCategory>('all');
  const [activeTab, setActiveTab] = useState<'computed' | 'box' | 'inline' | 'variables'>('computed');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // Group styles into categories
  const filteredStyles = useMemo(() => {
    if (!selectedElement) return [];
    const entries = Object.entries(selectedElement.computedStyles);

    const layoutProps = ['display', 'position', 'top', 'right', 'bottom', 'left', 'z-index', 'flex', 'flex-direction', 'justify-content', 'align-items', 'grid-template-columns', 'grid-template-rows', 'gap', 'width', 'height', 'max-width', 'min-width', 'overflow'];
    const typoProps = ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-align', 'text-transform', 'text-decoration', 'color', 'white-space'];
    const boxProps = ['margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'border', 'border-width', 'border-color', 'border-radius', 'box-sizing'];
    const visualProps = ['background', 'background-color', 'background-image', 'opacity', 'box-shadow', 'backdrop-filter', 'filter', 'cursor'];
    const animProps = ['transition', 'animation', 'transform', 'transform-origin'];

    return entries.filter(([prop, val]) => {
      if (styleSearch && !prop.toLowerCase().includes(styleSearch.toLowerCase()) && !val.toLowerCase().includes(styleSearch.toLowerCase())) {
        return false;
      }
      if (activeCategory === 'layout') return layoutProps.some((p) => prop.includes(p));
      if (activeCategory === 'typography') return typoProps.some((p) => prop.includes(p));
      if (activeCategory === 'box') return boxProps.some((p) => prop.includes(p));
      if (activeCategory === 'visuals') return visualProps.some((p) => prop.includes(p));
      if (activeCategory === 'animation') return animProps.some((p) => prop.includes(p));
      return true;
    });
  }, [selectedElement, styleSearch, activeCategory]);

  const cssVariablesList = useMemo(() => {
    if (!selectedElement) return [];
    return Object.entries(selectedElement.cssVariables);
  }, [selectedElement]);

  const inlineStylesList = useMemo(() => {
    if (!selectedElement) return [];
    return Object.entries(selectedElement.inlineStyles);
  }, [selectedElement]);

  const handleCopyAllCSS = () => {
    if (!selectedElement) return;
    const cssLines = Object.entries(selectedElement.computedStyles)
      .map(([prop, val]) => `  ${prop}: ${val};`)
      .join('\n');
    const fullBlock = `${selectedElement.selector} {\n${cssLines}\n}`;
    copyToClipboard(fullBlock, 'all-css');
  };

  if (!selectedElement) {
    return (
      <div className="p-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
        <div className="w-12 h-12 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center">
          <Target className="w-6 h-6 text-violet-600 dark:text-violet-400" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">{t('inspector.title')}</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xs">{t('inspector.emptyState')}</p>
        </div>
        <Button onClick={toggleInspect} className="bg-violet-600 hover:bg-violet-500 text-white">
          <Eye className="w-3.5 h-3.5" />
          <span>{isInspecting ? t('common.stopInspect') : t('dashboard.startInspect')}</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-3.5 space-y-4 max-w-full">
      {/* Selected Element Header Card */}
      <Card className="border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#10121a]/95">
        <CardContent className="p-3.5 space-y-3">
          {/* Tag & Controls */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-mono text-sm font-bold text-violet-700 dark:text-violet-300 bg-violet-600/10 dark:bg-violet-500/15 border border-violet-500/30 px-2.5 py-1 rounded-md">
                &lt;{selectedElement.tagName}&gt;
              </span>
              {selectedElement.id && (
                <Badge variant="brand" className="font-mono">
                  #{selectedElement.id}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollToElement(selectedElement.selector)}
                title={t('inspector.scrollTo')}
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyAllCSS}
                title={t('inspector.copyCss')}
              >
                {copiedKey === 'all-css' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />}
              </Button>
            </div>
          </div>

          {/* Classes pill list */}
          {selectedElement.classList.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap max-h-16 overflow-y-auto">
              {selectedElement.classList.map((cls, i) => (
                <span
                  key={i}
                  className="font-mono text-[10px] text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] px-1.5 py-0.5 rounded cursor-pointer hover:bg-slate-200 dark:hover:bg-white/[0.08] transition-colors"
                  onClick={() => copyToClipboard(`.${cls}`, `cls-${i}`)}
                  title="Click to copy class"
                >
                  .{cls}
                </span>
              ))}
            </div>
          )}

          {/* Selector & XPath Bar */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
            <div className="flex items-center justify-between gap-2 bg-slate-100 dark:bg-black/35 p-1.5 rounded-lg border border-slate-200 dark:border-white/[0.06]">
              <span className="font-mono text-[11px] text-violet-700 dark:text-violet-300 truncate max-w-[280px]">
                {selectedElement.selector}
              </span>
              <button
                onClick={() => copyToClipboard(selectedElement.selector, 'selector')}
                className="text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white p-1 cursor-pointer"
                title={t('inspector.copySelector')}
              >
                {copiedKey === 'selector' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* DOM Breadcrumbs Hierarchy */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-zinc-400 tracking-wider">
              {t('inspector.hierarchy')}
            </span>
            <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none font-mono text-[11px]">
              {selectedElement.hierarchy.map((node, idx) => (
                <React.Fragment key={idx}>
                  <button
                    onClick={() => selectElementBySelector(node.selector)}
                    className={`px-1.5 py-0.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
                      idx === selectedElement.hierarchy.length - 1
                        ? 'bg-violet-600/10 dark:bg-violet-500/20 text-violet-700 dark:text-violet-200 font-bold border border-violet-500/35'
                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
                    }`}
                  >
                    {node.tagName}
                    {node.id ? `#${node.id}` : ''}
                  </button>
                  {idx < selectedElement.hierarchy.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-slate-400 dark:text-zinc-600 flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Switcher: Computed Styles | Box Model | Inline | Variables */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-white/[0.07] pb-2">
        <button
          onClick={() => setActiveTab('computed')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'computed'
              ? 'bg-violet-600/10 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 border border-violet-500/30 font-semibold'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/[0.04]'
          }`}
        >
          {t('inspector.computedStyles')}
        </button>
        <button
          onClick={() => setActiveTab('box')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'box'
              ? 'bg-violet-600/10 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 border border-violet-500/30 font-semibold'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/[0.04]'
          }`}
        >
          {t('inspector.boxModel')}
        </button>
        <button
          onClick={() => setActiveTab('variables')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'variables'
              ? 'bg-violet-600/10 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 border border-violet-500/30 font-semibold'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/[0.04]'
          }`}
        >
          {t('inspector.cssVariables')} ({cssVariablesList.length})
        </button>
        <button
          onClick={() => setActiveTab('inline')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'inline'
              ? 'bg-violet-600/10 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 border border-violet-500/30 font-semibold'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/[0.04]'
          }`}
        >
          {t('inspector.inlineStyles')} ({inlineStylesList.length})
        </button>
      </div>

      {/* Tab: Box Model */}
      {activeTab === 'box' && (
        <Card>
          <CardHeader>
            <CardTitle>{t('inspector.boxModel')}</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <BoxModelVisualizer
              boxModel={selectedElement.boxModel}
              onCopyValue={(label, val) => copyToClipboard(val, label)}
            />
          </CardContent>
        </Card>
      )}

      {/* Tab: Computed Styles */}
      {activeTab === 'computed' && (
        <div className="space-y-3">
          {/* Search & Category Filter */}
          <div className="space-y-2">
            <SearchInput
              placeholder={t('inspector.searchStyles')}
              value={styleSearch}
              onChange={(e) => setStyleSearch(e.target.value)}
            />

            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1 text-[11px]">
              {(['all', 'layout', 'typography', 'box', 'visuals', 'animation'] as StyleCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2 py-0.5 rounded capitalize whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-violet-600 text-white font-medium shadow-xs'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  {cat === 'all' ? t('inspector.categoryAll') : t(`inspector.category${cat.charAt(0).toUpperCase() + cat.slice(1)}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Styles Table */}
          <div className="bg-white dark:bg-[#10121a]/95 border border-slate-200/90 dark:border-white/[0.07] rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-white/[0.05] font-mono text-xs">
            {filteredStyles.length === 0 ? (
              <div className="p-4 text-center text-slate-500 dark:text-zinc-500 text-xs">
                {t('common.noData')}
              </div>
            ) : (
              filteredStyles.map(([prop, val]) => (
                <div
                  key={prop}
                  className="px-3 py-2 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors group cursor-pointer"
                  onClick={() => copyToClipboard(`${prop}: ${val};`, prop)}
                  title="Click to copy CSS rule"
                >
                  <span className="text-violet-700 dark:text-violet-400 font-medium group-hover:text-violet-800 dark:group-hover:text-violet-300">
                    {prop}
                  </span>
                  <div className="flex items-center gap-2 max-w-[200px]">
                    <span className="text-slate-800 dark:text-zinc-300 truncate text-right">
                      {val}
                    </span>
                    {copiedKey === prop ? (
                      <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-400 dark:text-zinc-600 group-hover:text-slate-600 dark:group-hover:text-zinc-400 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab: CSS Variables */}
      {activeTab === 'variables' && (
        <div className="bg-white dark:bg-[#10121a]/95 border border-slate-200/90 dark:border-white/[0.07] rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-white/[0.05] font-mono text-xs">
          {cssVariablesList.length === 0 ? (
            <div className="p-4 text-center text-slate-500 dark:text-zinc-500 text-xs">
              No CSS Custom Properties (--*) detected on this element.
            </div>
          ) : (
            cssVariablesList.map(([varName, val]) => (
              <div
                key={varName}
                onClick={() => copyToClipboard(`${varName}: ${val};`, varName)}
                className="px-3 py-2 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
              >
                <span className="text-purple-700 dark:text-purple-400 font-medium">{varName}</span>
                <span className="text-slate-800 dark:text-zinc-300 truncate">{val}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Inline Styles */}
      {activeTab === 'inline' && (
        <div className="bg-white dark:bg-[#10121a]/95 border border-slate-200/90 dark:border-white/[0.07] rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-white/[0.05] font-mono text-xs">
          {inlineStylesList.length === 0 ? (
            <div className="p-4 text-center text-slate-500 dark:text-zinc-500 text-xs">
              No inline styles found on this element.
            </div>
          ) : (
            inlineStylesList.map(([prop, val]) => (
              <div
                key={prop}
                onClick={() => copyToClipboard(`${prop}: ${val};`, prop)}
                className="px-3 py-2 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
              >
                <span className="text-amber-700 dark:text-amber-400 font-medium">{prop}</span>
                <span className="text-slate-800 dark:text-zinc-300 truncate">{val}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Children Elements Navigation */}
      {selectedElement.children.length > 0 && (
        <Card>
          <CardHeader className="py-2.5">
            <CardTitle>{t('inspector.children', { count: selectedElement.children.length })}</CardTitle>
          </CardHeader>
          <CardContent className="p-2 space-y-1 max-h-48 overflow-y-auto">
            {selectedElement.children.map((child, idx) => (
              <div
                key={idx}
                onClick={() => selectElementBySelector(child.selector)}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-black/35 dark:hover:bg-white/[0.04] border border-slate-200 dark:border-white/[0.05] cursor-pointer transition-colors"
              >
                <span className="font-mono text-xs text-violet-700 dark:text-violet-300 font-medium">
                  &lt;{child.tagName}&gt;
                  {child.id ? `#${child.id}` : ''}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
