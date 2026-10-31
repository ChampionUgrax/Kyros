
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Clock3,
  GraduationCap,
  Users,
  Layers3,
  TrendingUp,
  UserRound,
  Mail,
  Phone,
  MapPin,
  Search,
  Download,
  MoreHorizontal,
  Pencil,
  CheckCircle2,
  CircleAlert,
  PlayCircle,
  FileText,
  X,
} from "lucide-react";

const DEMO_BATCHES = [
  {
    id: "batch-001",
    name: "B.Tech CSE - A",
    code: "CSE-A-2026",
    facultyName: "Rahul Sharma",
    studentCount: 48,
    capacity: 60,
    academicYear: "2026-27",
    status: "Active",
    schedule: "Mon - Fri, 9:00 AM",
  },
  {
    id: "batch-002",
    name: "B.Tech CSE - B",
    code: "CSE-B-2026",
    facultyName: "Rahul Sharma",
    studentCount: 45,
    capacity: 60,
    academicYear: "2026-27",
    status: "Active",
    schedule: "Mon - Fri, 11:00 AM",
  },
  {
    id: "batch-003",
    name: "B.Tech CSE - C",
    code: "CSE-C-2026",
    facultyName: "Amit Kumar",
    studentCount: 42,
    capacity: 55,
    academicYear: "2026-27",
    status: "Upcoming",
    schedule: "Mon - Fri, 2:00 PM",
  },
  {
    id: "batch-004",
    name: "B.Tech CSE - D",
    code: "CSE-D-2025",
    facultyName: "Rahul Sharma",
    studentCount: 45,
    capacity: 55,
    academicYear: "2025-26",
    status: "Completed",
    schedule: "Mon - Fri, 10:00 AM",
  },
];

const DEMO_STUDENTS = [
  {
    id: "STU-1001",
    name: "Aarav Mehta",
    email: "aarav.mehta@example.com",
    batch: "B.Tech CSE - A",
    semester: "Semester 1",
    attendance: 92,
    performance: 86,
    status: "Active",
  },
  {
    id: "STU-1002",
    name: "Ananya Sharma",
    email: "ananya.sharma@example.com",
    batch: "B.Tech CSE - A",
    semester: "Semester 1",
    attendance: 88,
    performance: 91,
    status: "Active",
  },
  {
    id: "STU-1003",
    name: "Rohan Gupta",
    email: "rohan.gupta@example.com",
    batch: "B.Tech CSE - B",
    semester: "Semester 1",
    attendance: 74,
    performance: 68,
    status: "At Risk",
  },
  {
    id: "STU-1004",
    name: "Priya Singh",
    email: "priya.singh@example.com",
    batch: "B.Tech CSE - B",
    semester: "Semester 1",
    attendance: 95,
    performance: 94,
    status: "Active",
  },
  {
    id: "STU-1005",
    name: "Kabir Joshi",
    email: "kabir.joshi@example.com",
    batch: "B.Tech CSE - C",
    semester: "Semester 1",
    attendance: 61,
    performance: 56,
    status: "At Risk",
  },
  {
    id: "STU-1006",
    name: "Isha Kapoor",
    email: "isha.kapoor@example.com",
    batch: "B.Tech CSE - A",
    semester: "Semester 1",
    attendance: 89,
    performance: 82,
    status: "Active",
  },
];

