const statusEl = document.getElementById("status");
const detailEl = document.getElementById("detail");
const connectButton = document.getElementById("connect");

let activeTab = null;
let appPermission = null;

function permissionPattern(url) {
  const hostname = url.hostname.toLowerCase();
  if (url.protocol === "http:" && (hostname === "localhost" || hostname === "127.0.0.1")) {
    return `${url.protocol}//${hostname}/*`;
  }
  if (url.protocol === "https:" && (hostname === "kyros.app" || hostname.endsWith(".kyros.app"))) {
    return `${url.protocol}//${hostname}/*`;
  }
  return null;
}

function setStatus(message, detail, state = "") {
  statusEl.textContent = message;
  statusEl.className = `status ${state}`.trim();
  detailEl.textContent = detail;
}

async function initialize() {
  try {
    const version = chrome.runtime.getManifest().version;
    [activeTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (!activeTab?.id || !activeTab.url) {
      setStatus("No web tab selected", "Open http://localhost:5175/app/student/focus in this Chrome tab.");
      return;
    }

    let url;
    try { url = new URL(activeTab.url); }
    catch { url = null; }
    appPermission = url && permissionPattern(url);
    if (!appPermission) {
      setStatus("Open a Kyros tab first", "This button connects localhost and Kyros app tabs. Return to the Kyros Focus page and open this popup again.");
      return;
    }

    const hasAccess = await chrome.permissions.contains({ origins: [appPermission] });
    setStatus(hasAccess ? `Kyros tab is ready · v${version}` : `Kyros needs access · v${version}`, `${url.host} · click below to attach the extension${hasAccess ? " again if the app is not connected" : " and approve localhost access if Chrome asks"}.`);
    connectButton.textContent = hasAccess ? "Connect this tab" : "Allow access & connect";
    connectButton.disabled = false;
  } catch (error) {
    setStatus("Could not check this tab", error?.message || "Close and reopen the extension popup.", "error");
  }
}

connectButton.addEventListener("click", async () => {
  if (!activeTab?.id || !appPermission) return;
  connectButton.disabled = true;
  connectButton.textContent = "Connecting…";
  setStatus("Waiting for Chrome access", "Approve the site permission if Chrome displays a prompt.");
  try {
    // This request is called directly from the user's click, as required by Chrome.
    const granted = await chrome.permissions.request({ origins: [appPermission] });
    if (!granted) throw new Error("Site access was not granted. Click again and allow this Kyros address.");
    await chrome.scripting.executeScript({ target: { tabId: activeTab.id }, files: ["bridge.js"] });
    const connection = await chrome.tabs.sendMessage(activeTab.id, { channel: "KYROS_FOCUS_EXTENSION", type: "VERIFY_CONNECTION" });
    if (!connection?.ready) throw new Error(connection?.error || "The bridge loaded, but the extension background worker did not answer. Reload Kyros Focus on chrome://extensions and try again.");
    if (connection.version !== chrome.runtime.getManifest().version) throw new Error(`The loaded bridge is v${connection.version || "unknown"}, but this popup is v${chrome.runtime.getManifest().version}. Remove duplicate Kyros Focus copies and reload the current one.`);
    setStatus("Connected to this Kyros tab", "Return to the Focus page. Its connection indicator should update now.", "success");
    connectButton.textContent = "Connected";
  } catch (error) {
    setStatus("Could not connect", error?.message || "Reload the Kyros tab and try again.", "error");
    connectButton.textContent = "Try again";
    connectButton.disabled = false;
  }
});

initialize();
