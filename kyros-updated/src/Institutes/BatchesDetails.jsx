
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Users,
  BookOpen,
  UserRound,
  CalendarDays,
  Clock3,
  MapPin,
  Search,
  Download,
  Pencil,
  MoreHorizontal,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  AlertCircle,
  GraduationCap,
  TrendingUp,
  ClipboardList,
  X,
} from "lucide-react";

const DEMO_BATCH = {
  id: "batch-001",
  name: "B.Tech CSE - A",
  code: "CSE-A-2026",
  courseName: "Computer Science Engineering",
  facultyName: "Rahul Sharma",
  academicYear: "2026-27",
  startDate: "2026-08-01",
  endDate: "2027-05-31",
  studentCount: 42,
  capacity: 60,
  status: "Active",
  description:
    "First-year Computer Science Engineering batch focused on programming fundamentals, mathematics, problem solving and core engineering concepts.",
  semester: "Semester 1",
  section: "A",
  room: "Block A · Room 204",
  schedule: "Monday – Friday",
  timing: "09:00 AM – 03:00 PM",
};

const DEMO_STUDENTS = [
  {
    id: 1,
    name: "Aarav Sharma",
    enrollmentId: "KY26CSE001",
    email: "aarav@example.com",
    phone: "+91 98765 43210",
    attendance: 94,
    performance: 88,
    status: "Active",
  },
  {
    id: 2,
    name: "Ananya Verma",
    enrollmentId: "KY26CSE002",
    email: "ananya@example.com",
    phone: "+91 98765 43211",
    attendance: 89,
    performance: 92,
    status: "Active",
  },
  {
    id: 3,
    name: "Rohan Mehta",
    enrollmentId: "KY26CSE003",
    email: "rohan@example.com",
    phone: "+91 98765 43212",
    attendance: 76,
    performance: 71,
    status: "Active",
  },
  {
    id: 4,
    name: "Diya Gupta",
    enrollmentId: "KY26CSE004",
    email: "diya@example.com",
    phone: "+91 98765 43213",
    attendance: 96,
    performance: 95,
    status: "Active",
  },
  {
    id: 5,
    name: "Kabir Singh",
    enrollmentId: "KY26CSE005",
    email: "kabir@example.com",
    phone: "+91 98765 43214",
    attendance: 68,
    performance: 64,
    status: "At Risk",
  },
  {
    id: 6,
    name: "Meera Joshi",
    enrollmentId: "KY26CSE006",
    email: "meera@example.com",
    phone: "+91 98765 43215",
    attendance: 91,
    performance: 86,
    status: "Active",
  },
  {
    id: 7,
    name: "Ishaan Patel",
    enrollmentId: "KY26CSE007",
    email: "ishaan@example.com",
    phone: "+91 98765 43216",
    attendance: 82,
    performance: 78,
    status: "Active",
  },
  {
    id: 8,
    name: "Sara Khan",
    enrollmentId: "KY26CSE008",
    email: "sara@example.com",
    phone: "+91 98765 43217",
    attendance: 59,
    performance: 61,
    status: "At Risk",
  },
];