const DEMO_MODULES = [
  {
    id: 1,
    name: "Programming Fundamentals",
    description: "Introduction to programming concepts and problem solving.",
    lessons: 12,
    progress: 100,
    status: "Completed",
  },
  {
    id: 2,
    name: "Data Structures",
    description: "Arrays, linked lists, stacks, queues and trees.",
    lessons: 15,
    progress: 82,
    status: "In Progress",
  },
  {
    id: 3,
    name: "Database Management",
    description: "Relational databases, SQL and database design.",
    lessons: 10,
    progress: 64,
    status: "In Progress",
  },
  {
    id: 4,
    name: "Operating Systems",
    description: "Processes, memory management and scheduling.",
    lessons: 11,
    progress: 30,
    status: "In Progress",
  },
  {
    id: 5,
    name: "Computer Networks",
    description: "Networking fundamentals and communication protocols.",
    lessons: 9,
    progress: 0,
    status: "Not Started",
  },
];

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function MetricCard({ icon: Icon, label, value, note, color }) {
  return (
    <div className="institute-course-detail-metric">
      <span className={`institute-course-detail-metric-icon ${color}`}>
        <Icon size={19} />
      </span>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {note && <small>{note}</small>}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`institute-course-detail-status ${status
        .toLowerCase()
        .replace(/\s+/g, "-")}`}
    >
      {status}
    </span>
  );
}

