import { InspectedElement, BoxModel, ElementDimensions, ElementHierarchyNode } from '../types/element';

export class DOMInspector {
  private active = false;
  private overlayContainer: HTMLElement | null = null;
  private highlightBox: HTMLElement | null = null;
  private badge: HTMLElement | null = null;
  private currentTarget: HTMLElement | null = null;
  private onSelectCallback?: (element: InspectedElement) => void;

  constructor() {
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  public start(onSelect: (element: InspectedElement) => void) {
    if (this.active) return;
    this.active = true;
    this.onSelectCallback = onSelect;

    this.createOverlay();
    window.addEventListener('mousemove', this.handleMouseMove, true);
    window.addEventListener('click', this.handleClick, true);
    window.addEventListener('keydown', this.handleKeyDown, true);
  }

  public stop() {
    if (!this.active) return;
    this.active = false;
    this.onSelectCallback = undefined;
    this.currentTarget = null;

    window.removeEventListener('mousemove', this.handleMouseMove, true);
    window.removeEventListener('click', this.handleClick, true);
    window.removeEventListener('keydown', this.handleKeyDown, true);

    this.removeOverlay();
  }

  public isActive(): boolean {
    return this.active;
  }

  private createOverlay() {
    if (this.overlayContainer) return;

    const container = document.createElement('div');
    container.id = '__elemently-overlay-host__';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 2147483647;
      margin: 0;
      padding: 0;
      border: none;
      overflow: hidden;
      display: block;
    `;

    const box = document.createElement('div');
    box.id = '__elemently-highlight-box__';
    box.style.cssText = `
      position: absolute;
      border: 2px solid #8b5cf6;
      background: rgba(139, 92, 246, 0.18);
      box-sizing: border-box;
      pointer-events: none;
      display: none;
      transition: all 0.05s ease-out;
      border-radius: 2px;
      box-shadow: 0 0 12px rgba(139, 92, 246, 0.4);
    `;

    const badge = document.createElement('div');
    badge.id = '__elemently-badge__';
    badge.style.cssText = `
      position: absolute;
      top: -28px;
      left: 0;
      background: #0f172a;
      color: #f8fafc;
      padding: 3px 8px;
      font-size: 11px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 600;
      border-radius: 4px;
      border: 1px solid #334155;
      white-space: nowrap;
      pointer-events: none;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      gap: 6px;
    `;

    box.appendChild(badge);
    container.appendChild(box);
    document.documentElement.appendChild(container);

    this.overlayContainer = container;
    this.highlightBox = box;
    this.badge = badge;
  }

  private removeOverlay() {
    if (this.overlayContainer && this.overlayContainer.parentNode) {
      this.overlayContainer.parentNode.removeChild(this.overlayContainer);
    }
    this.overlayContainer = null;
    this.highlightBox = null;
    this.badge = null;
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.active) return;

    const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
    if (!target || target === this.currentTarget || target.id?.startsWith('__elemently-')) {
      return;
    }

    this.currentTarget = target;
    this.updateHighlight(target);
  }

  public updateHighlight(target: HTMLElement) {
    if (!this.highlightBox || !this.badge) return;

    const rect = target.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);

    this.highlightBox.style.display = 'block';
    this.highlightBox.style.top = `${rect.top}px`;
    this.highlightBox.style.left = `${rect.left}px`;
    this.highlightBox.style.width = `${rect.width}px`;
    this.highlightBox.style.height = `${rect.height}px`;

    // Reposition badge if offscreen at the top
    if (rect.top < 32) {
      this.badge.style.top = 'auto';
      this.badge.style.bottom = '-28px';
    } else {
      this.badge.style.top = '-28px';
      this.badge.style.bottom = 'auto';
    }

    const tag = target.tagName.toLowerCase();
    const id = target.id ? `#${target.id}` : '';
    const firstClass = target.classList.length ? `.${target.classList[0]}` : '';

    this.badge.innerHTML = `
      <span style="color: #a78bfa;">${tag}${id}${firstClass}</span>
      <span style="color: #94a3b8;">${w} × ${h}px</span>
    `;
  }

  private handleClick(e: MouseEvent) {
    if (!this.active) return;

    e.preventDefault();
    e.stopPropagation();

    const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
    if (!target || target.id?.startsWith('__elemently-')) return;

    const inspected = this.extractElementDetails(target);
    if (this.onSelectCallback) {
      this.onSelectCallback(inspected);
    }

    this.stop();
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && this.active) {
      this.stop();
    }
  }

  public selectElementBySelector(selector: string): InspectedElement | null {
    try {
      const el = document.querySelector(selector) as HTMLElement;
      if (el) {
        this.createOverlay();
        this.updateHighlight(el);
        return this.extractElementDetails(el);
      }
    } catch (e) {
      console.warn('Invalid selector:', selector, e);
    }
    return null;
  }

