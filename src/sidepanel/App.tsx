import React, { useState } from 'react';
import { I18nProvider } from '../hooks/useI18n';
import { ThemeProvider } from '../hooks/useTheme';
import { ElementlyDataProvider } from '../hooks/useElementlyData';
import { Header } from '../components/Header';
import { Navigation, NavTabId } from '../components/Navigation';

// Feature modules
import { Dashboard } from '../features/dashboard/Dashboard';
import { Inspector } from '../features/inspector/Inspector';
import { ColorInspector } from '../features/colors/ColorInspector';
import { TypographyInspector } from '../features/typography/TypographyInspector';
import { LayoutInspector } from '../features/layout/LayoutInspector';
import { AssetsInspector } from '../features/assets/AssetsInspector';
import { AccessibilityAnalyzer } from '../features/accessibility/AccessibilityAnalyzer';
import { DOMExplorer } from '../features/dom-explorer/DOMExplorer';
import { DeveloperTools } from '../features/tools/DeveloperTools';
import { ResponsiveInspector } from '../features/responsive/ResponsiveInspector';
import { FavoritesManager } from '../features/favorites/FavoritesManager';
import { SettingsManager } from '../features/settings/SettingsManager';

const SidepanelMain: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTabId>('dashboard');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090a0f] text-slate-800 dark:text-zinc-100 font-sans select-none antialiased transition-colors duration-150">
      {/* Top Fixed Header with Main Inspect Toggle */}
      <Header />

      {/* Primary Navigation Bar */}
      <Navigation activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Feature Content Area */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
        {activeTab === 'inspector' && <Inspector />}
        {activeTab === 'colors' && <ColorInspector />}
        {activeTab === 'typography' && <TypographyInspector />}
        {activeTab === 'layout' && <LayoutInspector />}
        {activeTab === 'assets' && <AssetsInspector />}
        {activeTab === 'accessibility' && <AccessibilityAnalyzer />}
        {activeTab === 'domExplorer' && <DOMExplorer />}
        {activeTab === 'tools' && <DeveloperTools />}
        {activeTab === 'responsive' && <ResponsiveInspector />}
        {activeTab === 'favorites' && <FavoritesManager />}
        {activeTab === 'settings' && <SettingsManager />}
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <I18nProvider>
        <ElementlyDataProvider>
          <SidepanelMain />
        </ElementlyDataProvider>
      </I18nProvider>
    </ThemeProvider>
  );
};

export default App;