export default function CourseDetails({
  course,
  onBack,
  onEdit,
  batches,
  students,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [studentSearch, setStudentSearch] = useState("");
  const [studentBatchFilter, setStudentBatchFilter] = useState("All");
  const [studentStatusFilter, setStudentStatusFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);

  if (!course) {
    return (
      <div className="institute-course-detail-missing">
        <BookOpen size={32} />
        <h2>Course not found</h2>
        <p>Select a course from the course catalogue to view its details.</p>
        <button type="button" onClick={onBack}>
          <ArrowLeft size={15} /> Back to courses
        </button>
      </div>
    );
  }

  const courseBatches = batches || DEMO_BATCHES;
  const courseStudents = students || DEMO_STUDENTS;

  const filteredStudents = useMemo(() => {
    const query = studentSearch.trim().toLowerCase();

    return courseStudents.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(query) ||
        student.id.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query);

      const matchesBatch =
        studentBatchFilter === "All" ||
        student.batch === studentBatchFilter;

      const matchesStatus =
        studentStatusFilter === "All" ||
        student.status === studentStatusFilter;

      return matchesSearch && matchesBatch && matchesStatus;
    });
  }, [courseStudents, studentSearch, studentBatchFilter, studentStatusFilter]);

  const averageAttendance = courseStudents.length
    ? Math.round(
        courseStudents.reduce(
          (total, student) => total + student.attendance,
          0
        ) / courseStudents.length
      )
    : 0;

  const averagePerformance = courseStudents.length
    ? Math.round(
        courseStudents.reduce(
          (total, student) => total + student.performance,
          0
        ) / courseStudents.length
      )
    : 0;

  const activeBatches = courseBatches.filter(
    (batch) => batch.status === "Active"
  ).length;

  const completedModules = DEMO_MODULES.filter(
    (module) => module.status === "Completed"
  ).length;

  const tabs = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "batches", label: "Batches", icon: Layers3 },
    { id: "students", label: "Students", icon: Users },
    { id: "curriculum", label: "Curriculum", icon: GraduationCap },
  ];

  return (
    <div className="institute-course-detail-page">
      <button
        type="button"
        className="institute-course-detail-back"
        onClick={onBack}
      >
        <ArrowLeft size={16} />
        Back to courses
      </button>

      <section className="institute-course-detail-hero">
        <div className="institute-course-detail-hero-main">
          <div className="institute-course-detail-icon">
            <BookOpen size={27} />
          </div>

          <div className="institute-course-detail-heading">
            <div className="institute-course-detail-code">{course.code}</div>
            <h1>{course.name}</h1>
            <p>
              {course.description ||
                "Manage course information, batches, faculty, and student progress."}
            </p>

            <div className="institute-course-detail-tags">
              <span>{course.category || "General"}</span>
              <span>{course.level || "Undergraduate"}</span>
              <StatusBadge status={course.status || "Active"} />
            </div>
          </div>
        </div>

        <div className="institute-course-detail-hero-actions">
          <button
            type="button"
            className="institute-course-detail-edit"
            onClick={() => onEdit?.(course)}
          >
            <Pencil size={15} />
            Edit course
          </button>
          <button
            type="button"
            className="institute-course-detail-more"
            onClick={() => window.alert("Additional course actions can be added later.")}
            aria-label="More course actions"
          >
            <MoreHorizontal size={19} />
          </button>
        </div>
      </section>

      <div className="institute-course-detail-metrics">
        <MetricCard
          icon={Users}
          label="Enrolled students"
          value={course.studentCount ?? courseStudents.length}
          note="Across all batches"
          color="blue"
        />
        <MetricCard
          icon={Layers3}
          label="Total batches"
          value={course.batchCount ?? courseBatches.length}
          note={`${activeBatches} currently active`}
          color="violet"
        />
        <MetricCard
          icon={TrendingUp}
          label="Course completion"
          value={`${course.completionRate ?? 0}%`}
          note="Overall course progress"
          color="green"
        />
        <MetricCard
          icon={GraduationCap}
          label="Average performance"
          value={`${averagePerformance}%`}
          note="Based on demo student records"
          color="orange"
        />
      </div>

      <section className="institute-course-detail-content">
        <div className="institute-course-detail-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                className={activeTab === tab.id ? "active" : ""}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={16} />
                {tab.label}
                {tab.id === "batches" && (
                  <span>{courseBatches.length}</span>
                )}
                {tab.id === "students" && (
                  <span>{courseStudents.length}</span>
                )}
              </button>
            );
          })}
        </div>

        {activeTab === "overview" && (
          <div className="institute-course-detail-overview">
            <div className="institute-course-detail-main-column">
              <section className="institute-course-detail-panel">
                <div className="institute-course-detail-panel-heading">
                  <div>
                    <h2>Course overview</h2>
                    <p>Key information about this academic program.</p>
                  </div>
                  <BookOpen size={19} />
                </div>

                <div className="institute-course-info-grid">
                  <div>
                    <span>Course name</span>
                    <strong>{course.name}</strong>
                  </div>
                  <div>
                    <span>Course code</span>
                    <strong>{course.code}</strong>
                  </div>
                  <div>
                    <span>Category</span>
                    <strong>{course.category || "Not specified"}</strong>
                  </div>
                  <div>
                    <span>Academic level</span>
                    <strong>{course.level || "Not specified"}</strong>
                  </div>
                  <div>
                    <span>Duration</span>
                    <strong>{course.duration || "Not specified"}</strong>
                  </div>
                  <div>
                    <span>Total modules</span>
                    <strong>{course.modules ?? DEMO_MODULES.length}</strong>
                  </div>
                </div>

                <div className="institute-course-detail-description">
                  <span>Course description</span>
                  <p>
                    {course.description ||
                      "No course description has been added yet."}
                  </p>
                </div>
              </section>

              <section className="institute-course-detail-panel">
                <div className="institute-course-detail-panel-heading">
                  <div>
                    <h2>Curriculum progress</h2>
                    <p>Progress across the course modules.</p>
                  </div>
                  <GraduationCap size={19} />
                </div>

                <div className="institute-course-curriculum-summary">
                  <div>
                    <strong>{completedModules}</strong>
                    <span>Completed modules</span>
                  </div>
                  <div>
                    <strong>{DEMO_MODULES.length}</strong>
                    <span>Total demo modules</span>
                  </div>
                  <div>
                    <strong>{course.completionRate ?? 0}%</strong>
                    <span>Course completion</span>
                  </div>
                </div>

                <div className="institute-course-detail-progress-track">
                  <div
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, Number(course.completionRate) || 0)
                      )}%`,
                    }}
                  />
                </div>

                <button
                  type="button"
                  className="institute-course-text-link"
                  onClick={() => setActiveTab("curriculum")}
                >
                  View complete curriculum
                  <ArrowLeft size={14} />
                </button>
              </section>
            </div>

            <div className="institute-course-detail-side-column">
              <section className="institute-course-detail-panel">
                <div className="institute-course-detail-panel-heading">
                  <div>
                    <h2>Assigned faculty</h2>
                    <p>Primary course instructor.</p>
                  </div>
                  <UserRound size={19} />
                </div>

                <div className="institute-course-faculty-profile">
                  <span className="institute-course-faculty-large-avatar">
                    {getInitials(course.facultyName || "Not Assigned")}
                  </span>
                  <div>
                    <strong>{course.facultyName || "Not assigned"}</strong>
                    <span>Course faculty</span>
                  </div>
                </div>

                <div className="institute-course-faculty-details">
                  <div>
                    <Mail size={15} />
                    <span>
                      {course.facultyEmail || "Email not available"}
                    </span>
                  </div>
                  <div>
                    <Phone size={15} />
                    <span>
                      {course.facultyPhone || "Phone not available"}
                    </span>
                  </div>
                </div>
              </section>

              <section className="institute-course-detail-panel">
                <div className="institute-course-detail-panel-heading">
                  <div>
                    <h2>Attendance overview</h2>
                    <p>Average student attendance.</p>
                  </div>
                  <CalendarDays size={19} />
                </div>

                <div className="institute-course-attendance-value">
                  <strong>{averageAttendance}%</strong>
                  <span>Average attendance</span>
                </div>

                <div className="institute-course-detail-progress-track attendance">
                  <div style={{ width: `${averageAttendance}%` }} />
                </div>

                <p className="institute-course-detail-small-note">
                  Calculated from the currently displayed demo student records.
                </p>
              </section>
            </div>
          </div>
        )}

        {activeTab === "batches" && (
          <div className="institute-course-detail-panel">
            <div className="institute-course-detail-panel-heading">
              <div>
                <h2>Course batches</h2>
                <p>All batches associated with this course.</p>
              </div>
              <span className="institute-course-detail-count">
                {courseBatches.length} batches
              </span>
            </div>

            <div className="institute-course-batches-grid">
              {courseBatches.map((batch) => {
                const occupancy = batch.capacity
                  ? Math.min(
                      100,
                      Math.round((batch.studentCount / batch.capacity) * 100)
                    )
                  : 0;

                return (
                  <article
                    className="institute-course-batch-card"
                    key={batch.id}
                  >
                    <div className="institute-course-batch-top">
                      <span><Layers3 size={18} /></span>
                      <StatusBadge status={batch.status} />
                    </div>

                    <h3>{batch.name}</h3>
                    <p>{batch.code}</p>

                    <div className="institute-course-batch-info">
                      <span>Faculty</span>
                      <strong>{batch.facultyName}</strong>
                    </div>

                    <div className="institute-course-batch-info">
                      <span>Academic year</span>
                      <strong>{batch.academicYear}</strong>
                    </div>

                    <div className="institute-course-batch-info">
                      <span>Schedule</span>
                      <strong>{batch.schedule}</strong>
                    </div>

                    <div className="institute-course-batch-capacity">
                      <div>
                        <span>Capacity</span>
                        <strong>
                          {batch.studentCount}/{batch.capacity}
                        </strong>
                      </div>
                      <div className="institute-course-detail-progress-track">
                        <div style={{ width: `${occupancy}%` }} />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "students" && (
          <div className="institute-course-detail-panel">
            <div className="institute-course-detail-panel-heading">
              <div>
                <h2>Enrolled students</h2>
                <p>Students registered under this course.</p>
              </div>
              <span className="institute-course-detail-count">
                {filteredStudents.length} students
              </span>
            </div>

            <div className="institute-course-student-toolbar">
              <div className="institute-course-student-search">
                <Search size={16} />
                <input
                  value={studentSearch}
                  onChange={(event) => setStudentSearch(event.target.value)}
                  placeholder="Search student name, ID or email..."
                />
              </div>

              <select
                value={studentBatchFilter}
                onChange={(event) =>
                  setStudentBatchFilter(event.target.value)
                }
              >
                <option value="All">All batches</option>
                {[...new Set(courseStudents.map((student) => student.batch))].map(
                  (batch) => (
                    <option key={batch} value={batch}>{batch}</option>
                  )
                )}
              </select>

              <select
                value={studentStatusFilter}
                onChange={(event) =>
                  setStudentStatusFilter(event.target.value)
                }
              >
                <option value="All">All statuses</option>
                <option value="Active">Active</option>
                <option value="At Risk">At Risk</option>
              </select>
            </div>

            <div className="institute-course-student-table-wrap">
              <table className="institute-course-student-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Enrollment ID</th>
                    <th>Batch</th>
                    <th>Attendance</th>
                    <th>Performance</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="institute-course-student-name">
                          <span>{getInitials(student.name)}</span>
                          <div>
                            <strong>{student.name}</strong>
                            <small>{student.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{student.id}</td>
                      <td>{student.batch}</td>
                      <td>
                        <span
                          className={
                            student.attendance < 75
                              ? "institute-course-low-score"
                              : ""
                          }
                        >
                          {student.attendance}%
                        </span>
                      </td>
                      <td>{student.performance}%</td>
                      <td><StatusBadge status={student.status} /></td>
                      <td>
                        <button
                          type="button"
                          className="institute-course-student-view"
                          onClick={() => setSelectedStudent(student)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {!filteredStudents.length && (
                <div className="institute-course-table-empty">
                  No students match your search or filters.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "curriculum" && (
          <div className="institute-course-detail-panel">
            <div className="institute-course-detail-panel-heading">
              <div>
                <h2>Course curriculum</h2>
                <p>Modules and their current learning progress.</p>
              </div>
              <span className="institute-course-detail-count">
                {DEMO_MODULES.length} modules
              </span>
            </div>

            <div className="institute-course-module-list">
              {DEMO_MODULES.map((module, index) => (
                <article className="institute-course-module" key={module.id}>
                  <span className="institute-course-module-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="institute-course-module-main">
                    <div className="institute-course-module-title">
                      <h3>{module.name}</h3>
                      <StatusBadge status={module.status} />
                    </div>
                    <p>{module.description}</p>

                    <div className="institute-course-module-progress">
                      <div className="institute-course-detail-progress-track">
                        <div style={{ width: `${module.progress}%` }} />
                      </div>
                      <span>{module.progress}%</span>
                    </div>
                  </div>

                  <span className="institute-course-module-lessons">
                    <FileText size={14} />
                    {module.lessons} lessons
                  </span>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      {selectedStudent && (
        <div
          className="institute-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedStudent(null);
            }
          }}
        >
          <div className="institute-modal institute-course-student-modal">
            <div className="institute-modal-header">
              <div>
                <span className="institute-modal-icon">
                  <UserRound size={19} />
                </span>
                <div>
                  <h2 className="institute-modal-heading">Student details</h2>
                  <p>Student information and course performance.</p>
                </div>
              </div>

              <button
                type="button"
                className="institute-modal-close"
                onClick={() => setSelectedStudent(null)}
              >
                <X size={19} />
              </button>
            </div>

            <div className="institute-modal-body">
              <div className="institute-course-student-profile">
                <span>{getInitials(selectedStudent.name)}</span>
                <div>
                  <strong>{selectedStudent.name}</strong>
                  <small>{selectedStudent.id}</small>
                </div>
                <StatusBadge status={selectedStudent.status} />
              </div>

              <div className="institute-course-student-detail-grid">
                <div>
                  <span>Email</span>
                  <strong>{selectedStudent.email}</strong>
                </div>
                <div>
                  <span>Batch</span>
                  <strong>{selectedStudent.batch}</strong>
                </div>
                <div>
                  <span>Semester</span>
                  <strong>{selectedStudent.semester}</strong>
                </div>
                <div>
                  <span>Attendance</span>
                  <strong>{selectedStudent.attendance}%</strong>
                </div>
                <div>
                  <span>Performance</span>
                  <strong>{selectedStudent.performance}%</strong>
                </div>
              </div>
            </div>

            <div className="institute-modal-footer">
              <button
                type="button"
                className="institute-btn-secondary"
                onClick={() => setSelectedStudent(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
