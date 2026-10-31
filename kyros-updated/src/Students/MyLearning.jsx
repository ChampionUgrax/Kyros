import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Clock3, GraduationCap } from "lucide-react";
import { api } from "../services/api.js";
import { useFetch } from "../services/hooks.js";
import { State } from "../components/Panels.jsx";

export default function MyLearning({ onNavigate = () => {} }) {
  const { data, loading, error } = useFetch("/student/courses");
  const courses = Array.isArray(data) ? data : [];
  const [overview, setOverview] = useState([]);
  useEffect(() => { api.get("/student/overview").then(setOverview).catch(() => setOverview([])); }, []);
  return <div className="student-page-stack">
    <section className="student-page-intro"><span className="student-page-kicker"><BookOpen size={16} /> YOUR STUDY PLAN</span><h2>My Learning</h2><p>Continue your enrolled courses and keep each subject moving forward.</p></section>
    <section className="student-page-stats" aria-label="Learning summary">{(overview.length ? overview : [{label:"Active courses",value:String(courses.length),hint:"From your account"},{label:"Practice attempts",value:"—",hint:"Loading learning record"},{label:"Study materials",value:"—",hint:"Loading learning record"}]).slice(0,3).map((item)=><div className="student-page-stat" key={item.label}><span>{item.label}</span><strong>{item.value}</strong><small>{item.hint}</small></div>)}</section>
    <section className="student-page-section"><div className="student-page-section-heading"><div><h3>Your courses</h3><p>Courses assigned to your account.</p></div></div>
      {loading || error || !courses.length ? <State loading={loading} error={error} empty="No courses are linked to your account yet." /> : <div className="student-course-grid">{courses.map((course)=><article className="student-course-card" key={course.id}><div className="student-course-icon"><GraduationCap size={21}/></div><div className="student-course-copy"><h4>{course.title || course.name || "Course"}</h4><p>{course.description || course.subtitle || "Your enrolled learning course"}</p></div><div className="student-course-progress-label"><span>Course progress</span><strong>{Number(course.progress)||0}%</strong></div><div className="student-course-progress"><span style={{width:`${Math.max(0,Math.min(100,Number(course.progress)||0))}%`}}/></div><div className="student-course-next"><span><Clock3 size={15}/> {course.next || "Continue learning"}</span><button type="button" onClick={()=>onNavigate("revision")} aria-label={`Review ${course.title||course.name||"course"}`}><ArrowRight size={17}/></button></div></article>)}</div>}
    </section>
    <section className="student-page-callout"><div><h3>Ready for a quick review?</h3><p>Use your revision cards to strengthen what you have learned.</p></div><button type="button" className="student-page-button" onClick={()=>onNavigate("revision")}>Open revision <ArrowRight size={16}/></button></section>
  </div>;
}
