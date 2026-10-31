
import { useEffect, useState } from "react";
import {
  Camera,
  UserRound,
  Mail,
  Phone,
  Building2,
  MapPin,
  BriefcaseBusiness,
  CalendarDays,
  ShieldCheck,
  Save,
  RotateCcw,
  Pencil,
  CheckCircle2,
} from "lucide-react";

const DEFAULT_PROFILE = {
  name: "Institute Administrator",
  email: "admin@kyros.edu",
  phone: "+91 98765 43210",
  designation: "Institute Administrator",
  department: "Administration",
  instituteName: "KYROS Learning Institute",
  instituteCode: "KYROS-2026",
  address: "Jaipur, Rajasthan, India",
  website: "www.kyros.edu",
  joinedDate: "October 2026",
  bio: "Managing academic operations, faculty coordination, and student development.",
};

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  designation: "",
  department: "",
  instituteName: "",
  instituteCode: "",
  address: "",
  website: "",
  bio: "",
};

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  type = "text",
  disabled = false,
  full = false,
}) {
  return (
    <div className={`institute-profile-field ${full ? "full" : ""}`}>
      <label htmlFor={`profile-${name}`}>{label}</label>
      <div className={`institute-profile-input-wrap ${disabled ? "disabled" : ""}`}>
        {Icon && <Icon size={16} />}
        <input
          id={`profile-${name}`}
          name={name}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="institute-profile-section-heading">
      <div className="institute-profile-section-icon">
        <Icon size={17} />
      </div>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function Profile({ user, onSave }) {
  const [profile, setProfile] = useState(() => ({
    ...DEFAULT_PROFILE,
    ...(user || {}),
  }));

  const [form, setForm] = useState(() => ({
    ...INITIAL_FORM,
    ...DEFAULT_PROFILE,
    ...(user || {}),
  }));

  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!avatarFile) return undefined;

    const previewUrl = URL.createObjectURL(avatarFile);
    setAvatar(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [avatarFile]);

  const initials = (profile.name || "Institute Admin")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setSaveMessage("");
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSaveMessage("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSaveMessage("Profile image must be smaller than 5 MB.");
      return;
    }

    setAvatarFile(file);
    setSaveMessage("");
  };

  const handleEdit = () => {
    setForm({ ...INITIAL_FORM, ...profile });
    setIsEditing(true);
    setSaveMessage("");
  };

  const handleCancel = () => {
    setForm({ ...INITIAL_FORM, ...profile });
    setAvatarFile(null);
    setAvatar(user?.avatar || profile.avatar || "");
    setIsEditing(false);
    setSaveMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      setSaveMessage("Name and email are required.");
      return;
    }

    const updatedProfile = {
      ...profile,
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      avatar,
    };

    try {
      setSaving(true);
      await onSave?.(updatedProfile, avatarFile);
      setProfile(updatedProfile);
      setIsEditing(false);
      setAvatarFile(null);
      setSaveMessage("Profile changes saved successfully.");
    } catch (error) {
      setSaveMessage(error?.message || "Unable to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="institute-profile-page">
      <div className="institute-profile-header">
        <div>
          <span className="institute-profile-eyebrow">ACCOUNT SETTINGS</span>
          <h1>My Profile</h1>
          <p>Manage your personal details and institute information.</p>
        </div>

        {!isEditing && (
          <button
            type="button"
            className="institute-profile-edit-btn"
            onClick={handleEdit}
          >
            <Pencil size={15} />
            Edit profile
          </button>
        )}
      </div>

      <div className="institute-profile-layout">
        <aside className="institute-profile-sidebar">
          <div className="institute-profile-identity-card">
            <div className="institute-profile-avatar-wrap">
              <div className="institute-profile-avatar">
                {avatar ? (
                  <img src={avatar} alt="Profile" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              {isEditing && (
                <label
                  className="institute-profile-camera"
                  htmlFor="institute-profile-photo"
                  title="Upload profile photo"
                >
                  <Camera size={15} />
                </label>
              )}

              <input
                id="institute-profile-photo"
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
                disabled={!isEditing}
              />
            </div>

            <h2>{profile.name}</h2>
            <p>{profile.designation}</p>

            <span className="institute-profile-status">
              <span />
              Active account
            </span>

            <div className="institute-profile-identity-divider" />

            <div className="institute-profile-identity-detail">
              <Mail size={15} />
              <span>{profile.email}</span>
            </div>

            <div className="institute-profile-identity-detail">
              <Building2 size={15} />
              <span>{profile.instituteName}</span>
            </div>

            <div className="institute-profile-identity-detail">
              <MapPin size={15} />
              <span>{profile.address}</span>
            </div>
          </div>

          <div className="institute-profile-security-card">
            <div className="institute-profile-security-icon">
              <ShieldCheck size={19} />
            </div>
            <div>
              <h4>Account security</h4>
              <p>Your administrator account is protected.</p>
              <span>Security settings can be managed separately.</span>
            </div>
          </div>
        </aside>

        <form className="institute-profile-content" onSubmit={handleSubmit}>
          <section className="institute-profile-section">
            <SectionHeader
              icon={UserRound}
              title="Personal information"
              description="Your basic contact and professional details."
            />

            <div className="institute-profile-fields">
              <Field
                label="Full name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                icon={UserRound}
                disabled={!isEditing}
              />

              <Field
                label="Email address"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email address"
                icon={Mail}
                type="email"
                disabled={!isEditing}
              />

              <Field
                label="Phone number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                icon={Phone}
                disabled={!isEditing}
              />

              <Field
                label="Designation"
                name="designation"
                value={form.designation}
                onChange={handleChange}
                placeholder="Your designation"
                icon={BriefcaseBusiness}
                disabled={!isEditing}
              />

              <Field
                label="Department"
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Your department"
                icon={Building2}
                disabled={!isEditing}
              />

              <Field
                label="Member since"
                name="joinedDate"
                value={form.joinedDate}
                icon={CalendarDays}
                disabled
              />

              <div className="institute-profile-field full">
                <label htmlFor="profile-bio">About</label>
                <textarea
                  id="profile-bio"
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Write a short introduction..."
                  rows={4}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </section>

          <section className="institute-profile-section">
            <SectionHeader
              icon={Building2}
              title="Institute information"
              description="The institution associated with your administrator account."
            />

            <div className="institute-profile-fields">
              <Field
                label="Institute name"
                name="instituteName"
                value={form.instituteName}
                onChange={handleChange}
                placeholder="Enter institute name"
                icon={Building2}
                disabled={!isEditing}
              />

              <Field
                label="Institute code"
                name="instituteCode"
                value={form.instituteCode}
                onChange={handleChange}
                placeholder="Enter institute code"
                icon={ShieldCheck}
                disabled={!isEditing}
              />

              <Field
                label="Website"
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="Institute website"
                icon={BriefcaseBusiness}
                disabled={!isEditing}
              />

              <Field
                label="Location"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="City, State, Country"
                icon={MapPin}
                disabled={!isEditing}
                full
              />
            </div>
          </section>

          {saveMessage && (
            <div
              className={`institute-profile-message ${
                saveMessage.includes("successfully") ? "success" : "error"
              }`}
              role="status"
            >
              {saveMessage.includes("successfully") && (
                <CheckCircle2 size={16} />
              )}
              {saveMessage}
            </div>
          )}

          {isEditing && (
            <div className="institute-profile-actions">
              <button
                type="button"
                className="institute-profile-cancel-btn"
                onClick={handleCancel}
                disabled={saving}
              >
                <RotateCcw size={15} />
                Cancel
              </button>

              <button
                type="submit"
                className="institute-profile-save-btn"
                disabled={saving}
              >
                <Save size={15} />
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
