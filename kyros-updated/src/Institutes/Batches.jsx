
import { useMemo, useState } from "react";
import BatchCard from "./BatchCard.jsx";
import {
  Layers3,
  Users,
  CheckCircle2,
  Clock3,
  Search,
  Plus,
  SlidersHorizontal,
  X,
  CalendarDays,
  GraduationCap,
  BookOpen,
  UserRound,
  Pencil,
  Trash2,
  Eye,
  Building2,
} from "lucide-react";

import AddBatchModal from "./AddBatchModel.jsx";

const INITIAL_COURSES = [
  { id: "course-1", name: "Computer Science Engineering", code: "CSE" },
  { id: "course-2", name: "Information Technology", code: "IT" },
  { id: "course-3", name: "Mechanical Engineering", code: "ME" },
  { id: "course-4", name: "Electronics Engineering", code: "ECE" },
];

const INITIAL_FACULTY = [
  { id: "faculty-1", name: "Rahul Sharma" },
  { id: "faculty-2", name: "Priya Mehta" },
  { id: "faculty-3", name: "Amit Verma" },
  { id: "faculty-4", name: "Neha Gupta" },
];

const INITIAL_BATCHES = [
  {
    id: "batch-001",
    name: "B.Tech CSE - A",
    code: "CSE-A-2026",
    courseId: "course-1",
    courseName: "Computer Science Engineering",
    facultyId: "faculty-1",
    facultyName: "Rahul Sharma",
    academicYear: "2026-27",
    startDate: "2026-08-01",
    endDate: "2027-05-31",
    studentCount: 42,
    capacity: 60,
    status: "Active",
    description: "First-year Computer Science batch.",
  },
  {
    id: "batch-002",
    name: "B.Tech CSE - B",
    code: "CSE-B-2026",
    courseId: "course-1",
    courseName: "Computer Science Engineering",
    facultyId: "faculty-2",
    facultyName: "Priya Mehta",
    academicYear: "2026-27",
    startDate: "2026-08-01",
    endDate: "2027-05-31",
    studentCount: 38,
    capacity: 60,
    status: "Active",
    description: "First-year Computer Science batch.",
  },
  {
    id: "batch-003",
    name: "B.Tech IT - A",
    code: "IT-A-2026",
    courseId: "course-2",
    courseName: "Information Technology",
    facultyId: "faculty-3",
    facultyName: "Amit Verma",
    academicYear: "2026-27",
    startDate: "2026-08-01",
    endDate: "2027-05-31",
    studentCount: 35,
    capacity: 50,
    status: "Active",
    description: "First-year Information Technology batch.",
  },
  {
    id: "batch-004",
    name: "B.Tech Mechanical - A",
    code: "ME-A-2026",
    courseId: "course-3",
    courseName: "Mechanical Engineering",
    facultyId: "faculty-4",
    facultyName: "Neha Gupta",
    academicYear: "2026-27",
    startDate: "2026-11-15",
    endDate: "2027-05-31",
    studentCount: 0,
    capacity: 50,
    status: "Upcoming",
    description: "Upcoming Mechanical Engineering batch.",
  },
  {
    id: "batch-005",
    name: "B.Tech ECE - A",
    code: "ECE-A-2025",
    courseId: "course-4",
    courseName: "Electronics Engineering",
    facultyId: "faculty-2",
    facultyName: "Priya Mehta",
    academicYear: "2025-26",
    startDate: "2025-08-01",
    endDate: "2026-05-31",
    studentCount: 45,
    capacity: 50,
    status: "Completed",
    description: "Previous academic-year ECE batch.",
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

function StatCard({ icon: Icon, label, value, helper, tone }) {
  return (
    <div className="institute-batches-stat">
      <div className={`institute-batches-stat-icon ${tone}`}>
        <Icon size={21} />
      </div>
      <div className="institute-batches-stat-info">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{helper}</small>
      </div>
    </div>
  );
}

export default function Batches() {
  const [batches, setBatches] = useState(INITIAL_BATCHES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const stats = useMemo(() => {
    const active = batches.filter((batch) => batch.status === "Active").length;
    const upcoming = batches.filter(
      (batch) => batch.status === "Upcoming"
    ).length;
    const totalStudents = batches.reduce(
      (sum, batch) => sum + Number(batch.studentCount || 0),
      0
    );

    return {
      total: batches.length,
      active,
      upcoming,
      students: totalStudents,
    };
  }, [batches]);

  const filteredBatches = useMemo(() => {
    let result = [...batches];

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter(
        (batch) =>
          batch.name?.toLowerCase().includes(query) ||
          batch.code?.toLowerCase().includes(query) ||
          batch.facultyName?.toLowerCase().includes(query) ||
          batch.courseName?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((batch) => batch.status === statusFilter);
    }

    if (courseFilter !== "All") {
      result = result.filter((batch) => batch.courseId === courseFilter);
    }

    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "students") {
      result.sort((a, b) => b.studentCount - a.studentCount);
    } else {
      result.sort(
        (a, b) => new Date(b.startDate || 0) - new Date(a.startDate || 0)
      );
    }

    return result;
  }, [batches, search, statusFilter, courseFilter, sortBy]);

  const handleAddBatch = async (newBatch) => {
    setBatches((current) => [newBatch, ...current]);
    setIsAddModalOpen(false);
  };

  const handleEditBatch = (batch) => {
    const updatedName = window.prompt(
      "Enter the updated batch name:",
      batch.name
    );

    if (!updatedName?.trim()) return;

    setBatches((current) =>
      current.map((item) =>
        item.id === batch.id
          ? { ...item, name: updatedName.trim() }
          : item
      )
    );
  };

  const handleDeleteBatch = (batch) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${batch.name}"?`
    );

    if (!confirmed) return;

    setBatches((current) =>
      current.filter((item) => item.id !== batch.id)
    );

    if (selectedBatch?.id === batch.id) {
      setSelectedBatch(null);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setCourseFilter("All");
    setSortBy("newest");
  };

  return (
    <div className="institute-batches-page">
      <section className="institute-batches-heading">
        <div>
          <div className="institute-batches-eyebrow">
            <Building2 size={14} />
            Academic management
          </div>
          <h1>Batch Management</h1>
          <p>
            Create and manage academic batches, assign faculty, and keep track
            of student capacity.
          </p>
        </div>

        <button
          className="institute-batches-add-btn"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={18} />
          Create new batch
        </button>
      </section>

      <section className="institute-batches-stats">
        <StatCard
          icon={Layers3}
          label="Total batches"
          value={stats.total}
          helper="Across all courses"
          tone="blue"
        />
        <StatCard
          icon={CheckCircle2}
          label="Active batches"
          value={stats.active}
          helper="Currently running"
          tone="green"
        />
        <StatCard
          icon={Clock3}
          label="Upcoming batches"
          value={stats.upcoming}
          helper="Scheduled to start"
          tone="orange"
        />
        <StatCard
          icon={Users}
          label="Total students"
          value={stats.students}
          helper="Across all batches"
          tone="purple"
        />
      </section>

      <section className="institute-batches-toolbar">
        <div className="institute-batches-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by batch, code, course or faculty..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearch("")}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="institute-batches-filters">
          <label>
            <SlidersHorizontal size={16} />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>

          <label>
            <BookOpen size={16} />
            <select
              value={courseFilter}
              onChange={(event) => setCourseFilter(event.target.value)}
            >
              <option value="All">All courses</option>
              {INITIAL_COURSES.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </label>

          <select
            className="institute-batches-sort"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            aria-label="Sort batches"
          >
            <option value="newest">Sort: Recent first</option>
            <option value="name">Sort: Name A–Z</option>
            <option value="students">Sort: Most students</option>
          </select>
        </div>
      </section>

      <section className="institute-batches-results">
        <div className="institute-batches-results-heading">
          <div>
            <h2>All batches</h2>
            <p>
              Showing {filteredBatches.length} of {batches.length} batches
            </p>
          </div>

          {(search ||
            statusFilter !== "All" ||
            courseFilter !== "All" ||
            sortBy !== "newest") && (
            <button
              className="institute-batches-clear"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}
        </div>

        {filteredBatches.length > 0 ? (
          <div className="institute-batches-grid">
            {filteredBatches.map((batch) => (
              <BatchCard
                key={batch.id}
                batch={batch}
                onView={setSelectedBatch}
                onEdit={handleEditBatch}
                onDelete={handleDeleteBatch}
              />
            ))}
          </div>
        ) : (
          <div className="institute-batches-empty">
            <div className="institute-batches-empty-icon">
              <Layers3 size={28} />
            </div>
            <h3>No batches found</h3>
            <p>
              Try changing your search or filters, or create a new batch.
            </p>
            <button onClick={clearFilters}>Clear filters</button>
          </div>
        )}
      </section>

      <AddBatchModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddBatch}
        courses={INITIAL_COURSES}
        faculty={INITIAL_FACULTY}
      />

      {selectedBatch && (
        <div
          className="institute-batch-details-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedBatch(null);
            }
          }}
        >
          <div
            className="institute-batch-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="batch-details-title"
          >
            <div className="institute-batch-details-header">
              <div>
                <span>Batch overview</span>
                <h2 id="batch-details-title">{selectedBatch.name}</h2>
                <p>{selectedBatch.code}</p>
              </div>
              <button
                onClick={() => setSelectedBatch(null)}
                aria-label="Close batch details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="institute-batch-details-status">
              <span
                className={`institute-batch-status-pill ${selectedBatch.status?.toLowerCase()}`}
              >
                {selectedBatch.status}
              </span>
              <span>{selectedBatch.academicYear}</span>
            </div>

            <div className="institute-batch-details-grid">
              <div>
                <BookOpen size={18} />
                <span>Course</span>
                <strong>{selectedBatch.courseName || "Not assigned"}</strong>
              </div>
              <div>
                <UserRound size={18} />
                <span>Faculty</span>
                <strong>{selectedBatch.facultyName || "Not assigned"}</strong>
              </div>
              <div>
                <Users size={18} />
                <span>Students</span>
                <strong>
                  {selectedBatch.studentCount} / {selectedBatch.capacity}
                </strong>
              </div>
              <div>
                <GraduationCap size={18} />
                <span>Available seats</span>
                <strong>
                  {Math.max(
                    0,
                    Number(selectedBatch.capacity || 0) -
                      Number(selectedBatch.studentCount || 0)
                  )}
                </strong>
              </div>
              <div>
                <CalendarDays size={18} />
                <span>Start date</span>
                <strong>{formatDate(selectedBatch.startDate)}</strong>
              </div>
              <div>
                <CalendarDays size={18} />
                <span>End date</span>
                <strong>{formatDate(selectedBatch.endDate)}</strong>
              </div>
            </div>

            {selectedBatch.description && (
              <div className="institute-batch-details-description">
                <span>Description</span>
                <p>{selectedBatch.description}</p>
              </div>
            )}

            <div className="institute-batch-details-footer">
              <button
                className="institute-batch-delete-btn"
                onClick={() => handleDeleteBatch(selectedBatch)}
              >
                <Trash2 size={16} />
                Delete batch
              </button>
              <button
                className="institute-batch-edit-btn"
                onClick={() => {
                  handleEditBatch(selectedBatch);
                  setSelectedBatch(null);
                }}
              >
                <Pencil size={16} />
                Edit name
              </button>
              <button
                className="institute-batch-close-btn"
                onClick={() => setSelectedBatch(null)}
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
