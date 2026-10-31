
import { useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Mail,
  Phone,
  GraduationCap,
  Users,
  CalendarDays,
  TrendingUp,
  ClipboardCheck,
  ChevronRight,
  X,
} from "lucide-react";

function getInitials(name = "Student") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function normalizeStatus(status = "Active") {
  return status.toLowerCase().replace(/\s+/g, "-");
}

function ProgressMetric({ label, value, icon: Icon, type = "attendance" }) {
  const numericValue = Number(value);
  const safeValue = Number.isFinite(numericValue)
    ? Math.min(100, Math.max(0, numericValue))
    : 0;

  return (
    <div className="institute-student-metric">
      <div className="institute-student-metric-heading">
        <span>
          <Icon size={13} />
          {label}
        </span>
        <strong>{Number.isFinite(numericValue) ? `${numericValue}%` : "—"}</strong>
      </div>

      <div className={`institute-student-progress ${type}`}>
        <span style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}

export default function StudentCard({
  student,
  onView,
  onEdit,
  onDelete,
  selectable = false,
  selected = false,
  onSelect,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  if (!student) return null;

  const {
    name = "Unnamed Student",
    enrollmentId = student.id || "Not assigned",
    email = "No email available",
    phone = "Not provided",
    batchName = student.batch || "Unassigned batch",
    courseName = "Course not assigned",
    academicYear = "—",
    semester = "—",
    section = "—",
    attendance,
    performance,
    status = "Active",
    avatar,
    profileImage,
  } = student;

  const photo = avatar || profileImage;
  const attendanceValue =
    attendance === null || attendance === undefined ? null : Number(attendance);
  const performanceValue =
    performance === null || performance === undefined
      ? null
      : Number(performance);

  const handleAction = (callback) => {
    setMenuOpen(false);
    callback?.(student);
  };

  return (
    <article
      className={`institute-student-card ${
        selected ? "selected" : ""
      }`}
    >
      <div className="institute-student-card-top">
        {selectable && (
          <input
            type="checkbox"
            className="institute-student-select"
            checked={selected}
            onChange={(event) => onSelect?.(student, event.target.checked)}
            aria-label={`Select ${name}`}
          />
        )}

        <span
          className={`institute-student-status ${normalizeStatus(status)}`}
        >
          <span />
          {status}
        </span>

        <div className="institute-student-menu-wrap">
          <button
            type="button"
            className="institute-student-menu-trigger"
            onClick={() => setMenuOpen((previous) => !previous)}
            aria-label={`Actions for ${name}`}
            aria-expanded={menuOpen}
          >
            <MoreHorizontal size={18} />
          </button>

          {menuOpen && (
            <>
              <button
                type="button"
                className="institute-student-menu-dismiss"
                aria-label="Close actions menu"
                onClick={() => setMenuOpen(false)}
              />

              <div className="institute-student-action-menu">
                <button
                  type="button"
                  onClick={() => handleAction(onView)}
                >
                  <Eye size={14} />
                  View details
                </button>

                <button
                  type="button"
                  onClick={() => handleAction(onEdit)}
                >
                  <Pencil size={14} />
                  Edit student
                </button>

                <button
                  type="button"
                  className="danger"
                  onClick={() => handleAction(onDelete)}
                >
                  <Trash2 size={14} />
                  Delete student
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="institute-student-card-identity">
        <div className="institute-student-avatar">
          {photo ? (
            <img src={photo} alt={`${name}'s profile`} />
          ) : (
            <span>{getInitials(name)}</span>
          )}
        </div>

        <div className="institute-student-identity-copy">
          <h3 title={name}>{name}</h3>
          <span>{enrollmentId}</span>
        </div>
      </div>

      <div className="institute-student-contact">
        <div>
          <Mail size={14} />
          <span title={email}>{email}</span>
        </div>

        <div>
          <Phone size={14} />
          <span>{phone}</span>
        </div>
      </div>

      <div className="institute-student-academic">
        <div className="institute-student-academic-item">
          <div className="institute-student-academic-icon batch">
            <Users size={14} />
          </div>
          <div>
            <span>Batch</span>
            <strong title={batchName}>{batchName}</strong>
          </div>
        </div>

        <div className="institute-student-academic-item">
          <div className="institute-student-academic-icon course">
            <GraduationCap size={15} />
          </div>
          <div>
            <span>Course</span>
            <strong title={courseName}>{courseName}</strong>
          </div>
        </div>
      </div>

      <div className="institute-student-card-meta">
        <span>
          <CalendarDays size={13} />
          {academicYear}
        </span>
        <span>Semester {semester}</span>
        <span>Section {section}</span>
      </div>

      <div className="institute-student-card-metrics">
        <ProgressMetric
          label="Attendance"
          value={attendanceValue}
          icon={ClipboardCheck}
          type="attendance"
        />

        <ProgressMetric
          label="Performance"
          value={performanceValue}
          icon={TrendingUp}
          type="performance"
        />
      </div>

      <div className="institute-student-card-footer">
        <button
          type="button"
          className="institute-student-view-btn"
          onClick={() => onView?.(student)}
        >
          View profile
          <ChevronRight size={15} />
        </button>

        <button
          type="button"
          className="institute-student-edit-btn"
          onClick={() => onEdit?.(student)}
          aria-label={`Edit ${name}`}
          title="Edit student"
        >
          <Pencil size={14} />
        </button>
      </div>
    </article>
  );
}
