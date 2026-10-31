
import { useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  ClipboardCheck,
  Plus,
  Search,
  SlidersHorizontal,
  RotateCcw,
  X,
  Pencil,
  Trash2,
  Download,
  GraduationCap,
  ChevronDown,
} from "lucide-react";

import StudentCard from "./StudentCard.jsx";
import AddStudentModal from "./AddStudentModel.jsx";
import ExportButton from "./ExportButton.jsx";

const INITIAL_BATCHES = [
  {
    id: "batch-001",
    name: "B.Tech CSE - A",
    courseName: "Computer Science Engineering",
  },
  {
    id: "batch-002",
    name: "B.Tech CSE - B",
    courseName: "Computer Science Engineering",
  },
  {
    id: "batch-003",
    name: "B.Tech IT - A",
    courseName: "Information Technology",
  },
  {
    id: "batch-004",
    name: "B.Tech ECE - A",
    courseName: "Electronics and Communication",
  },
];

const INITIAL_STUDENTS = [
  {
    id: "student-001",
    name: "Aarav Sharma",
    enrollmentId: "CSE2026001",
    email: "aarav.sharma@example.com",
    phone: "+91 9876543210",
    batchId: "batch-001",
    batchName: "B.Tech CSE - A",
    courseName: "Computer Science Engineering",
    academicYear: "2026-27",
    semester: "1",
    section: "A",
    attendance: 92,
    performance: 86,
    status: "Active",
    guardianName: "Rajesh Sharma",
    guardianPhone: "+91 9876500001",
  },
  {
    id: "student-002",
    name: "Ananya Verma",
    enrollmentId: "CSE2026002",
    email: "ananya.verma@example.com",
    phone: "+91 9876543211",
    batchId: "batch-001",
    batchName: "B.Tech CSE - A",
    courseName: "Computer Science Engineering",
    academicYear: "2026-27",
    semester: "1",
    section: "A",
    attendance: 96,
    performance: 91,
    status: "Active",
    guardianName: "Amit Verma",
    guardianPhone: "+91 9876500002",
  },
  {
    id: "student-003",
    name: "Vivaan Gupta",
    enrollmentId: "CSE2026003",
    email: "vivaan.gupta@example.com",
    phone: "+91 9876543212",
    batchId: "batch-001",
    batchName: "B.Tech CSE - A",
    courseName: "Computer Science Engineering",
    academicYear: "2026-27",
    semester: "1",
    section: "A",
    attendance: 68,
    performance: 72,
    status: "Active",
    guardianName: "Sanjay Gupta",
    guardianPhone: "+91 9876500003",
  },
  {
    id: "student-004",
    name: "Diya Mehta",
    enrollmentId: "CSE2026004",
    email: "diya.mehta@example.com",
    phone: "+91 9876543213",
    batchId: "batch-002",
    batchName: "B.Tech CSE - B",
    courseName: "Computer Science Engineering",
    academicYear: "2026-27",
    semester: "1",
    section: "B",
    attendance: 88,
    performance: 83,
    status: "Active",
    guardianName: "Neeraj Mehta",
    guardianPhone: "+91 9876500004",
  },
  {
    id: "student-005",
    name: "Kabir Singh",
    enrollmentId: "IT2026001",
    email: "kabir.singh@example.com",
    phone: "+91 9876543214",
    batchId: "batch-003",
    batchName: "B.Tech IT - A",
    courseName: "Information Technology",
    academicYear: "2026-27",
    semester: "1",
    section: "A",
    attendance: 74,
    performance: 79,
    status: "Active",
    guardianName: "Harpreet Singh",
    guardianPhone: "+91 9876500005",
  },
  {
    id: "student-006",
    name: "Ishita Jain",
    enrollmentId: "ECE2026001",
    email: "ishita.jain@example.com",
    phone: "+91 9876543215",
    batchId: "batch-004",
    batchName: "B.Tech ECE - A",
    courseName: "Electronics and Communication",
    academicYear: "2026-27",
    semester: "1",
    section: "A",
    attendance: 95,
    performance: 89,
    status: "Active",
    guardianName: "Manoj Jain",
    guardianPhone: "+91 9876500006",
  },
  {
    id: "student-007",
    name: "Reyansh Patel",
    enrollmentId: "CSE2025008",
    email: "reyansh.patel@example.com",
    phone: "+91 9876543216",
    batchId: "batch-002",
    batchName: "B.Tech CSE - B",
    courseName: "Computer Science Engineering",
    academicYear: "2026-27",
    semester: "3",
    section: "B",
    attendance: 61,
    performance: 58,
    status: "Inactive",
    guardianName: "Kunal Patel",
    guardianPhone: "+91 9876500007",
  },
  {
    id: "student-008",
    name: "Saanvi Joshi",
    enrollmentId: "IT2026002",
    email: "saanvi.joshi@example.com",
    phone: "+91 9876543217",
    batchId: "batch-003",
    batchName: "B.Tech IT - A",
    courseName: "Information Technology",
    academicYear: "2026-27",
    semester: "1",
    section: "A",
    attendance: 82,
    performance: 87,
    status: "Active",
    guardianName: "Rohit Joshi",
    guardianPhone: "+91 9876500008",
  },
];

