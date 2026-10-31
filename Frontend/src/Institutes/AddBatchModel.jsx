
import { useState } from "react";
import {
  X,
  Layers,
  CalendarDays,
  Users,
  BookOpen,
  GraduationCap,
  Clock,
} from "lucide-react";

const INITIAL_FORM = {
  name: "",
  code: "",
  academicYear: "",
  courseId: "",
  facultyId: "",
  startDate: "",
  endDate: "",
  capacity: "40",
  description: "",
};

export default function AddBatchModal({
  isOpen,
  onClose,
  onSave,
  courses = [],
  faculty = [],
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Batch name is required.";
    }

    if (!form.code.trim()) {
      newErrors.code = "Batch code is required.";
    }

    if (!form.academicYear.trim()) {
      newErrors.academicYear = "Academic year is required.";
    }

    if (!form.courseId) {
      newErrors.courseId = "Please select a course.";
    }

    if (!form.facultyId) {
      newErrors.facultyId = "Please assign a faculty member.";
    }

    if (!form.startDate) {
      newErrors.startDate = "Start date is required.";
    }

    if (!form.endDate) {
      newErrors.endDate = "End date is required.";
    }

    if (
      form.startDate &&
      form.endDate &&
      form.endDate <= form.startDate
    ) {
      newErrors.endDate = "End date must be after the start date.";
    }

    if (
      !form.capacity ||
      Number(form.capacity) < 1 ||
      !Number.isInteger(Number(form.capacity))
    ) {
      newErrors.capacity = "Enter a valid capacity.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);

    const selectedCourse = courses.find(
      (course) => String(course.id) === form.courseId
    );

    const selectedFaculty = faculty.find(
      (member) => String(member.id) === form.facultyId
    );

    const newBatch = {
      id: `batch-${Date.now()}`,
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      academicYear: form.academicYear,
      courseId: form.courseId,
      courseName: selectedCourse?.name || "",
      facultyId: form.facultyId,
      facultyName: selectedFaculty?.name || "",
      startDate: form.startDate,
      endDate: form.endDate,
      capacity: Number(form.capacity),
      studentCount: 0,
      description: form.description.trim(),
      status: "Upcoming",
      createdAt: new Date().toISOString(),
    };

    try {
      await onSave?.(newBatch);
      setForm(INITIAL_FORM);
      setErrors({});
      onClose();
    } catch (error) {
      setErrors({
        submit: error.message || "Unable to create batch.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (saving) return;

    setForm(INITIAL_FORM);
    setErrors({});
    onClose();
  };

  return (
    <div
      className="institute-modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="institute-modal institute-batch-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-batch-title"
      >
        {/* Modal Header */}
        <div className="institute-modal-header">
          <div className="institute-modal-heading">
            <div className="institute-modal-icon">
              <Layers size={22} />
            </div>

            <div>
              <h2 id="add-batch-title">Create New Batch</h2>
              <p>
                Set up a batch and assign its course and faculty.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="institute-modal-close"
            onClick={handleClose}
            disabled={saving}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          <div className="institute-modal-body">

            {/* Basic Information */}
            <div className="institute-form-section">
              <h3>Basic Information</h3>

              <div className="institute-form-grid">
                <div className="institute-form-field">
                  <label htmlFor="batch-name">Batch Name *</label>
                  <input
                    id="batch-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. B.Tech CSE - Batch A"
                  />
                  {errors.name && (
                    <span className="institute-field-error">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="institute-form-field">
                  <label htmlFor="batch-code">Batch Code *</label>
                  <input
                    id="batch-code"
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="e.g. CSE-2026-A"
                  />
                  {errors.code && (
                    <span className="institute-field-error">
                      {errors.code}
                    </span>
                  )}
                </div>

                <div className="institute-form-field institute-form-full">
                  <label htmlFor="academic-year">Academic Year *</label>
                  <input
                    id="academic-year"
                    name="academicYear"
                    value={form.academicYear}
                    onChange={handleChange}
                    placeholder="e.g. 2026-2027"
                  />
                  {errors.academicYear && (
                    <span className="institute-field-error">
                      {errors.academicYear}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Course and Faculty */}
            <div className="institute-form-section">
              <h3>Academic Assignment</h3>

              <div className="institute-form-grid">
                <div className="institute-form-field">
                  <label htmlFor="batch-course">
                    <BookOpen size={15} />
                    Course *
                  </label>

                  <select
                    id="batch-course"
                    name="courseId"
                    value={form.courseId}
                    onChange={handleChange}
                  >
                    <option value="">Select course</option>

                    {courses.map((course) => (
                      <option
                        key={course.id}
                        value={String(course.id)}
                      >
                        {course.name}
                      </option>
                    ))}
                  </select>

                  {errors.courseId && (
                    <span className="institute-field-error">
                      {errors.courseId}
                    </span>
                  )}
                </div>

                <div className="institute-form-field">
                  <label htmlFor="batch-faculty">
                    <GraduationCap size={15} />
                    Faculty *
                  </label>

                  <select
                    id="batch-faculty"
                    name="facultyId"
                    value={form.facultyId}
                    onChange={handleChange}
                  >
                    <option value="">Assign faculty</option>

                    {faculty.map((member) => (
                      <option
                        key={member.id}
                        value={String(member.id)}
                      >
                        {member.name}
                      </option>
                    ))}
                  </select>

                  {errors.facultyId && (
                    <span className="institute-field-error">
                      {errors.facultyId}
                    </span>
                  )}
                </div>
              </div>

              {courses.length === 0 && (
                <p className="institute-form-hint">
                  No courses available. Add a course before creating a batch.
                </p>
              )}

              {faculty.length === 0 && (
                <p className="institute-form-hint">
                  No faculty available. Add a faculty member before assigning one.
                </p>
              )}
            </div>

            {/* Schedule */}
            <div className="institute-form-section">
              <h3>
                <CalendarDays size={17} />
                Batch Schedule
              </h3>

              <div className="institute-form-grid">
                <div className="institute-form-field">
                  <label htmlFor="batch-start">Start Date *</label>
                  <input
                    id="batch-start"
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                  />
                  {errors.startDate && (
                    <span className="institute-field-error">
                      {errors.startDate}
                    </span>
                  )}
                </div>

                <div className="institute-form-field">
                  <label htmlFor="batch-end">End Date *</label>
                  <input
                    id="batch-end"
                    type="date"
                    name="endDate"
                    min={form.startDate || undefined}
                    value={form.endDate}
                    onChange={handleChange}
                  />
                  {errors.endDate && (
                    <span className="institute-field-error">
                      {errors.endDate}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Capacity */}
            <div className="institute-form-section">
              <h3>
                <Users size={17} />
                Batch Capacity
              </h3>

              <div className="institute-form-field">
                <label htmlFor="batch-capacity">
                  Maximum Students *
                </label>

                <input
                  id="batch-capacity"
                  type="number"
                  name="capacity"
                  min="1"
                  value={form.capacity}
                  onChange={handleChange}
                  placeholder="40"
                />

                {errors.capacity && (
                  <span className="institute-field-error">
                    {errors.capacity}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="institute-form-section">
              <h3>Additional Details</h3>

              <div className="institute-form-field">
                <label htmlFor="batch-description">
                  Description (Optional)
                </label>

                <textarea
                  id="batch-description"
                  name="description"
                  rows="3"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Add a short description about this batch..."
                />
              </div>
            </div>

            {errors.submit && (
              <p className="institute-field-error">
                {errors.submit}
              </p>
            )}
          </div>

          {/* Modal Footer */}
          <div className="institute-modal-footer">
            <button
              type="button"
              className="institute-btn-secondary"
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="institute-btn-primary"
              disabled={saving || courses.length === 0 || faculty.length === 0}
            >
              {saving ? (
                <>
                  <Clock size={16} />
                  Creating...
                </>
              ) : (
                <>
                  <Layers size={16} />
                  Create Batch
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
