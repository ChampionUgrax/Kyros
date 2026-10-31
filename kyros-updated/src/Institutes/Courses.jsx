
import { useMemo, useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  GraduationCap,
  Users,
  Layers3,
  Filter,
  X,
  Save,
} from "lucide-react";

import CourseCard from "./CourseCard.jsx";
import AddCourseModal from "./AddCourseModel.jsx";

const DEMO_FACULTY = [
  { id: "faculty-1", name: "Rahul Sharma" },
  { id: "faculty-2", name: "Priya Verma" },
  { id: "faculty-3", name: "Amit Kumar" },
];

const INITIAL_COURSES = [
  {
    id: "course-001",
    name: "Computer Science Engineering",
    code: "CSE-101",
    category: "Engineering",
    level: "Undergraduate",
    duration: "4 Years",
    modules: 12,
    facultyId: "faculty-1",
    facultyName: "Rahul Sharma",
    batchCount: 4,
    studentCount: 180,
    completionRate: 68,
    status: "Active",
    description: "Core computer science and software engineering.",
  },
  {
    id: "course-002",
    name: "Data Science and Analytics",
    code: "DS-202",
    category: "Technology",
    level: "Undergraduate",
    duration: "3 Years",
    modules: 10,
    facultyId: "faculty-2",
    facultyName: "Priya Verma",
    batchCount: 2,
    studentCount: 92,
    completionRate: 52,
    status: "Active",
    description: "Data analysis, statistics, and applied machine learning.",
  },
  {
    id: "course-003",
    name: "Business Administration",
    code: "BBA-301",
    category: "Management",
    level: "Undergraduate",
    duration: "3 Years",
    modules: 8,
    facultyId: "faculty-3",
    facultyName: "Amit Kumar",
    batchCount: 3,
    studentCount: 124,
    completionRate: 81,
    status: "Active",
    description: "Business fundamentals, leadership, and management.",
  },
  {
    id: "course-004",
    name: "Applied Mathematics",
    code: "MTH-104",
    category: "Science",
    level: "Undergraduate",
    duration: "2 Years",
    modules: 9,
    facultyId: "faculty-1",
    facultyName: "Rahul Sharma",
    batchCount: 1,
    studentCount: 45,
    completionRate: 35,
    status: "Upcoming",
    description: "Mathematical foundations for technical disciplines.",
  },
  {
    id: "course-005",
    name: "Digital Marketing",
    code: "DM-405",
    category: "Management",
    level: "Certificate",
    duration: "6 Months",
    modules: 6,
    facultyId: "faculty-2",
    facultyName: "Priya Verma",
    batchCount: 2,
    studentCount: 64,
    completionRate: 92,
    status: "Completed",
    description: "Digital strategy, content, and marketing analytics.",
  },
];

const EMPTY_EDIT_FORM = {
  name: "",
  code: "",
  category: "Engineering",
  level: "Undergraduate",
  duration: "",
  modules: 1,
  facultyId: "",
  description: "",
  status: "Active",
};