  public scrollToElement(selector: string) {
    try {
      const el = document.querySelector(selector) as HTMLElement;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        this.createOverlay();
        this.updateHighlight(el);
      }
    } catch (e) {
      // ignore
    }
  }

  public extractElementDetails(el: HTMLElement): InspectedElement {
    const rect = el.getBoundingClientRect();
    const computed = window.getComputedStyle(el);

    // Box model values
    const parse = (val: string) => parseFloat(val) || 0;
    const boxModel: BoxModel = {
      margin: {
        top: parse(computed.marginTop),
        right: parse(computed.marginRight),
        bottom: parse(computed.marginBottom),
        left: parse(computed.marginLeft),
      },
      border: {
        top: parse(computed.borderTopWidth),
        right: parse(computed.borderRightWidth),
        bottom: parse(computed.borderBottomWidth),
        left: parse(computed.borderLeftWidth),
      },
      padding: {
        top: parse(computed.paddingTop),
        right: parse(computed.paddingRight),
        bottom: parse(computed.paddingBottom),
        left: parse(computed.paddingLeft),
      },
      content: {
        width: Math.round(rect.width - parse(computed.paddingLeft) - parse(computed.paddingRight) - parse(computed.borderLeftWidth) - parse(computed.borderRightWidth)),
        height: Math.round(rect.height - parse(computed.paddingTop) - parse(computed.paddingBottom) - parse(computed.borderTopWidth) - parse(computed.borderBottomWidth)),
      },
    };

    const dimensions: ElementDimensions = {
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      top: Math.round(rect.top + window.scrollY),
      left: Math.round(rect.left + window.scrollX),
      right: Math.round(rect.right + window.scrollX),
      bottom: Math.round(rect.bottom + window.scrollY),
      x: Math.round(rect.x),
      y: Math.round(rect.y),
    };

    // Computed styles dictionary
    const computedStyles: Record<string, string> = {};
    for (let i = 0; i < computed.length; i++) {
      const prop = computed[i];
      computedStyles[prop] = computed.getPropertyValue(prop);
    }

    // Inline styles dictionary
    const inlineStyles: Record<string, string> = {};
    if (el.style) {
      for (let i = 0; i < el.style.length; i++) {
        const prop = el.style[i];
        inlineStyles[prop] = el.style.getPropertyValue(prop);
      }
    }

    // CSS custom properties (--*)
    const cssVariables: Record<string, string> = {};
    for (let i = 0; i < computed.length; i++) {
      const prop = computed[i];
      if (prop.startsWith('--')) {
        cssVariables[prop] = computed.getPropertyValue(prop);
      }
    }

    // Attributes
    const attributes: Record<string, string> = {};
    for (let i = 0; i < el.attributes.length; i++) {
      const attr = el.attributes[i];
      attributes[attr.name] = attr.value;
    }

    // DOM Hierarchy
    const hierarchy: ElementHierarchyNode[] = [];
    let curr: HTMLElement | null = el;
    while (curr && curr !== document.documentElement.parentElement) {
      hierarchy.unshift({
        tagName: curr.tagName.toLowerCase(),
        id: curr.id || undefined,
        className: curr.className && typeof curr.className === 'string' ? curr.className : undefined,
        selector: this.generateCSSSelector(curr),
      });
      curr = curr.parentElement;
    }

    // Parent
    const parent = el.parentElement
      ? {
          tagName: el.parentElement.tagName.toLowerCase(),
          id: el.parentElement.id || undefined,
          className: el.parentElement.className && typeof el.parentElement.className === 'string' ? el.parentElement.className : undefined,
          selector: this.generateCSSSelector(el.parentElement),
        }
      : undefined;

    // Children
    const children: ElementHierarchyNode[] = Array.from(el.children).map((child) => ({
      tagName: child.tagName.toLowerCase(),
      id: child.id || undefined,
      className: child.className && typeof child.className === 'string' ? child.className : undefined,
      selector: this.generateCSSSelector(child as HTMLElement),
    }));

    return {
      tagName: el.tagName.toLowerCase(),
      id: el.id || '',
      className: typeof el.className === 'string' ? el.className : '',
      classList: Array.from(el.classList || []),
      selector: this.generateCSSSelector(el),
      xpath: this.generateXPath(el),
      dimensions,
      boxModel,
      hierarchy,
      parent,
      children,
      computedStyles,
      inlineStyles,
      cssVariables,
      outerHTML: el.outerHTML.slice(0, 5000), // safe limit for messaging
      innerHTML: el.innerHTML.slice(0, 5000),
      textContent: (el.textContent || '').trim().slice(0, 1000),
      attributes,
    };
  }

  public generateCSSSelector(el: HTMLElement): string {
    if (el.id) {
      return `#${CSS.escape(el.id)}`;
    }

    if (el.tagName.toLowerCase() === 'body') return 'body';
    if (el.tagName.toLowerCase() === 'html') return 'html';

    let path = el.tagName.toLowerCase();
    if (el.className && typeof el.className === 'string') {
      const classes = el.className
        .trim()
        .split(/\s+/)
        .filter((c) => c && !c.includes(':') && !c.includes('/'))
        .slice(0, 2);
      if (classes.length) {
        path += '.' + classes.map((c) => CSS.escape(c)).join('.');
      }
    }

    if (el.parentElement) {
      const siblings = Array.from(el.parentElement.children).filter((s) => s.tagName === el.tagName);
      if (siblings.length > 1) {
        const index = siblings.indexOf(el) + 1;
        path += `:nth-of-type(${index})`;
      }
    }

    return path;
  }

  public generateXPath(el: HTMLElement): string {
    if (el.id) {
      return `//*[@id="${el.id}"]`;
    }
    const parts: string[] = [];
    let current: HTMLElement | null = el;
    while (current && current.nodeType === Node.ELEMENT_NODE) {
      let index = 1;
      let sibling = current.previousElementSibling;
      while (sibling) {
        if (sibling.tagName === current.tagName) {
          index++;
        }
        sibling = sibling.previousElementSibling;
      }
      parts.unshift(`${current.tagName.toLowerCase()}[${index}]`);
      current = current.parentElement;
    }
    return '/' + parts.join('/');
  }
}

