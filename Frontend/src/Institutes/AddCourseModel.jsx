
import { useState } from "react";
import {
  X,
  BookOpen,
  GraduationCap,
  Clock,
  Layers,
  FileText,
} from "lucide-react";

const INITIAL_FORM = {
  name: "",
  code: "",
  category: "",
  level: "",
  duration: "",
  modules: "10",
  facultyId: "",
  description: "",
  status: "Active",
};

export default function AddCourseModal({
  isOpen,
  onClose,
  onSave,
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
      submit: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Course name is required.";
    }

    if (!form.code.trim()) {
      newErrors.code = "Course code is required.";
    }

    if (!form.category) {
      newErrors.category = "Please select a category.";
    }

    if (!form.level) {
      newErrors.level = "Please select an academic level.";
    }

    if (!form.duration.trim()) {
      newErrors.duration = "Course duration is required.";
    }

    if (
      !form.modules ||
      !Number.isInteger(Number(form.modules)) ||
      Number(form.modules) < 1
    ) {
      newErrors.modules = "Enter a valid number of modules.";
    }

    if (!form.facultyId) {
      newErrors.facultyId = "Please assign a faculty member.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);

    const selectedFaculty = faculty.find(
      (member) => String(member.id) === form.facultyId
    );

    const newCourse = {
      id: `course-${Date.now()}`,
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      category: form.category,
      level: form.level,
      duration: form.duration.trim(),
      modules: Number(form.modules),
      facultyId: form.facultyId,
      facultyName: selectedFaculty?.name || "",
      description: form.description.trim(),
      status: form.status,
      batchCount: 0,
      studentCount: 0,
      completionRate: 0,
      createdAt: new Date().toISOString(),
    };

    try {
      await onSave?.(newCourse);

      setForm(INITIAL_FORM);
      setErrors({});
      onClose();
    } catch (error) {
      setErrors({
        submit: error.message || "Unable to create course.",
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
        className="institute-modal institute-course-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-course-title"
      >
        {/* Header */}
        <div className="institute-modal-header">
          <div className="institute-modal-heading">
            <div className="institute-modal-icon">
              <BookOpen size={22} />
            </div>

            <div>
              <h2 id="add-course-title">Create New Course</h2>
              <p>
                Add a course to your institute's academic catalogue.
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

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="institute-modal-body">

            {/* Basic Details */}
            <div className="institute-form-section">
              <h3>
                <FileText size={17} />
                Course Information
              </h3>

              <div className="institute-form-grid">
                <div className="institute-form-field">
                  <label htmlFor="course-name">Course Name *</label>

                  <input
                    id="course-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science Engineering"
                  />

                  {errors.name && (
                    <span className="institute-field-error">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="institute-form-field">
                  <label htmlFor="course-code">Course Code *</label>

                  <input
                    id="course-code"
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="e.g. CSE-101"
                  />

                  {errors.code && (
                    <span className="institute-field-error">
                      {errors.code}
                    </span>
                  )}
                </div>

                <div className="institute-form-field">
                  <label htmlFor="course-category">Category *</label>

                  <select
                    id="course-category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option value="">Select category</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts & Humanities">
                      Arts & Humanities
                    </option>
                    <option value="Management">Management</option>
                    <option value="Technology">Technology</option>
                    <option value="Other">Other</option>
                  </select>

                  {errors.category && (
                    <span className="institute-field-error">
                      {errors.category}
                    </span>
                  )}
                </div>

                <div className="institute-form-field">
                  <label htmlFor="course-level">
                    <GraduationCap size={15} />
                    Academic Level *
                  </label>

                  <select
                    id="course-level"
                    name="level"
                    value={form.level}
                    onChange={handleChange}
                  >
                    <option value="">Select level</option>
                    <option value="Undergraduate">
                      Undergraduate
                    </option>
                    <option value="Postgraduate">
                      Postgraduate
                    </option>
                    <option value="Diploma">Diploma</option>
                    <option value="Certificate">Certificate</option>
                    <option value="Professional">
                      Professional
                    </option>
                  </select>

                  {errors.level && (
                    <span className="institute-field-error">
                      {errors.level}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Course Structure */}
            <div className="institute-form-section">
              <h3>
                <Layers size={17} />
                Course Structure
              </h3>

              <div className="institute-form-grid">
                <div className="institute-form-field">
                  <label htmlFor="course-duration">
                    <Clock size={15} />
                    Duration *
                  </label>

                  <input
                    id="course-duration"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="e.g. 4 Years or 6 Months"
                  />

                  {errors.duration && (
                    <span className="institute-field-error">
                      {errors.duration}
                    </span>
                  )}
                </div>

                <div className="institute-form-field">
                  <label htmlFor="course-modules">
                    Total Modules *
                  </label>

                  <input
                    id="course-modules"
                    type="number"
                    name="modules"
                    min="1"
                    value={form.modules}
                    onChange={handleChange}
                    placeholder="e.g. 10"
                  />

                  {errors.modules && (
                    <span className="institute-field-error">
                      {errors.modules}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Faculty Assignment */}
            <div className="institute-form-section">
              <h3>
                <GraduationCap size={17} />
                Faculty Assignment
              </h3>

              <div className="institute-form-field">
                <label htmlFor="course-faculty">
                  Course Coordinator *
                </label>

                <select
                  id="course-faculty"
                  name="facultyId"
                  value={form.facultyId}
                  onChange={handleChange}
                >
                  <option value="">Select faculty member</option>

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

                {faculty.length === 0 && (
                  <p className="institute-form-hint">
                    Add faculty members before assigning a course coordinator.
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="institute-form-section">
              <h3>Additional Details</h3>

              <div className="institute-form-grid">
                <div className="institute-form-field institute-form-full">
                  <label htmlFor="course-description">
                    Course Description
                  </label>

                  <textarea
                    id="course-description"
                    name="description"
                    rows="4"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the course, its objectives and learning outcomes..."
                  />
                </div>

                <div className="institute-form-field">
                  <label htmlFor="course-status">Course Status</label>

                  <select
                    id="course-status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>

            {errors.submit && (
              <p className="institute-field-error">
                {errors.submit}
              </p>
            )}
          </div>

          {/* Footer */}
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
              disabled={saving || faculty.length === 0}
            >
              {saving ? (
                <>
                  <Clock size={16} />
                  Creating...
                </>
              ) : (
                <>
                  <BookOpen size={16} />
                  Create Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