const formatDate = (value) => {
  if (!value) return "Not specified";

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function MetricCard({ icon: Icon, label, value, helper, tone }) {
  return (
    <div className="institute-batch-detail-metric">
      <div className={`institute-batch-detail-metric-icon ${tone}`}>
        <Icon size={20} />
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{helper}</small>
      </div>
    </div>
  );
}

function ProgressBar({ value, tone = "blue" }) {
  return (
    <div className="institute-batch-detail-progress">
      <div className={`institute-batch-detail-progress-fill ${tone}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export default function BatchDetails({
  batch = DEMO_BATCH,
  students = DEMO_STUDENTS,
  onBack,
  onEdit,
  onStudentClick,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [studentFilter, setStudentFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const safeBatch = batch || DEMO_BATCH;
  const safeStudents = Array.isArray(students) ? students : DEMO_STUDENTS;

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return safeStudents.filter((student) => {
      const matchesSearch =
        !query ||
        student.name?.toLowerCase().includes(query) ||
        student.enrollmentId?.toLowerCase().includes(query) ||
        student.email?.toLowerCase().includes(query);

      const matchesStatus =
        studentFilter === "All" || student.status === studentFilter;

      return matchesSearch && matchesStatus;
    });
  }, [safeStudents, search, studentFilter]);

  const averageAttendance = safeStudents.length
    ? Math.round(
        safeStudents.reduce(
          (total, student) => total + Number(student.attendance || 0),
          0
        ) / safeStudents.length
      )
    : 0;

  const averagePerformance = safeStudents.length
    ? Math.round(
        safeStudents.reduce(
          (total, student) => total + Number(student.performance || 0),
          0
        ) / safeStudents.length
      )
    : 0;

  const atRiskStudents = safeStudents.filter(
    (student) => student.status === "At Risk"
  ).length;

  const occupancy = safeBatch.capacity
    ? Math.round((safeBatch.studentCount / safeBatch.capacity) * 100)
    : 0;

  const exportStudents = () => {
    const headers = [
      "Name",
      "Enrollment ID",
      "Email",
      "Phone",
      "Attendance",
      "Performance",
      "Status",
    ];

    const rows = filteredStudents.map((student) => [
      student.name,
      student.enrollmentId,
      student.email,
      student.phone,
      `${student.attendance}%`,
      `${student.performance}%`,
      student.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${safeBatch.code || "batch"}-students.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="institute-batch-detail-page">
      <button className="institute-batch-detail-back" onClick={onBack}>
        <ArrowLeft size={17} />
        Back to batches
      </button>

      <section className="institute-batch-detail-hero">
        <div className="institute-batch-detail-hero-main">
          <div className="institute-batch-detail-icon">
            <GraduationCap size={27} />
          </div>

          <div className="institute-batch-detail-title">
            <div className="institute-batch-detail-eyebrow">
              Batch management <span>/</span> {safeBatch.code}
            </div>
            <h1>{safeBatch.name}</h1>
            <p>{safeBatch.description || "Academic batch information and student progress."}</p>

            <div className="institute-batch-detail-tags">
              <span className={`institute-batch-detail-status ${safeBatch.status?.toLowerCase()}`}>
                <span />
                {safeBatch.status}
              </span>
              <span>{safeBatch.academicYear}</span>
              <span>{safeBatch.courseName}</span>
            </div>
          </div>
        </div>

        <div className="institute-batch-detail-hero-actions">
          <button
            className="institute-batch-detail-edit"
            onClick={() => onEdit?.(safeBatch)}
          >
            <Pencil size={16} />
            Edit batch
          </button>
        </div>
      </section>

      <section className="institute-batch-detail-metrics">
        <MetricCard
          icon={Users}
          label="Enrolled students"
          value={safeBatch.studentCount ?? safeStudents.length}
          helper={`${safeBatch.capacity ?? 0} total capacity`}
          tone="blue"
        />
        <MetricCard
          icon={ClipboardList}
          label="Average attendance"
          value={`${averageAttendance}%`}
          helper="Across listed students"
          tone="green"
        />
        <MetricCard
          icon={TrendingUp}
          label="Average performance"
          value={`${averagePerformance}%`}
          helper="Based on demo records"
          tone="purple"
        />
        <MetricCard
          icon={AlertCircle}
          label="Students at risk"
          value={atRiskStudents}
          helper="Need additional attention"
          tone="orange"
        />
      </section>

      <section className="institute-batch-detail-content">
        <div className="institute-batch-detail-tabs">
          <button
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            <BookOpen size={16} />
            Overview
          </button>
          <button
            className={activeTab === "students" ? "active" : ""}
            onClick={() => setActiveTab("students")}
          >
            <Users size={16} />
            Students <span>{safeStudents.length}</span>
          </button>
        </div>

        {activeTab === "overview" && (
          <div className="institute-batch-detail-overview">
            <div className="institute-batch-detail-main-column">
              <div className="institute-batch-detail-panel">
                <div className="institute-batch-detail-panel-heading">
                  <div>
                    <h2>Batch information</h2>
                    <p>Academic and administrative details</p>
                  </div>
                  <BookOpen size={19} />
                </div>

                <div className="institute-batch-detail-info-grid">
                  <div>
                    <span>Batch name</span>
                    <strong>{safeBatch.name}</strong>
                  </div>
                  <div>
                    <span>Batch code</span>
                    <strong>{safeBatch.code || "—"}</strong>
                  </div>
                  <div>
                    <span>Course</span>
                    <strong>{safeBatch.courseName || "Not assigned"}</strong>
                  </div>
                  <div>
                    <span>Academic year</span>
                    <strong>{safeBatch.academicYear || "—"}</strong>
                  </div>
                  <div>
                    <span>Start date</span>
                    <strong>{formatDate(safeBatch.startDate)}</strong>
                  </div>
                  <div>
                    <span>End date</span>
                    <strong>{formatDate(safeBatch.endDate)}</strong>
                  </div>
                  <div>
                    <span>Semester</span>
                    <strong>{safeBatch.semester || "Not specified"}</strong>
                  </div>
                  <div>
                    <span>Section</span>
                    <strong>{safeBatch.section || "Not specified"}</strong>
                  </div>
                </div>
              </div>

              <div className="institute-batch-detail-panel">
                <div className="institute-batch-detail-panel-heading">
                  <div>
                    <h2>Student capacity</h2>
                    <p>Current batch enrolment</p>
                  </div>
                  <Users size={19} />
                </div>

                <div className="institute-batch-detail-capacity">
                  <div>
                    <strong>{safeBatch.studentCount ?? safeStudents.length}</strong>
                    <span>of {safeBatch.capacity ?? 0} seats filled</span>
                  </div>
                  <strong>{occupancy}%</strong>
                </div>

                <ProgressBar value={occupancy} />

                <div className="institute-batch-detail-capacity-footer">
                  <span>
                    <i className="filled" />
                    Enrolled: {safeBatch.studentCount ?? safeStudents.length}
                  </span>
                  <span>
                    <i />
                    Available: {Math.max(0, (safeBatch.capacity || 0) - (safeBatch.studentCount ?? safeStudents.length))}
                  </span>
                </div>
              </div>
            </div>

            <div className="institute-batch-detail-side-column">
              <div className="institute-batch-detail-panel">
                <div className="institute-batch-detail-panel-heading">
                  <div>
                    <h2>Assigned faculty</h2>
                    <p>Batch coordinator</p>
                  </div>
                  <UserRound size={19} />
                </div>

                <div className="institute-batch-detail-faculty">
                  <div className="institute-batch-detail-faculty-avatar">
                    {safeBatch.facultyName
                      ?.split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase() || "FC"}
                  </div>
                  <div>
                    <strong>{safeBatch.facultyName || "Faculty not assigned"}</strong>
                    <span>Assigned faculty</span>
                  </div>
                </div>
              </div>

              <div className="institute-batch-detail-panel">
                <div className="institute-batch-detail-panel-heading">
                  <div>
                    <h2>Schedule & venue</h2>
                    <p>Batch timetable information</p>
                  </div>
                  <CalendarDays size={19} />
                </div>

                <div className="institute-batch-detail-schedule-item">
                  <CalendarDays size={17} />
                  <div>
                    <span>Class days</span>
                    <strong>{safeBatch.schedule || "Not specified"}</strong>
                  </div>
                </div>
                <div className="institute-batch-detail-schedule-item">
                  <Clock3 size={17} />
                  <div>
                    <span>Class timing</span>
                    <strong>{safeBatch.timing || "Not specified"}</strong>
                  </div>
                </div>
                <div className="institute-batch-detail-schedule-item">
                  <MapPin size={17} />
                  <div>
                    <span>Classroom</span>
                    <strong>{safeBatch.room || "Not specified"}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "students" && (
          <div className="institute-batch-detail-students">
            <div className="institute-batch-detail-students-toolbar">
              <div>
                <h2>Enrolled students</h2>
                <p>Manage and review students in this batch</p>
              </div>
              <button onClick={exportStudents}>
                <Download size={16} />
                Export CSV
              </button>
            </div>

            <div className="institute-batch-detail-student-filters">
              <div className="institute-batch-detail-student-search">
                <Search size={17} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search students by name or ID..."
                />
                {search && (
                  <button onClick={() => setSearch("")} aria-label="Clear search">
                    <X size={15} />
                  </button>
                )}
              </div>

              <select
                value={studentFilter}
                onChange={(event) => setStudentFilter(event.target.value)}
              >
                <option value="All">All students</option>
                <option value="Active">Active</option>
                <option value="At Risk">At Risk</option>
              </select>
            </div>

            <div className="institute-batch-detail-table-wrap">
              <table className="institute-batch-detail-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Enrollment ID</th>
                    <th>Attendance</th>
                    <th>Performance</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="institute-batch-detail-student-name">
                          <div>
                            {student.name
                              ?.split(" ")
                              .map((part) => part[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </div>
                          <span>
                            <strong>{student.name}</strong>
                            <small>{student.email}</small>
                          </span>
                        </div>
                      </td>
                      <td>{student.enrollmentId}</td>
                      <td>
                        <div className="institute-batch-detail-student-score">
                          <strong>{student.attendance}%</strong>
                          <ProgressBar
                            value={student.attendance}
                            tone={student.attendance < 75 ? "orange" : "green"}
                          />
                        </div>
                      </td>
                      <td>
                        <strong className="institute-batch-detail-performance">
                          {student.performance}%
                        </strong>
                      </td>
                      <td>
                        <span className={`institute-batch-detail-student-status ${student.status === "At Risk" ? "risk" : "active"}`}>
                          {student.status === "At Risk" ? (
                            <AlertCircle size={13} />
                          ) : (
                            <CheckCircle2 size={13} />
                          )}
                          {student.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="institute-batch-detail-view-student"
                          aria-label={`View ${student.name}`}
                          onClick={() => {
                            setSelectedStudent(student);
                            onStudentClick?.(student);
                          }}
                        >
                          <MoreHorizontal size={19} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredStudents.length === 0 && (
                <div className="institute-batch-detail-no-students">
                  <Users size={25} />
                  <strong>No students found</strong>
                  <span>Try another search or status filter.</span>
                </div>
              )}
            </div>
            <div className="institute-batch-detail-table-footer">
              Showing {filteredStudents.length} of {safeStudents.length} students
            </div>
          </div>
        )}
      </section>

      {selectedStudent && (
        <div
          className="institute-batch-student-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedStudent(null);
          }}
        >
          <div className="institute-batch-student-modal">
            <button
              className="institute-batch-student-modal-close"
              onClick={() => setSelectedStudent(null)}
              aria-label="Close student details"
            >
              <X size={19} />
            </button>
            <div className="institute-batch-student-avatar">
              {selectedStudent.name
                ?.split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
            <h2>{selectedStudent.name}</h2>
            <p>{selectedStudent.enrollmentId}</p>
            <div className="institute-batch-student-contact">
              <span><Mail size={15} /> {selectedStudent.email}</span>
              <span><Phone size={15} /> {selectedStudent.phone}</span>
            </div>
            <div className="institute-batch-student-modal-metrics">
              <div>
                <span>Attendance</span>
                <strong>{selectedStudent.attendance}%</strong>
              </div>
              <div>
                <span>Performance</span>
                <strong>{selectedStudent.performance}%</strong>
              </div>
            </div>
            <span className={`institute-batch-detail-student-status ${selectedStudent.status === "At Risk" ? "risk" : "active"}`}>
              {selectedStudent.status}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
