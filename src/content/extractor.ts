import { ColorMetric, FontMetric, AssetMetric, A11yReport, A11yIssue, DOMTreeNode, PageOverview } from '../types/page-metrics';

// Color utilities
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function parseRgba(str: string): { r: number; g: number; b: number; a: number } | null {
  const match = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return null;
  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
    a: match[4] !== undefined ? parseFloat(match[4]) : 1,
  };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(lum1: number, lum2: number): number {
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
}

export function extractPageColors(): ColorMetric[] {
  const colorMap = new Map<string, { types: Set<'text' | 'background' | 'border' | 'gradient'>; count: number; parsed: { r: number; g: number; b: number; a: number } }>();

  const elements = Array.from(document.querySelectorAll('*')).slice(0, 1500);

  elements.forEach((el) => {
    if (el.id?.startsWith('__elemently-')) return;
    try {
      const style = window.getComputedStyle(el);

      // Text color
      const textColor = style.color;
      const parsedText = parseRgba(textColor);
      if (parsedText && parsedText.a > 0.05) {
        const hex = rgbToHex(parsedText.r, parsedText.g, parsedText.b);
        const existing = colorMap.get(hex) || { types: new Set(), count: 0, parsed: parsedText };
        existing.types.add('text');
        existing.count += 1;
        colorMap.set(hex, existing);
      }

      // Background color
      const bgColor = style.backgroundColor;
      const parsedBg = parseRgba(bgColor);
      if (parsedBg && parsedBg.a > 0.05) {
        const hex = rgbToHex(parsedBg.r, parsedBg.g, parsedBg.b);
        const existing = colorMap.get(hex) || { types: new Set(), count: 0, parsed: parsedBg };
        existing.types.add('background');
        existing.count += 1;
        colorMap.set(hex, existing);
      }

      // Border color
      if (parseFloat(style.borderWidth) > 0) {
        const borderColor = style.borderColor;
        const parsedBorder = parseRgba(borderColor);
        if (parsedBorder && parsedBorder.a > 0.05) {
          const hex = rgbToHex(parsedBorder.r, parsedBorder.g, parsedBorder.b);
          const existing = colorMap.get(hex) || { types: new Set(), count: 0, parsed: parsedBorder };
          existing.types.add('border');
          existing.count += 1;
          colorMap.set(hex, existing);
        }
      }

      // Gradients in backgroundImage
      const bgImg = style.backgroundImage;
      if (bgImg && (bgImg.includes('gradient') || bgImg.includes('linear-gradient') || bgImg.includes('radial-gradient'))) {
        const matches = bgImg.match(/rgba?\([^)]+\)/g);
        if (matches) {
          matches.forEach((colorStr) => {
            const parsed = parseRgba(colorStr);
            if (parsed && parsed.a > 0.05) {
              const hex = rgbToHex(parsed.r, parsed.g, parsed.b);
              const existing = colorMap.get(hex) || { types: new Set(), count: 0, parsed };
              existing.types.add('gradient');
              existing.count += 1;
              colorMap.set(hex, existing);
            }
          });
        }
      }
    } catch {
      // ignore
    }
  });

  const whiteLum = getLuminance(255, 255, 255);
  const blackLum = getLuminance(0, 0, 0);

  const results: ColorMetric[] = [];
  colorMap.forEach((val, hex) => {
    const { r, g, b, a } = val.parsed;
    const hsl = rgbToHsl(r, g, b);
    const lum = getLuminance(r, g, b);

    results.push({
      hex,
      rgb: `rgb(${r}, ${g}, ${b})`,
      rgba: `rgba(${r}, ${g}, ${b}, ${a})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      hsla: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${a})`,
      types: Array.from(val.types),
      count: val.count,
      contrastWithWhite: getContrastRatio(lum, whiteLum),
      contrastWithBlack: getContrastRatio(lum, blackLum),
    });
  });

  return results.sort((a, b) => b.count - a.count);
}

