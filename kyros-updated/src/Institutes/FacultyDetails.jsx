
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  GraduationCap,
  BriefcaseBusiness,
  BookOpen,
  Users,
  Layers3,
  CalendarDays,
  MapPin,
  Pencil,
  Clock3,
  Search,
  X,
  ChevronRight,
  Building2,
  Award,
  Activity,
} from "lucide-react";

const DEMO_COURSES = [
  {
    id: "course-001",
    name: "Computer Science Engineering",
    code: "CSE-101",
    category: "Engineering",
    level: "Undergraduate",
    duration: "4 Years",
    modules: 12,
    studentCount: 180,
    completionRate: 68,
    status: "Active",
  },
  {
    id: "course-002",
    name: "Data Science and Analytics",
    code: "DSA-201",
    category: "Technology",
    level: "Undergraduate",
    duration: "3 Years",
    modules: 10,
    studentCount: 126,
    completionRate: 74,
    status: "Active",
  },
];

const DEMO_BATCHES = [
  {
    id: "batch-001",
    name: "B.Tech CSE - A",
    code: "CSE-A-2026",
    courseName: "Computer Science Engineering",
    facultyName: "Rahul Sharma",
    facultyId: "faculty-001",
    academicYear: "2026-27",
    studentCount: 42,
    capacity: 60,
    status: "Active",
    schedule: "Monday – Friday",
  },
  {
    id: "batch-002",
    name: "B.Tech CSE - B",
    code: "CSE-B-2026",
    courseName: "Computer Science Engineering",
    facultyName: "Rahul Sharma",
    facultyId: "faculty-001",
    academicYear: "2026-27",
    studentCount: 38,
    capacity: 60,
    status: "Active",
    schedule: "Monday – Friday",
  },
  {
    id: "batch-003",
    name: "Web Development - A",
    code: "WEB-A-2026",
    courseName: "Computer Science Engineering",
    facultyName: "Rahul Sharma",
    facultyId: "faculty-001",
    academicYear: "2026-27",
    studentCount: 32,
    capacity: 45,
    status: "Active",
    schedule: "Tuesday – Saturday",
  },
];

