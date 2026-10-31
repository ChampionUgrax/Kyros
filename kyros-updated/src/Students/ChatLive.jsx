import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Search, Send, UserPlus } from "lucide-react";
import { api } from "../services/api.js";
import { useFetch } from "../services/hooks.js";
import { State } from "../components/Panels.jsx";

export default function ChatLive() {
  const { data, loading, error, reload } = useFetch("/student/chats");
  const threads = Array.isArray(data) ? data : [];
  const [activeId, setActiveId] = useState("");
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const active = threads.find((thread) => thread.id === activeId);
  const visible = useMemo(() => threads.filter((thread) => `${thread.name} ${thread.detail}`.toLowerCase().includes(search.toLowerCase())), [threads, search]);
  useEffect(() => { if (!activeId && threads.length) setActiveId(threads[0].id); }, [threads, activeId]);
  useEffect(() => { if (!activeId) { setMessages([]); return; } let alive = true; api.get(`/student/chats/${encodeURIComponent(activeId)}/messages`).then((data) => alive && setMessages(Array.isArray(data) ? data : [])).catch((err) => alive && setNotice(err.message)); return () => { alive = false; }; }, [activeId]);
  const startChat = async (event) => { event.preventDefault(); try { setNotice(""); const thread = await api.post("/student/chats", { email }); setEmail(""); await reload(); setActiveId(thread.id); } catch (err) { setNotice(err.message || "Could not start the conversation."); } };
  const send = async (event) => { event.preventDefault(); const text = draft.trim(); if (!text || !activeId) return; try { const message = await api.post(`/student/chats/${encodeURIComponent(activeId)}/messages`, { text }); setMessages((current) => [...current, message]); setDraft(""); reload(); } catch (err) { setNotice(err.message || "Could not send your message."); } };
  return <div className="student-page-stack">
    <section className="student-page-intro"><span className="student-page-kicker"><MessageCircle size={16}/> STUDY TOGETHER</span><h2>Messages</h2><p>Connect with registered learners using your account.</p></section>
    <form className="student-page-section" onSubmit={startChat}><label htmlFor="student-chat-email"><UserPlus size={16}/> Start a conversation</label><div className="student-chat-compose"><input id="student-chat-email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Learner email address" required/><button className="student-page-button" type="submit">Start chat</button></div>{notice&&<p role="status">{notice}</p>}</form>
    <section className="student-chat-shell">
      <aside className="student-chat-sidebar"><div className="student-chat-heading"><div><h3>Conversations</h3><span>{threads.length} chats</span></div></div><label className="student-chat-search"><Search size={16}/><input aria-label="Search conversations" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search chats"/></label><div className="student-chat-threads">{loading||error||!visible.length?<State loading={loading} error={error} empty="No conversations yet. Start one with a registered learner."/>:visible.map((thread)=><button type="button" key={thread.id} className={`student-chat-thread ${thread.id===activeId?"active":""}`} onClick={()=>setActiveId(thread.id)}><span className="student-chat-initials">{thread.name?.slice(0,2).toUpperCase()||"KY"}</span><span className="student-chat-thread-copy"><strong>{thread.name}</strong><small>{thread.lastMessage||thread.detail}</small></span></button>)}</div></aside>
      <div className="student-chat-main">{active?<><header className="student-chat-conversation-heading"><span className="student-chat-initials">{active.name?.slice(0,2).toUpperCase()||"KY"}</span><div><strong>{active.name}</strong><small>{active.detail}</small></div></header><div className="student-chat-messages" aria-live="polite">{messages.map((message)=><div className={`student-chat-message ${message.senderUid===JSON.parse(localStorage.getItem("kyros_user")||"{}").uid?"mine":""}`} key={message.id}><p>{message.text}</p><time>{message.createdAt?new Date(message.createdAt).toLocaleString():""}</time></div>)}</div><form className="student-chat-compose" onSubmit={send}><label className="sr-only" htmlFor="student-chat-message">Write a message</label><input id="student-chat-message" value={draft} onChange={(e)=>setDraft(e.target.value)} placeholder="Write a message…"/><button type="submit" className="student-page-button" disabled={!draft.trim()}><Send size={17}/> Send</button></form></>:<div className="student-focus-history-empty">Choose a conversation to see messages.</div>}</div>
    </section>
  </div>;
}