export function extractPageFonts(): FontMetric[] {
  const fontMap = new Map<string, { weights: Set<string>; sizes: Set<string>; count: number }>();

  // Check Google Fonts / Web fonts linked in <head>
  const googleFontsUrls: string[] = [];
  const linkTags = document.querySelectorAll('link[rel="stylesheet"], link[as="style"]');
  linkTags.forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href.includes('fonts.googleapis.com')) {
      googleFontsUrls.push(href);
    }
  });

  const elements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, input, label, li, td, th')).slice(0, 1500);

  elements.forEach((el) => {
    if (el.id?.startsWith('__elemently-')) return;
    try {
      const style = window.getComputedStyle(el);
      const rawFamily = style.fontFamily;
      if (!rawFamily) return;

      // Extract primary font name
      const primary = rawFamily.split(',')[0].trim().replace(/^['"]|['"]$/g, '');
      if (!primary) return;

      const existing = fontMap.get(primary) || { weights: new Set(), sizes: new Set(), count: 0 };
      existing.weights.add(style.fontWeight);
      existing.sizes.add(style.fontSize);
      existing.count += 1;
      fontMap.set(primary, existing);
    } catch {
      // ignore
    }
  });

  const results: FontMetric[] = [];
  fontMap.forEach((data, family) => {
    const isGoogle = googleFontsUrls.some((url) => url.toLowerCase().includes(family.toLowerCase().replace(/\s+/g, '+')));
    const isSystem = ['Arial', 'Helvetica', 'Times New Roman', 'sans-serif', 'serif', 'monospace', 'Segoe UI', 'Roboto', 'system-ui', '-apple-system'].includes(family);

    results.push({
      family,
      category: isGoogle ? 'google' : isSystem ? 'system' : 'custom',
      weights: Array.from(data.weights).sort(),
      sizes: Array.from(data.sizes).sort((a, b) => parseFloat(a) - parseFloat(b)),
      elementsCount: data.count,
      googleFontsUrl: isGoogle ? googleFontsUrls[0] : undefined,
    });
  });

  return results.sort((a, b) => b.elementsCount - a.elementsCount);
}

export function extractPageAssets(): AssetMetric[] {
  const assets: AssetMetric[] = [];
  const seenUrls = new Set<string>();

  // 1. <img> and <picture> tags
  document.querySelectorAll('img').forEach((img, idx) => {
    const src = img.currentSrc || img.src;
    if (!src || src.startsWith('data:image/svg+xml') || seenUrls.has(src)) return;
    seenUrls.add(src);

    const rect = img.getBoundingClientRect();
    const ext = src.split('.').pop()?.split('?')[0]?.toLowerCase() || 'img';

    assets.push({
      id: `img-${idx}`,
      url: src,
      type: 'image',
      format: ext.toUpperCase(),
      naturalWidth: img.naturalWidth || undefined,
      naturalHeight: img.naturalHeight || undefined,
      renderedWidth: Math.round(rect.width),
      renderedHeight: Math.round(rect.height),
      alt: img.alt || undefined,
      selector: img.id ? `#${img.id}` : `img:nth-of-type(${idx + 1})`,
    });
  });

  // 2. Inline SVGs
  document.querySelectorAll('svg').forEach((svg, idx) => {
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;

    assets.push({
      id: `svg-${idx}`,
      url: `Inline SVG (${Math.round(rect.width)} × ${Math.round(rect.height)})`,
      type: 'svg',
      format: 'SVG',
      renderedWidth: Math.round(rect.width),
      renderedHeight: Math.round(rect.height),
      selector: svg.id ? `#${svg.id}` : `svg:nth-of-type(${idx + 1})`,
    });
  });

  // 3. Elements with background-image
  document.querySelectorAll('*').forEach((el, idx) => {
    if (el.id?.startsWith('__elemently-') || idx > 800) return;
    try {
      const style = window.getComputedStyle(el);
      const bg = style.backgroundImage;
      if (bg && bg.startsWith('url(')) {
        const match = bg.match(/url\(["']?([^"']+)["']?\)/);
        if (match && match[1] && !seenUrls.has(match[1])) {
          const url = match[1];
          seenUrls.add(url);
          const rect = el.getBoundingClientRect();
          const ext = url.split('.').pop()?.split('?')[0]?.toLowerCase() || 'bg';

          assets.push({
            id: `bg-${assets.length}`,
            url,
            type: 'background',
            format: ext.toUpperCase(),
            renderedWidth: Math.round(rect.width),
            renderedHeight: Math.round(rect.height),
            selector: el.id ? `#${el.id}` : el.tagName.toLowerCase(),
          });
        }
      }
    } catch {
      // ignore
    }
  });

  // 4. Video & Audio
  document.querySelectorAll('video, audio').forEach((media, idx) => {
    const src = media.getAttribute('src') || media.querySelector('source')?.getAttribute('src');
    if (!src || seenUrls.has(src)) return;
    seenUrls.add(src);

    const isVideo = media.tagName.toLowerCase() === 'video';
    const rect = media.getBoundingClientRect();

    assets.push({
      id: `media-${idx}`,
      url: src,
      type: isVideo ? 'video' : 'audio',
      format: isVideo ? 'MP4 / WEBM' : 'AUDIO',
      renderedWidth: Math.round(rect.width),
      renderedHeight: Math.round(rect.height),
    });
  });

  return assets;
}

export function extractPageA11y(): A11yReport {
  const issues: A11yIssue[] = [];

  // 1. Missing alt attributes on <img>
  document.querySelectorAll('img').forEach((img, idx) => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        id: `alt-${idx}`,
        type: 'error',
        category: 'alt',
        message: 'Image missing required "alt" attribute',
        tagName: 'IMG',
        selector: img.id ? `#${img.id}` : `img:nth-of-type(${idx + 1})`,
        details: img.src ? `Src: ${img.src.slice(0, 60)}...` : undefined,
      });
    } else if (img.getAttribute('alt')?.trim() === '') {
      issues.push({
        id: `alt-empty-${idx}`,
        type: 'info',
        category: 'alt',
        message: 'Empty alt attribute (treated as decorative image)',
        tagName: 'IMG',
        selector: img.id ? `#${img.id}` : `img:nth-of-type(${idx + 1})`,
      });
    }
  });

  // 2. Heading hierarchy (h1 -> h6)
  const headingElements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const headingHierarchy: { level: number; text: string; selector: string }[] = [];

  let lastLevel = 0;
  const h1Count = headingElements.filter((h) => h.tagName === 'H1').length;
  if (h1Count === 0) {
    issues.push({
      id: 'h1-missing',
      type: 'warning',
      category: 'heading',
      message: 'Page does not have an <h1> heading',
      details: 'Each page should ideally have one main <h1> landmark for screen readers.',
    });
  } else if (h1Count > 1) {
    issues.push({
      id: 'h1-multiple',
      type: 'info',
      category: 'heading',
      message: `Page has ${h1Count} <h1> headings`,
      details: 'Best practice is to keep a single primary <h1> per document.',
    });
  }

  headingElements.forEach((h, idx) => {
    const level = parseInt(h.tagName.substring(1), 10);
    const text = (h.textContent || '').trim().slice(0, 50);
    const sel = h.id ? `#${h.id}` : `${h.tagName.toLowerCase()}:nth-of-type(${idx + 1})`;

    headingHierarchy.push({ level, text, selector: sel });

    if (lastLevel > 0 && level > lastLevel + 1) {
      issues.push({
        id: `heading-skip-${idx}`,
        type: 'warning',
        category: 'heading',
        message: `Skipped heading level: <h${lastLevel}> to <h${level}>`,
        selector: sel,
        tagName: h.tagName,
        details: `Heading text: "${text}"`,
      });
    }
    lastLevel = level;
  });

  // 3. Empty buttons and links without aria-label
  document.querySelectorAll('button, a').forEach((el, idx) => {
    const text = (el.textContent || '').trim();
    const ariaLabel = el.getAttribute('aria-label');
    const ariaLabelledBy = el.getAttribute('aria-labelledby');
    const title = el.getAttribute('title');

    if (!text && !ariaLabel && !ariaLabelledBy && !title) {
      issues.push({
        id: `label-missing-${idx}`,
        type: 'error',
        category: 'keyboard',
        message: `Interactive <${el.tagName.toLowerCase()}> has no accessible name or label`,
        tagName: el.tagName,
        selector: el.id ? `#${el.id}` : `${el.tagName.toLowerCase()}:nth-of-type(${idx + 1})`,
      });
    }
  });

  // 4. Form inputs without associated label or aria-label
  document.querySelectorAll('input:not([type="hidden"]), select, textarea').forEach((input, idx) => {
    const hasAria = input.getAttribute('aria-label') || input.getAttribute('aria-labelledby');
    const id = input.id;
    const hasLabel = id && document.querySelector(`label[for="${id}"]`);
    const isWrappedInLabel = input.closest('label');

    if (!hasAria && !hasLabel && !isWrappedInLabel) {
      issues.push({
        id: `form-label-${idx}`,
        type: 'error',
        category: 'form',
        message: 'Form input is missing an accessible label or aria-label',
        tagName: input.tagName,
        selector: input.id ? `#${input.id}` : `${input.tagName.toLowerCase()}:nth-of-type(${idx + 1})`,
      });
    }
  });

  // 5. HTML lang attribute
  if (!document.documentElement.getAttribute('lang')) {
    issues.push({
      id: 'html-lang-missing',
      type: 'warning',
      category: 'aria',
      message: '<html lang="..."> attribute is missing',
      details: 'Screen readers require a valid language code (e.g., lang="en" or lang="tr").',
    });
  }

  // Calculate accessibility score (0 - 100)
  const errors = issues.filter((i) => i.type === 'error').length;
  const warnings = issues.filter((i) => i.type === 'warning').length;
  const info = issues.filter((i) => i.type === 'info').length;

  let score = 100;
  score -= errors * 12;
  score -= warnings * 4;
  score -= info * 1;
  score = Math.max(10, Math.min(100, score));

  return {
    score,
    errorsCount: errors,
    warningsCount: warnings,
    infoCount: info,
    issues,
    headingHierarchy,
  };
}

