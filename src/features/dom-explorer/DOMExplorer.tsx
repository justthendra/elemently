import React, { useState } from 'react';
import {
  FolderTree,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
} from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { useElementlyData } from '../../hooks/useElementlyData';
import { DOMTreeNode } from '../../types/page-metrics';
import { Card, CardContent } from '../../components/ui/Card';
import { SearchInput } from '../../components/ui/Input';

interface TreeNodeProps {
  node: DOMTreeNode;
  search: string;
  onSelect: (selector: string) => void;
  onHover: (selector: string) => void;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
  depth?: number;
}

const TreeNodeItem: React.FC<TreeNodeProps> = ({
  node,
  search,
  onSelect,
  onHover,
  copiedKey,
  onCopy,
  depth = 0,
}) => {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;

  const matchesSearch =
    search &&
    (node.tagName.toLowerCase().includes(search.toLowerCase()) ||
      node.id?.toLowerCase().includes(search.toLowerCase()) ||
      node.className?.toLowerCase().includes(search.toLowerCase()) ||
      node.textPreview?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="select-none font-mono text-xs">
      <div
        className={`flex items-center justify-between gap-1 py-1 px-1.5 rounded-lg transition-colors group cursor-pointer ${
          matchesSearch
            ? 'bg-violet-600/15 text-violet-800 dark:text-violet-200 border border-violet-500/35'
            : 'hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-700 dark:text-zinc-300'
        }`}
        style={{ paddingLeft: `${depth * 14 + 6}px` }}
        onMouseEnter={() => onHover(node.selector)}
        onClick={() => onSelect(node.selector)}
      >
        <div className="flex items-center gap-1 min-w-0">
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="p-0.5 text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-300 rounded cursor-pointer"
            >
              {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          ) : (
            <span className="w-4" />
          )}

          <span className="text-violet-700 dark:text-violet-400 font-semibold">&lt;{node.tagName}</span>
          {node.id && <span className="text-purple-600 dark:text-purple-300">#{node.id}</span>}
          {node.className && (
            <span className="text-slate-500 dark:text-zinc-400 truncate max-w-[120px]">
              .{node.className.split(' ')[0]}
            </span>
          )}
          <span className="text-violet-700 dark:text-violet-400 font-semibold">&gt;</span>

          {node.textPreview && (
            <span className="text-slate-500 dark:text-zinc-400 truncate max-w-[140px] text-[11px] font-sans">
              "{node.textPreview}"
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopy(node.selector, `sel-${node.selector}`);
            }}
            className="p-1 text-slate-400 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white rounded cursor-pointer transition-colors"
            title="Copy selector"
          >
            {copiedKey === `sel-${node.selector}` ? (
              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      {hasChildren && expanded && (
        <div className="border-l border-slate-200 dark:border-white/[0.07] ml-2">
          {node.children!.map((child, idx) => (
            <TreeNodeItem
              key={idx}
              node={child}
              search={search}
              onSelect={onSelect}
              onHover={onHover}
              copiedKey={copiedKey}
              onCopy={onCopy}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const DOMExplorer: React.FC = () => {
  const { t } = useI18n();
  const { domTree, selectElementBySelector, hoverElement } = useElementlyData();
  const [search, setSearch] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <div className="p-3.5 space-y-4 max-w-full">
      {/* Title */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          <span>{t('domExplorer.title')}</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400">{t('domExplorer.subtitle')}</p>
      </div>

      {/* Search */}
      <SearchInput
        placeholder={t('domExplorer.searchNodes')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* DOM Tree View Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-2 max-h-[500px] overflow-y-auto">
          <TreeNodeItem
            node={domTree}
            search={search}
            onSelect={(sel) => selectElementBySelector(sel)}
            onHover={(sel) => hoverElement(sel)}
            copiedKey={copiedKey}
            onCopy={handleCopy}
            depth={0}
          />
        </CardContent>
      </Card>
    </div>
  );
};
