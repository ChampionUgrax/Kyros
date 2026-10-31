import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, CirclePause, CirclePlay, Clock3, RotateCcw, ShieldCheck, TimerReset, Trophy } from "lucide-react";
import { Panel } from "../components/Panels.jsx";
import { api, USE_MOCK_API } from "../services/api.js";
import { useFetch } from "../services/hooks.js";

const TIMER_KEY = "kyros_focus_timer";
const SESSIONS_KEY = "kyros_focus_sessions";
const APPS_KEY = "kyros_focus_blocked_apps";
const EXTENSION_CHANNEL = "KYROS_FOCUS_EXTENSION";
const REQUIRED_EXTENSION_VERSION = "1.3.1";
const FOCUS_APPS = [
  { id: "instagram", name: "Instagram", description: "Reels, stories and feed", hosts: ["instagram.com"], image: "apps/instagram.svg" },
  { id: "youtube", name: "YouTube", description: "Videos and Shorts", hosts: ["youtube.com", "youtu.be", "youtube-nocookie.com"], image: "apps/youtube.svg" },
];
const DEFAULT_BLOCKED_APPS = FOCUS_APPS.map((app) => app.id);
const PRESETS = [15, 25, 45, 60];

function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }
  catch { return fallback; }
}

function initialTimer() {
  const saved = readJson(TIMER_KEY, null);
  if (!saved) return { status: "idle", durationSeconds: 25 * 60, remainingSeconds: 25 * 60, endAt: null };
  const durationSeconds = Number(saved.durationSeconds) || 25 * 60;
  const remainingSeconds = saved.status === "running" && saved.endAt
    ? Math.max(0, Math.ceil((saved.endAt - Date.now()) / 1000))
    : Math.max(0, Number(saved.remainingSeconds) || durationSeconds);
  return { status: saved.status || "idle", durationSeconds, remainingSeconds, endAt: saved.endAt || null };
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function isOutdatedExtensionError(error) {
  const message = error?.message || "";
  return /older Kyros Focus copy|outdated/i.test(message) || message.includes(`v${REQUIRED_EXTENSION_VERSION}`);
}

function requestExtension(type, payload = {}, timeoutMs = type === "START" ? 10000 : 5000) {
  return new Promise((resolve, reject) => {
    const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    let staleVersion = null;
    let staleTimer = null;
    let settled = false;
    const cleanup = () => {
      settled = true;
      window.clearTimeout(timeout);
      if (staleTimer) window.clearTimeout(staleTimer);
      window.removeEventListener("message", onResponse);
    };
    const stopAnyExtension = () => window.postMessage({ channel: EXTENSION_CHANNEL, type: "STOP", requestId: `cleanup-${requestId}` }, window.location.origin);
    const fail = (error, cleanupBlock = false) => {
      if (settled) return;
      cleanup();
      if (cleanupBlock && type === "START") stopAnyExtension();
      reject(error);
    };
    const timeout = window.setTimeout(() => {
      fail(new Error(staleVersion
        ? `An older Kyros Focus copy${staleVersion === "older copy" ? "" : ` (v${staleVersion})`} answered. Remove old copies and load v${REQUIRED_EXTENSION_VERSION}.`
        : "No reply from Kyros Focus. Open the Chrome Extensions menu, choose Kyros Focus, click Connect this tab, then try again."), true);
    }, timeoutMs);
    const onResponse = (event) => {
      const message = event.data;
      if (event.source !== window || event.origin !== window.location.origin || message?.channel !== EXTENSION_CHANNEL || message.requestId !== requestId) return;
      if (type !== "STOP" && message.extensionVersion !== REQUIRED_EXTENSION_VERSION) {
        staleVersion = message.extensionVersion || message.response?.version || "older copy";
        if (!staleTimer) {
          staleTimer = window.setTimeout(() => {
            fail(new Error(`An older Kyros Focus copy${staleVersion === "older copy" ? "" : ` (v${staleVersion})`} answered. Remove old copies and load v${REQUIRED_EXTENSION_VERSION}.`), true);
          }, 1500);
        }
        return;
      }
      cleanup();
      if (message.error) reject(new Error(message.error));
      else if (message.response?.error) reject(new Error(message.response.error));
      else if (!message.response) reject(new Error("Kyros Focus extension did not respond. Please reload this page."));
      else resolve({ ...message.response, version: message.response.version || message.extensionVersion });
    };
    window.addEventListener("message", onResponse);
    window.postMessage({ channel: EXTENSION_CHANNEL, type, requestId, ...payload }, window.location.origin);
  });
}

export default function Focus() {
  const history = useFetch(USE_MOCK_API ? null : "/focus/history");
  const [actionError, setActionError] = useState("");
  const [extensionError, setExtensionError] = useState("");
  const [extensionStatus, setExtensionStatus] = useState("checking");
  const [selectedApps, setSelectedApps] = useState(() => {
    const saved = readJson(APPS_KEY, DEFAULT_BLOCKED_APPS);
    return Array.isArray(saved) ? saved.filter((id) => FOCUS_APPS.some((app) => app.id === id)) : DEFAULT_BLOCKED_APPS;
  });
  const [timer, setTimer] = useState(initialTimer);
  const [sessions, setSessions] = useState(() => {
    const saved = readJson(SESSIONS_KEY, []);
    return Array.isArray(saved) ? saved : [];
  });
  const recordedEndAt = useRef(null);
  const extensionStatusRef = useRef("checking");
  const progress = timer.durationSeconds ? (timer.durationSeconds - timer.remainingSeconds) / timer.durationSeconds : 0;
  const todaySeconds = useMemo(() => {
    const today = new Date().toDateString();
    return sessions.filter((session) => new Date(session.endedAt).toDateString() === today).reduce((total, session) => total + session.seconds, 0);
  }, [sessions]);
  const recordSession = (seconds, completed) => {
    if (seconds < 60) return;
    const entry = { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, seconds, completed, endedAt: new Date().toISOString() };
    const previous = readJson(SESSIONS_KEY, []);
    const updated = [entry, ...(Array.isArray(previous) ? previous : [])].slice(0, 50);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
    setSessions(updated);
  };

  useEffect(() => {
    localStorage.setItem(TIMER_KEY, JSON.stringify(timer));
  }, [timer]);

  useEffect(() => {
    localStorage.setItem(APPS_KEY, JSON.stringify(selectedApps));
  }, [selectedApps]);

  useEffect(() => {
    let disposed = false;
    let checking = false;
    let attempts = 0;
    const checkExtension = async () => {
      if (disposed || checking) return;
      checking = true;
      try {
        const response = await requestExtension("PING");
        if (disposed) return;
        if (response.version !== REQUIRED_EXTENSION_VERSION) {
          extensionStatusRef.current = "outdated";
          setExtensionStatus("outdated");
          setExtensionError(`Kyros Focus v${response.version || "older"} was detected. Replace it with v${REQUIRED_EXTENSION_VERSION} using the updated extension ZIP, then click Connect this tab.`);
          return;
        }
        extensionStatusRef.current = "connected";
        setExtensionStatus("connected");
        setExtensionError(response.active ? "A focus block is already active in this browser." : "");
      } catch (error) {
        if (disposed) return;
        const outdated = isOutdatedExtensionError(error);
        extensionStatusRef.current = outdated ? "outdated" : "missing";
        setExtensionStatus(extensionStatusRef.current);
        setExtensionError(outdated ? error.message : "In Chrome, open the Extensions menu, choose Kyros Focus, then click “Connect this tab”. Allow localhost access if Chrome asks. The status will update as soon as the bridge is attached.");
      } finally {
        checking = false;
      }
    };
    const onBridgeReady = (event) => {
      if (event.source === window && event.origin === window.location.origin && event.data?.channel === EXTENSION_CHANNEL && event.data?.type === "EXTENSION_READY") checkExtension();
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") checkExtension();
    };
    window.addEventListener("message", onBridgeReady);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("focus", checkExtension);
    const poll = window.setInterval(() => {
      if (extensionStatusRef.current === "connected" || attempts++ >= 20) {
        window.clearInterval(poll);
        return;
      }
      checkExtension();
    }, 1500);
    checkExtension();
    return () => {
      disposed = true;
      window.clearInterval(poll);
      window.removeEventListener("message", onBridgeReady);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", checkExtension);
    };
  }, []);

  useEffect(() => {
    if (timer.status !== "running" || !timer.endAt) return undefined;
    const tick = () => {
      const remainingSeconds = Math.max(0, Math.ceil((timer.endAt - Date.now()) / 1000));
      if (remainingSeconds === 0) {
        requestExtension("STOP").catch(() => {});
        if (recordedEndAt.current !== timer.endAt) {
          recordedEndAt.current = timer.endAt;
          if (timer.serverSessionId) api.patch(`/focus/${timer.serverSessionId}/end`, {}).then(() => history.reload()).catch((error) => setActionError(error.message || "Could not save your focus session."));
          else if (USE_MOCK_API) recordSession(timer.durationSeconds, true);
        }
        setTimer((current) => ({ ...current, status: "idle", remainingSeconds: current.durationSeconds, endAt: null, serverSessionId: null }));
      } else {
        setTimer((current) => current.status === "running" ? { ...current, remainingSeconds } : current);
      }
    };
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [timer.status, timer.endAt, timer.durationSeconds, timer.serverSessionId]);

  const choosePreset = (minutes) => {
    const durationSeconds = minutes * 60;
    setTimer({ status: "idle", durationSeconds, remainingSeconds: durationSeconds, endAt: null });
  };
  const startTimer = async () => {
    const remainingSeconds = timer.remainingSeconds || timer.durationSeconds;
    let extensionStarted = false;
    try {
      setActionError("");
      setExtensionError("");
      const extensionState = await requestExtension("PING");
      if (extensionState.version !== REQUIRED_EXTENSION_VERSION) {
        extensionStatusRef.current = "outdated";
        setExtensionStatus("outdated");
        throw new Error(`Kyros Focus v${extensionState.version || "older"} is connected, but v${REQUIRED_EXTENSION_VERSION} is required. Replace the old extension from the updated ZIP and click Connect this tab.`);
      }
      const sites = FOCUS_APPS.filter((app) => selectedApps.includes(app.id)).flatMap((app) => app.hosts);
      if (!sites.length) throw new Error("Select Instagram or YouTube to block before starting.");
      const blockResult = await requestExtension("START", { sites, durationSeconds: remainingSeconds });
      extensionStarted = true;
      if (!blockResult.active) throw new Error("The extension did not activate site blocking. Reload Kyros Focus and try again.");
      extensionStatusRef.current = "connected";
      setExtensionStatus("connected");
      setExtensionError("");
      const endAt = Date.now() + remainingSeconds * 1000;
      setTimer((current) => ({ ...current, status: "running", remainingSeconds, serverSessionId: null, endAt }));
      if (!USE_MOCK_API) {
        try {
          const serverSession = await api.post("/focus/start", { subject: "Study session", goal: "Complete a focused study block" });
          if (serverSession?.sessionId) {
            setTimer((current) => current.status === "running" && current.endAt === endAt
              ? { ...current, serverSessionId: serverSession.sessionId }
              : current);
          }
        } catch (error) {
          setActionError(`Your timer and site blocking are active, but session history could not be synced: ${error.message || "backend unavailable"}`);
        }
      }
    } catch (error) {
      if (extensionStarted) await requestExtension("STOP").catch(() => {});
      if (/extension|kyros focus|no reply/i.test(error.message || "")) {
        const outdated = isOutdatedExtensionError(error);
        extensionStatusRef.current = outdated ? "outdated" : "missing";
        setExtensionStatus(extensionStatusRef.current);
        setExtensionError(error.message);
      } else setActionError(error.message || "Could not start your focus session.");
    }
  };
  const pauseTimer = async () => {
    const remainingSeconds = timer.endAt ? Math.max(0, Math.ceil((timer.endAt - Date.now()) / 1000)) : timer.remainingSeconds;
    if (timer.serverSessionId) {
      try { await api.patch(`/focus/${timer.serverSessionId}/end`, {}); history.reload(); }
      catch (error) { setActionError(error.message || "Could not save your focus session."); return; }
    }
    requestExtension("STOP").catch(() => {});
    if (remainingSeconds === 0) {
      if (USE_MOCK_API) recordSession(timer.durationSeconds, true);
      setTimer((current) => ({ ...current, status: "idle", remainingSeconds: current.durationSeconds, endAt: null, serverSessionId: null }));
      return;
    }
    setTimer((current) => ({ ...current, status: "paused", remainingSeconds, endAt: null, serverSessionId: null }));
  };
  const resetTimer = async () => {
    const elapsed = timer.durationSeconds - timer.remainingSeconds;
    if (timer.serverSessionId) {
      try { await api.patch(`/focus/${timer.serverSessionId}/end`, {}); history.reload(); }
      catch (error) { setActionError(error.message || "Could not save your focus session."); return; }
    } else if (USE_MOCK_API && timer.status !== "idle") recordSession(elapsed, false);
    requestExtension("STOP").catch(() => {});
    setTimer((current) => ({ ...current, status: "idle", remainingSeconds: current.durationSeconds, endAt: null, serverSessionId: null }));
  };
  const liveSessions = !USE_MOCK_API && Array.isArray(history.data) ? history.data.map((session) => ({ id: session.sessionId, seconds: Number(session.duration)||0, completed: session.status === "completed", endedAt: session.endedAt?.toDate?.()?.toISOString?.() || session.endedAt })) : sessions;
  const todayTotal = liveSessions.filter((session) => session.endedAt && new Date(session.endedAt).toDateString() === new Date().toDateString()).reduce((sum, session) => sum + session.seconds, 0);
  const totalMinutes = Math.floor((USE_MOCK_API ? todaySeconds : todayTotal) / 60);
  const displaySessions = USE_MOCK_API ? sessions : liveSessions;
  const statusText = timer.status === "running" ? "Session in progress" : timer.status === "paused" ? "Session paused" : "Ready when you are";

  return (
    <div className="student-page-stack student-focus-page">
      <section className="student-page-intro student-focus-hero"><div><span className="student-page-kicker"><Activity size={16} /> FOCUS WORKSPACE</span><h2>Make space for focused work.</h2><p>Set a timer, work without interruption, and build a record of your study sessions.</p></div><div className="student-focus-hero-badge"><ShieldCheck size={21} /><span>Just you and your next task</span></div></section>

      <section className="student-focus-layout">
        <div className="student-focus-timer-card"><div className="student-focus-timer-heading"><div><span className="student-page-kicker"><Clock3 size={15} /> FOCUS TIMER</span><h3>{statusText}</h3></div><span className={`student-focus-live ${timer.status}`}><i />{timer.status === "running" ? "LIVE" : timer.status === "paused" ? "PAUSED" : "READY"}</span></div>
          <div className="student-focus-clock" aria-live="off"><svg viewBox="0 0 120 120" role="img" aria-label={`${formatTime(timer.remainingSeconds)} remaining`}><circle className="student-focus-clock-track" cx="60" cy="60" r="50" /><circle className="student-focus-clock-progress" cx="60" cy="60" r="50" style={{ strokeDashoffset: `${314 * (1 - progress)}` }} /></svg><div className="student-focus-clock-time"><strong>{formatTime(timer.remainingSeconds)}</strong><span>{timer.status === "running" ? "remaining" : "minutes"}</span></div></div>
          <div className="student-focus-presets" aria-label="Choose session duration">{PRESETS.map((minutes) => <button type="button" key={minutes} className={timer.durationSeconds === minutes * 60 ? "selected" : ""} disabled={timer.status === "running"} onClick={() => choosePreset(minutes)}>{minutes} min</button>)}</div>
          <fieldset className="student-focus-app-picker" disabled={timer.status === "running"}>
            <legend>Choose apps to pause</legend>
            <div className="student-focus-app-grid">
              {FOCUS_APPS.map((app) => {
                const checked = selectedApps.includes(app.id);
                return <label className={`student-focus-app-option${checked ? " selected" : ""}`} key={app.id}>
                  <input type="checkbox" checked={checked} onChange={() => setSelectedApps((current) => checked ? current.filter((id) => id !== app.id) : [...current, app.id])} />
                  <img src={`${import.meta.env.BASE_URL}${app.image}`} alt="" width="44" height="44" />
                  <span className="student-focus-app-copy"><strong>{app.name}</strong><small>{app.description}</small></span>
                  <span className="student-focus-app-check" aria-hidden="true">✓</span>
                </label>;
              })}
            </div>
          </fieldset>
          <p className={`student-focus-extension-indicator ${extensionStatus}`} role="status"><span />{extensionStatus === "checking" ? "Checking Chrome extension…" : extensionStatus === "connected" ? `Kyros Focus v${REQUIRED_EXTENSION_VERSION} connected` : extensionStatus === "outdated" ? "Kyros Focus needs an update" : "Chrome extension not connected"}</p>
          {extensionError && <p className="student-focus-extension-note" role="status">{extensionError} {(extensionStatus === "missing" || extensionStatus === "outdated") && <a href="/extension" target="_blank" rel="noreferrer">Open install guide</a>}</p>}
          <div className="student-focus-controls">{timer.status === "running" ? <button type="button" className="student-page-button" onClick={pauseTimer}><CirclePause size={18} /> Pause</button> : <button type="button" className="student-page-button" onClick={startTimer} disabled={selectedApps.length === 0}><CirclePlay size={18} /> {timer.status === "paused" ? "Resume session" : "Start focus session"}</button>}{timer.status !== "idle" && <button type="button" className="student-focus-reset" onClick={resetTimer}><TimerReset size={17} /> End &amp; save</button>}{timer.status === "idle" && timer.remainingSeconds < timer.durationSeconds && <button type="button" className="student-focus-reset" onClick={resetTimer}><RotateCcw size={16} /> Reset</button>}</div>
          {actionError && <p className="student-page-error" role="alert">{actionError}</p>}
          <p className="student-focus-caption">{USE_MOCK_API ? "Demo sessions are stored in this browser." : "Your sessions are saved to your account."}</p>
        </div>

        <aside className="student-focus-summary"><div className="student-focus-summary-head"><div className="student-focus-summary-icon"><Trophy size={19} /></div><div><h3>Your focus record</h3><p>{USE_MOCK_API ? "Stored on this device" : "Synced to your account"}</p></div></div><div className="student-focus-today"><span>Focused today</span><strong>{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</strong><small>{displaySessions.filter((session) => session.endedAt && new Date(session.endedAt).toDateString() === new Date().toDateString()).length} sessions recorded</small></div><div className="student-focus-history-heading"><h4>Recent sessions</h4><span>{displaySessions.length}</span></div>{displaySessions.length ? <div className="student-focus-history">{displaySessions.slice(0, 4).map((session) => <div className="student-focus-history-row" key={session.id}><span className="student-focus-history-dot" /><div><strong>{Math.floor(session.seconds / 60)} min focus</strong><small>{session.endedAt ? new Date(session.endedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "Session active"}</small></div><span className={`student-focus-session-status ${session.completed ? "complete" : "partial"}`}>{session.completed ? "Done" : "Saved"}</span></div>)}</div> : <div className="student-focus-history-empty">Your saved sessions will show here after your first focus session.</div>}</aside>
      </section>

      <div className="student-focus-community"><section className="student-page-section"><div className="student-page-section-heading"><div><h3><Trophy size={18} /> Focus leaderboard</h3><p>Based on completed sessions across learners.</p></div></div><Panel endpoint="/student/leaderboard" type="leaderboard" empty="No leaderboard entries yet." /></section><section className="student-page-section"><div className="student-page-section-heading"><div><h3>Your accountability groups</h3><p>Groups connected to your learner account.</p></div></div><Panel endpoint="/student/groups" type="list" empty="No groups are connected to your account yet." /></section></div>
    </div>
  );
}
