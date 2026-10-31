
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  GraduationCap,
  Users,
  CalendarDays,
  ClipboardCheck,
  TrendingUp,
  BookOpen,
  Clock3,
  MapPin,
  ShieldCheck,
  Pencil,
  Download,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Activity,
  Award,
  ChevronRight,
  User,
} from "lucide-react";
import ChartCard from "./ChartCard.jsx";

const DEMO_ATTENDANCE = [
  { date: "30 Oct 2026", subject: "Data Structures", status: "Present" },
  { date: "29 Oct 2026", subject: "Web Development", status: "Present" },
  { date: "28 Oct 2026", subject: "Mathematics", status: "Absent" },
  { date: "27 Oct 2026", subject: "Computer Networks", status: "Present" },
  { date: "26 Oct 2026", subject: "Data Structures", status: "Late" },
  { date: "24 Oct 2026", subject: "Web Development", status: "Present" },
  { date: "23 Oct 2026", subject: "Mathematics", status: "Present" },
  { date: "22 Oct 2026", subject: "Computer Networks", status: "Present" },
];

const DEMO_PERFORMANCE = [
  { name: "Jun", score: 68 },
  { name: "Jul", score: 72 },
  { name: "Aug", score: 70 },
  { name: "Sep", score: 78 },
  { name: "Oct", score: 86 },
];

const DEMO_COURSES = [
  { id: "course-1", name: "Data Structures", progress: 82, score: 88 },
  { id: "course-2", name: "Web Development", progress: 74, score: 84 },
  { id: "course-3", name: "Mathematics", progress: 68, score: 76 },
  { id: "course-4", name: "Computer Networks", progress: 59, score: 71 },
];

const DEMO_ACTIVITY = [
  {
    id: 1,
    title: "Completed a learning module",
    description: "Data Structures · Trees and Graphs",
    date: "30 Oct 2026 · 11:25 AM",
    type: "learning",
  },
  {
    id: 2,
    title: "Submitted an assignment",
    description: "Web Development · Responsive Layout",
    date: "29 Oct 2026 · 03:40 PM",
    type: "assignment",
  },
  {
    id: 3,
    title: "Attended a class",
    description: "Mathematics · Differential Equations",
    date: "28 Oct 2026 · 10:00 AM",
    type: "attendance",
  },
  {
    id: 4,
    title: "Earned a learning achievement",
    description: "Completed 5 consecutive learning sessions",
    date: "26 Oct 2026 · 05:15 PM",
    type: "achievement",
  },
];

function getInitials(name = "Student") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function DetailMetric({ icon: Icon, label, value, caption, tone = "blue" }) {
  return (
    <div className="institute-student-detail-metric">
      <div className={`institute-student-detail-metric-icon ${tone}`}>
        <Icon size={17} />
      </div>
      <div className="institute-student-detail-metric-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        {caption && <small>{caption}</small>}
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="institute-student-detail-info-item">
      <span className="institute-student-detail-info-icon">
        <Icon size={15} />
      </span>
      <div>
        <span>{label}</span>
        <strong>{value || "Not provided"}</strong>
      </div>
    </div>
  );
}

