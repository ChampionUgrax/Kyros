
import { useMemo, useState } from "react";
import {
  Users,
  BookOpen,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowUpRight,
  ArrowRight,
  Clock3,
  CalendarDays,
  Target,
  BrainCircuit,
  ClipboardList,
  MessageCircle,
  Activity,
  CheckCircle2,
} from "lucide-react";

const WEEKLY_ACTIVITY = [
  { day: "Mon", students: 42 },
  { day: "Tue", students: 56 },
  { day: "Wed", students: 48 },
  { day: "Thu", students: 69 },
  { day: "Fri", students: 61 },
  { day: "Sat", students: 38 },
  { day: "Sun", students: 25 },
];

const CLASSES = [
  { name: "Class 10A", subject: "Mathematics", students: 32, progress: 82, trend: "+8%" },
  { name: "Class 10B", subject: "Mathematics", students: 28, progress: 74, trend: "+5%" },
  { name: "Class 9A", subject: "Science", students: 35, progress: 68, trend: "+3%" },
  { name: "Class 9B", subject: "Science", students: 30, progress: 61, trend: "-2%" },
];

const RECENT_ACTIVITY = [
  {
    name: "Aarav Sharma",
    initials: "AS",
    action: "completed Algebra Practice",
    detail: "Class 10A · Mathematics",
    time: "10 min ago",
    color: "blue",
  },
  {
    name: "Priya Verma",
    initials: "PV",
    action: "achieved a new learning milestone",
    detail: "Class 10B · Mathematics",
    time: "35 min ago",
    color: "purple",
  },
  {
    name: "Rohan Mehta",
    initials: "RM",
    action: "completed a revision session",
    detail: "Class 9A · Science",
    time: "1 hour ago",
    color: "peach",
  },
  {
    name: "Ananya Singh",
    initials: "AS",
    action: "submitted Physics Assignment 03",
    detail: "Class 9B · Science",
    time: "2 hours ago",
    color: "green",
  },
];

const ATTENTION_STUDENTS = [
  {
    name: "Aarav Sharma",
    className: "Class 10A",
    topic: "Quadratic Equations",
    issue: "Low topic mastery",
    score: 38,
    severity: "high",
    initials: "AS",
  },
  {
    name: "Rohan Mehta",
    className: "Class 9A",
    topic: "Force and Motion",
    issue: "Practice consistency",
    score: 46,
    severity: "medium",
    initials: "RM",
  },
  {
    name: "Ananya Singh",
    className: "Class 9B",
    topic: "Chemical Reactions",
    issue: "Revision recommended",
    score: 52,
    severity: "medium",
    initials: "AS",
  },
];

function StatCard({ icon: Icon, label, value, change, note, tone, trend }) {
  return (
    <article className="teacher-overview-stat">
      <div className={`teacher-overview-stat-icon ${tone}`}>
        <Icon size={20} />
      </div>
      <div className="teacher-overview-stat-content">
        <span>{label}</span>
        <div className="teacher-overview-stat-value-row">
          <strong>{value}</strong>
          {change && (
            <span className={`teacher-overview-stat-change ${trend || "up"}`}>
              {trend === "down" ? (
                <TrendingDown size={13} />
              ) : (
                <TrendingUp size={13} />
              )}
              {change}
            </span>
          )}
        </div>
        <small>{note}</small>
      </div>
    </article>
  );
}

function SectionHeading({ title, subtitle, action, onAction }) {
  return (
    <div className="teacher-overview-section-heading">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action && (
        <button onClick={onAction}>
          {action}
          <ArrowUpRight size={15} />
        </button>
      )}
    </div>
  );
}

