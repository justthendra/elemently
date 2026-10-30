chrome.runtime.onInstalled.addListener(async () => {
	if (console.log("Elemently – Explore Every Element installed."), chrome.sidePanel && chrome.sidePanel.setPanelBehavior) try {
		await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: !0 });
	} catch (e) {
		console.warn("sidePanel.setPanelBehavior not supported in this Chrome version", e);
	}
}), chrome.runtime.onMessage.addListener((e, t, n) => {
	if (e.type === "PING") return n({ type: "PONG" }), !0;
});
