
import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  MoreVertical,
  Pencil,
  Trash2,
  Users,
  Eye,
} from "lucide-react";
import { useState } from "react";

export default function BatchCard({
  batch,
  onView,
  onEdit,
  onDelete,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  if (!batch) return null;

  const studentCount = Number(batch.studentCount) || 0;
  const capacity = Number(batch.capacity) || 0;

  const occupancy = capacity
    ? Math.min(Math.round((studentCount / capacity) * 100), 100)
    : 0;

  const status = batch.status || "Upcoming";

  const statusClass = status.toLowerCase().replace(/\s+/g, "-");

  const initials = (batch.facultyName || "Unassigned")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  function handleAction(callback) {
    setMenuOpen(false);
    callback?.(batch);
  }

  return (
    <article className="institute-batch-card">
      <div className="institute-batch-card-header">
        <div className="institute-batch-card-icon">
          <GraduationCap size={22} />
        </div>

        <div className="institute-batch-card-menu-wrap">
          <button
            type="button"
            className="institute-batch-card-menu-button"
            aria-label="Batch actions"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <MoreVertical size={19} />
          </button>

          {menuOpen && (
            <>
              <button
                type="button"
                className="institute-batch-card-menu-backdrop"
                aria-label="Close batch menu"
                onClick={() => setMenuOpen(false)}
              />

              <div className="institute-batch-card-menu">
                <button
                  type="button"
                  onClick={() => handleAction(onView)}
                >
                  <Eye size={15} />
                  View details
                </button>

                <button
                  type="button"
                  onClick={() => handleAction(onEdit)}
                >
                  <Pencil size={15} />
                  Edit batch
                </button>

                <button
                  type="button"
                  className="danger"
                  onClick={() => handleAction(onDelete)}
                >
                  <Trash2 size={15} />
                  Delete batch
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="institute-batch-card-title-row">
        <div>
          <h3>{batch.name || "Untitled batch"}</h3>
          <span className="institute-batch-card-code">
            {batch.code || "No batch code"}
          </span>
        </div>

        <span className={`institute-batch-status ${statusClass}`}>
          {status}
        </span>
      </div>

      <div className="institute-batch-card-course">
        <BookOpen size={15} />
        <span>{batch.courseName || "Course not assigned"}</span>
      </div>

      <div className="institute-batch-card-faculty">
        <div className="institute-batch-card-faculty-avatar">
          {initials}
        </div>

        <div>
          <span>Assigned faculty</span>
          <strong>{batch.facultyName || "Not assigned"}</strong>
        </div>
      </div>

      <div className="institute-batch-card-divider" />

      <div className="institute-batch-card-stats">
        <div>
          <Users size={16} />
          <span>
            <strong>{studentCount}</strong> Students
          </span>
        </div>

        <div>
          <CalendarDays size={16} />
          <span>{batch.academicYear || "Academic year not set"}</span>
        </div>
      </div>

      <div className="institute-batch-card-capacity">
        <div className="institute-batch-card-capacity-label">
          <span>Batch capacity</span>
          <strong>
            {capacity ? `${studentCount}/${capacity}` : `${studentCount} enrolled`}
          </strong>
        </div>

        <div className="institute-batch-card-progress">
          <span
            style={{
              width: `${occupancy}%`,
            }}
          />
        </div>

        {capacity > 0 && (
          <small>{Math.max(capacity - studentCount, 0)} seats available</small>
        )}
      </div>

      <div className="institute-batch-card-footer">
        <button
          type="button"
          className="institute-batch-view-button"
          onClick={() => onView?.(batch)}
        >
          View batch
          <Eye size={15} />
        </button>

        <button
          type="button"
          className="institute-batch-edit-button"
          aria-label={`Edit ${batch.name || "batch"}`}
          onClick={() => onEdit?.(batch)}
        >
          <Pencil size={15} />
        </button>
      </div>
    </article>
  );
}
