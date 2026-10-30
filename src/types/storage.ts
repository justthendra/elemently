import { LocaleCode } from '../locales';
import { InspectedElement } from './element';
import { ColorMetric, FontMetric } from './page-metrics';

export type AppTheme = 'dark' | 'light' | 'system';
export type InterfaceDensity = 'comfortable' | 'compact';

export interface UserSettings {
  language: LocaleCode;
  theme: AppTheme;
  accentColor: string;
  density: InterfaceDensity;
  hoverHighlight: boolean;
  showDimensions: boolean;
  showBreadcrumbs: boolean;
  overlayOpacity: number;
}

export interface SavedCollection {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  colors: ColorMetric[];
  fonts: FontMetric[];
  snippets: { id: string; title: string; css: string; tags: string[] }[];
  elements: { id: string; name: string; element: Partial<InspectedElement> }[];
}

export interface StorageData {
  settings: UserSettings;
  favorites: {
    colors: ColorMetric[];
    fonts: FontMetric[];
    snippets: { id: string; title: string; css: string; tags: string[] }[];
    elements: { id: string; name: string; element: Partial<InspectedElement> }[];
  };
  collections: SavedCollection[];
  recentElements: Partial<InspectedElement>[];
  recentColors: string[];
}

export const DEFAULT_SETTINGS: UserSettings = {
  language: 'en-US',
  theme: 'dark',
  accentColor: '#8b5cf6', // Indigo-purple
  density: 'comfortable',
  hoverHighlight: true,
  showDimensions: true,
  showBreadcrumbs: true,
  overlayOpacity: 0.15,
};

