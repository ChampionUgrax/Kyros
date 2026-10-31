const ALARM = "kyros-focus-expiry";
const SESSION_KEY = "focusSession";
const FIRST_RULE_ID = 1000;
const LAST_RULE_ID = FIRST_RULE_ID + 49;
const ALLOWED_HOSTS = new Set(["instagram.com", "youtube.com", "youtu.be", "youtube-nocookie.com"]);
const KYROS_APP_HOSTS = new Set(["localhost", "127.0.0.1", "kyros.app"]);

function isKyrosAppUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && (KYROS_APP_HOSTS.has(url.hostname) || url.hostname.endsWith(".kyros.app"));
  } catch { return false; }
}

function appPermissionPattern(value) {
  try {
    const url = new URL(value);
    if (url.protocol === "http:" && (url.hostname === "localhost" || url.hostname === "127.0.0.1")) return `${url.protocol}//${url.hostname}/*`;
    if (url.protocol === "https:" && (url.hostname === "kyros.app" || url.hostname.endsWith(".kyros.app"))) return `${url.protocol}//${url.hostname}/*`;
    return null;
  } catch { return null; }
}

async function injectBridgeIntoTab(tabId, url) {
  if (!isKyrosAppUrl(url)) return;
  const permission = appPermissionPattern(url);
  if (!permission || !await chrome.permissions.contains({ origins: [permission] })) return;
  await chrome.scripting.executeScript({ target: { tabId }, files: ["bridge.js"] });
}

async function injectBridgeIntoOpenKyrosTabs() {
  const tabs = await chrome.tabs.query({ url: ["http://localhost/*", "http://127.0.0.1/*", "https://kyros.app/*", "https://*.kyros.app/*"] });
  await Promise.all(tabs.filter((tab) => tab.id != null && isKyrosAppUrl(tab.url || "")).map(async (tab) => {
    try {
      await injectBridgeIntoTab(tab.id, tab.url);
    } catch (error) {
      console.debug("Could not attach the Kyros bridge to this tab:", error.message);
    }
  }));
}

function normalizeHost(value) {
  try {
    const parsed = new URL(value.includes("://") ? value : `https://${value}`);
    if (!["http:", "https:"].includes(parsed.protocol) || !parsed.hostname || parsed.hostname === "localhost") return null;
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    return ALLOWED_HOSTS.has(host) ? host : null;
  } catch { return null; }
}

function makeRules(hosts) {
  return hosts.map((host, index) => ({
    id: FIRST_RULE_ID + index,
    priority: 1,
    action: { type: "redirect", redirect: { extensionPath: `/blocked.html?site=${encodeURIComponent(host)}` } },
    condition: { urlFilter: `||${host}^`, resourceTypes: ["main_frame"] }
  }));
}

function hostPatterns(hosts) {
  return hosts.flatMap((host) => ["http", "https"].flatMap((scheme) => [
    `${scheme}://${host}/*`,
    `${scheme}://*.${host}/*`,
  ]));
}

async function clearSession() {
  await chrome.alarms.clear(ALARM);
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const ids = existing.filter((rule) => rule.id >= FIRST_RULE_ID && rule.id <= LAST_RULE_ID).map((rule) => rule.id);
  if (ids.length) await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: ids });
  await chrome.storage.local.remove(SESSION_KEY);
}

async function startSession(message) {
  const hosts = [...new Set((Array.isArray(message.sites) ? message.sites : []).map(normalizeHost).filter(Boolean))].slice(0, 50);
  const requestedDuration = Number(message.durationSeconds);
  if (!Number.isFinite(requestedDuration) || requestedDuration < 1) throw new Error("Choose a valid focus timer duration.");
  const durationSeconds = Math.min(24 * 60 * 60, Math.floor(requestedDuration));
  if (!hosts.length || !durationSeconds) throw new Error("Add at least one valid website and choose a timer duration.");

  await clearSession();
  const endsAt = Date.now() + durationSeconds * 1000;
  await chrome.storage.local.set({ [SESSION_KEY]: { hosts, endsAt } });
  try {
    await chrome.declarativeNetRequest.updateDynamicRules({ addRules: makeRules(hosts) });
    await chrome.alarms.create(ALARM, { when: endsAt });
  } catch (error) {
    await clearSession();
    throw error;
  }

  // Move already-open matching tabs to the same focus page immediately.
  const tabs = await chrome.tabs.query({ url: hostPatterns(hosts) });
  for (const tab of tabs) {
    try {
      const host = new URL(tab.url).hostname.toLowerCase().replace(/^www\./, "");
      if (hosts.some((blocked) => host === blocked || host.endsWith(`.${blocked}`))) {
        await chrome.tabs.update(tab.id, { url: chrome.runtime.getURL(`blocked.html?site=${encodeURIComponent(host)}`) });
      }
    } catch { /* Ignore browser-internal tabs. */ }
  }
  return { active: true, endsAt, hosts, version: chrome.runtime.getManifest().version };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || message.channel !== "KYROS_FOCUS_EXTENSION") return false;
  const senderUrl = sender.documentUrl || sender.tab?.url || sender.url || sender.origin || "";
  const trustedSender = (!sender.id || sender.id === chrome.runtime.id) && Boolean(sender.tab) && isKyrosAppUrl(senderUrl);
  if (!trustedSender) {
    sendResponse({ error: "Kyros Focus received a request from an unsupported tab. Open the local Kyros Focus page and reconnect." });
    return false;
  }

  const task = message.type === "PING"
    ? chrome.storage.local.get(SESSION_KEY).then(async ({ focusSession }) => {
        if (focusSession && focusSession.endsAt <= Date.now()) await clearSession();
        return { installed: true, version: chrome.runtime.getManifest().version, active: Boolean(focusSession && focusSession.endsAt > Date.now()), endsAt: focusSession?.endsAt > Date.now() ? focusSession.endsAt : null };
      })
    : message.type === "START"
      ? startSession(message)
      : message.type === "STOP"
        ? clearSession().then(() => ({ active: false }))
        : Promise.reject(new Error("Unsupported request."));

  task.then(sendResponse).catch((error) => sendResponse({ error: error.message || "Could not update focus blocking." }));
  return true;
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM) clearSession();
});

async function restoreSession() {
  const { focusSession } = await chrome.storage.local.get(SESSION_KEY);
  if (!focusSession) return;
  if (focusSession.endsAt <= Date.now()) return clearSession();
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = existing.filter((rule) => rule.id >= FIRST_RULE_ID && rule.id <= LAST_RULE_ID).map((rule) => rule.id);
  await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds, addRules: makeRules(focusSession.hosts) });
  await chrome.alarms.create(ALARM, { when: focusSession.endsAt });
}

chrome.runtime.onStartup.addListener(restoreSession);
chrome.runtime.onInstalled.addListener(async () => {
  await Promise.allSettled([restoreSession(), injectBridgeIntoOpenKyrosTabs()]);
});

chrome.permissions.onAdded.addListener(() => {
  injectBridgeIntoOpenKyrosTabs().catch((error) => console.debug("Could not attach the Kyros bridge after permission was granted:", error.message));
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "loading" && !changeInfo.url) return;
  const url = changeInfo.url || tab.url || "";
  injectBridgeIntoTab(tabId, url).catch((error) => console.debug("Could not attach the Kyros bridge during navigation:", error.message));
});
