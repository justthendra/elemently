export interface ColorMetric {
  hex: string;
  rgb: string;
  rgba: string;
  hsl: string;
  hsla: string;
  types: ('text' | 'background' | 'border' | 'gradient')[];
  count: number;
  contrastWithWhite: number;
  contrastWithBlack: number;
}

export interface FontMetric {
  family: string;
  category: 'google' | 'system' | 'custom';
  weights: string[];
  sizes: string[];
  elementsCount: number;
  googleFontsUrl?: string;
}

export interface AssetMetric {
  id: string;
  url: string;
  type: 'image' | 'svg' | 'background' | 'video' | 'audio';
  format: string;
  naturalWidth?: number;
  naturalHeight?: number;
  renderedWidth: number;
  renderedHeight: number;
  alt?: string;
  selector?: string;
}

export interface A11yIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  category: 'contrast' | 'alt' | 'heading' | 'aria' | 'keyboard' | 'form';
  message: string;
  selector?: string;
  tagName?: string;
  details?: string;
}

export interface A11yReport {
  score: number;
  errorsCount: number;
  warningsCount: number;
  infoCount: number;
  issues: A11yIssue[];
  headingHierarchy: { level: number; text: string; selector: string }[];
}

export interface DOMTreeNode {
  tagName: string;
  id?: string;
  className?: string;
  selector: string;
  childrenCount: number;
  children?: DOMTreeNode[];
  textPreview?: string;
}

export interface PageOverview {
  url: string;
  title: string;
  viewportWidth: number;
  viewportHeight: number;
  domNodeCount: number;
  colorsCount: number;
  fontsCount: number;
  assetsCount: number;
  a11yScore: number;
}