const EMPTY_EDIT_FORM = {
  name: "",
  email: "",
  phone: "",
  status: "Active",
};

function SummaryCard({ icon: Icon, label, value, note, tone }) {
  return (
    <div className="institute-students-summary-card">
      <div className={`institute-students-summary-icon ${tone}`}>
        <Icon size={18} />
      </div>
      <div className="institute-students-summary-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{note}</small>
      </div>
    </div>
  );
}

export default function Students({ onViewStudent }) {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [batches] = useState(INITIAL_BATCHES);

  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [semesterFilter, setSemesterFilter] = useState("All");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_EDIT_FORM);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        student.name?.toLowerCase().includes(query) ||
        student.enrollmentId?.toLowerCase().includes(query) ||
        student.email?.toLowerCase().includes(query) ||
        student.batchName?.toLowerCase().includes(query);

      const matchesBatch =
        batchFilter === "All" || student.batchId === batchFilter;

      const matchesStatus =
        statusFilter === "All" || student.status === statusFilter;

      const matchesSemester =
        semesterFilter === "All" ||
        String(student.semester).replace(/^semester\s*/i, "") === semesterFilter;

      return (
        matchesSearch &&
        matchesBatch &&
        matchesStatus &&
        matchesSemester
      );
    });
  }, [students, search, batchFilter, statusFilter, semesterFilter]);

  const activeCount = students.filter(
    (student) => student.status === "Active"
  ).length;

  const inactiveCount = students.filter(
    (student) => student.status === "Inactive"
  ).length;

  const averageAttendance = students.length
    ? Math.round(
        students.reduce(
          (total, student) => total + (Number(student.attendance) || 0),
          0
        ) / students.length
      )
    : 0;

  const selectedData = students.filter((student) =>
    selectedStudents.includes(student.id)
  );

  const handleAddStudent = (newStudent) => {
    const batch = batches.find((item) => item.id === newStudent.batchId);

    const studentWithDetails = {
      ...newStudent,
      id: newStudent.id || `student-${Date.now()}`,
      batchName: newStudent.batchName || batch?.name || "Unassigned batch",
      courseName: newStudent.courseName || batch?.courseName || "Not assigned",
      attendance: newStudent.attendance ?? 0,
      performance: newStudent.performance ?? 0,
      status: newStudent.status || "Active",
    };

    setStudents((current) => [studentWithDetails, ...current]);
    setIsAddOpen(false);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setEditForm({
      name: student.name || "",
      email: student.email || "",
      phone: student.phone || "",
      status: student.status || "Active",
    });
  };

  const saveEditedStudent = (event) => {
    event.preventDefault();

    if (!editingStudent) return;

    setStudents((current) =>
      current.map((student) =>
        student.id === editingStudent.id
          ? {
              ...student,
              ...editForm,
              email: editForm.email.trim().toLowerCase(),
              name: editForm.name.trim(),
            }
          : student
      )
    );

    setEditingStudent(null);
    setEditForm(EMPTY_EDIT_FORM);
  };

  const handleDeleteStudent = (student) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${student.name}?`
    );

    if (!confirmed) return;

    setStudents((current) =>
      current.filter((item) => item.id !== student.id)
    );

    setSelectedStudents((current) =>
      current.filter((id) => id !== student.id)
    );
  };

  const handleSelectStudent = (student, checked) => {
    setSelectedStudents((current) =>
      checked
        ? [...new Set([...current, student.id])]
        : current.filter((id) => id !== student.id)
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedStudents((current) => [
        ...new Set([
          ...current,
          ...filteredStudents.map((student) => student.id),
        ]),
      ]);
    } else {
      const visibleIds = new Set(filteredStudents.map((student) => student.id));
      setSelectedStudents((current) =>
        current.filter((id) => !visibleIds.has(id))
      );
    }
  };

  const resetFilters = () => {
    setSearch("");
    setBatchFilter("All");
    setStatusFilter("All");
    setSemesterFilter("All");
  };

  const allVisibleSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((student) =>
      selectedStudents.includes(student.id)
    );

  return (
    <div className="institute-students-page">
      <div className="institute-students-page-header">
        <div>
          <div className="institute-students-eyebrow">
            <GraduationCap size={14} />
            STUDENT MANAGEMENT
          </div>
          <h1>Students</h1>
          <p>
            Manage student profiles, enrollment details and academic records.
          </p>
        </div>

        <div className="institute-students-header-actions">
          <ExportButton
            data={students}
            selectedData={selectedData}
            filename="kyros-students"
            formats={["csv", "json"]}
            columns={[
              { header: "Name", accessor: "name" },
              { header: "Enrollment ID", accessor: "enrollmentId" },
              { header: "Email", accessor: "email" },
              { header: "Phone", accessor: "phone" },
              { header: "Batch", accessor: "batchName" },
              { header: "Course", accessor: "courseName" },
              { header: "Academic Year", accessor: "academicYear" },
              { header: "Semester", accessor: "semester" },
              { header: "Attendance", accessor: "attendance" },
              { header: "Performance", accessor: "performance" },
              { header: "Status", accessor: "status" },
            ]}
          />

          <button
            type="button"
            className="institute-students-add-btn"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus size={16} />
            Add student
          </button>
        </div>
      </div>

      <div className="institute-students-summary-grid">
        <SummaryCard
          icon={Users}
          label="Total students"
          value={students.length}
          note="Registered in directory"
          tone="blue"
        />
        <SummaryCard
          icon={UserCheck}
          label="Active students"
          value={activeCount}
          note="Currently enrolled"
          tone="green"
        />
        <SummaryCard
          icon={UserX}
          label="Inactive students"
          value={inactiveCount}
          note="Not currently active"
          tone="orange"
        />
        <SummaryCard
          icon={ClipboardCheck}
          label="Average attendance"
          value={`${averageAttendance}%`}
          note="Across all students"
          tone="purple"
        />
      </div>

      <section className="institute-students-directory">
        <div className="institute-students-directory-heading">
          <div>
            <h2>Student directory</h2>
            <p>Browse and manage all registered students.</p>
          </div>
          <span className="institute-students-count">
            {filteredStudents.length} of {students.length} students
          </span>
        </div>

        <div className="institute-students-toolbar">
          <div className="institute-students-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, enrollment ID, email or batch..."
              aria-label="Search students"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="institute-students-filter">
            <SlidersHorizontal size={15} />
            <select
              value={batchFilter}
              onChange={(event) => setBatchFilter(event.target.value)}
              aria-label="Filter by batch"
            >
              <option value="All">All batches</option>
              {batches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))}
            </select>
            <ChevronDown size={13} />
          </div>

          <div className="institute-students-filter">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
            <ChevronDown size={13} />
          </div>

          <div className="institute-students-filter">
            <select
              value={semesterFilter}
              onChange={(event) => setSemesterFilter(event.target.value)}
              aria-label="Filter by semester"
            >
              <option value="All">All semesters</option>
              {["1", "2", "3", "4", "5", "6", "7", "8"].map((semester) => (
                <option key={semester} value={semester}>
                  Semester {semester}
                </option>
              ))}
            </select>
            <ChevronDown size={13} />
          </div>

          <button
            type="button"
            className="institute-students-reset-btn"
            onClick={resetFilters}
            title="Reset filters"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        <div className="institute-students-selection-row">
          <label>
            <input
              type="checkbox"
              checked={allVisibleSelected}
              onChange={(event) => handleSelectAll(event.target.checked)}
            />
            Select visible
          </label>

          {selectedStudents.length > 0 && (
            <span>
              {selectedStudents.length} selected · Use Export to download selected
              records
            </span>
          )}
        </div>

        {filteredStudents.length > 0 ? (
          <div className="institute-students-grid">
            {filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onView={onViewStudent}
                onEdit={openEditModal}
                onDelete={handleDeleteStudent}
                selectable
                selected={selectedStudents.includes(student.id)}
                onSelect={(checked) => handleSelectStudent(student, checked)}
              />
            ))}
          </div>
        ) : (
          <div className="institute-students-empty">
            <div className="institute-students-empty-icon">
              <Users size={25} />
            </div>
            <h3>No students found</h3>
            <p>
              Try changing your search or filters, or add a new student to the
              directory.
            </p>
            <button type="button" onClick={resetFilters}>
              <RotateCcw size={14} />
              Clear filters
            </button>
          </div>
        )}
      </section>

      <AddStudentModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={handleAddStudent}
        batches={batches}
      />

      {editingStudent && (
        <div
          className="institute-students-edit-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setEditingStudent(null);
            }
          }}
        >
          <form
            className="institute-students-edit-modal"
            onSubmit={saveEditedStudent}
          >
            <div className="institute-students-edit-heading">
              <div>
                <span>STUDENT DIRECTORY</span>
                <h2>Edit student</h2>
                <p>Update the student's basic contact information.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                aria-label="Close edit modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="institute-students-edit-fields">
              <label>
                Full name
                <input
                  required
                  value={editForm.name}
                  onChange={(event) =>
                    setEditForm({ ...editForm, name: event.target.value })
                  }
                  placeholder="Enter full name"
                />
              </label>

              <label>
                Email address
                <input
                  required
                  type="email"
                  value={editForm.email}
                  onChange={(event) =>
                    setEditForm({ ...editForm, email: event.target.value })
                  }
                  placeholder="student@example.com"
                />
              </label>

              <label>
                Phone number
                <input
                  value={editForm.phone}
                  onChange={(event) =>
                    setEditForm({ ...editForm, phone: event.target.value })
                  }
                  placeholder="Enter phone number"
                />
              </label>

              <label>
                Enrollment status
                <select
                  value={editForm.status}
                  onChange={(event) =>
                    setEditForm({ ...editForm, status: event.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </label>
            </div>

            <div className="institute-students-edit-actions">
              <button
                type="button"
                className="institute-students-edit-cancel"
                onClick={() => setEditingStudent(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="institute-students-edit-save"
              >
                <Pencil size={14} />
                Save changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
