import { ArrowRight, BookOpen, Clock3, Flame, GraduationCap } from "lucide-react";

const COURSES = [
  { id: "web", title: "Web Development", subtitle: "HTML, CSS and JavaScript", progress: 68, next: "DOM fundamentals", color: "blue" },
  { id: "react", title: "React Fundamentals", subtitle: "Components, state and routing", progress: 42, next: "Reusable components", color: "purple" },
  { id: "dsa", title: "Data Structures", subtitle: "Arrays, lists and problem solving", progress: 31, next: "Array patterns", color: "green" },
];

export default function MyLearning({ onNavigate = () => {} }) {
  return (
    <div className="student-page-stack">
      <section className="student-page-intro">
        <span className="student-page-kicker"><BookOpen size={16} /> YOUR STUDY PLAN</span>
        <h2>My Learning</h2>
        <p>Pick up where you left off and keep each subject moving forward.</p>
      </section>

      <section className="student-page-stats" aria-label="Learning summary">
        <div className="student-page-stat"><span>Active courses</span><strong>3</strong><small>Stay on track</small></div>
        <div className="student-page-stat"><span>Study time</span><strong>6.5 hrs</strong><small>This week</small></div>
        <div className="student-page-stat"><span>Current streak</span><strong><Flame size={19} /> 7 days</strong><small>One session at a time</small></div>
      </section>

      <section className="student-page-section">
        <div className="student-page-section-heading"><div><h3>Your courses</h3><p>Progress is saved in this demo workspace.</p></div></div>
        <div className="student-course-grid">
          {COURSES.map((course) => (
            <article className={`student-course-card tone-${course.color}`} key={course.id}>
              <div className="student-course-icon"><GraduationCap size={21} /></div>
              <div className="student-course-copy"><h4>{course.title}</h4><p>{course.subtitle}</p></div>
              <div className="student-course-progress-label"><span>Course progress</span><strong>{course.progress}%</strong></div>
              <div className="student-course-progress"><span style={{ width: `${course.progress}%` }} /></div>
              <div className="student-course-next"><span><Clock3 size={15} /> Next: {course.next}</span><button type="button" onClick={() => onNavigate("revision")} aria-label={`Review ${course.title}`}><ArrowRight size={17} /></button></div>
            </article>
          ))}
        </div>
      </section>

      <section className="student-page-callout"><div><h3>Ready for a quick review?</h3><p>Use your revision cards to strengthen what you have learned.</p></div><button type="button" className="student-page-button" onClick={() => onNavigate("revision")}>Open revision <ArrowRight size={16} /></button></section>
    </div>
  );
}
