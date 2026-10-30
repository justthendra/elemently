import { ExtensionMessage } from '../types/messages';

export const isChromeRuntimeAvailable = (): boolean => {
  return typeof chrome !== 'undefined' && !!chrome.runtime && !!chrome.runtime.sendMessage;
};

export const isChromeTabsAvailable = (): boolean => {
  return typeof chrome !== 'undefined' && !!chrome.tabs && !!chrome.tabs.query;
};

export const ChromeMessagingService = {
  async getActiveTab(): Promise<chrome.tabs.Tab | null> {
    if (!isChromeTabsAvailable()) return null;
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      return tabs[0] || null;
    } catch (e) {
      console.warn('Could not query active tab:', e);
      return null;
    }
  },

  async ensureContentScriptInjected(tabId: number): Promise<boolean> {
    try {
      // Ping content script
      const response = await chrome.tabs.sendMessage(tabId, { type: 'PING' });
      if (response?.type === 'PONG') return true;
    } catch {
      // Ping failed, inject script programmatically
      try {
        if (chrome.scripting) {
          await chrome.scripting.executeScript({
            target: { tabId },
            files: ['content.js'],
          });
          return true;
        }
      } catch (err) {
        console.warn('Cannot inject content script:', err);
      }
    }
    return false;
  },

  async sendMessageToActiveTab<T = any>(message: ExtensionMessage): Promise<T | null> {
    const tab = await this.getActiveTab();
    if (!tab || !tab.id) {
      console.warn('No active tab found');
      return null;
    }

    // Ignore restricted schemes
    if (tab.url?.startsWith('chrome://') || tab.url?.startsWith('chrome-extension://') || tab.url?.startsWith('edge://')) {
      console.warn('Cannot inspect restricted browser pages');
      return null;
    }

    try {
      await this.ensureContentScriptInjected(tab.id);
      return await chrome.tabs.sendMessage(tab.id, message);
    } catch (err) {
      console.warn('Failed to send message to tab:', err);
      return null;
    }
  },

  onMessage(listener: (message: ExtensionMessage, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => void): () => void {
    if (!isChromeRuntimeAvailable()) {
      return () => {};
    }

    const handler = (msg: any, sender: chrome.runtime.MessageSender, sendResponse: (resp?: any) => void) => {
      listener(msg, sender, sendResponse);
    };

    chrome.runtime.onMessage.addListener(handler);
    return () => {
      chrome.runtime.onMessage.removeListener(handler);
    };
  },
};

