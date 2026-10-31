
import { useState } from "react";
import {
  X,
  UserRound,
  GraduationCap,
  Mail,
  Phone,
  Users,
  CalendarDays,
  Clock,
  BookOpen,
} from "lucide-react";

const INITIAL_FORM = {
  name: "",
  enrollmentId: "",
  email: "",
  phone: "",
  batchId: "",
  academicYear: "",
  semester: "",
  section: "",
  guardianName: "",
  guardianPhone: "",
  status: "Active",
};

export default function AddStudentModal({
  isOpen,
  onClose,
  onSave,
  batches = [],
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
      newErrors.name = "Student name is required.";
    }

    if (!form.enrollmentId.trim()) {
      newErrors.enrollmentId = "Enrollment ID is required.";
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

    if (!form.batchId) {
      newErrors.batchId = "Please select a batch.";
    }

    if (!form.academicYear.trim()) {
      newErrors.academicYear = "Academic year is required.";
    }

    if (!form.semester) {
      newErrors.semester = "Please select a semester.";
    }

    if (form.guardianPhone.trim() &&
      !/^\+?[0-9\s()-]{7,18}$/.test(form.guardianPhone.trim())) {
      newErrors.guardianPhone = "Enter a valid guardian phone number.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);

    const selectedBatch = batches.find(
      (batch) => String(batch.id) === form.batchId
    );

    const newStudent = {
      id: `student-${Date.now()}`,
      name: form.name.trim(),
      enrollmentId: form.enrollmentId.trim().toUpperCase(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      batchId: form.batchId,
      batchName: selectedBatch?.name || "",
      academicYear: form.academicYear.trim(),
      semester: form.semester,
      section: form.section.trim(),
      guardianName: form.guardianName.trim(),
      guardianPhone: form.guardianPhone.trim(),
      status: form.status,
      attendance: 0,
      performance: 0,
      createdAt: new Date().toISOString(),
    };

    try {
      await onSave?.(newStudent);

      setForm(INITIAL_FORM);
      setErrors({});
      onClose();
    } catch (error) {
      setErrors({
        submit: error.message || "Unable to add student.",
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
        className="institute-modal institute-student-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-student-title"
      >
        {/* Header */}
        <div className="institute-modal-header">
          <div className="institute-modal-heading">
            <div className="institute-modal-icon">
              <UserRound size={22} />
            </div>

            <div>
              <h2 id="add-student-title">Add New Student</h2>
              <p>
                Register a student and assign them to an academic batch.
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
                  <label htmlFor="student-name">Full Name *</label>

                  <input
                    id="student-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Aarav Sharma"
                  />

                  {errors.name && (
                    <span className="institute-field-error">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="institute-form-field">
                  <label htmlFor="student-enrollment">
                    Enrollment ID *
                  </label>

                  <input
                    id="student-enrollment"
                    name="enrollmentId"
                    value={form.enrollmentId}
                    onChange={handleChange}
                    placeholder="e.g. KYR2026001"
                  />

                  {errors.enrollmentId && (
                    <span className="institute-field-error">
                      {errors.enrollmentId}
                    </span>
                  )}
                </div>

                <div className="institute-form-field">
                  <label htmlFor="student-email">
                    <Mail size={15} />
                    Email Address *
                  </label>

                  <input
                    id="student-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="student@example.com"
                  />

                  {errors.email && (
                    <span className="institute-field-error">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className="institute-form-field">
                  <label htmlFor="student-phone">
                    <Phone size={15} />
                    Phone Number *
                  </label>

                  <input
                    id="student-phone"
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

            {/* Academic Information */}
            <div className="institute-form-section">
              <h3>
                <GraduationCap size={17} />
                Academic Information
              </h3>

              <div className="institute-form-grid">
                <div className="institute-form-field institute-form-full">
                  <label htmlFor="student-batch">
                    <Users size={15} />
                    Assign Batch *
                  </label>

                  <select
                    id="student-batch"
                    name="batchId"
                    value={form.batchId}
                    onChange={handleChange}
                  >
                    <option value="">Select batch</option>

                    {batches.map((batch) => (
                      <option
                        key={batch.id}
                        value={String(batch.id)}
                      >
                        {batch.name} ({batch.code || batch.id})
                      </option>
                    ))}
                  </select>

                  {errors.batchId && (
                    <span className="institute-field-error">
                      {errors.batchId}
                    </span>
                  )}

                  {batches.length === 0 && (
                    <p className="institute-form-hint">
                      Create a batch before registering students.
                    </p>
                  )}
                </div>

                <div className="institute-form-field">
                  <label htmlFor="student-academic-year">
                    <CalendarDays size={15} />
                    Academic Year *
                  </label>

                  <input
                    id="student-academic-year"
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

                <div className="institute-form-field">
                  <label htmlFor="student-semester">
                    <BookOpen size={15} />
                    Semester *
                  </label>

                  <select
                    id="student-semester"
                    name="semester"
                    value={form.semester}
                    onChange={handleChange}
                  >
                    <option value="">Select semester</option>
                    {Array.from({ length: 8 }, (_, index) => (
                      <option key={index + 1} value={String(index + 1)}>
                        Semester {index + 1}
                      </option>
                    ))}
                  </select>

                  {errors.semester && (
                    <span className="institute-field-error">
                      {errors.semester}
                    </span>
                  )}
                </div>

                <div className="institute-form-field">
                  <label htmlFor="student-section">
                    Section
                  </label>

                  <input
                    id="student-section"
                    name="section"
                    value={form.section}
                    onChange={handleChange}
                    placeholder="e.g. A"
                  />
                </div>
              </div>
            </div>

            {/* Guardian Information */}
            <div className="institute-form-section">
              <h3>
                <Users size={17} />
                Guardian Information
              </h3>

              <div className="institute-form-grid">
                <div className="institute-form-field">
                  <label htmlFor="guardian-name">
                    Guardian Name
                  </label>

                  <input
                    id="guardian-name"
                    name="guardianName"
                    value={form.guardianName}
                    onChange={handleChange}
                    placeholder="e.g. Rajesh Sharma"
                  />
                </div>

                <div className="institute-form-field">
                  <label htmlFor="guardian-phone">
                    Guardian Phone
                  </label>

                  <input
                    id="guardian-phone"
                    type="tel"
                    name="guardianPhone"
                    value={form.guardianPhone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                  />

                  {errors.guardianPhone && (
                    <span className="institute-field-error">
                      {errors.guardianPhone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Enrollment Status */}
            <div className="institute-form-section">
              <h3>
                <Clock size={17} />
                Enrollment Status
              </h3>

              <div className="institute-form-field">
                <label htmlFor="student-status">
                  Student Status
                </label>

                <select
                  id="student-status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </select>
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
              disabled={saving || batches.length === 0}
            >
              {saving ? (
                <>
                  <Clock size={16} />
                  Adding...
                </>
              ) : (
                <>
                  <UserRound size={16} />
                  Add Student
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
