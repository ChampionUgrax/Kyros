// The app and extension communicate through a narrow postMessage bridge because
// browser extension APIs are intentionally unavailable to ordinary web pages.
(() => {
  const channel = "KYROS_FOCUS_EXTENSION";
  const isKyrosApp = () => {
    const host = window.location.hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "kyros.app" || host.endsWith(".kyros.app");
  };

  if (!isKyrosApp()) return;
  const extensionVersion = chrome.runtime.getManifest().version;

  if (!window.__KYROS_FOCUS_BRIDGE_INSTALLED__) {
    window.__KYROS_FOCUS_BRIDGE_INSTALLED__ = true;
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message?.channel !== channel || message.type !== "VERIFY_CONNECTION") return false;
      let settled = false;
      const timeout = window.setTimeout(() => {
        if (settled) return;
        settled = true;
        sendResponse({ ready: false, error: "The extension background worker did not respond. Reload Kyros Focus from chrome://extensions." });
      }, 5000);
      try {
        chrome.runtime.sendMessage({ channel, type: "PING" }, (response) => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timeout);
          const error = chrome.runtime.lastError?.message || response?.error || null;
          sendResponse({ ready: !error && Boolean(response?.installed), version: response?.version || null, error });
        });
      } catch (error) {
        settled = true;
        window.clearTimeout(timeout);
        sendResponse({ ready: false, error: error?.message || "Could not contact the extension background worker." });
      }
      return true;
    });
    window.addEventListener("message", (event) => {
      if (event.source !== window || event.origin !== window.location.origin) return;
      const message = event.data;
      if (!message || message.channel !== channel || !["PING", "START", "STOP"].includes(message.type)) return;

      const respond = (response, error = null) => window.postMessage({
        channel,
        type: `${message.type}_RESULT`,
        requestId: message.requestId,
        extensionVersion,
        response: response || null,
        error,
      }, window.location.origin);

      try {
        chrome.runtime.sendMessage({ channel, ...message }, (response) => {
          const runtimeError = chrome.runtime.lastError?.message || null;
          respond(response, runtimeError);
        });
      } catch (error) {
        respond(null, error?.message || "Could not contact the Kyros Focus background worker.");
      }
    });
  }

  // Re-injection is the popup's recovery path for tabs that were already open
  // before localhost access was granted. Always announce it to the app.
  window.postMessage({ channel, type: "EXTENSION_READY" }, window.location.origin);
})();
