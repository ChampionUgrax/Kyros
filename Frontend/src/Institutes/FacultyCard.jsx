
import { useState } from "react";
import {
  Users,
  BookOpen,
  GraduationCap,
  BriefcaseBusiness,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Mail,
  Phone,
  X,
} from "lucide-react";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function FacultyCard({
  faculty,
  onView,
  onEdit,
  onDelete,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  if (!faculty) return null;

  const {
    name = "Unnamed Faculty",
    employeeId = "Not assigned",
    email = "",
    phone = "",
    department = "Department not assigned",
    specialization = "Not specified",
    qualification = "Not specified",
    experience = 0,
    courseNames = [],
    studentCount = 0,
    batchCount = 0,
    status = "Active",
  } = faculty;

  const normalizedStatus = status.toLowerCase().replace(/\s+/g, "-");

  const handleAction = (callback) => {
    setMenuOpen(false);
    callback?.(faculty);
  };

  return (
    <article className="institute-faculty-card">
      <div className="institute-faculty-card-top">
        <div className="institute-faculty-card-identity">
          <div className="institute-faculty-card-avatar">
            {getInitials(name)}
          </div>

          <div className="institute-faculty-card-person">
            <h3 title={name}>{name}</h3>
            <span>{employeeId}</span>
          </div>
        </div>

        <div className="institute-faculty-card-menu-wrap">
          <button
            type="button"
            className="institute-faculty-card-menu-trigger"
            aria-label="Faculty actions"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((previous) => !previous)}
          >
            <MoreHorizontal size={19} />
          </button>

          {menuOpen && (
            <>
              <button
                type="button"
                className="institute-faculty-card-menu-backdrop"
                aria-label="Close actions menu"
                onClick={() => setMenuOpen(false)}
              />

              <div className="institute-faculty-card-menu">
                <button
                  type="button"
                  onClick={() => handleAction(onView)}
                >
                  <Eye size={14} />
                  View profile
                </button>

                <button
                  type="button"
                  onClick={() => handleAction(onEdit)}
                >
                  <Pencil size={14} />
                  Edit faculty
                </button>

                <button
                  type="button"
                  className="danger"
                  onClick={() => handleAction(onDelete)}
                >
                  <Trash2 size={14} />
                  Delete faculty
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="institute-faculty-card-department">
        <span className="institute-faculty-card-department-icon">
          <GraduationCap size={14} />
        </span>
        <span title={department}>{department}</span>

        <span className={`institute-faculty-card-status ${normalizedStatus}`}>
          <span />
          {status}
        </span>
      </div>

      <div className="institute-faculty-card-specialization">
        <span>Specialization</span>
        <strong title={specialization}>{specialization}</strong>
      </div>

      <div className="institute-faculty-card-contact">
        {email && (
          <div title={email}>
            <Mail size={13} />
            <span>{email}</span>
          </div>
        )}

        {phone && (
          <div title={phone}>
            <Phone size={13} />
            <span>{phone}</span>
          </div>
        )}
      </div>

      <div className="institute-faculty-card-divider" />

      <div className="institute-faculty-card-metrics">
        <div>
          <span className="institute-faculty-card-metric-icon">
            <BookOpen size={14} />
          </span>
          <strong>{courseNames.length}</strong>
          <small>Courses</small>
        </div>

        <div>
          <span className="institute-faculty-card-metric-icon">
            <Users size={14} />
          </span>
          <strong>{studentCount}</strong>
          <small>Students</small>
        </div>

        <div>
          <span className="institute-faculty-card-metric-icon">
            <BriefcaseBusiness size={14} />
          </span>
          <strong>{experience}</strong>
          <small>Years exp.</small>
        </div>
      </div>

      <div className="institute-faculty-card-qualification">
        <span>Qualification</span>
        <strong>{qualification}</strong>
        <span className="institute-faculty-card-batch-count">
          {batchCount} {batchCount === 1 ? "batch" : "batches"}
        </span>
      </div>

      <div className="institute-faculty-card-footer">
        <button
          type="button"
          className="institute-faculty-card-view-btn"
          onClick={() => onView?.(faculty)}
        >
          <Eye size={14} />
          View profile
        </button>

        <button
          type="button"
          className="institute-faculty-card-edit-btn"
          aria-label={`Edit ${name}`}
          onClick={() => onEdit?.(faculty)}
        >
          <Pencil size={14} />
        </button>
      </div>
    </article>
  );
}
