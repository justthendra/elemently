import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { InspectedElement } from '../types/element';
import { ColorMetric, FontMetric, AssetMetric, A11yReport, DOMTreeNode, PageOverview } from '../types/page-metrics';
import { StorageData, SavedCollection } from '../types/storage';
import { ChromeMessagingService, isChromeRuntimeAvailable } from '../services/chrome-messaging';
import { StorageService } from '../services/storage-service';

// Rich fallback/mock data for developer preview and restricted tab pages
const MOCK_ELEMENT: InspectedElement = {
  tagName: 'button',
  id: 'submit-action',
  className: 'btn btn-primary inline-flex items-center px-4 py-2 font-medium shadow-md transition-colors',
  classList: ['btn', 'btn-primary', 'inline-flex', 'items-center', 'px-4', 'py-2', 'font-medium', 'shadow-md', 'transition-colors'],
  selector: 'button#submit-action',
  xpath: '//*[@id="submit-action"]',
  dimensions: { width: 142, height: 40, top: 120, left: 340, right: 482, bottom: 160, x: 340, y: 120 },
  boxModel: {
    margin: { top: 0, right: 8, bottom: 0, left: 0 },
    border: { top: 1, right: 1, bottom: 1, left: 1 },
    padding: { top: 8, right: 16, bottom: 8, left: 16 },
    content: { width: 108, height: 22 },
  },
  hierarchy: [
    { tagName: 'html', selector: 'html' },
    { tagName: 'body', selector: 'body' },
    { tagName: 'main', id: 'main-content', selector: 'main#main-content' },
    { tagName: 'div', className: 'hero-actions', selector: 'div.hero-actions' },
    { tagName: 'button', id: 'submit-action', selector: 'button#submit-action' },
  ],
  parent: { tagName: 'div', className: 'hero-actions', selector: 'div.hero-actions' },
  children: [
    { tagName: 'span', className: 'icon-sparkle', selector: 'span.icon-sparkle' },
    { tagName: 'span', className: 'btn-label', selector: 'span.btn-label' },
  ],
  computedStyles: {
    'display': 'inline-flex',
    'align-items': 'center',
    'justify-content': 'center',
    'padding-top': '8px',
    'padding-right': '16px',
    'padding-bottom': '8px',
    'padding-left': '16px',
    'margin-right': '8px',
    'border-top-width': '1px',
    'border-color': 'rgb(124, 58, 237)',
    'border-radius': '8px',
    'background-color': 'rgb(139, 92, 246)',
    'color': 'rgb(255, 255, 255)',
    'font-family': 'Inter, system-ui, sans-serif',
    'font-size': '14px',
    'font-weight': '600',
    'line-height': '20px',
    'letter-spacing': '-0.01em',
    'box-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    'cursor': 'pointer',
    'transition': 'all 0.15s ease-in-out',
  },
  inlineStyles: {
    'transform': 'translateZ(0)',
  },
  cssVariables: {
    '--brand-purple': '#8b5cf6',
    '--btn-radius': '8px',
  },
  outerHTML: '<button id="submit-action" class="btn btn-primary inline-flex items-center px-4 py-2 font-medium shadow-md transition-colors"><span class="icon-sparkle">✨</span><span class="btn-label">Get Started</span></button>',
  innerHTML: '<span class="icon-sparkle">✨</span><span class="btn-label">Get Started</span>',
  textContent: 'Get Started',
  attributes: {
    id: 'submit-action',
    class: 'btn btn-primary inline-flex items-center px-4 py-2 font-medium shadow-md transition-colors',
    type: 'button',
  },
};

