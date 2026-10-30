import React, { useState } from 'react';
import {
  Bookmark,
  Palette,
  Type,
  Code2,
  Trash2,
  Download,
  Upload,
  Plus,
  Copy,
  Check,
  FolderPlus,
} from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { useElementlyData } from '../../hooks/useElementlyData';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StorageService } from '../../services/storage-service';

export const FavoritesManager: React.FC = () => {
  const { t } = useI18n();
  const {
    favorites,
    removeFavoriteColor,
    removeFavoriteFont,
    removeFavoriteSnippet,
    addFavoriteSnippet,
    collections,
    createCollection,
    deleteCollection,
  } = useElementlyData();

  const [activeTab, setActiveTab] = useState<'all' | 'colors' | 'fonts' | 'snippets' | 'collections'>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // New snippet modal state
  const [showAddSnippet, setShowAddSnippet] = useState(false);
  const [newSnipTitle, setNewSnipTitle] = useState('');
  const [newSnipCSS, setNewSnipCSS] = useState('');

  // New collection modal state
  const [showAddCollection, setShowAddCollection] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleExportJSON = async () => {
    const jsonStr = await StorageService.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elemently-collections-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = await StorageService.importData(content);
        if (success) {
          alert('Elemently data imported successfully! Reloading...');
          window.location.reload();
        } else {
          alert('Failed to parse imported file.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleSaveSnippet = () => {
    if (!newSnipTitle.trim() || !newSnipCSS.trim()) return;
    addFavoriteSnippet(newSnipTitle.trim(), newSnipCSS.trim());
    setNewSnipTitle('');
    setNewSnipCSS('');
    setShowAddSnippet(false);
  };

  const handleSaveCollection = () => {
    if (!newColName.trim()) return;
    createCollection(newColName.trim(), newColDesc.trim());
    setNewColName('');
    setNewColDesc('');
    setShowAddCollection(false);
  };

  return (
    <div className="p-3.5 space-y-4 max-w-full">
      {/* Title & Import/Export */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span>{t('favorites.title')}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">{t('favorites.subtitle')}</p>
        </div>

        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm" onClick={handleExportJSON} title={t('favorites.exportCollections')}>
            <Download className="w-3 h-3 text-violet-600 dark:text-violet-400" />
            <span>{t('common.export')}</span>
          </Button>

          <label className="inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg text-xs px-2.5 py-1.5 gap-1.5 bg-transparent hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-white/[0.1] cursor-pointer">
            <Upload className="w-3 h-3 text-violet-600 dark:text-violet-400" />
            <span>{t('common.import')}</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/40 p-1 rounded-lg border border-slate-200 dark:border-white/[0.07] text-xs">
        {(['all', 'colors', 'fonts', 'snippets', 'collections'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1 rounded text-center capitalize font-medium transition-colors cursor-pointer ${
              activeTab === tab
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Favorite Colors Section */}
      {(activeTab === 'all' || activeTab === 'colors') && (
        <Card>
          <CardHeader className="py-2.5 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{t('favorites.savedColors', { count: favorites.colors.length })}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            {favorites.colors.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-zinc-500">{t('favorites.noFavorites')}</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {favorites.colors.map((c) => (
                  <div
                    key={c.hex}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-black/35 border border-slate-200 dark:border-white/[0.06] flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-5 h-5 rounded-md border border-slate-200 dark:border-white/[0.12] flex-shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="font-mono text-xs text-slate-800 dark:text-zinc-200 truncate">
                        {c.hex}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyToClipboard(c.hex, `fav-${c.hex}`)}
                        className="p-1 text-slate-400 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white rounded cursor-pointer transition-colors"
                      >
                        {copiedKey === `fav-${c.hex}` ? (
                          <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                      <button
                        onClick={() => removeFavoriteColor(c.hex)}
                        className="p-1 text-slate-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400 rounded cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Favorite Fonts Section */}
      {(activeTab === 'all' || activeTab === 'fonts') && (
        <Card>
          <CardHeader className="py-2.5 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Type className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>{t('favorites.savedFonts', { count: favorites.fonts.length })}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            {favorites.fonts.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-zinc-500">{t('favorites.noFavorites')}</p>
            ) : (
              favorites.fonts.map((f) => (
                <div
                  key={f.family}
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-black/35 border border-slate-200 dark:border-white/[0.06] flex items-center justify-between gap-2"
                >
                  <span className="font-bold text-xs text-slate-900 dark:text-zinc-100" style={{ fontFamily: f.family }}>
                    {f.family}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => copyToClipboard(`font-family: '${f.family}', sans-serif;`, `fav-${f.family}`)}
                      className="p-1 text-slate-400 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white rounded cursor-pointer transition-colors"
                    >
                      {copiedKey === `fav-${f.family}` ? (
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                    <button
                      onClick={() => removeFavoriteFont(f.family)}
                      className="p-1 text-slate-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400 rounded cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Saved CSS Snippets */}
      {(activeTab === 'all' || activeTab === 'snippets') && (
        <Card>
          <CardHeader className="py-2.5 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <span>{t('favorites.savedSnippets', { count: favorites.snippets.length })}</span>
            </CardTitle>
            <Button size="sm" variant="ghost" onClick={() => setShowAddSnippet(!showAddSnippet)}>
              <Plus className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            </Button>
          </CardHeader>
          <CardContent className="p-3 space-y-3">
            {showAddSnippet && (
              <div className="p-3 bg-slate-100 dark:bg-black/40 rounded-xl border border-slate-200 dark:border-white/[0.09] space-y-2">
                <Input
                  placeholder="Snippet Title..."
                  value={newSnipTitle}
                  onChange={(e) => setNewSnipTitle(e.target.value)}
                />
                <textarea
                  placeholder="Paste CSS rules..."
                  rows={3}
                  value={newSnipCSS}
                  onChange={(e) => setNewSnipCSS(e.target.value)}
                  className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-white/[0.08] rounded-lg p-2 text-xs font-mono text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-violet-500"
                />
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setShowAddSnippet(false)}>Cancel</Button>
                  <Button size="sm" onClick={handleSaveSnippet}>Save Snippet</Button>
                </div>
              </div>
            )}

            {favorites.snippets.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-zinc-500">{t('favorites.noFavorites')}</p>
            ) : (
              favorites.snippets.map((snip) => (
                <div
                  key={snip.id}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-black/35 border border-slate-200 dark:border-white/[0.06] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 dark:text-zinc-100">{snip.title}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyToClipboard(snip.css, `snip-${snip.id}`)}
                        className="p-1 text-slate-400 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white rounded cursor-pointer transition-colors"
                      >
                        {copiedKey === `snip-${snip.id}` ? (
                          <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                      <button
                        onClick={() => removeFavoriteSnippet(snip.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400 rounded cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <pre className="p-2 bg-slate-100 dark:bg-black/40 rounded font-mono text-[11px] text-violet-700 dark:text-violet-300 overflow-x-auto whitespace-pre-wrap border border-slate-200 dark:border-white/[0.04]">
                    {snip.css}
                  </pre>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Collections Section */}
      {(activeTab === 'all' || activeTab === 'collections') && (
        <Card>
          <CardHeader className="py-2.5 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FolderPlus className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <span>Collections ({collections.length})</span>
            </CardTitle>
            <Button size="sm" variant="ghost" onClick={() => setShowAddCollection(!showAddCollection)}>
              <Plus className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            </Button>
          </CardHeader>
          <CardContent className="p-3 space-y-3">
            {showAddCollection && (
              <div className="p-3 bg-slate-100 dark:bg-black/40 rounded-xl border border-slate-200 dark:border-white/[0.09] space-y-2">
                <Input
                  placeholder="Collection Name..."
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                />
                <Input
                  placeholder="Optional description..."
                  value={newColDesc}
                  onChange={(e) => setNewColDesc(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setShowAddCollection(false)}>Cancel</Button>
                  <Button size="sm" onClick={handleSaveCollection}>Create Collection</Button>
                </div>
              </div>
            )}

            {collections.map((col) => (
              <div key={col.id} className="p-3 rounded-lg bg-slate-50 dark:bg-black/35 border border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-zinc-100">{col.name}</h4>
                  {col.description && <p className="text-[11px] text-slate-500 dark:text-zinc-400">{col.description}</p>}
                </div>
                <button
                  onClick={() => deleteCollection(col.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400 rounded cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
