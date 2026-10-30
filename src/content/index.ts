import { DOMInspector } from './inspector';
import {
  extractPageOverview,
  extractPageColors,
  extractPageFonts,
  extractPageAssets,
  extractPageA11y,
  extractDOMTree,
} from './extractor';
import { ExtensionMessage } from '../types/messages';

console.log('⚡ Elemently content script initialized');

const inspector = new DOMInspector();

chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => {
  switch (message.type) {
    case 'PING':
      sendResponse({ type: 'PONG' });
      return false;

    case 'START_INSPECTOR':
      inspector.start((element) => {
        chrome.runtime.sendMessage({
          type: 'ELEMENT_SELECTED',
          payload: element,
        });
      });
      sendResponse({ success: true, active: true });
      return false;

    case 'STOP_INSPECTOR':
      inspector.stop();
      sendResponse({ success: true, active: false });
      return false;

    case 'GET_INSPECTOR_STATUS':
      sendResponse({ active: inspector.isActive() });
      return false;

    case 'HOVER_ELEMENT':
      if ('selector' in message && message.selector) {
        inspector.selectElementBySelector(message.selector);
      }
      sendResponse({ success: true });
      return false;

    case 'SELECT_ELEMENT_BY_SELECTOR':
      if ('selector' in message && message.selector) {
        const details = inspector.selectElementBySelector(message.selector);
        sendResponse({ success: !!details, payload: details });
      } else {
        sendResponse({ success: false });
      }
      return false;

    case 'SCROLL_TO_ELEMENT':
      if ('selector' in message && message.selector) {
        inspector.scrollToElement(message.selector);
      }
      sendResponse({ success: true });
      return false;

    case 'GET_PAGE_OVERVIEW':
      sendResponse({ type: 'PAGE_OVERVIEW_RESPONSE', payload: extractPageOverview() });
      return false;

    case 'GET_PAGE_COLORS':
      sendResponse({ type: 'PAGE_COLORS_RESPONSE', payload: extractPageColors() });
      return false;

    case 'GET_PAGE_FONTS':
      sendResponse({ type: 'PAGE_FONTS_RESPONSE', payload: extractPageFonts() });
      return false;

    case 'GET_PAGE_ASSETS':
      sendResponse({ type: 'PAGE_ASSETS_RESPONSE', payload: extractPageAssets() });
      return false;

    case 'GET_PAGE_A11Y':
      sendResponse({ type: 'PAGE_A11Y_RESPONSE', payload: extractPageA11y() });
      return false;

    case 'GET_DOM_TREE':
      sendResponse({ type: 'DOM_TREE_RESPONSE', payload: extractDOMTree() });
      return false;

    case 'TRIGGER_EYEDROPPER':
      if ('EyeDropper' in window) {
        try {
          const eyeDropper = new (window as any).EyeDropper();
          eyeDropper
            .open()
            .then((result: { sRGBHex: string }) => {
              chrome.runtime.sendMessage({
                type: 'EYEDROPPER_RESULT',
                hex: result.sRGBHex,
              });
              sendResponse({ success: true, hex: result.sRGBHex });
            })
            .catch(() => {
              sendResponse({ success: false, error: 'User canceled eyedropper' });
            });
          return true; // asynchronous response
        } catch (e: any) {
          sendResponse({ success: false, error: e.message });
        }
      } else {
        sendResponse({ success: false, error: 'EyeDropper API not supported in this browser' });
      }
      return false;

    default:
      return false;
  }
});

