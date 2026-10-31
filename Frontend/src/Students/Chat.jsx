import { useMemo, useState } from "react";
import { MessageCircle, Search, Send } from "lucide-react";

const INITIAL_THREADS = [
  { id: "maya", name: "Maya Patel", detail: "Study partner · Web Development", initials: "MP", messages: [{ from: "them", text: "Want to review the DOM notes together today?", time: "10:24" }, { from: "me", text: "Yes, I can join after my focus session.", time: "10:28" }] },
  { id: "web-group", name: "Frontend Study Group", detail: "8 learners · Group", initials: "FS", messages: [{ from: "them", text: "Welcome! Share questions and useful resources here.", time: "Yesterday" }] },
  { id: "arjun", name: "Arjun Rao", detail: "Classmate · Data Structures", initials: "AR", messages: [{ from: "them", text: "I found a good way to practise array patterns.", time: "Mon" }] },
];

export default function Chat() {
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [activeId, setActiveId] = useState(INITIAL_THREADS[0].id);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const activeThread = threads.find((thread) => thread.id === activeId) || threads[0];
  const visibleThreads = useMemo(() => threads.filter((thread) => `${thread.name} ${thread.detail}`.toLowerCase().includes(search.toLowerCase())), [threads, search]);

  const send = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !activeThread) return;
    setThreads((current) => current.map((thread) => thread.id === activeId ? { ...thread, messages: [...thread.messages, { from: "me", text, time: "Now" }] } : thread));
    setDraft("");
  };

  return (
    <div className="student-page-stack">
      <section className="student-page-intro"><span className="student-page-kicker"><MessageCircle size={16} /> STUDY TOGETHER</span><h2>Messages</h2><p>Keep up with your study partners and learning groups. Messages stay in this browser demo.</p></section>
      <section className="student-chat-shell">
        <aside className="student-chat-sidebar"><div className="student-chat-heading"><div><h3>Conversations</h3><span>{threads.length} recent chats</span></div></div><label className="student-chat-search"><Search size={16} /><input aria-label="Search conversations" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search chats" /></label><div className="student-chat-threads">{visibleThreads.map((thread) => { const last = thread.messages.at(-1); return <button type="button" key={thread.id} className={`student-chat-thread ${thread.id === activeId ? "active" : ""}`} onClick={() => setActiveId(thread.id)}><span className="student-chat-initials">{thread.initials}</span><span className="student-chat-thread-copy"><strong>{thread.name}</strong><small>{last?.text || thread.detail}</small></span></button>; })}{visibleThreads.length === 0 && <p className="student-page-note">No conversations match your search.</p>}</div></aside>
        <div className="student-chat-main"><header className="student-chat-conversation-heading"><span className="student-chat-initials">{activeThread.initials}</span><div><strong>{activeThread.name}</strong><small>{activeThread.detail}</small></div><span className="student-chat-demo-tag">Frontend demo</span></header><div className="student-chat-messages" aria-live="polite">{activeThread.messages.map((message, index) => <div className={`student-chat-message ${message.from === "me" ? "mine" : ""}`} key={`${activeThread.id}-${index}`}><p>{message.text}</p><time>{message.time}</time></div>)}</div><form className="student-chat-compose" onSubmit={send}><label className="sr-only" htmlFor="student-chat-message">Write a message</label><input id="student-chat-message" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message…" /><button type="submit" className="student-page-button" disabled={!draft.trim()} aria-label="Send message"><Send size={17} /> Send</button></form></div>
      </section>
    </div>
  );
}
