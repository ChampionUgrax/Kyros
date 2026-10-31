
import { useState } from "react";
import {
  X,
  GraduationCap,
  UserRound,
  BriefcaseBusiness,
  BookOpen,
  Mail,
  Phone,
  Clock,
} from "lucide-react";

const INITIAL_FORM = {
  name: "",
  employeeId: "",
  email: "",
  phone: "",
  department: "",
  specialization: "",
  qualification: "",
  experience: "",
  courseIds: [],
  status: "Active",
  bio: "",
};

export default function AddFacultyModal({
  isOpen,
  onClose,
  onSave,
  courses = [],
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

  const handleCourseChange = (courseId) => {
    setForm((prev) => {
      const alreadySelected = prev.courseIds.includes(courseId);

      return {
        ...prev,
        courseIds: alreadySelected
          ? prev.courseIds.filter((id) => id !== courseId)
          : [...prev.courseIds, courseId],
      };
    });

    setErrors((prev) => ({
      ...prev,
      courseIds: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Faculty name is required.";
    }

    if (!form.employeeId.trim()) {
      newErrors.employeeId = "Employee ID is required.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\+?[0-9\s()-]{7,18}$/.test(form.phone.trim())) {
      newErrors.phone = "Enter a valid phone number.";
    }

    if (!form.department) {
      newErrors.department = "Please select a department.";
    }

    if (!form.specialization.trim()) {
      newErrors.specialization = "Specialization is required.";
    }

    if (!form.qualification) {
      newErrors.qualification = "Please select a qualification.";
    }

    if (
      form.experience === "" ||
      Number(form.experience) < 0 ||
      !Number.isFinite(Number(form.experience))
    ) {
      newErrors.experience = "Enter valid years of experience.";
    }

    if (form.courseIds.length === 0) {
      newErrors.courseIds = "Assign at least one course.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);

    const selectedCourses = courses.filter((course) =>
      form.courseIds.includes(String(course.id))
    );

    const newFaculty = {
      id: `faculty-${Date.now()}`,
      name: form.name.trim(),
      employeeId: form.employeeId.trim().toUpperCase(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      department: form.department,
      specialization: form.specialization.trim(),
      qualification: form.qualification,
      experience: Number(form.experience),
      courseIds: form.courseIds,
      courseNames: selectedCourses.map((course) => course.name),
      status: form.status,
      bio: form.bio.trim(),
      batchCount: 0,
      studentCount: 0,
      createdAt: new Date().toISOString(),
    };

    try {
      await onSave?.(newFaculty);

      setForm(INITIAL_FORM);
      setErrors({});
      onClose();
    } catch (error) {
      setErrors({
        submit: error.message || "Unable to add faculty member.",
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
        className="institute-modal institute-faculty-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-faculty-title"
      >
        {/* Header */}
        <div className="institute-modal-header">
          <div className="institute-modal-heading">
            <div className="institute-modal-icon">
              <GraduationCap size={22} />
            </div>

            <div>
              <h2 id="add-faculty-title">Add Faculty Member</h2>
              <p>
                Register a faculty member and assign their academic responsibilities.
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

            {/* Personal Information */}
            <div className="institute-form-section">
              <h3>
                <UserRound size={17} />
                Personal Information
              </h3>

              <div className="institute-form-grid">
                <div className="institute-form-field">
                  <label htmlFor="faculty-name">Full Name *</label>

                  <input
                    id="faculty-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                  />

                  {errors.name && (
                    <span className="institute-field-error">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="institute-form-field">
                  <label htmlFor="faculty-employee-id">
                    Employee ID *
                  </label>

                  <input
                    id="faculty-employee-id"
                    name="employeeId"
                    value={form.employeeId}
                    onChange={handleChange}
                    placeholder="e.g. FAC-2026-001"
                  />

                  {errors.employeeId && (
                    <span className="institute-field-error">
                      {errors.employeeId}
                    </span>
                  )}
                </div>

                <div className="institute-form-field">
                  <label htmlFor="faculty-email">
                    <Mail size={15} />
                    Email Address *
                  </label>

                  <input
                    id="faculty-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="faculty@institute.edu"
                  />

                  {errors.email && (
                    <span className="institute-field-error">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className="institute-form-field">
                  <label htmlFor="faculty-phone">
                    <Phone size={15} />
                    Phone Number *
                  </label>

                  <input
                    id="faculty-phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                  />

                  {errors.phone && (
                    <span className="institute-field-error">
                      {errors.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="institute-form-section">
              <h3>
                <BriefcaseBusiness size={17} />
                Professional Information
              </h3>

              <div className="institute-form-grid">
                <div className="institute-form-field">
                  <label htmlFor="faculty-department">
                    Department *
                  </label>

                  <select
                    id="faculty-department"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                  >
                    <option value="">Select department</option>
                    <option value="Computer Science">
                      Computer Science
                    </option>
                    <option value="Information Technology">
                      Information Technology
                    </option>
                    <option value="Electronics">
                      Electronics
                    </option>
                    <option value="Mechanical Engineering">
                      Mechanical Engineering
                    </option>
                    <option value="Civil Engineering">
                      Civil Engineering
                    </option>
                    <option value="Mathematics">
                      Mathematics
                    </option>
                    <option value="Physics">Physics</option>
                    <option value="Management">Management</option>
                    <option value="Other">Other</option>
                  </select>

                  {errors.department && (
                    <span className="institute-field-error">
                      {errors.department}
                    </span>
                  )}
                </div>

                <div className="institute-form-field">
                  <label htmlFor="faculty-specialization">
                    Specialization *
                  </label>

                  <input
                    id="faculty-specialization"
                    name="specialization"
                    value={form.specialization}
                    onChange={handleChange}
                    placeholder="e.g. Artificial Intelligence"
                  />

                  {errors.specialization && (
                    <span className="institute-field-error">
                      {errors.specialization}
                    </span>
                  )}
                </div>

                <div className="institute-form-field">
                  <label htmlFor="faculty-qualification">
                    Highest Qualification *
                  </label>

                  <select
                    id="faculty-qualification"
                    name="qualification"
                    value={form.qualification}
                    onChange={handleChange}
                  >
                    <option value="">Select qualification</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="MCA">MCA</option>
                    <option value="M.Sc">M.Sc</option>
                    <option value="MBA">MBA</option>
                    <option value="Ph.D">Ph.D</option>
                    <option value="Other">Other</option>
                  </select>

                  {errors.qualification && (
                    <span className="institute-field-error">
                      {errors.qualification}
                    </span>
                  )}
                </div>

                <div className="institute-form-field">
                  <label htmlFor="faculty-experience">
                    <Clock size={15} />
                    Experience (Years) *
                  </label>

                  <input
                    id="faculty-experience"
                    type="number"
                    name="experience"
                    min="0"
                    step="0.5"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="e.g. 5"
                  />

                  {errors.experience && (
                    <span className="institute-field-error">
                      {errors.experience}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Course Assignment */}
            <div className="institute-form-section">
              <h3>
                <BookOpen size={17} />
                Course Assignment
              </h3>

              <div className="institute-form-field">
                <label>Assign Courses *</label>

                {courses.length > 0 ? (
                  <div className="institute-course-checkbox-list">
                    {courses.map((course) => {
                      const courseId = String(course.id);
                      const checked = form.courseIds.includes(courseId);

                      return (
                        <label
                          key={course.id}
                          className={`institute-course-checkbox ${
                            checked ? "selected" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleCourseChange(courseId)}
                          />

                          <span className="institute-course-checkbox-info">
                            <strong>{course.name}</strong>
                            <small>
                              {course.code || "Course"}
                            </small>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <p className="institute-form-hint">
                    No courses available. Create a course before assigning it to faculty.
                  </p>
                )}

                {errors.courseIds && (
                  <span className="institute-field-error">
                    {errors.courseIds}
                  </span>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div className="institute-form-section">
              <h3>Additional Details</h3>

              <div className="institute-form-grid">
                <div className="institute-form-field">
                  <label htmlFor="faculty-status">
                    Employment Status
                  </label>

                  <select
                    id="faculty-status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="institute-form-field institute-form-full">
                  <label htmlFor="faculty-bio">
                    Short Bio (Optional)
                  </label>

                  <textarea
                    id="faculty-bio"
                    name="bio"
                    rows="3"
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="Write a short professional introduction..."
                  />
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
              disabled={saving || courses.length === 0}
            >
              {saving ? (
                <>
                  <Clock size={16} />
                  Adding...
                </>
              ) : (
                <>
                  <GraduationCap size={16} />
                  Add Faculty
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
