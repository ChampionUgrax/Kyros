import { useMemo, useState } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  Layers3,
  ArrowUpRight,
  ArrowRight,
  CalendarDays,
  Clock3,
  UserPlus,
  Plus,
  ClipboardList,
  BarChart3,
  Bell,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Activity,
  Target,
} from "lucide-react";

import InstituteStatCard from "./InstituteStatcard.jsx";
import ChartCard from "./ChartCard.jsx";

const ENROLLMENT_DATA = [
  { month: "May", students: 1840 },
  { month: "Jun", students: 1910 },
  { month: "Jul", students: 2050 },
  { month: "Aug", students: 2180 },
  { month: "Sep", students: 2310 },
  { month: "Oct", students: 2450 },
];

const PERFORMANCE_DATA = [
  { name: "CSE - A", performance: 82, attendance: 88 },
  { name: "CSE - B", performance: 76, attendance: 81 },
  { name: "DS - A", performance: 71, attendance: 79 },
  { name: "MBA - A", performance: 68, attendance: 74 },
  { name: "IT - A", performance: 85, attendance: 91 },
];

const DISTRIBUTION_DATA = [
  { name: "Computer Science", students: 980 },
  { name: "Data Science", students: 540 },
  { name: "Management", students: 430 },
  { name: "Information Technology", students: 320 },
  { name: "Mathematics", students: 180 },
];

const RECENT_ACTIVITIES = [
  {
    id: 1,
    title: "New students enrolled",
    description: "8 students added to Data Science - A",
    time: "Today, 01:20 PM",
    icon: UserPlus,
    type: "success",
  },
  {
    id: 2,
    title: "Faculty profile updated",
    description: "Dr. Neha Kapoor joined the faculty directory",
    time: "Today, 08:30 AM",
    icon: GraduationCap,
    type: "faculty",
  },
  {
    id: 3,
    title: "Attendance alert generated",
    description: "12 students have attendance below the threshold",
    time: "Today, 09:15 AM",
    icon: AlertTriangle,
    type: "warning",
  },
  {
    id: 4,
    title: "Course progress updated",
    description: "Data Structures reached 85% completion",
    time: "Yesterday, 04:45 PM",
    icon: BookOpen,
    type: "academic",
  },
  {
    id: 5,
    title: "New batch created",
    description: "B.Tech CSE - C added to the institute",
    time: "Yesterday, 11:10 AM",
    icon: Layers3,
    type: "batch",
  },
];

const ATTENTION_STUDENTS = [
  {
    id: "STU-1024",
    name: "Aarav Sharma",
    batch: "B.Tech CSE - B",
    issue: "Low attendance",
    value: "61%",
    severity: "high",
  },
  {
    id: "STU-1087",
    name: "Diya Mehta",
    batch: "Data Science - A",
    issue: "Low learning score",
    value: "48%",
    severity: "high",
  },
  {
    id: "STU-1132",
    name: "Kabir Verma",
    batch: "B.Tech CSE - A",
    issue: "Needs academic support",
    value: "55%",
    severity: "medium",
  },
];

const QUICK_ACTIONS = [
  {
    label: "Add Student",
    description: "Register a new student",
    icon: UserPlus,
    tab: "students",
  },
  {
    label: "Add Faculty",
    description: "Create a faculty profile",
    icon: GraduationCap,
    tab: "faculty",
  },
  {
    label: "Create Batch",
    description: "Organise a new batch",
    icon: Layers3,
    tab: "batches",
  },
  {
    label: "Add Course",
    description: "Create a course",
    icon: BookOpen,
    tab: "courses",
  },
];

