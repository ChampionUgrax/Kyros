import { ArrowRight, BrainCircuit, CircleHelp, Flame, Target } from "lucide-react";

const TOPICS = [
  { name: "Arrays", subject: "Data Structures", score: 45, change: "+8% this week", priority: "High" },
  { name: "Functions", subject: "JavaScript", score: 62, change: "+5% this week", priority: "Practice" },
  { name: "Objects", subject: "JavaScript", score: 38, change: "Needs attention", priority: "High" },
  { name: "DOM Manipulation", subject: "Web Development", score: 72, change: "+12% this week", priority: "Improving" },
];

export default function WeakTopics({ onNavigate = () => {} }) {
  const average = Math.round(TOPICS.reduce((sum, topic) => sum + topic.score, 0) / TOPICS.length);
  const priorityCount = TOPICS.filter((topic) => topic.score < 50).length;
  return (
    <div className="student-page-stack student-weak-page">
      <section className="student-page-intro student-weak-hero"><div><span className="student-page-kicker"><BrainCircuit size={16} /> PERSONALIZED PRACTICE</span><h2>Build confidence, one topic at a time.</h2><p>Use your recent practice scores to decide where to focus next.</p></div><div className="student-weak-hero-mark"><Target size={30} /></div></section>
      <section className="student-page-stats" aria-label="Topic performance summary"><div className="student-page-stat"><span>Topics tracked</span><strong>{TOPICS.length}</strong><small>Across your courses</small></div><div className="student-page-stat"><span>Average practice score</span><strong>{average}%</strong><small>Keep improving steadily</small></div><div className="student-page-stat"><span>Priority topics</span><strong><Flame size={19} /> {priorityCount}</strong><small>Below 50% right now</small></div></section>
      <section className="student-page-section"><div className="student-page-section-heading"><div><h3>Topic performance</h3><p>Start with a priority topic, then check your progress again.</p></div><span className="student-weak-legend"><i /> Needs practice <i className="good" /> Building strength</span></div>
        <div className="student-topic-list">{TOPICS.map((topic) => <article className="student-topic-card" key={topic.name}><div className="student-topic-main"><div className={`student-topic-score ${topic.score < 50 ? "priority" : ""}`}>{topic.score}%</div><div className="student-topic-copy"><div className="student-topic-title"><h4>{topic.name}</h4><span className={`student-topic-priority ${topic.score < 50 ? "priority" : ""}`}>{topic.priority}</span></div><p>{topic.subject} <span>·</span> {topic.change}</p></div></div><div className="student-topic-progress"><span className={topic.score < 50 ? "priority" : ""} style={{ width: `${topic.score}%` }} /></div><button type="button" className="student-topic-action" onClick={() => onNavigate("revision")}>Review topic <ArrowRight size={15} /></button></article>)}</div>
      </section>
      <section className="student-page-callout"><div><h3>Need a hint before you practise?</h3><p>Ask the learning assistant to explain a concept in smaller steps.</p></div><button type="button" className="student-page-button" onClick={() => onNavigate("assistant")}><CircleHelp size={16} /> Ask assistant</button></section>
      <p className="student-page-note">Topic scores are sample data for the frontend demo and are not tied to a backend account.</p>
    </div>
  );
}