const MOCK_COLORS: ColorMetric[] = [
  { hex: '#8b5cf6', rgb: 'rgb(139, 92, 246)', rgba: 'rgba(139, 92, 246, 1)', hsl: 'hsl(258, 90%, 66%)', hsla: 'hsla(258, 90%, 66%, 1)', types: ['background', 'border'], count: 42, contrastWithWhite: 3.82, contrastWithBlack: 5.5 },
  { hex: '#6366f1', rgb: 'rgb(99, 102, 241)', rgba: 'rgba(99, 102, 241, 1)', hsl: 'hsl(239, 84%, 67%)', hsla: 'hsla(239, 84%, 67%, 1)', types: ['background'], count: 35, contrastWithWhite: 4.12, contrastWithBlack: 5.1 },
  { hex: '#0f172a', rgb: 'rgb(15, 23, 42)', rgba: 'rgba(15, 23, 42, 1)', hsl: 'hsl(222, 47%, 11%)', hsla: 'hsla(222, 47%, 11%, 1)', types: ['background', 'text'], count: 88, contrastWithWhite: 16.2, contrastWithBlack: 1.3 },
  { hex: '#ffffff', rgb: 'rgb(255, 255, 255)', rgba: 'rgba(255, 255, 255, 1)', hsl: 'hsl(0, 0%, 100%)', hsla: 'hsla(0, 0%, 100%, 1)', types: ['text', 'background'], count: 114, contrastWithWhite: 1.0, contrastWithBlack: 21.0 },
  { hex: '#10b981', rgb: 'rgb(16, 185, 129)', rgba: 'rgba(16, 185, 129, 1)', hsl: 'hsl(160, 84%, 39%)', hsla: 'hsla(160, 84%, 39%, 1)', types: ['text', 'border'], count: 18, contrastWithWhite: 2.8, contrastWithBlack: 7.5 },
  { hex: '#f59e0b', rgb: 'rgb(245, 158, 11)', rgba: 'rgba(245, 158, 11, 1)', hsl: 'hsl(38, 92%, 50%)', hsla: 'hsla(38, 92%, 50%, 1)', types: ['background'], count: 12, contrastWithWhite: 1.9, contrastWithBlack: 11.0 },
  { hex: '#ec4899', rgb: 'rgb(236, 72, 153)', rgba: 'rgba(236, 72, 153, 1)', hsl: 'hsl(330, 81%, 60%)', hsla: 'hsla(330, 81%, 60%, 1)', types: ['text', 'gradient'], count: 9, contrastWithWhite: 3.4, contrastWithBlack: 6.2 },
];

