export interface BoxModel {
  margin: { top: number; right: number; bottom: number; left: number };
  border: { top: number; right: number; bottom: number; left: number };
  padding: { top: number; right: number; bottom: number; left: number };
  content: { width: number; height: number };
}

export interface ElementDimensions {
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
  x: number;
  y: number;
}

export interface ElementHierarchyNode {
  tagName: string;
  id?: string;
  className?: string;
  selector: string;
}

export interface InspectedElement {
  tagName: string;
  id: string;
  className: string;
  classList: string[];
  selector: string;
  xpath: string;
  dimensions: ElementDimensions;
  boxModel: BoxModel;
  hierarchy: ElementHierarchyNode[];
  parent?: ElementHierarchyNode;
  children: ElementHierarchyNode[];
  computedStyles: Record<string, string>;
  inlineStyles: Record<string, string>;
  cssVariables: Record<string, string>;
  outerHTML: string;
  innerHTML: string;
  textContent: string;
  attributes: Record<string, string>;
}