function SectionHeading({ title, subtitle, action, onAction }) {
  return (
    <div className="institute-overview-section-heading">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>

      {action && (
        <button type="button" onClick={onAction}>
          {action}
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}

function ActivityItem({ activity }) {
  const Icon = activity.icon;

  return (
    <div className="institute-overview-activity-item">
      <div className={`institute-overview-activity-icon ${activity.type}`}>
        <Icon size={17} />
      </div>

      <div className="institute-overview-activity-content">
        <strong>{activity.title}</strong>
        <p>{activity.description}</p>
        <span>
          <Clock3 size={11} />
          {activity.time}
        </span>
      </div>
    </div>
  );
}

export default function Overview({ onNavigate }) {
  const [enrollmentPeriod, setEnrollmentPeriod] = useState("This year");

  const enrollmentSummary = useMemo(() => {
    const first = ENROLLMENT_DATA[0].students;
    const last = ENROLLMENT_DATA[ENROLLMENT_DATA.length - 1].students;
    const growth = (((last - first) / first) * 100).toFixed(1);

    return {
      total: last.toLocaleString("en-IN"),
      growth: `+${growth}%`,
    };
  }, []);

  const navigate = (tab) => {
    onNavigate?.(tab);
  };

  return (
    <div className="institute-overview-page">
      {/* Welcome header */}
      <header className="institute-overview-header">
        <div>
          <div className="institute-overview-eyebrow">
            <Activity size={14} />
            INSTITUTE COMMAND CENTRE
          </div>

          <h1>Institute Overview</h1>
          <p>
            Here's what's happening across your institute. Track performance,
            monitor activity, and manage your academic operations.
          </p>
        </div>

        <div className="institute-overview-date">
          <CalendarDays size={16} />
          <span>
            {new Date().toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </header>

      {/* Main metrics */}
      <section className="institute-overview-stats">
        <InstituteStatCard
          title="Total Students"
          value="2,450"
          change="+12.5%"
          changeType="positive"
          comparison="vs. last month"
          icon={Users}
          iconColor="#65A5DA"
          iconBackground="rgba(101, 165, 218, 0.12)"
          onClick={() => navigate("students")}
        />

        <InstituteStatCard
          title="Faculty Members"
          value="86"
          change="+4.2%"
          changeType="positive"
          comparison="vs. last month"
          icon={GraduationCap}
          iconColor="#8B83D9"
          iconBackground="rgba(139, 131, 217, 0.12)"
          onClick={() => navigate("faculty")}
        />

        <InstituteStatCard
          title="Active Batches"
          value="32"
          change="+2"
          changeType="positive"
          comparison="new batches"
          icon={Layers3}
          iconColor="#55B98E"
          iconBackground="rgba(85, 185, 142, 0.12)"
          onClick={() => navigate("batches")}
        />

        <InstituteStatCard
          title="Total Courses"
          value="18"
          change="No change"
          changeType="neutral"
          comparison="vs. last month"
          icon={BookOpen}
          iconColor="#E8A65C"
          iconBackground="rgba(232, 166, 92, 0.12)"
          onClick={() => navigate("courses")}
        />
      </section>

      {/* Secondary metrics */}
      <section className="institute-overview-secondary-stats">
        <div className="institute-overview-mini-stat">
          <div className="institute-overview-mini-icon attendance">
            <CalendarDays size={17} />
          </div>
          <div>
            <span>Average Attendance</span>
            <strong>87.4%</strong>
          </div>
          <span className="institute-overview-mini-trend">
            <ArrowUpRight size={13} />
            3.2%
          </span>
        </div>

        <div className="institute-overview-mini-stat">
          <div className="institute-overview-mini-icon performance">
            <Target size={17} />
          </div>
          <div>
            <span>Average Performance</span>
            <strong>76.8%</strong>
          </div>
          <span className="institute-overview-mini-trend">
            <ArrowUpRight size={13} />
            5.1%
          </span>
        </div>

        <div className="institute-overview-mini-stat">
          <div className="institute-overview-mini-icon completion">
            <CheckCircle2 size={17} />
          </div>
          <div>
            <span>Course Completion</span>
            <strong>79.2%</strong>
          </div>
          <span className="institute-overview-mini-trend">
            <ArrowUpRight size={13} />
            4.6%
          </span>
        </div>
      </section>

      {/* Main charts */}
      <section className="institute-overview-chart-grid">
        <div className="institute-overview-chart-large">
          <ChartCard
            title="Student Enrollment"
            subtitle="Student growth across the institute"
            type="area"
            data={ENROLLMENT_DATA}
            xKey="month"
            series={[
              {
                dataKey: "students",
                label: "Students",
                color: "#65A5DA",
              },
            ]}
            height={285}
            showGrid
            showLegend={false}
            showYAxis
            showXAxis
            showFilter
            filterValue={enrollmentPeriod}
            filterOptions={["This year", "Last year"]}
            onFilterChange={setEnrollmentPeriod}
            formatter={(value) => Number(value).toLocaleString("en-IN")}
            footer={
              <div className="institute-overview-chart-footer">
                <span>
                  Current enrollment: <strong>{enrollmentSummary.total}</strong>
                </span>
                <span className="positive">
                  <ArrowUpRight size={13} />
                  {enrollmentSummary.growth} growth
                </span>
              </div>
            }
          />
        </div>

        <div className="institute-overview-chart-small">
          <ChartCard
            title="Department Distribution"
            subtitle="Students across departments"
            type="donut"
            data={DISTRIBUTION_DATA}
            nameKey="name"
            valueKey="students"
            height={285}
            showLegend
            showTooltip
            centerLabel="Students"
            centerValue="2,450"
          />
        </div>
      </section>

      {/* Batch performance */}
      <section className="institute-overview-performance-section">
        <div className="institute-overview-section-top">
          <SectionHeading
            title="Batch Performance"
            subtitle="Compare academic performance and attendance across batches."
            action="View analytics"
            onAction={() => navigate("analytics")}
          />
        </div>

        <div className="institute-overview-performance-grid">
          {PERFORMANCE_DATA.map((batch, index) => (
            <div className="institute-overview-performance-card" key={batch.name}>
              <div className="institute-overview-performance-card-top">
                <div className="institute-overview-batch-avatar">
                  {batch.name.split(" ").slice(0, 2).join("").replace("-", "")}
                </div>
                <span className="institute-overview-rank">
                  #{index + 1}
                </span>
              </div>

              <h3>{batch.name}</h3>
              <div className="institute-overview-performance-score">
                <strong>{batch.performance}%</strong>
                <span>Performance</span>
              </div>

              <div className="institute-overview-performance-track">
                <div style={{ width: `${batch.performance}%` }} />
              </div>

              <div className="institute-overview-performance-footer">
                <span>Attendance</span>
                <strong>{batch.attendance}%</strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lower content */}
      <section className="institute-overview-lower-grid">
        {/* Recent activity */}
        <div className="institute-overview-panel">
          <SectionHeading
            title="Recent Activity"
            subtitle="Latest updates from across your institute."
            action="View all"
            onAction={() => navigate("notifications")}
          />

          <div className="institute-overview-activity-list">
            {RECENT_ACTIVITIES.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>

        {/* Attention list */}
        <div className="institute-overview-panel">
          <SectionHeading
            title="Needs Attention"
            subtitle="Students who may need additional support."
            action="View students"
            onAction={() => navigate("students")}
          />

          <div className="institute-overview-attention-list">
            {ATTENTION_STUDENTS.map((student) => (
              <div
                className="institute-overview-attention-item"
                key={student.id}
              >
                <div className="institute-overview-student-avatar">
                  {student.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>

                <div className="institute-overview-student-info">
                  <strong>{student.name}</strong>
                  <span>{student.batch}</span>
                  <small>{student.issue}</small>
                </div>

                <div className="institute-overview-student-score">
                  <strong>{student.value}</strong>
                  <span className={student.severity}>
                    {student.severity === "high" ? "High risk" : "Review"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="institute-overview-attention-note">
            <AlertTriangle size={14} />
            These are illustrative demo records, not live risk assessments.
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="institute-overview-quick-section">
        <SectionHeading
          title="Quick Actions"
          subtitle="Common institute management tasks."
        />

        <div className="institute-overview-quick-grid">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;

            return (
              <button
                type="button"
                className="institute-overview-quick-card"
                key={action.tab}
                onClick={() => navigate(action.tab)}
              >
                <div className="institute-overview-quick-icon">
                  <Icon size={19} />
                </div>

                <div>
                  <strong>{action.label}</strong>
                  <span>{action.description}</span>
                </div>

                <ArrowRight size={16} className="quick-arrow" />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