const MOCK_FONTS: FontMetric[] = [
  { family: 'Inter', category: 'google', weights: ['400', '500', '600', '700'], sizes: ['12px', '14px', '16px', '20px', '32px', '48px'], elementsCount: 84, googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
  { family: 'Plus Jakarta Sans', category: 'google', weights: ['600', '700', '800'], sizes: ['24px', '36px', '60px'], elementsCount: 22, googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&display=swap' },
  { family: 'JetBrains Mono', category: 'custom', weights: ['400', '500'], sizes: ['13px', '14px'], elementsCount: 15 },
  { family: 'system-ui', category: 'system', weights: ['400', '600'], sizes: ['14px', '16px'], elementsCount: 30 },
];

const MOCK_ASSETS: AssetMetric[] = [
  { id: 'img-0', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800', type: 'image', format: 'WEBP', naturalWidth: 1200, naturalHeight: 800, renderedWidth: 600, renderedHeight: 400, alt: 'Abstract violet 3D shape' },
  { id: 'svg-0', url: 'Inline Brand Logo (140 × 36)', type: 'svg', format: 'SVG', renderedWidth: 140, renderedHeight: 36, selector: 'svg.brand-logo' },
  { id: 'img-1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', type: 'image', format: 'JPEG', naturalWidth: 800, naturalHeight: 800, renderedWidth: 48, renderedHeight: 48, alt: 'User avatar' },
  { id: 'bg-0', url: 'https://assets.example.com/mesh-gradient.png', type: 'background', format: 'PNG', renderedWidth: 1920, renderedHeight: 1080 },
];

const MOCK_A11Y: A11yReport = {
  score: 88,
  errorsCount: 1,
  warningsCount: 2,
  infoCount: 3,
  issues: [
    { id: 'alt-missing-1', type: 'error', category: 'alt', message: 'Image missing required "alt" attribute', tagName: 'IMG', selector: 'img.hero-illustration', details: 'Ensure descriptive alternative text is provided.' },
    { id: 'contrast-1', type: 'warning', category: 'contrast', message: 'Low color contrast on muted text (3.2:1)', tagName: 'SPAN', selector: 'span.text-muted', details: 'Normal text requires at least 4.5:1 contrast for WCAG AA compliance.' },
    { id: 'heading-skip-1', type: 'warning', category: 'heading', message: 'Skipped heading level: <h2> to <h4>', tagName: 'H4', selector: 'h4.feature-subheading' },
    { id: 'html-lang', type: 'info', category: 'aria', message: 'HTML lang attribute set to "en"', tagName: 'HTML' },
  ],
  headingHierarchy: [
    { level: 1, text: 'Elemently – Explore Every Element', selector: 'h1.hero-title' },
    { level: 2, text: 'Powerful Inspector Tools', selector: 'h2.section-title' },
    { level: 4, text: 'Instant CSS Diagnostics', selector: 'h4.feature-subheading' },
  ],
};

const MOCK_DOM_TREE: DOMTreeNode = {
  tagName: 'body',
  className: 'antialiased bg-slate-950 text-white',
  selector: 'body',
  childrenCount: 3,
  children: [
    {
      tagName: 'header',
      id: 'site-header',
      className: 'sticky top-0 z-50 backdrop-blur',
      selector: 'header#site-header',
      childrenCount: 2,
      children: [
        { tagName: 'div', className: 'logo-wrap', selector: 'div.logo-wrap', childrenCount: 1, textPreview: 'Elemently' },
        { tagName: 'nav', className: 'main-nav', selector: 'nav.main-nav', childrenCount: 4 },
      ],
    },
    {
      tagName: 'main',
      id: 'main-content',
      selector: 'main#main-content',
      childrenCount: 2,
      children: [
        { tagName: 'section', className: 'hero-section', selector: 'section.hero-section', childrenCount: 3 },
        { tagName: 'section', className: 'features-grid', selector: 'section.features-grid', childrenCount: 6 },
      ],
    },
    {
      tagName: 'footer',
      className: 'border-t border-slate-800 py-12',
      selector: 'footer',
      childrenCount: 1,
    },
  ],
};

const MOCK_OVERVIEW: PageOverview = {
  url: 'https://elemently.dev',
  title: 'Elemently – Explore Every Element',
  viewportWidth: 1440,
  viewportHeight: 900,
  domNodeCount: 348,
  colorsCount: 7,
  fontsCount: 4,
  assetsCount: 4,
  a11yScore: 88,
};

interface ElementlyDataContextType {
  isInspecting: boolean;
  toggleInspect: () => Promise<void>;
  selectedElement: InspectedElement | null;
  setSelectedElement: (el: InspectedElement | null) => void;
  pageOverview: PageOverview;
  pageColors: ColorMetric[];
  pageFonts: FontMetric[];
  pageAssets: AssetMetric[];
  pageA11y: A11yReport;
  domTree: DOMTreeNode;
  isLoading: boolean;
  activeTab: chrome.tabs.Tab | null;
  refreshPageData: () => Promise<void>;
  selectElementBySelector: (selector: string) => Promise<void>;
  hoverElement: (selector: string) => Promise<void>;
  scrollToElement: (selector: string) => Promise<void>;
  triggerEyedropper: () => Promise<string | null>;
  favorites: StorageData['favorites'];
  addFavoriteColor: (color: ColorMetric) => Promise<void>;
  removeFavoriteColor: (hex: string) => Promise<void>;
  addFavoriteFont: (font: FontMetric) => Promise<void>;
  removeFavoriteFont: (family: string) => Promise<void>;
  addFavoriteSnippet: (title: string, css: string, tags?: string[]) => Promise<void>;
  removeFavoriteSnippet: (id: string) => Promise<void>;
  collections: SavedCollection[];
  createCollection: (name: string, description?: string) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
}

const ElementlyDataContext = createContext<ElementlyDataContextType | null>(null);

export const ElementlyDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInspecting, setIsInspecting] = useState(false);
  const [selectedElement, setSelectedElement] = useState<InspectedElement | null>(MOCK_ELEMENT);
  const [pageOverview, setPageOverview] = useState<PageOverview>(MOCK_OVERVIEW);
  const [pageColors, setPageColors] = useState<ColorMetric[]>(MOCK_COLORS);
  const [pageFonts, setPageFonts] = useState<FontMetric[]>(MOCK_FONTS);
  const [pageAssets, setPageAssets] = useState<AssetMetric[]>(MOCK_ASSETS);
  const [pageA11y, setPageA11y] = useState<A11yReport>(MOCK_A11Y);
  const [domTree, setDomTree] = useState<DOMTreeNode>(MOCK_DOM_TREE);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | null>(null);

  const [favorites, setFavoritesState] = useState<StorageData['favorites']>({
    colors: [MOCK_COLORS[0], MOCK_COLORS[1]],
    fonts: [MOCK_FONTS[0]],
    snippets: [
      { id: 'snip-1', title: 'Purple Glassmorphism', css: 'background: rgba(139, 92, 246, 0.15);\nbackdrop-filter: blur(12px);\nborder: 1px solid rgba(139, 92, 246, 0.3);\nborder-radius: 12px;', tags: ['glass', 'gradient', 'modern'] },
    ],
    elements: [],
  });

  const [collections, setCollectionsState] = useState<SavedCollection[]>([
    {
      id: 'col-1',
      name: 'Default Palette & Typography',
      description: 'Elemently Brand Core Tokens',
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now(),
      colors: [MOCK_COLORS[0], MOCK_COLORS[1]],
      fonts: [MOCK_FONTS[0]],
      snippets: [],
      elements: [],
    },
  ]);

  // Load storage data
  useEffect(() => {
    StorageService.getFavorites().then((favs) => {
      if (favs && (favs.colors.length || favs.fonts.length || favs.snippets.length)) {
        setFavoritesState(favs);
      }
    });
    StorageService.getCollections().then((cols) => {
      if (cols && cols.length) setCollectionsState(cols);
    });
  }, []);

  // Listen for active tab and messages from content script
  useEffect(() => {
    if (!isChromeRuntimeAvailable()) return;

    ChromeMessagingService.getActiveTab().then((tab) => {
      if (tab) {
        setActiveTab(tab);
        if (tab.title && tab.url) {
          setPageOverview((prev) => ({
            ...prev,
            title: tab.title || prev.title,
            url: tab.url || prev.url,
          }));
        }
      }
    });

    const unsubscribe = ChromeMessagingService.onMessage((msg) => {
      if (msg.type === 'ELEMENT_SELECTED' && 'payload' in msg) {
        setSelectedElement(msg.payload);
        setIsInspecting(false);
      } else if (msg.type === 'EYEDROPPER_RESULT' && 'hex' in msg) {
        StorageService.addRecentColor(msg.hex);
      }
    });

    return () => unsubscribe();
  }, []);

  const refreshPageData = useCallback(async () => {
    setIsLoading(true);
    try {
      const tab = await ChromeMessagingService.getActiveTab();
      if (tab) setActiveTab(tab);

      const [overviewRes, colorsRes, fontsRes, assetsRes, a11yRes, domRes] = await Promise.all([
        ChromeMessagingService.sendMessageToActiveTab({ type: 'GET_PAGE_OVERVIEW' }),
        ChromeMessagingService.sendMessageToActiveTab({ type: 'GET_PAGE_COLORS' }),
        ChromeMessagingService.sendMessageToActiveTab({ type: 'GET_PAGE_FONTS' }),
        ChromeMessagingService.sendMessageToActiveTab({ type: 'GET_PAGE_ASSETS' }),
        ChromeMessagingService.sendMessageToActiveTab({ type: 'GET_PAGE_A11Y' }),
        ChromeMessagingService.sendMessageToActiveTab({ type: 'GET_DOM_TREE' }),
      ]);

      if (overviewRes?.payload) setPageOverview(overviewRes.payload);
      if (colorsRes?.payload) setPageColors(colorsRes.payload);
      if (fontsRes?.payload) setPageFonts(fontsRes.payload);
      if (assetsRes?.payload) setPageAssets(assetsRes.payload);
      if (a11yRes?.payload) setPageA11y(a11yRes.payload);
      if (domRes?.payload) setDomTree(domRes.payload);
    } catch (e) {
      console.warn('Could not refresh page data:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleInspect = useCallback(async () => {
    const nextState = !isInspecting;
    setIsInspecting(nextState);

    await ChromeMessagingService.sendMessageToActiveTab({
      type: nextState ? 'START_INSPECTOR' : 'STOP_INSPECTOR',
    });
  }, [isInspecting]);

  const selectElementBySelector = useCallback(async (selector: string) => {
    const res = await ChromeMessagingService.sendMessageToActiveTab({
      type: 'SELECT_ELEMENT_BY_SELECTOR',
      selector,
    });
    if (res?.payload) {
      setSelectedElement(res.payload);
    }
  }, []);

  const hoverElement = useCallback(async (selector: string) => {
    await ChromeMessagingService.sendMessageToActiveTab({
      type: 'HOVER_ELEMENT',
      selector,
    });
  }, []);

  const scrollToElement = useCallback(async (selector: string) => {
    await ChromeMessagingService.sendMessageToActiveTab({
      type: 'SCROLL_TO_ELEMENT',
      selector,
    });
  }, []);

  const triggerEyedropper = useCallback(async (): Promise<string | null> => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const res = await eyeDropper.open();
        if (res?.sRGBHex) {
          await StorageService.addRecentColor(res.sRGBHex);
          return res.sRGBHex;
        }
      } catch {
        return null;
      }
    }

    const res = await ChromeMessagingService.sendMessageToActiveTab({ type: 'TRIGGER_EYEDROPPER' });
    if (res?.hex) {
      await StorageService.addRecentColor(res.hex);
      return res.hex;
    }
    return null;
  }, []);

  const addFavoriteColor = useCallback(async (color: ColorMetric) => {
    setFavoritesState((prev) => {
      const exists = prev.colors.some((c) => c.hex.toLowerCase() === color.hex.toLowerCase());
      if (exists) return prev;
      const updated = { ...prev, colors: [color, ...prev.colors] };
      StorageService.saveFavorites(updated);
      return updated;
    });
  }, []);

  const removeFavoriteColor = useCallback(async (hex: string) => {
    setFavoritesState((prev) => {
      const updated = {
        ...prev,
        colors: prev.colors.filter((c) => c.hex.toLowerCase() !== hex.toLowerCase()),
      };
      StorageService.saveFavorites(updated);
      return updated;
    });
  }, []);

  const addFavoriteFont = useCallback(async (font: FontMetric) => {
    setFavoritesState((prev) => {
      const exists = prev.fonts.some((f) => f.family.toLowerCase() === font.family.toLowerCase());
      if (exists) return prev;
      const updated = { ...prev, fonts: [font, ...prev.fonts] };
      StorageService.saveFavorites(updated);
      return updated;
    });
  }, []);

  const removeFavoriteFont = useCallback(async (family: string) => {
    setFavoritesState((prev) => {
      const updated = {
        ...prev,
        fonts: prev.fonts.filter((f) => f.family.toLowerCase() !== family.toLowerCase()),
      };
      StorageService.saveFavorites(updated);
      return updated;
    });
  }, []);

  const addFavoriteSnippet = useCallback(async (title: string, css: string, tags: string[] = []) => {
    const newSnippet = { id: `snip-${Date.now()}`, title, css, tags };
    setFavoritesState((prev) => {
      const updated = { ...prev, snippets: [newSnippet, ...prev.snippets] };
      StorageService.saveFavorites(updated);
      return updated;
    });
  }, []);

  const removeFavoriteSnippet = useCallback(async (id: string) => {
    setFavoritesState((prev) => {
      const updated = {
        ...prev,
        snippets: prev.snippets.filter((s) => s.id !== id),
      };
      StorageService.saveFavorites(updated);
      return updated;
    });
  }, []);

  const createCollection = useCallback(async (name: string, description?: string) => {
    const newCol: SavedCollection = {
      id: `col-${Date.now()}`,
      name,
      description,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      colors: [],
      fonts: [],
      snippets: [],
      elements: [],
    };
    setCollectionsState((prev) => {
      const updated = [newCol, ...prev];
      StorageService.saveCollections(updated);
      return updated;
    });
  }, []);

  const deleteCollection = useCallback(async (id: string) => {
    setCollectionsState((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      StorageService.saveCollections(updated);
      return updated;
    });
  }, []);

  return (
    <ElementlyDataContext.Provider
      value={{
        isInspecting,
        toggleInspect,
        selectedElement,
        setSelectedElement,
        pageOverview,
        pageColors,
        pageFonts,
        pageAssets,
        pageA11y,
        domTree,
        isLoading,
        activeTab,
        refreshPageData,
        selectElementBySelector,
        hoverElement,
        scrollToElement,
        triggerEyedropper,
        favorites,
        addFavoriteColor,
        removeFavoriteColor,
        addFavoriteFont,
        removeFavoriteFont,
        addFavoriteSnippet,
        removeFavoriteSnippet,
        collections,
        createCollection,
        deleteCollection,
      }}
    >
      {children}
    </ElementlyDataContext.Provider>
  );
};

export const useElementlyData = (): ElementlyDataContextType => {
  const context = useContext(ElementlyDataContext);
  if (!context) {
    throw new Error('useElementlyData must be used within an ElementlyDataProvider');
  }
  return context;
};

