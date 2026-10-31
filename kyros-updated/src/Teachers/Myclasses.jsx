import { useMemo, useState } from "react";
import {
  BookOpen,
  Users,
  GraduationCap,
  TrendingUp,
  Search,
  Plus,
  ArrowLeft,
  ChevronRight,
  CalendarDays,
  Clock3,
  MapPin,
  MoreHorizontal,
  Mail,
  BarChart3,
  X,
} from "lucide-react";

const DEMO_CLASSES = [
  {
    id: 1,
    name: "Class 10A",
    section: "Section A",
    subject: "Mathematics",
    room: "Room 204",
    students: 25,
    capacity: 30,
    progress: 78,
    attendance: 92,
    averageScore: 81,
    status: "Active",
    color: "purple",
    nextClass: "Today, 10:30 AM",
    topics: [
      { name: "Linear Equations", progress: 90 },
      { name: "Quadratic Equations", progress: 72 },
      { name: "Trigonometry", progress: 65 },
      { name: "Statistics", progress: 85 },
    ],
    studentList: [
      { name: "Aarav Sharma", email: "aarav@example.com", score: 92, attendance: 96 },
      { name: "Riya Mehta", email: "riya@example.com", score: 88, attendance: 94 },
      { name: "Kabir Singh", email: "kabir@example.com", score: 76, attendance: 88 },
      { name: "Ananya Gupta", email: "ananya@example.com", score: 84, attendance: 92 },
      { name: "Ishaan Roy", email: "ishaan@example.com", score: 68, attendance: 84 },
    ],
  },
  {
    id: 2,
    name: "Class 10B",
    section: "Section B",
    subject: "Mathematics",
    room: "Room 206",
    students: 28,
    capacity: 30,
    progress: 64,
    attendance: 87,
    averageScore: 74,
    status: "Active",
    color: "blue",
    nextClass: "Today, 12:00 PM",
    topics: [
      { name: "Linear Equations", progress: 82 },
      { name: "Quadratic Equations", progress: 60 },
      { name: "Trigonometry", progress: 48 },
      { name: "Statistics", progress: 66 },
    ],
    studentList: [
      { name: "Dev Patel", email: "dev@example.com", score: 79, attendance: 91 },
      { name: "Ishita Jain", email: "ishita@example.com", score: 85, attendance: 95 },
      { name: "Manav Rao", email: "manav@example.com", score: 64, attendance: 82 },
      { name: "Kavya Nair", email: "kavya@example.com", score: 72, attendance: 86 },
    ],
  },
  {
    id: 3,
    name: "Class 9A",
    section: "Section A",
    subject: "Science",
    room: "Lab 1",
    students: 22,
    capacity: 25,
    progress: 85,
    attendance: 95,
    averageScore: 88,
    status: "Active",
    color: "green",
    nextClass: "Tomorrow, 09:00 AM",
    topics: [
      { name: "Electricity", progress: 92 },
      { name: "Motion", progress: 88 },
      { name: "Matter", progress: 80 },
      { name: "Force and Laws", progress: 78 },
    ],
    studentList: [
      { name: "Neha Sharma", email: "neha@example.com", score: 94, attendance: 98 },
      { name: "Arjun Das", email: "arjun@example.com", score: 86, attendance: 93 },
      { name: "Priya Verma", email: "priya@example.com", score: 90, attendance: 96 },
      { name: "Rohan Mehta", email: "rohan@example.com", score: 82, attendance: 91 },
    ],
  },
  {
    id: 4,
    name: "Class 9B",
    section: "Section B",
    subject: "Science",
    room: "Lab 2",
    students: 24,
    capacity: 25,
    progress: 71,
    attendance: 89,
    averageScore: 77,
    status: "Active",
    color: "orange",
    nextClass: "Tomorrow, 11:00 AM",
    topics: [
      { name: "Electricity", progress: 76 },
      { name: "Motion", progress: 70 },
      { name: "Matter", progress: 68 },
      { name: "Force and Laws", progress: 70 },
    ],
    studentList: [
      { name: "Sana Khan", email: "sana@example.com", score: 80, attendance: 90 },
      { name: "Aditya Joshi", email: "aditya@example.com", score: 73, attendance: 87 },
      { name: "Meera Shah", email: "meera@example.com", score: 85, attendance: 92 },
    ],
  },
];