export default function Overview({ user, onNavigate }) {
  const [activityPeriod, setActivityPeriod] = useState("week");

  const firstName = user?.name?.trim()?.split(/\s+/)[0] || "Teacher";

  const totalStudents = useMemo(
    () => CLASSES.reduce((total, item) => total + item.students, 0),
    []
  );

  const averagePerformance = Math.round(
    CLASSES.reduce((total, item) => total + item.progress, 0) / CLASSES.length
  );

  const maxActivity = Math.max(...WEEKLY_ACTIVITY.map((item) => item.students));

  const navigate = (tab) => {
    if (onNavigate) onNavigate(tab);
  };

  return (
    <main className="teacher-overview-page">
      {/* Welcome */}
      <section className="teacher-overview-welcome">
        <div className="teacher-overview-welcome-content">
          <span className="teacher-overview-eyebrow">
            TEACHER DASHBOARD
          </span>
          <h1>
            Good morning, {firstName} <span>✦</span>
          </h1>
          <p>
            Here's what's happening with your students and classes today.
          </p>
          <div className="teacher-overview-welcome-meta">
            <span>
              <CalendarDays size={14} />
              Your learning overview
            </span>
            <span className="teacher-overview-live">
              <span />
              Demo dashboard
            </span>
          </div>
        </div>

        <div className="teacher-overview-welcome-art" aria-hidden="true">
          <div className="teacher-overview-art-circle">
            <BookOpen size={43} />
          </div>
          <span className="teacher-overview-art-spark spark-one">✦</span>
          <span className="teacher-overview-art-spark spark-two">✧</span>
          <span className="teacher-overview-art-dot" />
        </div>
      </section>

      {/* Statistics */}
      <section className="teacher-overview-stats">
        <StatCard
          icon={Users}
          label="Total Students"
          value={totalStudents}
          change="+12%"
          note="Compared to last month"
          tone="blue"
        />
        <StatCard
          icon={BookOpen}
          label="Active Classes"
          value={CLASSES.length}
          note="Across your subjects"
          tone="purple"
        />
        <StatCard
          icon={Target}
          label="Average Performance"
          value={`${averagePerformance}%`}
          change="+6%"
          note="Learning progress"
          tone="peach"
        />
        <StatCard
          icon={AlertTriangle}
          label="Needs Attention"
          value={ATTENTION_STUDENTS.length}
          note="Students to follow up"
          tone="rose"
        />
      </section>

      {/* Activity and class performance */}
      <section className="teacher-overview-main-grid">
        <article className="teacher-overview-card teacher-overview-activity-card">
          <SectionHeading
            title="Student Activity"
            subtitle="Student learning activity throughout the week"
          />

          <div className="teacher-overview-chart-summary">
            <div>
              <strong>339</strong>
              <span>Learning activities</span>
            </div>
            <span className="teacher-overview-chart-trend">
              <TrendingUp size={14} />
              Active this week
            </span>
          </div>

          <div className="teacher-overview-chart">
            {WEEKLY_ACTIVITY.map((item) => (
              <div className="teacher-overview-chart-column" key={item.day}>
                <div className="teacher-overview-chart-bar-wrap">
                  <div
                    className="teacher-overview-chart-bar"
                    style={{
                      height: `${(item.students / maxActivity) * 100}%`,
                    }}
                    title={`${item.students} activities`}
                  />
                </div>
                <span>{item.day}</span>
              </div>
            ))}
          </div>

          <div className="teacher-overview-chart-legend">
            <span />
            Daily learning activity
          </div>
        </article>

        <article className="teacher-overview-card teacher-overview-class-card">
          <SectionHeading
            title="Class Performance"
            subtitle="Learning progress by class"
            action="View all"
            onAction={() => navigate("classes")}
          />

          <div className="teacher-overview-class-list">
            {CLASSES.map((item) => (
              <div className="teacher-overview-class-item" key={item.name}>
                <div className="teacher-overview-class-top">
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.subject} · {item.students} students</span>
                  </div>
                  <strong>{item.progress}%</strong>
                </div>

                <div className="teacher-overview-progress-track">
                  <div
                    className="teacher-overview-progress-fill"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>

                <div className="teacher-overview-class-bottom">
                  <span>Overall mastery</span>
                  <span className={item.trend.startsWith("-") ? "negative" : "positive"}>
                    {item.trend} this month
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* Attention and activity */}
      <section className="teacher-overview-lower-grid">
        <article className="teacher-overview-card">
          <SectionHeading
            title="Students Needing Attention"
            subtitle="Learners who may need additional support"
            action="View insights"
            onAction={() => navigate("misconceptions")}
          />

          <div className="teacher-overview-attention-list">
            {ATTENTION_STUDENTS.map((student) => (
              <div className="teacher-overview-attention-item" key={student.name}>
                <div className="teacher-overview-student-avatar">
                  {student.initials}
                </div>

                <div className="teacher-overview-attention-info">
                  <strong>{student.name}</strong>
                  <span>{student.className} · {student.topic}</span>
                  <small>{student.issue}</small>
                </div>

                <div className="teacher-overview-attention-score">
                  <strong>{student.score}%</strong>
                  <span className={student.severity}>
                    {student.severity === "high" ? "High priority" : "Review"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            className="teacher-overview-full-button"
            onClick={() => navigate("misconceptions")}
          >
            Explore student insights
            <ArrowRight size={16} />
          </button>
        </article>

        <article className="teacher-overview-card">
          <SectionHeading
            title="Recent Activity"
            subtitle="Latest updates from your students"
          />

          <div className="teacher-overview-recent-list">
            {RECENT_ACTIVITY.map((item, index) => (
              <div className="teacher-overview-recent-item" key={`${item.name}-${index}`}>
                <div className={`teacher-overview-recent-avatar ${item.color}`}>
                  {item.initials}
                </div>
                <div className="teacher-overview-recent-content">
                  <p>
                    <strong>{item.name}</strong> {item.action}
                  </p>
                  <span>{item.detail}</span>
                  <small>
                    <Clock3 size={11} />
                    {item.time}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* Quick actions */}
      <section className="teacher-overview-quick-section">
        <SectionHeading
          title="Quick Actions"
          subtitle="Jump straight into your teaching workflow"
        />

        <div className="teacher-overview-quick-grid">
          <button onClick={() => navigate("classes")}>
            <span className="teacher-overview-quick-icon blue">
              <BookOpen size={20} />
            </span>
            <span>
              <strong>My Classes</strong>
              <small>Manage your classes</small>
            </span>
            <ArrowUpRight size={16} />
          </button>

          <button onClick={() => navigate("misconceptions")}>
            <span className="teacher-overview-quick-icon purple">
              <BrainCircuit size={20} />
            </span>
            <span>
              <strong>Misconceptions</strong>
              <small>Explore learning gaps</small>
            </span>
            <ArrowUpRight size={16} />
          </button>

          <button onClick={() => navigate("heatmap")}>
            <span className="teacher-overview-quick-icon peach">
              <Activity size={20} />
            </span>
            <span>
              <strong>Class Heatmap</strong>
              <small>Analyse topic mastery</small>
            </span>
            <ArrowUpRight size={16} />
          </button>

          <button onClick={() => navigate("chat")}>
            <span className="teacher-overview-quick-icon green">
              <MessageCircle size={20} />
            </span>
            <span>
              <strong>Messages</strong>
              <small>Connect with students</small>
            </span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </section>
    </main>
  );
}
