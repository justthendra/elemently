import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { useElementlyData } from '../../hooks/useElementlyData';
import { A11yIssue } from '../../types/page-metrics';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const AccessibilityAnalyzer: React.FC = () => {
  const { t } = useI18n();
  const { pageA11y, scrollToElement, selectElementBySelector } = useElementlyData();
  const [filterType, setFilterType] = useState<'all' | 'error' | 'warning' | 'info'>('all');

  const filteredIssues = pageA11y.issues.filter((issue) => {
    if (filterType === 'all') return true;
    return issue.type === filterType;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 70) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  const handleInspectIssue = (issue: A11yIssue) => {
    if (issue.selector) {
      scrollToElement(issue.selector);
      selectElementBySelector(issue.selector);
    }
  };

  return (
    <div className="p-3.5 space-y-4 max-w-full">
      {/* Title */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{t('accessibility.title')}</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400">{t('accessibility.subtitle')}</p>
      </div>

      {/* Health Score Overview Card */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">
              {t('accessibility.overallHealth')}
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-3xl font-extrabold font-mono ${getScoreColor(pageA11y.score)}`}>
                {pageA11y.score}%
              </span>
              <Badge variant={pageA11y.score >= 80 ? 'success' : 'warning'}>
                {pageA11y.score >= 80 ? 'Good' : 'Needs Review'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              {t('accessibility.issuesFound', { count: pageA11y.issues.length })}
            </p>
          </div>

          {/* Counts breakdown */}
          <div className="flex flex-col gap-1.5 font-mono text-xs">
            <div className="flex items-center justify-between gap-3 text-rose-600 dark:text-rose-400">
              <span className="flex items-center gap-1 font-sans">
                <AlertCircle className="w-3.5 h-3.5" />
                Errors:
              </span>
              <span className="font-bold">{pageA11y.errorsCount}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-amber-600 dark:text-amber-400">
              <span className="flex items-center gap-1 font-sans">
                <AlertTriangle className="w-3.5 h-3.5" />
                Warnings:
              </span>
              <span className="font-bold">{pageA11y.warningsCount}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-sky-600 dark:text-sky-400">
              <span className="flex items-center gap-1 font-sans">
                <Info className="w-3.5 h-3.5" />
                Info:
              </span>
              <span className="font-bold">{pageA11y.infoCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/40 p-1 rounded-lg border border-slate-200 dark:border-white/[0.07] text-xs">
        <button
          onClick={() => setFilterType('all')}
          className={`flex-1 py-1 rounded text-center font-medium transition-colors cursor-pointer ${
            filterType === 'all'
              ? 'bg-violet-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {t('common.all')} ({pageA11y.issues.length})
        </button>
        <button
          onClick={() => setFilterType('error')}
          className={`flex-1 py-1 rounded text-center font-medium transition-colors cursor-pointer ${
            filterType === 'error'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Errors ({pageA11y.errorsCount})
        </button>
        <button
          onClick={() => setFilterType('warning')}
          className={`flex-1 py-1 rounded text-center font-medium transition-colors cursor-pointer ${
            filterType === 'warning'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Warnings ({pageA11y.warningsCount})
        </button>
        <button
          onClick={() => setFilterType('info')}
          className={`flex-1 py-1 rounded text-center font-medium transition-colors cursor-pointer ${
            filterType === 'info'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Info ({pageA11y.infoCount})
        </button>
      </div>

      {/* Issues List */}
      <div className="space-y-2 max-h-[420px] overflow-y-auto">
        {filteredIssues.length === 0 ? (
          <div className="p-8 text-center text-slate-400 dark:text-zinc-500 text-xs flex flex-col items-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500/60 dark:text-emerald-400/60" />
            <span>No accessibility issues in this category!</span>
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <Card
              key={issue.id}
              className={`hover:border-slate-300 dark:hover:border-white/[0.12] transition-colors ${
                issue.type === 'error'
                  ? 'border-rose-400/50 dark:border-rose-500/25'
                  : issue.type === 'warning'
                  ? 'border-amber-400/50 dark:border-amber-500/25'
                  : 'border-slate-200 dark:border-white/[0.07]'
              }`}
            >
              <CardContent className="p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    {issue.type === 'error' ? (
                      <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                    ) : issue.type === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-zinc-200">
                        {issue.message}
                      </h4>
                      {issue.details && (
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">{issue.details}</p>
                      )}
                    </div>
                  </div>

                  <Badge
                    variant={
                      issue.type === 'error'
                        ? 'error'
                        : issue.type === 'warning'
                        ? 'warning'
                        : 'default'
                    }
                    className="uppercase text-[9px] flex-shrink-0"
                  >
                    {issue.category}
                  </Badge>
                </div>

                {issue.selector && (
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-white/[0.06]">
                    <span className="font-mono text-[10px] text-violet-700 dark:text-violet-300 truncate max-w-[240px]">
                      {issue.selector}
                    </span>
                    <button
                      onClick={() => handleInspectIssue(issue)}
                      className="text-[11px] text-violet-700 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>{t('accessibility.highlightElement')}</span>
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Heading Hierarchy Card */}
      {pageA11y.headingHierarchy.length > 0 && (
        <Card>
          <CardHeader className="py-2.5">
            <CardTitle>{t('accessibility.headings')}</CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-1.5 font-mono text-xs max-h-48 overflow-y-auto">
            {pageA11y.headingHierarchy.map((h, idx) => (
              <div
                key={idx}
                onClick={() => scrollToElement(h.selector)}
                className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/[0.04] cursor-pointer transition-colors"
                style={{ paddingLeft: `${(h.level - 1) * 12 + 6}px` }}
              >
                <span className="px-1.5 py-0.5 rounded bg-violet-600/10 text-violet-700 border-violet-500/20 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/20 text-[10px] font-bold border">
                  H{h.level}
                </span>
                <span className="text-slate-700 dark:text-zinc-300 truncate">{h.text || '<empty>'}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
