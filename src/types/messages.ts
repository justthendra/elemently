import { InspectedElement } from './element';
import { ColorMetric, FontMetric, AssetMetric, A11yReport, DOMTreeNode, PageOverview } from './page-metrics';

export type MessageType =
  | 'START_INSPECTOR'
  | 'STOP_INSPECTOR'
  | 'GET_INSPECTOR_STATUS'
  | 'INSPECTOR_STATUS_RESPONSE'
  | 'ELEMENT_SELECTED'
  | 'HOVER_ELEMENT'
  | 'SELECT_ELEMENT_BY_SELECTOR'
  | 'SCROLL_TO_ELEMENT'
  | 'GET_PAGE_OVERVIEW'
  | 'PAGE_OVERVIEW_RESPONSE'
  | 'GET_PAGE_COLORS'
  | 'PAGE_COLORS_RESPONSE'
  | 'GET_PAGE_FONTS'
  | 'PAGE_FONTS_RESPONSE'
  | 'GET_PAGE_ASSETS'
  | 'PAGE_ASSETS_RESPONSE'
  | 'GET_PAGE_A11Y'
  | 'PAGE_A11Y_RESPONSE'
  | 'GET_DOM_TREE'
  | 'DOM_TREE_RESPONSE'
  | 'TRIGGER_EYEDROPPER'
  | 'EYEDROPPER_RESULT'
  | 'PING'
  | 'PONG';

export interface BaseMessage {
  type: MessageType;
}

export interface StartInspectorMessage extends BaseMessage {
  type: 'START_INSPECTOR';
}

export interface StopInspectorMessage extends BaseMessage {
  type: 'STOP_INSPECTOR';
}

export interface ElementSelectedMessage extends BaseMessage {
  type: 'ELEMENT_SELECTED';
  payload: InspectedElement;
}

export interface HoverElementMessage extends BaseMessage {
  type: 'HOVER_ELEMENT';
  selector: string;
}

export interface SelectElementBySelectorMessage extends BaseMessage {
  type: 'SELECT_ELEMENT_BY_SELECTOR';
  selector: string;
}

export interface ScrollToElementMessage extends BaseMessage {
  type: 'SCROLL_TO_ELEMENT';
  selector: string;
}

export interface PageOverviewResponseMessage extends BaseMessage {
  type: 'PAGE_OVERVIEW_RESPONSE';
  payload: PageOverview;
}

export interface PageColorsResponseMessage extends BaseMessage {
  type: 'PAGE_COLORS_RESPONSE';
  payload: ColorMetric[];
}

export interface PageFontsResponseMessage extends BaseMessage {
  type: 'PAGE_FONTS_RESPONSE';
  payload: FontMetric[];
}

export interface PageAssetsResponseMessage extends BaseMessage {
  type: 'PAGE_ASSETS_RESPONSE';
  payload: AssetMetric[];
}

export interface PageA11yResponseMessage extends BaseMessage {
  type: 'PAGE_A11Y_RESPONSE';
  payload: A11yReport;
}

export interface DOMTreeResponseMessage extends BaseMessage {
  type: 'DOM_TREE_RESPONSE';
  payload: DOMTreeNode;
}

export interface EyedropperResultMessage extends BaseMessage {
  type: 'EYEDROPPER_RESULT';
  hex: string;
}

export type ExtensionMessage =
  | StartInspectorMessage
  | StopInspectorMessage
  | ElementSelectedMessage
  | HoverElementMessage
  | SelectElementBySelectorMessage
  | ScrollToElementMessage
  | PageOverviewResponseMessage
  | PageColorsResponseMessage
  | PageFontsResponseMessage
  | PageAssetsResponseMessage
  | PageA11yResponseMessage
  | DOMTreeResponseMessage
  | EyedropperResultMessage
  | BaseMessage;