function SectionCard({ title, subtitle, action, children }) {
  return (
    <section className="institute-student-detail-panel">
      <div className="institute-student-detail-panel-heading">
        <div>
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function StatusBadge({ status }) {
  const normalized = (status || "Unknown").toLowerCase();

  return (
    <span className={`institute-student-detail-status ${normalized}`}>
      <span />
      {status || "Unknown"}
    </span>
  );
}

export default function StudentDetails({
  student,
  onBack,
  onEdit,
  attendanceRecords,
  courses,
  activities,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [attendanceSearch, setAttendanceSearch] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState("All");

  const studentAttendance = attendanceRecords || DEMO_ATTENDANCE;
  const studentCourses = courses || DEMO_COURSES;
  const studentActivities = activities || DEMO_ACTIVITY;

  const filteredAttendance = useMemo(() => {
    const query = attendanceSearch.trim().toLowerCase();

    return studentAttendance.filter((record) => {
      const matchesSearch =
        record.subject?.toLowerCase().includes(query) ||
        record.date?.toLowerCase().includes(query);

      const matchesStatus =
        attendanceFilter === "All" || record.status === attendanceFilter;

      return matchesSearch && matchesStatus;
    });
  }, [studentAttendance, attendanceSearch, attendanceFilter]);

  if (!student) {
    return (
      <div className="institute-student-detail-missing">
        <UserRound size={34} />
        <h2>Student not found</h2>
        <p>Select a student from the directory to view their profile.</p>
        <button type="button" onClick={onBack}>
          <ArrowLeft size={15} />
          Back to students
        </button>
      </div>
    );
  }

  const {
    name = "Unnamed Student",
    enrollmentId = student.id || "Not assigned",
    email = "Not provided",
    phone = "Not provided",
    batchName = student.batch || "Unassigned batch",
    courseName = "Not assigned",
    academicYear = "—",
    semester = "—",
    section = "—",
    attendance = 0,
    performance = 0,
    status = "Active",
    avatar,
    profileImage,
    guardianName = "Not provided",
    guardianPhone = "Not provided",
    address = "Not provided",
    admissionDate = "Not provided",
    department = "Not provided",
  } = student;

  const photo = avatar || profileImage;
  const attendanceValue = Number(attendance) || 0;
  const performanceValue = Number(performance) || 0;

  const tabs = [
    { id: "overview", label: "Overview", icon: UserRound },
    { id: "academics", label: "Academics", icon: GraduationCap },
    { id: "attendance", label: "Attendance", icon: ClipboardCheck },
    { id: "activity", label: "Activity", icon: Activity },
  ];

  const renderOverview = () => (
    <div className="institute-student-detail-content-grid">
      <div className="institute-student-detail-main-column">
        <SectionCard
          title="Personal information"
          subtitle="Student's registered contact and personal details."
        >
          <div className="institute-student-detail-info-grid">
            <InfoItem icon={User} label="Full name" value={name} />
            <InfoItem icon={Mail} label="Email address" value={email} />
            <InfoItem icon={Phone} label="Phone number" value={phone} />
            <InfoItem icon={CalendarDays} label="Admission date" value={admissionDate} />
            <InfoItem icon={MapPin} label="Address" value={address} />
            <InfoItem icon={Building2Fallback} label="Department" value={department} />
          </div>
        </SectionCard>

        <SectionCard
          title="Guardian information"
          subtitle="Emergency and family contact details."
        >
          <div className="institute-student-detail-info-grid">
            <InfoItem icon={UserRound} label="Guardian name" value={guardianName} />
            <InfoItem icon={Phone} label="Guardian phone" value={guardianPhone} />
          </div>
        </SectionCard>

        <SectionCard
          title="Recent activity"
          subtitle="Latest recorded learning activities."
          action={
            <button
              type="button"
              className="institute-student-detail-text-btn"
              onClick={() => setActiveTab("activity")}
            >
              View all <ChevronRight size={14} />
            </button>
          }
        >
          <ActivityList activities={studentActivities.slice(0, 3)} />
        </SectionCard>
      </div>

      <div className="institute-student-detail-side-column">
        <SectionCard title="Academic overview" subtitle="Current academic placement.">
          <div className="institute-student-detail-academic-summary">
            <div>
              <span>Batch</span>
              <strong>{batchName}</strong>
            </div>
            <div>
              <span>Course</span>
              <strong>{courseName}</strong>
            </div>
            <div>
              <span>Academic year</span>
              <strong>{academicYear}</strong>
            </div>
            <div>
              <span>Semester / Section</span>
              <strong>{semester} / {section}</strong>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Learning performance" subtitle="Current student indicators.">
          <div className="institute-student-detail-score">
            <div className="institute-student-detail-score-heading">
              <span>Attendance</span>
              <strong>{attendanceValue}%</strong>
            </div>
            <div className="institute-student-detail-score-track">
              <span style={{ width: `${Math.min(100, Math.max(0, attendanceValue))}%` }} />
            </div>
            <small>
              {attendanceValue >= 75
                ? "Meeting the attendance threshold"
                : "Below the recommended 75% threshold"}
            </small>
          </div>

          <div className="institute-student-detail-score">
            <div className="institute-student-detail-score-heading">
              <span>Academic performance</span>
              <strong>{performanceValue}%</strong>
            </div>
            <div className="institute-student-detail-score-track performance">
              <span style={{ width: `${Math.min(100, Math.max(0, performanceValue))}%` }} />
            </div>
            <small>Based on the available demo performance data</small>
          </div>
        </SectionCard>

        <div className="institute-student-detail-trust-card">
          <ShieldCheck size={20} />
          <div>
            <strong>Student record</strong>
            <span>Profile information managed by institute administration.</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAcademics = () => (
    <div className="institute-student-detail-main-column">
      <SectionCard
        title="Enrolled courses"
        subtitle="Course progress and performance overview."
      >
        <div className="institute-student-detail-course-list">
          {studentCourses.map((course) => (
            <div className="institute-student-detail-course" key={course.id || course.name}>
              <div className="institute-student-detail-course-top">
                <div className="institute-student-detail-course-icon">
                  <BookOpen size={17} />
                </div>
                <div className="institute-student-detail-course-copy">
                  <strong>{course.name}</strong>
                  <span>{course.progress ?? 0}% course completion</span>
                </div>
                <span className="institute-student-detail-course-score">
                  {course.score ?? "—"}%
                </span>
              </div>
              <div className="institute-student-detail-score-track">
                <span style={{ width: `${Math.min(100, Math.max(0, Number(course.progress) || 0))}%` }} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Performance trend"
        subtitle="Monthly academic performance."
      >
        <ChartCard
          title="Performance trend"
          subtitle="Monthly score progression"
          type="line"
          data={DEMO_PERFORMANCE}
          xKey="name"
          series={[{ dataKey: "score", label: "Performance", color: "#65A5DA" }]}
          height={245}
          showHeader={false}
          showLegend={false}
          showFilter={false}
        />
      </SectionCard>
    </div>
  );

  const renderAttendance = () => (
    <SectionCard
      title="Attendance records"
      subtitle="Search and review the student's recorded attendance."
    >
      <div className="institute-student-detail-attendance-toolbar">
        <div className="institute-student-detail-search">
          <Search size={15} />
          <input
            value={attendanceSearch}
            onChange={(event) => setAttendanceSearch(event.target.value)}
            placeholder="Search subject or date..."
          />
        </div>
        <select
          value={attendanceFilter}
          onChange={(event) => setAttendanceFilter(event.target.value)}
          aria-label="Filter attendance status"
        >
          <option>All</option>
          <option>Present</option>
          <option>Absent</option>
          <option>Late</option>
        </select>
      </div>

      <div className="institute-student-detail-table-wrap">
        <table className="institute-student-detail-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Subject</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.map((record, index) => (
              <tr key={`${record.date}-${record.subject}-${index}`}>
                <td>{record.date}</td>
                <td>{record.subject}</td>
                <td>
                  <span className={`institute-student-detail-attendance-status ${record.status.toLowerCase()}`}>
                    {record.status === "Present" ? (
                      <CheckCircle2 size={13} />
                    ) : record.status === "Absent" ? (
                      <XCircle size={13} />
                    ) : (
                      <AlertCircle size={13} />
                    )}
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredAttendance.length === 0 && (
              <tr>
                <td colSpan="3" className="institute-student-detail-empty">
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );

  const renderActivity = () => (
    <SectionCard
      title="Student activity timeline"
      subtitle="Recent academic and learning events."
    >
      <ActivityList activities={studentActivities} />
    </SectionCard>
  );

  return (
    <div className="institute-student-detail-page">
      <button
        type="button"
        className="institute-student-detail-back"
        onClick={onBack}
      >
        <ArrowLeft size={15} />
        Back to students
      </button>

      <section className="institute-student-detail-hero">
        <div className="institute-student-detail-hero-main">
          <div className="institute-student-detail-hero-avatar">
            {photo ? (
              <img src={photo} alt={`${name}'s profile`} />
            ) : (
              <span>{getInitials(name)}</span>
            )}
          </div>

          <div className="institute-student-detail-hero-copy">
            <div className="institute-student-detail-name-row">
              <h1>{name}</h1>
              <StatusBadge status={status} />
            </div>
            <p>{enrollmentId}</p>
            <div className="institute-student-detail-hero-meta">
              <span><Mail size={13} />{email}</span>
              <span><GraduationCap size={14} />{courseName}</span>
              <span><Users size={13} />{batchName}</span>
            </div>
          </div>
        </div>

        <div className="institute-student-detail-hero-actions">
          <button
            type="button"
            className="institute-student-detail-edit-btn"
            onClick={() => onEdit?.(student)}
          >
            <Pencil size={14} />
            Edit student
          </button>
          <button
            type="button"
            className="institute-student-detail-export-btn"
            onClick={() => window.print()}
            title="Print student profile"
          >
            <Download size={14} />
            Print
          </button>
        </div>
      </section>

      <div className="institute-student-detail-metrics">
        <DetailMetric
          icon={ClipboardCheck}
          label="Attendance"
          value={`${attendanceValue}%`}
          caption="Attendance rate"
          tone="blue"
        />
        <DetailMetric
          icon={TrendingUp}
          label="Performance"
          value={`${performanceValue}%`}
          caption="Academic score"
          tone="purple"
        />
        <DetailMetric
          icon={BookOpen}
          label="Enrolled courses"
          value={studentCourses.length}
          caption="Current courses"
          tone="orange"
        />
        <DetailMetric
          icon={Award}
          label="Academic status"
          value={performanceValue >= 75 ? "Good" : "Needs support"}
          caption="Based on demo score"
          tone="green"
        />
      </div>

      <div className="institute-student-detail-tabs">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            type="button"
            key={id}
            className={activeTab === id ? "active" : ""}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && renderOverview()}
      {activeTab === "academics" && renderAcademics()}
      {activeTab === "attendance" && renderAttendance()}
      {activeTab === "activity" && renderActivity()}
    </div>
  );
}

function ActivityList({ activities = [] }) {
  const iconMap = {
    learning: BookOpen,
    assignment: FileText,
    attendance: ClipboardCheck,
    achievement: Award,
  };

  return (
    <div className="institute-student-detail-activity-list">
      {activities.map((activity) => {
        const Icon = iconMap[activity.type] || Activity;

        return (
          <div className="institute-student-detail-activity-item" key={activity.id}>
            <div className={`institute-student-detail-activity-icon ${activity.type}`}>
              <Icon size={15} />
            </div>
            <div className="institute-student-detail-activity-copy">
              <strong>{activity.title}</strong>
              <span>{activity.description}</span>
              <small><Clock3 size={11} />{activity.date}</small>
            </div>
          </div>
        );
      })}
      {activities.length === 0 && (
        <p className="institute-student-detail-empty">No activity recorded yet.</p>
      )}
    </div>
  );
}

function Building2Fallback({ size = 15 }) {
  return <GraduationCap size={size} />;
}
