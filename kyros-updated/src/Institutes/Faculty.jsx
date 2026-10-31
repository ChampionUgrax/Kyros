
import { useMemo, useState } from "react";
import {
  Users,
  UserPlus,
  GraduationCap,
  BookOpen,
  Search,
  Eye,
  Pencil,
  Trash2,
  Mail,
  Phone,
  BriefcaseBusiness,
  X,
  Save,
  Building2,
} from "lucide-react";

import DataTable from "./DataTable.jsx";
import ExportButton from "./ExportButton.jsx";
import AddFacultyModal from "./AddFacultyModel.jsx";
import FacultyCard from "./FacultyCard.jsx";
import FilterBar from "./FilterBar.jsx";

const DEMO_COURSES = [
  { id: "course-001", name: "Computer Science Engineering", code: "CSE" },
  { id: "course-002", name: "Data Science and Analytics", code: "DSA" },
  { id: "course-003", name: "Applied Mathematics", code: "MATH" },
  { id: "course-004", name: "Business Administration", code: "BBA" },
];

const INITIAL_FACULTY = [
  {
    id: "faculty-001",
    name: "Rahul Sharma",
    employeeId: "FAC-001",
    email: "rahul.sharma@kyros.edu",
    phone: "+91 98765 43210",
    department: "Computer Science",
    specialization: "Web Development",
    qualification: "M.Tech",
    experience: 8,
    courseIds: ["course-001"],
    courseNames: ["Computer Science Engineering"],
    batchCount: 4,
    studentCount: 180,
    status: "Active",
    bio: "Specializes in software engineering and modern web technologies.",
  },
  {
    id: "faculty-002",
    name: "Priya Verma",
    employeeId: "FAC-002",
    email: "priya.verma@kyros.edu",
    phone: "+91 98765 43211",
    department: "Data Science",
    specialization: "Machine Learning",
    qualification: "Ph.D.",
    experience: 10,
    courseIds: ["course-002"],
    courseNames: ["Data Science and Analytics"],
    batchCount: 3,
    studentCount: 126,
    status: "Active",
    bio: "Works in data analytics, machine learning and applied AI.",
  },
  {
    id: "faculty-003",
    name: "Amit Kumar",
    employeeId: "FAC-003",
    email: "amit.kumar@kyros.edu",
    phone: "+91 98765 43212",
    department: "Mathematics",
    specialization: "Applied Mathematics",
    qualification: "M.Sc.",
    experience: 6,
    courseIds: ["course-003"],
    courseNames: ["Applied Mathematics"],
    batchCount: 2,
    studentCount: 92,
    status: "Active",
    bio: "Focuses on applied mathematics and quantitative problem solving.",
  },
  {
    id: "faculty-004",
    name: "Neha Gupta",
    employeeId: "FAC-004",
    email: "neha.gupta@kyros.edu",
    phone: "+91 98765 43213",
    department: "Management",
    specialization: "Business Strategy",
    qualification: "MBA",
    experience: 5,
    courseIds: ["course-004"],
    courseNames: ["Business Administration"],
    batchCount: 2,
    studentCount: 75,
    status: "On Leave",
    bio: "Teaches business strategy and organizational management.",
  },
  {
    id: "faculty-005",
    name: "Vikram Singh",
    employeeId: "FAC-005",
    email: "vikram.singh@kyros.edu",
    phone: "+91 98765 43214",
    department: "Computer Science",
    specialization: "Database Systems",
    qualification: "M.Tech",
    experience: 7,
    courseIds: ["course-001"],
    courseNames: ["Computer Science Engineering"],
    batchCount: 3,
    studentCount: 135,
    status: "Active",
    bio: "Specializes in database design and backend development.",
  },
];

const INITIAL_FILTERS = {
  department: "All",
  status: "All",
};

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
    <div className="institute-faculty-stat">
      <div className="institute-faculty-stat-top">
        <span>{label}</span>
        <span className="institute-faculty-stat-icon">
          <Icon size={17} />
        </span>
      </div>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}

