import { Bell, Check, CheckCheck } from "lucide-react";
import { api } from "../services/api.js";
import { useFetch } from "../services/hooks.js";
import { State } from "../components/Panels.jsx";

export default function Notifications() {
  const { data, loading, error, reload } = useFetch("/student/notifications");
  const items = Array.isArray(data) ? data : [];
  const unreadCount = items.filter((item) => item.unread).length;
  const markRead = async (id) => { await api.patch(`/student/notifications/${id}/read`, {}); reload(); };
  return (
    <div className="student-page-stack">
      <section className="student-page-intro"><span className="student-page-kicker"><Bell size={16} /> YOUR UPDATES</span><h2>Notifications</h2><p>Learning reminders and messages connected to your account.</p></section>
      <section className="student-page-section"><div className="student-page-section-heading"><div><h3>Recent activity</h3><p>{unreadCount ? `${unreadCount} unread updates` : "You are all caught up."}</p></div><button type="button" className="student-page-quiet-button" onClick={()=>Promise.all(items.filter((item)=>!item.read).map((item)=>markRead(item.id)))} disabled={!unreadCount}><CheckCheck size={16} /> Mark all as read</button></div>
        {loading || error || !items.length ? <State loading={loading} error={error} empty="New learning reminders and messages will appear here." /> : <div className="student-notification-list">{items.map((item) => <article className={`student-notification-card ${!item.read ? "unread" : ""}`} key={item.id}><div className="student-notification-icon"><Bell size={19} /></div><div className="student-notification-copy"><div className="student-notification-title-row"><h4>{item.title}</h4><span>{item.category || "Update"}</span></div><p>{item.description || item.detail || "You have a new account update."}</p><time>{item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}</time></div>{!item.read && <button type="button" className="student-notification-read" aria-label={`Mark ${item.title} as read`} onClick={() => markRead(item.id)}><Check size={16} /></button>}</article>)}</div>}
      </section>
    </div>
  );
}
