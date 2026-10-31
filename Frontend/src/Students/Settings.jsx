import { useState } from "react";
import { Bell, Check, Clock3, SlidersHorizontal } from "lucide-react";

const INITIAL = { reminders: true, weeklySummary: true, focusLength: "25" };

export default function Settings() {
  const [preferences, setPreferences] = useState(() => {
    try { return { ...INITIAL, ...JSON.parse(localStorage.getItem("kyros_student_preferences") || "{}") }; }
    catch { return INITIAL; }
  });
  const [saved, setSaved] = useState(false);
  const update = (key, value) => { setPreferences((current) => ({ ...current, [key]: value })); setSaved(false); };
  const save = (event) => { event.preventDefault(); localStorage.setItem("kyros_student_preferences", JSON.stringify(preferences)); setSaved(true); };
  return (
    <div className="student-page-stack">
      <section className="student-page-intro"><span className="student-page-kicker"><SlidersHorizontal size={16} /> YOUR WORKSPACE</span><h2>Settings</h2><p>Choose how your student workspace supports your study routine.</p></section>
      <form className="student-settings-form" onSubmit={save}>
        <section className="student-settings-card"><div className="student-settings-card-heading"><span className="student-settings-icon"><Bell size={18} /></span><div><h3>Reminders</h3><p>Keep useful learning updates close by.</p></div></div>
          <label className="student-setting-row"><span><strong>Study reminders</strong><small>Show a reminder to start a planned session.</small></span><input type="checkbox" checked={preferences.reminders} onChange={(event) => update("reminders", event.target.checked)} /></label>
          <label className="student-setting-row"><span><strong>Weekly learning summary</strong><small>Include a weekly progress recap in notifications.</small></span><input type="checkbox" checked={preferences.weeklySummary} onChange={(event) => update("weeklySummary", event.target.checked)} /></label>
        </section>
        <section className="student-settings-card"><div className="student-settings-card-heading"><span className="student-settings-icon"><Clock3 size={18} /></span><div><h3>Focus sessions</h3><p>Set a comfortable default for your timer.</p></div></div><label className="student-setting-select"><span><strong>Session length</strong><small>Breaks can be adjusted when you start a session.</small></span><select value={preferences.focusLength} onChange={(event) => update("focusLength", event.target.value)}><option value="15">15 minutes</option><option value="25">25 minutes</option><option value="45">45 minutes</option><option value="60">60 minutes</option></select></label></section>
        <div className="student-settings-actions"><span role="status" className="student-page-note">{saved ? "Preferences saved in this browser." : "Preferences are saved locally in this demo."}</span><button type="submit" className="student-page-button">{saved ? <Check size={16} /> : null}{saved ? "Saved" : "Save preferences"}</button></div>
      </form>
    </div>
  );
}