export default function Courses({ onViewCourse }) {
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [faculty] = useState(DEMO_FACULTY);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_EDIT_FORM);
  const [editError, setEditError] = useState("");

  const stats = useMemo(() => {
    return {
      total: courses.length,
      students: courses.reduce(
        (total, course) => total + (Number(course.studentCount) || 0),
        0
      ),
      batches: courses.reduce(
        (total, course) => total + (Number(course.batchCount) || 0),
        0
      ),
      active: courses.filter(
        (course) => course.status === "Active"
      ).length,
    };
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesSearch =
        course.name.toLowerCase().includes(query) ||
        course.code.toLowerCase().includes(query) ||
        (course.facultyName || "").toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "All" || course.category === categoryFilter;

      const matchesLevel =
        levelFilter === "All" || course.level === levelFilter;

      const matchesStatus =
        statusFilter === "All" || course.status === statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLevel &&
        matchesStatus
      );
    });
  }, [courses, search, categoryFilter, levelFilter, statusFilter]);

  const handleAddCourse = async (newCourse) => {
    setCourses((current) => [newCourse, ...current]);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setEditError("");
    setEditForm({
      name: course.name || "",
      code: course.code || "",
      category: course.category || "Engineering",
      level: course.level || "Undergraduate",
      duration: course.duration || "",
      modules: course.modules || 1,
      facultyId: course.facultyId || "",
      description: course.description || "",
      status: course.status || "Active",
    });
  };

  const saveEditedCourse = (event) => {
    event.preventDefault();

    if (!editForm.name.trim() || !editForm.code.trim()) {
      setEditError("Course name and course code are required.");
      return;
    }

    const selectedFaculty = faculty.find(
      (member) => member.id === editForm.facultyId
    );

    setCourses((current) =>
      current.map((course) =>
        course.id === editingCourse.id
          ? {
              ...course,
              ...editForm,
              name: editForm.name.trim(),
              code: editForm.code.trim().toUpperCase(),
              modules: Number(editForm.modules) || 0,
              facultyName: selectedFaculty?.name || "Not assigned",
            }
          : course
      )
    );

    setEditingCourse(null);
  };

  const handleDeleteCourse = (course) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.name}"?`
    );

    if (!confirmed) return;

    setCourses((current) =>
      current.filter((item) => item.id !== course.id)
    );
  };

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("All");
    setLevelFilter("All");
    setStatusFilter("All");
  };

  const hasActiveFilters =
    search || categoryFilter !== "All" ||
    levelFilter !== "All" || statusFilter !== "All";

  return (
    <div className="institute-courses-page">
      <div className="institute-courses-heading">
        <div>
          <span className="institute-eyebrow">ACADEMIC MANAGEMENT</span>
          <h1>Courses</h1>
          <p>Manage academic programs, course details, and faculty assignments.</p>
        </div>

        <button
          type="button"
          className="institute-courses-add-button"
          onClick={() => setAddModalOpen(true)}
        >
          <Plus size={17} />
          Add new course
        </button>
      </div>

      <div className="institute-courses-stats">
        <div className="institute-courses-stat">
          <span className="institute-courses-stat-icon blue">
            <BookOpen size={20} />
          </span>
          <div>
            <strong>{stats.total}</strong>
            <span>Total courses</span>
          </div>
        </div>

        <div className="institute-courses-stat">
          <span className="institute-courses-stat-icon violet">
            <Users size={20} />
          </span>
          <div>
            <strong>{stats.students.toLocaleString("en-IN")}</strong>
            <span>Enrolled students</span>
          </div>
        </div>

        <div className="institute-courses-stat">
          <span className="institute-courses-stat-icon orange">
            <Layers3 size={20} />
          </span>
          <div>
            <strong>{stats.batches}</strong>
            <span>Total batches</span>
          </div>
        </div>

        <div className="institute-courses-stat">
          <span className="institute-courses-stat-icon green">
            <GraduationCap size={20} />
          </span>
          <div>
            <strong>{stats.active}</strong>
            <span>Active courses</span>
          </div>
        </div>
      </div>

      <section className="institute-courses-content">
        <div className="institute-courses-toolbar">
          <div className="institute-courses-toolbar-title">
            <div>
              <h2>Course catalogue</h2>
              <p>
                Showing {filteredCourses.length} of {courses.length} courses
              </p>
            </div>
          </div>

          <div className="institute-courses-controls">
            <div className="institute-courses-search">
              <Search size={17} />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search courses, code or faculty..."
              />
            </div>

            <label className="institute-courses-filter">
              <Filter size={15} />
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                aria-label="Filter by category"
              >
                <option value="All">All categories</option>
                <option value="Engineering">Engineering</option>
                <option value="Science">Science</option>
                <option value="Commerce">Commerce</option>
                <option value="Arts & Humanities">Arts & Humanities</option>
                <option value="Management">Management</option>
                <option value="Technology">Technology</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <select
              className="institute-courses-select"
              value={levelFilter}
              onChange={(event) => setLevelFilter(event.target.value)}
              aria-label="Filter by level"
            >
              <option value="All">All levels</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="Diploma">Diploma</option>
              <option value="Certificate">Certificate</option>
              <option value="Professional">Professional</option>
            </select>

            <select
              className="institute-courses-select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="institute-courses-filter-summary">
            <span>Filters applied</span>
            <button type="button" onClick={clearFilters}>
              Clear all <X size={13} />
            </button>
          </div>
        )}

        {filteredCourses.length > 0 ? (
          <div className="institute-courses-grid">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onView={(selectedCourse) => {
                  if (onViewCourse) {
                    onViewCourse(selectedCourse);
                  } else {
                    window.alert(
                      `Course details for "${selectedCourse.name}" can be connected to the Course Details page.`
                    );
                  }
                }}
                onEdit={openEditModal}
                onDelete={handleDeleteCourse}
              />
            ))}
          </div>
        ) : (
          <div className="institute-courses-empty">
            <span><BookOpen size={28} /></span>
            <h3>No courses found</h3>
            <p>
              {courses.length === 0
                ? "Your course catalogue is empty. Add your first course to get started."
                : "Try changing your search or filters to find a course."}
            </p>
            {hasActiveFilters ? (
              <button type="button" onClick={clearFilters}>
                Clear filters
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAddModalOpen(true)}
              >
                <Plus size={15} /> Add your first course
              </button>
            )}
          </div>
        )}
      </section>

      <AddCourseModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleAddCourse}
        faculty={faculty}
      />

      {editingCourse && (
        <div
          className="institute-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setEditingCourse(null);
            }
          }}
        >
          <form
            className="institute-modal institute-course-edit-modal"
            onSubmit={saveEditedCourse}
          >
            <div className="institute-modal-header">
              <div>
                <span className="institute-modal-icon">
                  <BookOpen size={19} />
                </span>
                <div>
                  <h2 className="institute-modal-heading">Edit course</h2>
                  <p>Update the academic course information.</p>
                </div>
              </div>

              <button
                type="button"
                className="institute-modal-close"
                onClick={() => setEditingCourse(null)}
              >
                <X size={19} />
              </button>
            </div>

            <div className="institute-modal-body">
              <div className="institute-form-section">
                <div className="institute-form-grid">
                  <label className="institute-form-field">
                    Course name *
                    <input
                      required
                      value={editForm.name}
                      onChange={(event) =>
                        setEditForm({ ...editForm, name: event.target.value })
                      }
                    />
                  </label>

                  <label className="institute-form-field">
                    Course code *
                    <input
                      required
                      value={editForm.code}
                      onChange={(event) =>
                        setEditForm({ ...editForm, code: event.target.value })
                      }
                    />
                  </label>

                  <label className="institute-form-field">
                    Category
                    <select
                      value={editForm.category}
                      onChange={(event) =>
                        setEditForm({ ...editForm, category: event.target.value })
                      }
                    >
                      <option>Engineering</option>
                      <option>Science</option>
                      <option>Commerce</option>
                      <option>Arts & Humanities</option>
                      <option>Management</option>
                      <option>Technology</option>
                      <option>Other</option>
                    </select>
                  </label>

                  <label className="institute-form-field">
                    Level
                    <select
                      value={editForm.level}
                      onChange={(event) =>
                        setEditForm({ ...editForm, level: event.target.value })
                      }
                    >
                      <option>Undergraduate</option>
                      <option>Postgraduate</option>
                      <option>Diploma</option>
                      <option>Certificate</option>
                      <option>Professional</option>
                    </select>
                  </label>

                  <label className="institute-form-field">
                    Duration
                    <input
                      value={editForm.duration}
                      onChange={(event) =>
                        setEditForm({ ...editForm, duration: event.target.value })
                      }
                      placeholder="e.g. 4 Years"
                    />
                  </label>

                  <label className="institute-form-field">
                    Number of modules
                    <input
                      type="number"
                      min="1"
                      value={editForm.modules}
                      onChange={(event) =>
                        setEditForm({ ...editForm, modules: event.target.value })
                      }
                    />
                  </label>

                  <label className="institute-form-field">
                    Assigned faculty
                    <select
                      value={editForm.facultyId}
                      onChange={(event) =>
                        setEditForm({ ...editForm, facultyId: event.target.value })
                      }
                    >
                      <option value="">Not assigned</option>
                      {faculty.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="institute-form-field">
                    Status
                    <select
                      value={editForm.status}
                      onChange={(event) =>
                        setEditForm({ ...editForm, status: event.target.value })
                      }
                    >
                      <option>Active</option>
                      <option>Upcoming</option>
                      <option>Completed</option>
                      <option>Inactive</option>
                    </select>
                  </label>

                  <label className="institute-form-field institute-form-full">
                    Description
                    <textarea
                      rows={3}
                      value={editForm.description}
                      onChange={(event) =>
                        setEditForm({
                          ...editForm,
                          description: event.target.value,
                        })
                      }
                    />
                  </label>
                </div>

                {editError && (
                  <p className="institute-course-edit-error">{editError}</p>
                )}
              </div>
            </div>

            <div className="institute-modal-footer">
              <button
                type="button"
                className="institute-btn-secondary"
                onClick={() => setEditingCourse(null)}
              >
                Cancel
              </button>
              <button type="submit" className="institute-btn-primary">
                <Save size={15} />
                Save changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
