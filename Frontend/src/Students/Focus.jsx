import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, CirclePause, CirclePlay, Clock3, RotateCcw, ShieldCheck, TimerReset, Trophy } from "lucide-react";
import { Panel } from "../components/Panels.jsx";

const TIMER_KEY = "kyros_focus_timer";
const SESSIONS_KEY = "kyros_focus_sessions";
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

export default function Focus() {
  const [timer, setTimer] = useState(initialTimer);
  const [sessions, setSessions] = useState(() => {
    const saved = readJson(SESSIONS_KEY, []);
    return Array.isArray(saved) ? saved : [];
  });
  const recordedEndAt = useRef(null);
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
    if (timer.status !== "running" || !timer.endAt) return undefined;
    const tick = () => {
      const remainingSeconds = Math.max(0, Math.ceil((timer.endAt - Date.now()) / 1000));
      if (remainingSeconds === 0) {
        if (recordedEndAt.current !== timer.endAt) {
          recordedEndAt.current = timer.endAt;
          recordSession(timer.durationSeconds, true);
        }
        setTimer((current) => ({ ...current, status: "idle", remainingSeconds: current.durationSeconds, endAt: null }));
      } else {
        setTimer((current) => current.status === "running" ? { ...current, remainingSeconds } : current);
      }
    };
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [timer.status, timer.endAt, timer.durationSeconds]);

  const choosePreset = (minutes) => {
    const durationSeconds = minutes * 60;
    setTimer({ status: "idle", durationSeconds, remainingSeconds: durationSeconds, endAt: null });
  };
  const startTimer = () => {
    const remainingSeconds = timer.remainingSeconds || timer.durationSeconds;
    setTimer((current) => ({ ...current, status: "running", remainingSeconds, endAt: Date.now() + remainingSeconds * 1000 }));
  };
  const pauseTimer = () => {
    const remainingSeconds = timer.endAt ? Math.max(0, Math.ceil((timer.endAt - Date.now()) / 1000)) : timer.remainingSeconds;
    if (remainingSeconds === 0) {
      recordSession(timer.durationSeconds, true);
      setTimer((current) => ({ ...current, status: "idle", remainingSeconds: current.durationSeconds, endAt: null }));
      return;
    }
    setTimer((current) => ({ ...current, status: "paused", remainingSeconds, endAt: null }));
  };
  const resetTimer = () => {
    const elapsed = timer.durationSeconds - timer.remainingSeconds;
    if (timer.status !== "idle") recordSession(elapsed, false);
    setTimer((current) => ({ ...current, status: "idle", remainingSeconds: current.durationSeconds, endAt: null }));
  };
  const totalMinutes = Math.floor(todaySeconds / 60);
  const statusText = timer.status === "running" ? "Session in progress" : timer.status === "paused" ? "Session paused" : "Ready when you are";

  return (
    <div className="student-page-stack student-focus-page">
      <section className="student-page-intro student-focus-hero"><div><span className="student-page-kicker"><Activity size={16} /> FOCUS WORKSPACE</span><h2>Make space for focused work.</h2><p>Set a timer, work without interruption, and build a record of your study sessions.</p></div><div className="student-focus-hero-badge"><ShieldCheck size={21} /><span>Just you and your next task</span></div></section>

      <section className="student-focus-layout">
        <div className="student-focus-timer-card"><div className="student-focus-timer-heading"><div><span className="student-page-kicker"><Clock3 size={15} /> FOCUS TIMER</span><h3>{statusText}</h3></div><span className={`student-focus-live ${timer.status}`}><i />{timer.status === "running" ? "LIVE" : timer.status === "paused" ? "PAUSED" : "READY"}</span></div>
          <div className="student-focus-clock" aria-live="off"><svg viewBox="0 0 120 120" role="img" aria-label={`${formatTime(timer.remainingSeconds)} remaining`}><circle className="student-focus-clock-track" cx="60" cy="60" r="50" /><circle className="student-focus-clock-progress" cx="60" cy="60" r="50" style={{ strokeDashoffset: `${314 * (1 - progress)}` }} /></svg><div className="student-focus-clock-time"><strong>{formatTime(timer.remainingSeconds)}</strong><span>{timer.status === "running" ? "remaining" : "minutes"}</span></div></div>
          <div className="student-focus-presets" aria-label="Choose session duration">{PRESETS.map((minutes) => <button type="button" key={minutes} className={timer.durationSeconds === minutes * 60 ? "selected" : ""} disabled={timer.status === "running"} onClick={() => choosePreset(minutes)}>{minutes} min</button>)}</div>
          <div className="student-focus-controls">{timer.status === "running" ? <button type="button" className="student-page-button" onClick={pauseTimer}><CirclePause size={18} /> Pause</button> : <button type="button" className="student-page-button" onClick={startTimer}><CirclePlay size={18} /> {timer.status === "paused" ? "Resume session" : "Start focus session"}</button>}{timer.status !== "idle" && <button type="button" className="student-focus-reset" onClick={resetTimer}><TimerReset size={17} /> End &amp; save</button>}{timer.status === "idle" && timer.remainingSeconds < timer.durationSeconds && <button type="button" className="student-focus-reset" onClick={resetTimer}><RotateCcw size={16} /> Reset</button>}</div>
          <p className="student-focus-caption">Completed sessions and sessions you end early are recorded in this browser.</p>
        </div>

        <aside className="student-focus-summary"><div className="student-focus-summary-head"><div className="student-focus-summary-icon"><Trophy size={19} /></div><div><h3>Your focus record</h3><p>Stored on this device</p></div></div><div className="student-focus-today"><span>Focused today</span><strong>{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</strong><small>{sessions.filter((session) => new Date(session.endedAt).toDateString() === new Date().toDateString()).length} sessions recorded</small></div><div className="student-focus-history-heading"><h4>Recent sessions</h4><span>{sessions.length}</span></div>{sessions.length ? <div className="student-focus-history">{sessions.slice(0, 4).map((session) => <div className="student-focus-history-row" key={session.id}><span className="student-focus-history-dot" /><div><strong>{Math.floor(session.seconds / 60)} min focus</strong><small>{new Date(session.endedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</small></div><span className={`student-focus-session-status ${session.completed ? "complete" : "partial"}`}>{session.completed ? "Done" : "Saved"}</span></div>)}</div> : <div className="student-focus-history-empty">Your saved sessions will show here after your first focus session.</div>}</aside>
      </section>

      <div className="student-focus-community"><section className="student-page-section"><div className="student-page-section-heading"><div><h3><Trophy size={18} /> Focus leaderboard</h3><p>Sample scores from the demo learning community.</p></div></div><Panel endpoint="/student/leaderboard" type="leaderboard" empty="No leaderboard entries yet." /></section><section className="student-page-section"><div className="student-page-section-heading"><div><h3>Your accountability groups</h3><p>Learning groups available in this demo workspace.</p></div></div><Panel endpoint="/student/groups" type="list" empty="No groups are available yet." /></section></div>
    </div>
  );
}
