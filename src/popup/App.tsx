import React, { useEffect, useState } from 'react';
import { Target, Eye, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ThemeProvider } from '../hooks/useTheme';

const PopupContent: React.FC = () => {
  const [tabTitle, setTabTitle] = useState('');
  const [tabUrl, setTabUrl] = useState('');

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        if (tabs[0]) {
          setTabTitle(tabs[0].title || '');
          setTabUrl(tabs[0].url || '');
        }
      });
    }
  }, []);

  const openSidePanel = async () => {
    if (typeof chrome !== 'undefined' && chrome.sidePanel && chrome.sidePanel.open) {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs[0]?.id) {
        await chrome.sidePanel.open({ tabId: tabs[0].id });
        window.close();
      }
    }
  };

  const triggerInspect = async () => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'START_INSPECTOR' });
        window.close();
      }
    }
  };

  return (
    <div className="w-72 bg-white dark:bg-[#090a0f] text-slate-800 dark:text-zinc-100 p-3.5 space-y-3 font-sans select-none border border-slate-200 dark:border-white/[0.08] transition-colors">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-violet-600/10 border border-violet-500/25 flex items-center justify-center shadow-xs">
          <Target className="w-4 h-4 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h1 className="font-bold text-sm text-slate-900 dark:text-zinc-100 tracking-tight">
            Elemently
          </h1>
          <p className="text-[10px] text-slate-500 dark:text-zinc-400">Explore Every Element.</p>
        </div>
      </div>

      {tabTitle && (
        <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#10121a] border border-slate-200 dark:border-white/[0.07] space-y-0.5">
          <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate">{tabTitle}</p>
          <p className="text-[10px] text-violet-600 dark:text-violet-400 truncate font-mono">{tabUrl}</p>
        </div>
      )}

      <div className="space-y-1.5 pt-1">
        <Button onClick={openSidePanel} className="w-full bg-violet-600 hover:bg-violet-500 text-white">
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Open Side Panel</span>
        </Button>

        <Button onClick={triggerInspect} variant="secondary" className="w-full">
          <Eye className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
          <span>Quick Inspect</span>
        </Button>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <PopupContent />
    </ThemeProvider>
  );
};

export default App;
