import { useState } from "react";
import { Bell, BookOpen, Check, CheckCheck, Clock3, Flame, MessageCircle } from "lucide-react";

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: "Your weekly learning summary is ready", detail: "You studied for 6.5 hours this week. Keep your steady pace going.", time: "Today · 9:15 AM", category: "Learning", icon: BookOpen, unread: true },
  { id: 2, title: "Revision reminder", detail: "You have 8 JavaScript Basics cards ready to review.", time: "Today · 8:00 AM", category: "Reminder", icon: Clock3, unread: true },
  { id: 3, title: "Your focus streak is seven days", detail: "A short session today will help you keep it going.", time: "Yesterday", category: "Achievement", icon: Flame, unread: false },
  { id: 4, title: "New message from Maya", detail: "Want to review the DOM notes together today?", time: "Yesterday", category: "Messages", icon: MessageCircle, unread: false },
];

export default function Notifications() {
  const [items, setItems] = useState(INITIAL_NOTIFICATIONS);
  const unreadCount = items.filter((item) => item.unread).length;
  const markAllRead = () => setItems((current) => current.map((item) => ({ ...item, unread: false })));
  return (
    <div className="student-page-stack">
      <section className="student-page-intro"><span className="student-page-kicker"><Bell size={16} /> YOUR UPDATES</span><h2>Notifications</h2><p>Learning reminders and updates, stored locally for this frontend demo.</p></section>
      <section className="student-page-section"><div className="student-page-section-heading"><div><h3>Recent activity</h3><p>{unreadCount ? `${unreadCount} unread updates` : "You are all caught up."}</p></div><button type="button" className="student-page-quiet-button" onClick={markAllRead} disabled={!unreadCount}><CheckCheck size={16} /> Mark all as read</button></div>
        <div className="student-notification-list">{items.map((item) => { const Icon = item.icon; return <article className={`student-notification-card ${item.unread ? "unread" : ""}`} key={item.id}><div className="student-notification-icon"><Icon size={19} /></div><div className="student-notification-copy"><div className="student-notification-title-row"><h4>{item.title}</h4><span>{item.category}</span></div><p>{item.detail}</p><time>{item.time}</time></div>{item.unread && <button type="button" className="student-notification-read" aria-label={`Mark ${item.title} as read`} onClick={() => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, unread: false } : entry))}><Check size={16} /></button>}</article>; })}</div>
      </section>
    </div>
  );
}