function FacultyProfile({ faculty, onClose, onEdit }) {
  if (!faculty) return null;

  return (
    <div
      className="institute-faculty-profile-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="institute-faculty-profile-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="faculty-profile-title"
      >
        <div className="institute-faculty-profile-header">
          <div>
            <span>FACULTY PROFILE</span>
            <h2 id="faculty-profile-title">Faculty details</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close profile">
            <X size={18} />
          </button>
        </div>

        <div className="institute-faculty-profile-identity">
          <div className="institute-faculty-avatar large">
            {getInitials(faculty.name)}
          </div>
          <div>
            <h3>{faculty.name}</h3>
            <p>{faculty.employeeId}</p>
            <span
              className={`institute-faculty-status ${faculty.status
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
            >
              {faculty.status}
            </span>
          </div>
        </div>

        <div className="institute-faculty-profile-grid">
          <div>
            <Mail size={15} />
            <span>Email</span>
            <strong>{faculty.email}</strong>
          </div>
          <div>
            <Phone size={15} />
            <span>Phone</span>
            <strong>{faculty.phone}</strong>
          </div>
          <div>
            <Building2 size={15} />
            <span>Department</span>
            <strong>{faculty.department}</strong>
          </div>
          <div>
            <GraduationCap size={15} />
            <span>Qualification</span>
            <strong>{faculty.qualification}</strong>
          </div>
          <div>
            <BriefcaseBusiness size={15} />
            <span>Experience</span>
            <strong>{faculty.experience} years</strong>
          </div>
          <div>
            <Users size={15} />
            <span>Students</span>
            <strong>{faculty.studentCount ?? 0}</strong>
          </div>
        </div>

        <div className="institute-faculty-profile-section">
          <h4>Specialization</h4>
          <p>{faculty.specialization || "Not specified"}</p>
        </div>

        <div className="institute-faculty-profile-section">
          <h4>Assigned courses</h4>
          <div className="institute-faculty-course-tags">
            {(faculty.courseNames || []).length ? (
              faculty.courseNames.map((course) => (
                <span key={course}>{course}</span>
              ))
            ) : (
              <p>No courses assigned.</p>
            )}
          </div>
        </div>

        <div className="institute-faculty-profile-section">
          <h4>About</h4>
          <p>{faculty.bio || "No profile description added."}</p>
        </div>

        <div className="institute-faculty-profile-footer">
          <button
            type="button"
            className="institute-faculty-secondary-btn"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="institute-faculty-primary-btn"
            onClick={() => onEdit(faculty)}
          >
            <Pencil size={14} />
            Edit faculty
          </button>
        </div>
      </section>
    </div>
  );
}

export default function Faculty() {
  const [faculty, setFaculty] = useState(INITIAL_FACULTY);
  const [courses] = useState(DEMO_COURSES);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [selectedRows, setSelectedRows] = useState([]);

  const departments = useMemo(
    () => ["All", ...new Set(faculty.map((person) => person.department))],
    [faculty]
  );

  const filteredFaculty = useMemo(
    () =>
      faculty.filter((person) => {
        const matchesDepartment =
          filters.department === "All" ||
          person.department === filters.department;

        const matchesStatus =
          filters.status === "All" || person.status === filters.status;

        return matchesDepartment && matchesStatus;
      }),
    [faculty, filters]
  );

  const activeCount = faculty.filter(
    (person) => person.status === "Active"
  ).length;

  const departmentCount = new Set(
    faculty.map((person) => person.department)
  ).size;

  const totalStudents = faculty.reduce(
    (total, person) => total + (Number(person.studentCount) || 0),
    0
  );

  const handleAddFaculty = async (newFaculty) => {
    setFaculty((previous) => [
      {
        ...newFaculty,
        id: newFaculty.id || `faculty-${Date.now()}`,
      },
      ...previous,
    ]);
    setAddModalOpen(false);
  };

  const startEdit = (person) => {
    setSelectedFaculty(null);
    setEditingFaculty(person);
    setEditForm({
      name: person.name || "",
      employeeId: person.employeeId || "",
      email: person.email || "",
      phone: person.phone || "",
      department: person.department || "",
      specialization: person.specialization || "",
      qualification: person.qualification || "",
      experience: person.experience ?? 0,
      status: person.status || "Active",
      bio: person.bio || "",
    });
  };

  const saveEdit = (event) => {
    event.preventDefault();

    setFaculty((previous) =>
      previous.map((person) =>
        person.id === editingFaculty.id
          ? { ...person, ...editForm, experience: Number(editForm.experience) }
          : person
      )
    );

    setEditingFaculty(null);
    setEditForm(null);
  };

  const deleteFaculty = (person) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${person.name} from the faculty directory?`
    );

    if (!confirmed) return;

    setFaculty((previous) =>
      previous.filter((item) => item.id !== person.id)
    );

    setSelectedRows((previous) =>
      previous.filter((id) => id !== person.id)
    );
  };

  const columns = [
    {
      header: "Faculty member",
      accessor: "name",
      sortable: true,
      render: (value, person) => (
        <div className="institute-faculty-table-person">
          <span className="institute-faculty-avatar">
            {getInitials(value)}
          </span>
          <span>
            <strong>{value}</strong>
            <small>{person.employeeId}</small>
          </span>
        </div>
      ),
    },
    {
      header: "Department",
      accessor: "department",
      sortable: true,
    },
    {
      header: "Specialization",
      accessor: "specialization",
      sortable: true,
    },
    {
      header: "Courses",
      accessor: "courseNames",
      render: (value) => (
        <span className="institute-faculty-count">
          <BookOpen size={13} />
          {Array.isArray(value) ? value.length : 0}
        </span>
      ),
      exportValue: (value) => Array.isArray(value) ? value.join("; ") : "",
    },
    {
      header: "Students",
      accessor: "studentCount",
      sortable: true,
      render: (value) => (
        <span className="institute-faculty-count">
          <Users size={13} />
          {value ?? 0}
        </span>
      ),
    },
    {
      header: "Experience",
      accessor: "experience",
      sortable: true,
      render: (value) => `${value ?? 0} years`,
      exportValue: (value) => `${value ?? 0} years`,
    },
    {
      header: "Status",
      accessor: "status",
      render: (value) => (
        <span
          className={`institute-faculty-status ${value
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
        >
          <span />
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="institute-faculty-page">
      <div className="institute-faculty-page-heading">
        <div>
          <span className="institute-faculty-eyebrow">PEOPLE MANAGEMENT</span>
          <h1>Faculty Management</h1>
          <p>Manage your teaching team, assignments and faculty records.</p>
        </div>

        <button
          type="button"
          className="institute-faculty-primary-btn"
          onClick={() => setAddModalOpen(true)}
        >
          <UserPlus size={16} />
          Add Faculty
        </button>
      </div>

      <div className="institute-faculty-stats">
        <StatCard
          icon={Users}
          label="Total Faculty"
          value={faculty.length}
          note="Registered faculty members"
        />
        <StatCard
          icon={GraduationCap}
          label="Active Faculty"
          value={activeCount}
          note="Currently teaching"
        />
        <StatCard
          icon={Building2}
          label="Departments"
          value={departmentCount}
          note="Across the institute"
        />
        <StatCard
          icon={BookOpen}
          label="Students Covered"
          value={totalStudents.toLocaleString("en-IN")}
          note="Combined assigned student count"
        />
      </div>

      <div className="institute-faculty-directory">
        <div className="institute-faculty-directory-heading">
          <div>
            <h2>Faculty Directory</h2>
            <p>View and manage all faculty members in your institute.</p>
          </div>

          <div className="institute-faculty-filters">
            <label>
              <Search size={14} />
              <select
                value={filters.department}
                onChange={(event) =>
                  setFilters((previous) => ({
                    ...previous,
                    department: event.target.value,
                  }))
                }
              >
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department === "All" ? "All departments" : department}
                  </option>
                ))}
              </select>
            </label>

            <select
              value={filters.status}
              onChange={(event) =>
                setFilters((previous) => ({
                  ...previous,
                  status: event.target.value,
                }))
              }
              aria-label="Filter by status"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
            </select>

            <button
              type="button"
              className="institute-faculty-reset-btn"
              onClick={() => setFilters(INITIAL_FILTERS)}
            >
              Reset
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredFaculty}
          rowKey="id"
          searchable
          searchPlaceholder="Search by name, ID, email or department..."
          searchKeys={[
            "name",
            "employeeId",
            "email",
            "department",
            "specialization",
          ]}
          selectable
          selectedData={selectedRows}
          onSelectionChange={(rows) =>
            setSelectedRows(rows.map((row) => row.id))
          }
          headerActions={
            <ExportButton
              data={filteredFaculty}
              selectedData={filteredFaculty.filter((person) =>
                selectedRows.includes(person.id)
              )}
              columns={columns}
              filename="kyros-faculty"
            />
          }
          rowActions={(person) => [
            {
              label: "View profile",
              icon: Eye,
              onClick: () => setSelectedFaculty(person),
            },
            {
              label: "Edit faculty",
              icon: Pencil,
              onClick: () => startEdit(person),
            },
            {
              label: "Delete faculty",
              icon: Trash2,
              danger: true,
              onClick: () => deleteFaculty(person),
            },
          ]}
          emptyTitle="No faculty members found"
          emptyDescription="Try changing the department or status filters, or add a faculty member."
        />
      </div>

      <AddFacultyModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleAddFaculty}
        courses={courses}
      />

      <FacultyProfile
        faculty={selectedFaculty}
        onClose={() => setSelectedFaculty(null)}
        onEdit={startEdit}
      />

      {editingFaculty && editForm && (
        <div
          className="institute-faculty-profile-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setEditingFaculty(null);
              setEditForm(null);
            }
          }}
        >
          <form
            className="institute-faculty-edit-modal"
            onSubmit={saveEdit}
          >
            <div className="institute-faculty-profile-header">
              <div>
                <span>FACULTY DIRECTORY</span>
                <h2>Edit faculty member</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingFaculty(null);
                  setEditForm(null);
                }}
                aria-label="Close edit form"
              >
                <X size={18} />
              </button>
            </div>

            <div className="institute-faculty-edit-grid">
              {[
                ["name", "Full name", "text"],
                ["employeeId", "Employee ID", "text"],
                ["email", "Email address", "email"],
                ["phone", "Phone number", "tel"],
                ["department", "Department", "text"],
                ["specialization", "Specialization", "text"],
                ["qualification", "Qualification", "text"],
                ["experience", "Experience (years)", "number"],
              ].map(([key, label, type]) => (
                <label key={key}>
                  <span>{label}</span>
                  <input
                    type={type}
                    min={type === "number" ? "0" : undefined}
                    required
                    value={editForm[key]}
                    onChange={(event) =>
                      setEditForm((previous) => ({
                        ...previous,
                        [key]: event.target.value,
                      }))
                    }
                  />
                </label>
              ))}

              <label>
                <span>Status</span>
                <select
                  value={editForm.status}
                  onChange={(event) =>
                    setEditForm((previous) => ({
                      ...previous,
                      status: event.target.value,
                    }))
                  }
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </label>

              <label className="full">
                <span>About faculty member</span>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(event) =>
                    setEditForm((previous) => ({
                      ...previous,
                      bio: event.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <div className="institute-faculty-profile-footer">
              <button
                type="button"
                className="institute-faculty-secondary-btn"
                onClick={() => {
                  setEditingFaculty(null);
                  setEditForm(null);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="institute-faculty-primary-btn"
              >
                <Save size={14} />
                Save changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