export function extractDOMTree(): DOMTreeNode {
  function walk(el: HTMLElement, depth = 0): DOMTreeNode {
    const tag = el.tagName.toLowerCase();
    const id = el.id || undefined;
    const className = el.className && typeof el.className === 'string' ? el.className.trim() : undefined;

    let sel = tag;
    if (id) sel += `#${id}`;
    else if (className) sel += `.${className.split(/\s+/)[0]}`;

    const children: DOMTreeNode[] = [];
    if (depth < 6) {
      Array.from(el.children).forEach((child) => {
        if (!child.id?.startsWith('__elemently-') && child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
          children.push(walk(child as HTMLElement, depth + 1));
        }
      });
    }

    const text = el.children.length === 0 ? (el.textContent || '').trim().slice(0, 40) : undefined;

    return {
      tagName: tag,
      id,
      className,
      selector: sel,
      childrenCount: el.children.length,
      children: children.length ? children : undefined,
      textPreview: text,
    };
  }

  return walk(document.body || document.documentElement);
}

export function extractPageOverview(): PageOverview {
  const colors = extractPageColors();
  const fonts = extractPageFonts();
  const assets = extractPageAssets();
  const a11y = extractPageA11y();

  return {
    url: window.location.href,
    title: document.title || window.location.hostname,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    domNodeCount: document.querySelectorAll('*').length,
    colorsCount: colors.length,
    fontsCount: fonts.length,
    assetsCount: assets.length,
    a11yScore: a11y.score,
  };
}

