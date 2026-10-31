import { ArrowRight, BrainCircuit, CircleHelp, Flame, Target } from "lucide-react";
import { useFetch } from "../services/hooks.js";
import { State } from "../components/Panels.jsx";

export default function WeakTopics({ onNavigate = () => {} }) {
  const { data, loading, error } = useFetch("/student/weak-topics");
  const TOPICS = (Array.isArray(data) ? data : []).map((item) => ({ name: item.topic, subject: "Based on your quiz attempts", score: Number(item.score) || 0, change: `${item.attempts} recent ${item.attempts === 1 ? "attempt" : "attempts"}`, priority: item.score < 50 ? "High priority" : "Practice" }));
  const average = Math.round(TOPICS.reduce((sum, topic) => sum + topic.score, 0) / TOPICS.length);
  const priorityCount = TOPICS.filter((topic) => topic.score < 50).length;
  return (
    <div className="student-page-stack student-weak-page">
      <section className="student-page-intro student-weak-hero"><div><span className="student-page-kicker"><BrainCircuit size={16} /> PERSONALIZED PRACTICE</span><h2>Build confidence, one topic at a time.</h2><p>Use your recent practice scores to decide where to focus next.</p></div><div className="student-weak-hero-mark"><Target size={30} /></div></section>
      <section className="student-page-stats" aria-label="Topic performance summary"><div className="student-page-stat"><span>Topics tracked</span><strong>{TOPICS.length}</strong><small>From completed quizzes</small></div><div className="student-page-stat"><span>Average practice score</span><strong>{TOPICS.length ? `${average}%` : "—"}</strong><small>Across your attempts</small></div><div className="student-page-stat"><span>Priority topics</span><strong><Flame size={19} /> {priorityCount}</strong><small>Below 50% right now</small></div></section>
      <section className="student-page-section"><div className="student-page-section-heading"><div><h3>Topic performance</h3><p>Start with a priority topic, then check your progress again.</p></div><span className="student-weak-legend"><i /> Needs practice <i className="good" /> Building strength</span></div>
        {loading || error || !TOPICS.length ? <State loading={loading} error={error} empty="Your quiz results will identify topics that need more practice." /> : <div className="student-topic-list">{TOPICS.map((topic) => <article className="student-topic-card" key={topic.name}><div className="student-topic-main"><div className={`student-topic-score ${topic.score < 50 ? "priority" : ""}`}>{topic.score}%</div><div className="student-topic-copy"><div className="student-topic-title"><h4>{topic.name}</h4><span className={`student-topic-priority ${topic.score < 50 ? "priority" : ""}`}>{topic.priority}</span></div><p>{topic.subject} <span>·</span> {topic.change}</p></div></div><div className="student-topic-progress"><span className={topic.score < 50 ? "priority" : ""} style={{ width: `${topic.score}%` }} /></div><button type="button" className="student-topic-action" onClick={() => onNavigate("revision")}>Review topic <ArrowRight size={15} /></button></article>)}</div>}
      </section>
      <section className="student-page-callout"><div><h3>Need a hint before you practise?</h3><p>Ask the learning assistant to explain a concept in smaller steps.</p></div><button type="button" className="student-page-button" onClick={() => onNavigate("assistant")}><CircleHelp size={16} /> Ask assistant</button></section>
    </div>
  );
}
