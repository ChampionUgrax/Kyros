
import { useState } from "react";
import {
  BookOpen,
  Users,
  GraduationCap,
  MoreHorizontal,
  Eye,
  Edit3,
  Trash2,
  Clock3,
  Layers3,
  TrendingUp,
  X,
} from "lucide-react";

export default function CourseCard({
  course,
  onView,
  onEdit,
  onDelete,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  if (!course) return null;

  const {
    name = "Untitled Course",
    code = "N/A",
    category = "General",
    level = "Undergraduate",
    duration = "N/A",
    facultyName = "Not assigned",
    batchCount = 0,
    studentCount = 0,
    completionRate = 0,
    status = "Active",
    description = "",
    modules = 0,
  } = course;

  const normalizedStatus = status.toLowerCase();
  const safeCompletion = Math.min(
    100,
    Math.max(0, Number(completionRate) || 0)
  );

  const handleAction = (callback) => {
    setMenuOpen(false);
    callback?.(course);
  };

  return (
    <article className="institute-course-card">
      <div className="institute-course-card-top">
        <div className="institute-course-card-icon">
          <BookOpen size={21} />
        </div>

        <div className="institute-course-card-menu-wrapper">
          <button
            type="button"
            className="institute-course-card-menu-button"
            aria-label="Course actions"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <MoreHorizontal size={19} />
          </button>

          {menuOpen && (
            <>
              <button
                type="button"
                className="institute-course-menu-backdrop"
                aria-label="Close course menu"
                onClick={() => setMenuOpen(false)}
              />

              <div className="institute-course-card-menu">
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
                  <Edit3 size={15} />
                  Edit course
                </button>

                <button
                  type="button"
                  className="danger"
                  onClick={() => handleAction(onDelete)}
                >
                  <Trash2 size={15} />
                  Delete course
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="institute-course-card-heading">
        <div className="institute-course-card-code">{code}</div>

        <h3 title={name}>{name}</h3>

        {description && (
          <p className="institute-course-card-description">
            {description}
          </p>
        )}
      </div>

      <div className="institute-course-card-tags">
        <span>{category}</span>
        <span>{level}</span>
        <span className={`institute-course-status ${normalizedStatus}`}>
          {status}
        </span>
      </div>

      <div className="institute-course-card-faculty">
        <span className="institute-course-faculty-avatar">
          {facultyName
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase() || "NA"}
        </span>

        <div>
          <span>Course faculty</span>
          <strong>{facultyName}</strong>
        </div>
      </div>

      <div className="institute-course-card-metrics">
        <div>
          <Layers3 size={16} />
          <strong>{batchCount}</strong>
          <span>Batches</span>
        </div>

        <div>
          <Users size={16} />
          <strong>{studentCount}</strong>
          <span>Students</span>
        </div>

        <div>
          <GraduationCap size={17} />
          <strong>{modules}</strong>
          <span>Modules</span>
        </div>
      </div>

      <div className="institute-course-card-progress">
        <div className="institute-course-progress-heading">
          <span>Course completion</span>
          <strong>{safeCompletion}%</strong>
        </div>

        <div className="institute-course-progress-track">
          <div
            className="institute-course-progress-fill"
            style={{ width: `${safeCompletion}%` }}
          />
        </div>
      </div>

      <div className="institute-course-card-bottom">
        <span className="institute-course-duration">
          <Clock3 size={14} />
          {duration}
        </span>

        <button
          type="button"
          className="institute-course-view-button"
          onClick={() => handleAction(onView)}
        >
          View course
          <TrendingUp size={14} />
        </button>
      </div>
    </article>
  );
}