const DEMO_STUDENTS = [
  {
    id: "STU-001",
    name: "Aarav Mehta",
    email: "aarav@example.com",
    batchId: "batch-001",
    batchName: "B.Tech CSE - A",
    attendance: 92,
    performance: 88,
    status: "Active",
  },
  {
    id: "STU-002",
    name: "Ananya Sharma",
    email: "ananya@example.com",
    batchId: "batch-001",
    batchName: "B.Tech CSE - A",
    attendance: 85,
    performance: 91,
    status: "Active",
  },
  {
    id: "STU-003",
    name: "Rohan Verma",
    email: "rohan@example.com",
    batchId: "batch-002",
    batchName: "B.Tech CSE - B",
    attendance: 78,
    performance: 72,
    status: "Active",
  },
  {
    id: "STU-004",
    name: "Ishita Gupta",
    email: "ishita@example.com",
    batchId: "batch-003",
    batchName: "Web Development - A",
    attendance: 95,
    performance: 94,
    status: "Active",
  },
];

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StatCard({ icon: Icon, label, value, note }) {
  return (
    <div className="institute-faculty-detail-stat">
      <span className="institute-faculty-detail-stat-icon">
        <Icon size={17} />
      </span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        <span>{note}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status = "Active" }) {
  const normalized = status.toLowerCase().replace(/\s+/g, "-");

  return (
    <span className={`institute-faculty-detail-status ${normalized}`}>
      <span />
      {status}
    </span>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="institute-faculty-detail-empty">
      <Users size={25} />
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}

export default function FacultyDetails({
  faculty,
  onBack,
  onEdit,
  courses,
  batches,
  students,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [studentSearch, setStudentSearch] = useState("");
  const [studentBatchFilter, setStudentBatchFilter] = useState("All");
  const [studentStatusFilter, setStudentStatusFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const allCourses = courses || DEMO_COURSES;
  const allBatches = batches || DEMO_BATCHES;
  const allStudents = students || DEMO_STUDENTS;

  const assignedCourses = useMemo(() => {
    if (!faculty) return [];

    const courseIds = faculty.courseIds || [];
    const courseNames = faculty.courseNames || [];

    return allCourses.filter(
      (course) =>
        courseIds.includes(course.id) ||
        courseNames.includes(course.name) ||
        course.facultyId === faculty.id ||
        course.facultyName === faculty.name
    );
  }, [faculty, allCourses]);

  const assignedBatches = useMemo(() => {
    if (!faculty) return [];

    return allBatches.filter(
      (batch) =>
        batch.facultyId === faculty.id ||
        batch.facultyName === faculty.name ||
        (batch.facultyIds || []).includes(faculty.id)
    );
  }, [faculty, allBatches]);

  const assignedStudents = useMemo(() => {
    if (!faculty) return [];

    const batchIds = assignedBatches.map((batch) => batch.id);
    const batchNames = assignedBatches.map((batch) => batch.name);

    return allStudents.filter(
      (student) =>
        student.facultyId === faculty.id ||
        student.batchId && batchIds.includes(student.batchId) ||
        student.batch && batchNames.includes(student.batch) ||
        student.batchName && batchNames.includes(student.batchName)
    );
  }, [faculty, allStudents, assignedBatches]);

  const filteredStudents = useMemo(() => {
    const query = studentSearch.trim().toLowerCase();

    return assignedStudents.filter((student) => {
      const matchesSearch =
        (student.name || "").toLowerCase().includes(query) ||
        (student.id || "").toLowerCase().includes(query) ||
        (student.email || "").toLowerCase().includes(query);

      const studentBatch = student.batchName || student.batch || "";

      const matchesBatch =
        studentBatchFilter === "All" ||
        studentBatch === studentBatchFilter;

      const matchesStatus =
        studentStatusFilter === "All" ||
        student.status === studentStatusFilter;

      return matchesSearch && matchesBatch && matchesStatus;
    });
  }, [
    assignedStudents,
    studentSearch,
    studentBatchFilter,
    studentStatusFilter,
  ]);

  const batchOptions = [
    "All",
    ...new Set(
      assignedStudents.map(
        (student) => student.batchName || student.batch
      ).filter(Boolean)
    ),
  ];

  if (!faculty) {
    return (
      <div className="institute-faculty-detail-missing">
        <UserRound size={35} />
        <h2>Faculty member not found</h2>
        <p>Select a faculty member from the directory to view their details.</p>
        <button type="button" onClick={onBack}>
          <ArrowLeft size={15} />
          Back to faculty
        </button>
      </div>
    );
  }

  const totalStudents = assignedBatches.reduce(
    (total, batch) => total + (Number(batch.studentCount) || 0),
    0
  );

  const averageAttendance = assignedStudents.length
    ? Math.round(
        assignedStudents.reduce(
          (total, student) => total + (Number(student.attendance) || 0),
          0
        ) / assignedStudents.length
      )
    : 0;

  const averagePerformance = assignedStudents.length
    ? Math.round(
        assignedStudents.reduce(
          (total, student) => total + (Number(student.performance) || 0),
          0
        ) / assignedStudents.length
      )
    : 0;

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "batches", label: "Batches", icon: Layers3 },
    { id: "students", label: "Students", icon: Users },
  ];

  return (
    <div className="institute-faculty-detail-page">
      <button
        type="button"
        className="institute-faculty-detail-back"
        onClick={onBack}
      >
        <ArrowLeft size={15} />
        Back to faculty directory
      </button>

      <section className="institute-faculty-detail-hero">
        <div className="institute-faculty-detail-identity">
          <div className="institute-faculty-detail-avatar">
            {getInitials(faculty.name)}
          </div>

          <div className="institute-faculty-detail-heading">
            <div className="institute-faculty-detail-name-row">
              <h1>{faculty.name}</h1>
              <StatusBadge status={faculty.status} />
            </div>

            <p>
              {faculty.employeeId || "Employee ID not assigned"}
              <span>•</span>
              {faculty.department || "Department not assigned"}
            </p>

            <div className="institute-faculty-detail-tags">
              <span>
                <GraduationCap size={13} />
                {faculty.qualification || "Qualification not specified"}
              </span>
              <span>
                <BriefcaseBusiness size={13} />
                {faculty.experience ?? 0} years experience
              </span>
            </div>
          </div>
        </div>

        <div className="institute-faculty-detail-hero-actions">
          <button
            type="button"
            className="institute-faculty-detail-edit"
            onClick={() => onEdit?.(faculty)}
          >
            <Pencil size={14} />
            Edit profile
          </button>
        </div>
      </section>

      <section className="institute-faculty-detail-stats">
        <StatCard
          icon={BookOpen}
          label="Assigned Courses"
          value={assignedCourses.length || faculty.courseNames?.length || 0}
          note="Courses handled"
        />
        <StatCard
          icon={Layers3}
          label="Assigned Batches"
          value={assignedBatches.length || faculty.batchCount || 0}
          note="Active batch assignments"
        />
        <StatCard
          icon={Users}
          label="Students"
          value={totalStudents || faculty.studentCount || 0}
          note="Students under this faculty"
        />
        <StatCard
          icon={Award}
          label="Experience"
          value={`${faculty.experience ?? 0} yrs`}
          note="Teaching experience"
        />
      </section>

      <div className="institute-faculty-detail-content">
        <nav className="institute-faculty-detail-tabs">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={activeTab === id ? "active" : ""}
              onClick={() => setActiveTab(id)}
            >
              <Icon size={15} />
              {label}
              {id === "courses" && (
                <span>{assignedCourses.length}</span>
              )}
              {id === "batches" && (
                <span>{assignedBatches.length}</span>
              )}
              {id === "students" && (
                <span>{assignedStudents.length}</span>
              )}
            </button>
          ))}
        </nav>

        {activeTab === "overview" && (
          <div className="institute-faculty-detail-overview">
            <div className="institute-faculty-detail-main-column">
              <section className="institute-faculty-detail-panel">
                <div className="institute-faculty-detail-panel-heading">
                  <div>
                    <h2>Personal information</h2>
                    <p>Faculty member's contact and professional details.</p>
                  </div>
                  <UserRound size={18} />
                </div>

                <div className="institute-faculty-detail-info-grid">
                  <div>
                    <Mail size={15} />
                    <span>Email address</span>
                    <strong>{faculty.email || "Not provided"}</strong>
                  </div>
                  <div>
                    <Phone size={15} />
                    <span>Phone number</span>
                    <strong>{faculty.phone || "Not provided"}</strong>
                  </div>
                  <div>
                    <Building2 size={15} />
                    <span>Department</span>
                    <strong>{faculty.department || "Not assigned"}</strong>
                  </div>
                  <div>
                    <GraduationCap size={15} />
                    <span>Qualification</span>
                    <strong>{faculty.qualification || "Not specified"}</strong>
                  </div>
                  <div>
                    <Award size={15} />
                    <span>Specialization</span>
                    <strong>{faculty.specialization || "Not specified"}</strong>
                  </div>
                  <div>
                    <BriefcaseBusiness size={15} />
                    <span>Experience</span>
                    <strong>{faculty.experience ?? 0} years</strong>
                  </div>
                </div>
              </section>

              <section className="institute-faculty-detail-panel">
                <div className="institute-faculty-detail-panel-heading">
                  <div>
                    <h2>About faculty member</h2>
                    <p>Professional profile and introduction.</p>
                  </div>
                </div>
                <p className="institute-faculty-detail-bio">
                  {faculty.bio || "No profile description has been added yet."}
                </p>
              </section>

              <section className="institute-faculty-detail-panel">
                <div className="institute-faculty-detail-panel-heading">
                  <div>
                    <h2>Assigned courses</h2>
                    <p>Courses currently associated with this faculty member.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("courses")}
                  >
                    View all <ChevronRight size={14} />
                  </button>
                </div>

                {assignedCourses.length ? (
                  <div className="institute-faculty-detail-course-list">
                    {assignedCourses.slice(0, 3).map((course) => (
                      <div
                        className="institute-faculty-detail-course-row"
                        key={course.id}
                      >
                        <span className="institute-faculty-detail-course-icon">
                          <BookOpen size={17} />
                        </span>
                        <div>
                          <strong>{course.name}</strong>
                          <small>
                            {course.code || "Course"} · {course.level || "—"}
                          </small>
                        </div>
                        <StatusBadge status={course.status || "Active"} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No courses assigned"
                    description="Course assignments will appear here when they are connected."
                  />
                )}
              </section>
            </div>

            <div className="institute-faculty-detail-side-column">
              <section className="institute-faculty-detail-panel">
                <div className="institute-faculty-detail-panel-heading">
                  <div>
                    <h2>Teaching snapshot</h2>
                    <p>Summary of assigned student outcomes.</p>
                  </div>
                  <Activity size={17} />
                </div>

                <div className="institute-faculty-detail-progress-item">
                  <div>
                    <span>Average attendance</span>
                    <strong>{averageAttendance}%</strong>
                  </div>
                  <div className="institute-faculty-detail-progress-track">
                    <span style={{ width: `${averageAttendance}%` }} />
                  </div>
                </div>

                <div className="institute-faculty-detail-progress-item">
                  <div>
                    <span>Average performance</span>
                    <strong>{averagePerformance}%</strong>
                  </div>
                  <div className="institute-faculty-detail-progress-track performance">
                    <span style={{ width: `${averagePerformance}%` }} />
                  </div>
                </div>

                {!assignedStudents.length && (
                  <p className="institute-faculty-detail-muted">
                    Student outcome data will appear when student records are
                    connected to this faculty member's batches.
                  </p>
                )}
              </section>

              <section className="institute-faculty-detail-panel">
                <div className="institute-faculty-detail-panel-heading">
                  <div>
                    <h2>Batch assignments</h2>
                    <p>Teaching groups assigned to this faculty.</p>
                  </div>
                  <CalendarDays size={17} />
                </div>

                {assignedBatches.length ? (
                  <div className="institute-faculty-detail-batch-list">
                    {assignedBatches.slice(0, 4).map((batch) => (
                      <div
                        className="institute-faculty-detail-batch-row"
                        key={batch.id}
                      >
                        <div>
                          <strong>{batch.name}</strong>
                          <small>{batch.academicYear || "Academic year not set"}</small>
                        </div>
                        <span>
                          <Users size={12} />
                          {batch.studentCount ?? 0}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No batches assigned"
                    description="Assigned batches will be listed here."
                  />
                )}
              </section>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <section className="institute-faculty-detail-panel">
            <div className="institute-faculty-detail-panel-heading">
              <div>
                <h2>Assigned courses</h2>
                <p>All courses assigned to {faculty.name}.</p>
              </div>
              <span className="institute-faculty-detail-total">
                {assignedCourses.length} courses
              </span>
            </div>

            {assignedCourses.length ? (
              <div className="institute-faculty-detail-course-grid">
                {assignedCourses.map((course) => (
                  <article
                    className="institute-faculty-detail-course-card"
                    key={course.id}
                  >
                    <div className="institute-faculty-detail-course-card-icon">
                      <BookOpen size={19} />
                    </div>
                    <StatusBadge status={course.status || "Active"} />
                    <h3>{course.name}</h3>
                    <p>{course.code || "Course code not set"}</p>
                    <div className="institute-faculty-detail-course-meta">
                      <span>
                        <Layers3 size={13} />
                        {course.modules ?? 0} modules
                      </span>
                      <span>
                        <Users size={13} />
                        {course.studentCount ?? 0} students
                      </span>
                    </div>
                    <div className="institute-faculty-detail-course-progress">
                      <div>
                        <span>Completion</span>
                        <strong>{course.completionRate ?? 0}%</strong>
                      </div>
                      <div className="institute-faculty-detail-progress-track">
                        <span
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(0, Number(course.completionRate) || 0)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No courses assigned"
                description="This faculty member does not have any linked courses yet."
              />
            )}
          </section>
        )}

        {activeTab === "batches" && (
          <section className="institute-faculty-detail-panel">
            <div className="institute-faculty-detail-panel-heading">
              <div>
                <h2>Assigned batches</h2>
                <p>All batches currently assigned to {faculty.name}.</p>
              </div>
              <span className="institute-faculty-detail-total">
                {assignedBatches.length} batches
              </span>
            </div>

            {assignedBatches.length ? (
              <div className="institute-faculty-detail-batch-grid">
                {assignedBatches.map((batch) => {
                  const capacity = Number(batch.capacity) || 0;
                  const count = Number(batch.studentCount) || 0;
                  const occupancy = capacity
                    ? Math.min(100, Math.round((count / capacity) * 100))
                    : 0;

                  return (
                    <article
                      className="institute-faculty-detail-batch-card"
                      key={batch.id}
                    >
                      <div className="institute-faculty-detail-batch-card-top">
                        <span>
                          <Layers3 size={17} />
                        </span>
                        <StatusBadge status={batch.status || "Active"} />
                      </div>
                      <h3>{batch.name}</h3>
                      <p>{batch.code || "Batch code not set"}</p>
                      <div className="institute-faculty-detail-batch-course">
                        <BookOpen size={13} />
                        {batch.courseName || "Course not specified"}
                      </div>
                      <div className="institute-faculty-detail-batch-info">
                        <span>
                          <CalendarDays size={13} />
                          {batch.academicYear || "—"}
                        </span>
                        <span>
                          <Users size={13} />
                          {count} / {capacity || "—"} students
                        </span>
                      </div>
                      <div className="institute-faculty-detail-progress-track">
                        <span style={{ width: `${occupancy}%` }} />
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="No batches assigned"
                description="Batch assignments will appear here when linked to this faculty member."
              />
            )}
          </section>
        )}

        {activeTab === "students" && (
          <section className="institute-faculty-detail-panel">
            <div className="institute-faculty-detail-panel-heading">
              <div>
                <h2>Assigned students</h2>
                <p>Students belonging to this faculty member's assigned batches.</p>
              </div>
              <span className="institute-faculty-detail-total">
                {filteredStudents.length} students
              </span>
            </div>

            <div className="institute-faculty-detail-student-filters">
              <label>
                <Search size={15} />
                <input
                  type="search"
                  placeholder="Search students..."
                  value={studentSearch}
                  onChange={(event) => setStudentSearch(event.target.value)}
                />
              </label>

              <select
                value={studentBatchFilter}
                onChange={(event) => setStudentBatchFilter(event.target.value)}
              >
                {batchOptions.map((batch) => (
                  <option key={batch} value={batch}>
                    {batch === "All" ? "All batches" : batch}
                  </option>
                ))}
              </select>

              <select
                value={studentStatusFilter}
                onChange={(event) => setStudentStatusFilter(event.target.value)}
              >
                <option value="All">All statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {filteredStudents.length ? (
              <div className="institute-faculty-detail-student-table-wrap">
                <table className="institute-faculty-detail-student-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Batch</th>
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
                          <div className="institute-faculty-detail-student-person">
                            <span>{getInitials(student.name)}</span>
                            <div>
                              <strong>{student.name}</strong>
                              <small>{student.id}</small>
                            </div>
                          </div>
                        </td>
                        <td>{student.batchName || student.batch || "—"}</td>
                        <td>{student.attendance ?? 0}%</td>
                        <td>{student.performance ?? 0}%</td>
                        <td>
                          <StatusBadge status={student.status || "Active"} />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="institute-faculty-detail-student-view"
                            onClick={() => setSelectedStudent(student)}
                            aria-label={`View ${student.name}`}
                          >
                            <ChevronRight size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                title="No students found"
                description={
                  assignedStudents.length
                    ? "Try changing your search or filters."
                    : "Students linked to this faculty member's batches will appear here."
                }
              />
            )}
          </section>
        )}
      </div>

      {selectedStudent && (
        <div
          className="institute-faculty-detail-student-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedStudent(null);
            }
          }}
        >
          <section className="institute-faculty-detail-student-modal">
            <div className="institute-faculty-detail-panel-heading">
              <div>
                <h2>Student details</h2>
                <p>Quick student overview</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                aria-label="Close student details"
              >
                <X size={18} />
              </button>
            </div>

            <div className="institute-faculty-detail-student-modal-person">
              <span>{getInitials(selectedStudent.name)}</span>
              <div>
                <strong>{selectedStudent.name}</strong>
                <small>{selectedStudent.id}</small>
              </div>
            </div>

            <div className="institute-faculty-detail-student-modal-info">
              <div>
                <Mail size={14} />
                <span>{selectedStudent.email || "Email not provided"}</span>
              </div>
              <div>
                <Layers3 size={14} />
                <span>
                  {selectedStudent.batchName || selectedStudent.batch || "Batch not assigned"}
                </span>
              </div>
              <div>
                <Activity size={14} />
                <span>Attendance: {selectedStudent.attendance ?? 0}%</span>
              </div>
              <div>
                <Award size={14} />
                <span>Performance: {selectedStudent.performance ?? 0}%</span>
              </div>
            </div>

            <button
              type="button"
              className="institute-faculty-detail-student-close"
              onClick={() => setSelectedStudent(null)}
            >
              Close
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
