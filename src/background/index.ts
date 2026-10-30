// Elemently – Background Service Worker (Manifest V3)

chrome.runtime.onInstalled.addListener(async () => {
  console.log('Elemently – Explore Every Element installed.');

  // Enable Side Panel to open when clicking the toolbar action icon
  if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    try {
      await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    } catch (e) {
      console.warn('sidePanel.setPanelBehavior not supported in this Chrome version', e);
    }
  }
});

// Relay messages if needed between content scripts and side panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PING') {
    sendResponse({ type: 'PONG' });
    return true;
  }
});