const DEMO_SESSIONS = [
  { id: 1, className: "Class 10A", subject: "Mathematics", time: "10:30 AM", room: "Room 204", day: "Today" },
  { id: 2, className: "Class 10B", subject: "Mathematics", time: "12:00 PM", room: "Room 206", day: "Today" },
  { id: 3, className: "Class 9A", subject: "Science", time: "09:00 AM", room: "Lab 1", day: "Tomorrow" },
];

export default function Classes() {
  const [classes, setClasses] = useState(DEMO_CLASSES);
  const [selectedClass, setSelectedClass] = useState(null);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All Subjects");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newSubject, setNewSubject] = useState("Mathematics");
  const [newCapacity, setNewCapacity] = useState("30");

  const filteredClasses = useMemo(() => {
    return classes.filter((item) => {
      const matchesSearch =
        `${item.name} ${item.subject} ${item.section}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesSubject =
        subjectFilter === "All Subjects" ||
        item.subject === subjectFilter;

      return matchesSearch && matchesSubject;
    });
  }, [classes, search, subjectFilter]);

  const totalStudents = classes.reduce(
    (total, item) => total + item.students,
    0
  );

  const averageProgress = classes.length
    ? Math.round(
        classes.reduce((total, item) => total + item.progress, 0) /
          classes.length
      )
    : 0;

  function addClass(event) {
    event.preventDefault();

    if (!newClassName.trim()) return;

    const newClass = {
      id: Date.now(),
      name: newClassName.trim(),
      section: "New Section",
      subject: newSubject,
      room: "Not assigned",
      students: 0,
      capacity: Math.max(1, Number(newCapacity) || 30),
      progress: 0,
      attendance: 0,
      averageScore: 0,
      status: "Active",
      color: "purple",
      nextClass: "Not scheduled",
      topics: [],
      studentList: [],
    };

    setClasses((previous) => [...previous, newClass]);
    setNewClassName("");
    setNewSubject("Mathematics");
    setNewCapacity("30");
    setShowAddModal(false);
  }

  if (selectedClass) {
    return (
      <ClassDetails
        item={selectedClass}
        onBack={() => setSelectedClass(null)}
      />
    );
  }

  return (
    <div className="teacher-classes">
      <div className="teacher-classes-heading">
        <div>
          <span className="teacher-classes-eyebrow">CLASSROOM MANAGEMENT</span>
          <h1>My Classes</h1>
          <p>
            Manage your classrooms, monitor student progress, and stay
            organised with your teaching schedule.
          </p>
        </div>

        <button
          className="teacher-classes-add-btn"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={17} />
          Add class
        </button>
      </div>

      {/* Summary */}
      <div className="teacher-classes-stats">
        <StatCard
          icon={<BookOpen size={20} />}
          label="Total classes"
          value={classes.length}
          note="Your active classrooms"
          color="purple"
        />
        <StatCard
          icon={<Users size={20} />}
          label="Total students"
          value={totalStudents}
          note="Across all your classes"
          color="blue"
        />
        <StatCard
          icon={<GraduationCap size={20} />}
          label="Average progress"
          value={`${averageProgress}%`}
          note="Overall learning progress"
          color="green"
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Active sessions"
          value={DEMO_SESSIONS.length}
          note="Upcoming demo sessions"
          color="orange"
        />
      </div>

      {/* Sessions */}
      <section className="teacher-classes-sessions">
        <div className="teacher-classes-section-heading">
          <div>
            <h2>Upcoming sessions</h2>
            <p>Your next scheduled classes</p>
          </div>
          <CalendarDays size={20} />
        </div>

        <div className="teacher-classes-session-list">
          {DEMO_SESSIONS.map((session) => (
            <div className="teacher-classes-session" key={session.id}>
              <div className="teacher-classes-session-date">
                <CalendarDays size={17} />
              </div>
              <div className="teacher-classes-session-info">
                <strong>{session.className}</strong>
                <span>{session.subject}</span>
              </div>
              <div className="teacher-classes-session-time">
                <span><Clock3 size={13} /> {session.day}, {session.time}</span>
                <span><MapPin size={13} /> {session.room}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Class directory */}
      <section className="teacher-classes-directory">
        <div className="teacher-classes-section-heading">
          <div>
            <h2>Your classrooms</h2>
            <p>Explore and manage your assigned classes</p>
          </div>
          <span className="teacher-classes-count">
            {filteredClasses.length} classes
          </span>
        </div>

        <div className="teacher-classes-toolbar">
          <div className="teacher-classes-search">
            <Search size={17} />
            <input
              placeholder="Search classes or subjects..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            value={subjectFilter}
            onChange={(event) => setSubjectFilter(event.target.value)}
          >
            <option>All Subjects</option>
            <option>Mathematics</option>
            <option>Science</option>
          </select>
        </div>

        <div className="teacher-classes-grid">
          {filteredClasses.map((item) => (
            <article className="teacher-class-card" key={item.id}>
              <div className="teacher-class-card-top">
                <div className={`teacher-class-icon ${item.color}`}>
                  <BookOpen size={21} />
                </div>
                <span className="teacher-class-status">{item.status}</span>
                <button
                  className="teacher-class-more"
                  aria-label={`More options for ${item.name}`}
                  title="More options"
                  onClick={() => setSelectedClass(item)}
                >
                  <MoreHorizontal size={19} />
                </button>
              </div>

              <h3>{item.name}</h3>
              <p className="teacher-class-subtitle">
                {item.subject} · {item.section}
              </p>

              <div className="teacher-class-meta">
                <span><Users size={15} /> {item.students} students</span>
                <span><MapPin size={15} /> {item.room}</span>
              </div>

              <div className="teacher-class-progress-heading">
                <span>Learning progress</span>
                <strong>{item.progress}%</strong>
              </div>

              <div className="teacher-class-progress">
                <div style={{ width: `${item.progress}%` }} />
              </div>

              <div className="teacher-class-card-footer">
                <span>
                  <Clock3 size={14} /> {item.nextClass}
                </span>
                <button onClick={() => setSelectedClass(item)}>
                  View class <ChevronRight size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>

        {filteredClasses.length === 0 && (
          <div className="teacher-classes-empty">
            <Search size={28} />
            <h3>No classes found</h3>
            <p>Try another search or change the subject filter.</p>
            <button
              onClick={() => {
                setSearch("");
                setSubjectFilter("All Subjects");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* Add class modal */}
      {showAddModal && (
        <div
          className="teacher-classes-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowAddModal(false);
            }
          }}
        >
          <form
            className="teacher-classes-modal"
            onSubmit={addClass}
          >
            <div className="teacher-classes-modal-heading">
              <div>
                <h2>Create a class</h2>
                <p>Add a classroom to your demo workspace.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                aria-label="Close modal"
              >
                <X size={19} />
              </button>
            </div>

            <label>
              Class name
              <input
                value={newClassName}
                onChange={(event) => setNewClassName(event.target.value)}
                placeholder="e.g. Class 8A"
                required
              />
            </label>

            <label>
              Subject
              <select
                value={newSubject}
                onChange={(event) => setNewSubject(event.target.value)}
              >
                <option>Mathematics</option>
                <option>Science</option>
                <option>English</option>
                <option>Social Science</option>
              </select>
            </label>

            <label>
              Student capacity
              <input
                type="number"
                min="1"
                max="100"
                value={newCapacity}
                onChange={(event) => setNewCapacity(event.target.value)}
                required
              />
            </label>

            <div className="teacher-classes-modal-actions">
              <button
                type="button"
                className="teacher-classes-cancel"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="teacher-classes-submit">
                <Plus size={16} /> Create class
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, note, color }) {
  return (
    <div className="teacher-classes-stat">
      <div className={`teacher-classes-stat-icon ${color}`}>{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{note}</small>
      </div>
    </div>
  );
}

function ClassDetails({ item, onBack }) {
  return (
    <div className="teacher-classes teacher-class-details">
      <button className="teacher-class-back" onClick={onBack}>
        <ArrowLeft size={17} /> Back to My Classes
      </button>

      <div className="teacher-class-detail-heading">
        <div>
          <span className="teacher-classes-eyebrow">CLASS OVERVIEW</span>
          <h1>{item.name}</h1>
          <p>{item.subject} · {item.section} · {item.room}</p>
        </div>
        <span className="teacher-class-status">{item.status}</span>
      </div>

      <div className="teacher-classes-stats teacher-class-detail-stats">
        <StatCard
          icon={<Users size={20} />}
          label="Students"
          value={item.students}
          note={`Capacity: ${item.capacity}`}
          color="blue"
        />
        <StatCard
          icon={<BarChart3 size={20} />}
          label="Learning progress"
          value={`${item.progress}%`}
          note="Overall topic completion"
          color="purple"
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Average score"
          value={`${item.averageScore}%`}
          note="Demo assessment score"
          color="green"
        />
        <StatCard
          icon={<CalendarDays size={20} />}
          label="Attendance"
          value={`${item.attendance}%`}
          note="Demo attendance rate"
          color="orange"
        />
      </div>

      <div className="teacher-class-detail-grid">
        <section className="teacher-class-detail-panel">
          <div className="teacher-classes-section-heading">
            <div>
              <h2>Topic-wise progress</h2>
              <p>Learning progress across the syllabus</p>
            </div>
          </div>

          {item.topics.length ? (
            <div className="teacher-class-topics">
              {item.topics.map((topic) => (
                <div className="teacher-class-topic" key={topic.name}>
                  <div>
                    <span>{topic.name}</span>
                    <strong>{topic.progress}%</strong>
                  </div>
                  <div className="teacher-class-progress">
                    <div style={{ width: `${topic.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="teacher-class-no-data">
              Topic progress will appear once topics are added.
            </p>
          )}
        </section>

        <section className="teacher-class-detail-panel">
          <div className="teacher-classes-section-heading">
            <div>
              <h2>Class information</h2>
              <p>Classroom details</p>
            </div>
          </div>

          <div className="teacher-class-information">
            <div><span>Class</span><strong>{item.name}</strong></div>
            <div><span>Subject</span><strong>{item.subject}</strong></div>
            <div><span>Section</span><strong>{item.section}</strong></div>
            <div><span>Room</span><strong>{item.room}</strong></div>
            <div><span>Capacity</span><strong>{item.students} / {item.capacity}</strong></div>
            <div><span>Next session</span><strong>{item.nextClass}</strong></div>
          </div>
        </section>
      </div>

      <section className="teacher-class-detail-panel teacher-class-students-panel">
        <div className="teacher-classes-section-heading">
          <div>
            <h2>Students</h2>
            <p>Sample student performance overview</p>
          </div>
          <span className="teacher-classes-count">
            {item.studentList.length} shown
          </span>
        </div>

        {item.studentList.length ? (
          <div className="teacher-class-student-table-wrap">
            <table className="teacher-class-student-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Assessment score</th>
                  <th>Attendance</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                {item.studentList.map((student) => (
                  <tr key={student.email}>
                    <td>
                      <div className="teacher-class-student-name">
                        <div>
                          {student.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <span>
                          <strong>{student.name}</strong>
                          <small>{student.email}</small>
                        </span>
                      </div>
                    </td>
                    <td>{student.score}%</td>
                    <td>{student.attendance}%</td>
                    <td>
                      <span
                        className={`teacher-class-performance ${
                          student.score >= 80
                            ? "good"
                            : student.score >= 65
                              ? "average"
                              : "needs-support"
                        }`}
                      >
                        {student.score >= 80
                          ? "Strong"
                          : student.score >= 65
                            ? "Average"
                            : "Needs support"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="teacher-class-no-data">
            No students have been added to this class yet.
          </p>
        )}
      </section>
    </div>
  );
}