
import { useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  BriefcaseBusiness,
  GraduationCap,
  BookOpen,
  CalendarDays,
  Pencil,
  Check,
  X,
  ShieldCheck,
  Camera,
} from "lucide-react";

const INITIAL_PROFILE = {
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  phone: "",
  location: "",
  qualification: "",
  experience: "",
  subjects: "Mathematics, Physics",
  bio: "Passionate educator focused on helping students build strong concepts and develop problem-solving skills.",
};

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export default function MyProfile({ user }) {
  const [profile, setProfile] = useState(() => ({
    ...INITIAL_PROFILE,
    name: user?.name || INITIAL_PROFILE.name,
    email: user?.email || INITIAL_PROFILE.email,
  }));

  const [form, setForm] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleEdit = () => {
    setForm(profile);
    setSavedMessage("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setForm(profile);
    setIsEditing(false);
  };

  const handleSave = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      setSavedMessage("Name and email are required.");
      return;
    }

    setProfile(form);
    setIsEditing(false);
    setSavedMessage("Your profile changes have been saved in this session.");
  };

  const displayName = profile.name || "Teacher";
  const initials = getInitials(displayName) || "T";

  return (
    <main className="teacher-profile-page">
      <div className="teacher-profile-header">
        <div>
          <span className="teacher-profile-eyebrow">ACCOUNT</span>
          <h1>My Profile</h1>
          <p>Manage your personal information and teaching details.</p>
        </div>

        {!isEditing ? (
          <button className="teacher-profile-edit-btn" onClick={handleEdit}>
            <Pencil size={16} />
            Edit Profile
          </button>
        ) : (
          <button
            className="teacher-profile-cancel-btn"
            onClick={handleCancel}
          >
            <X size={16} />
            Cancel
          </button>
        )}
      </div>

      {savedMessage && (
        <div className="teacher-profile-message" role="status">
          {savedMessage}
        </div>
      )}

      <section className="teacher-profile-hero">
        <div className="teacher-profile-avatar-wrap">
          <div className="teacher-profile-avatar">{initials}</div>
          <span className="teacher-profile-online-dot" />
        </div>

        <div className="teacher-profile-hero-info">
          <h2>{displayName}</h2>
          <p>{profile.email}</p>
          <div className="teacher-profile-role">
            <GraduationCap size={14} />
            Teacher Account
          </div>
        </div>

        <div className="teacher-profile-verified">
          <ShieldCheck size={17} />
          <span>KYROS Member</span>
        </div>
      </section>

      <form onSubmit={handleSave}>
        <div className="teacher-profile-grid">
          <section className="teacher-profile-card">
            <div className="teacher-profile-card-heading">
              <div className="teacher-profile-card-icon">
                <UserRound size={19} />
              </div>
              <div>
                <h3>Personal Information</h3>
                <p>Your basic account details</p>
              </div>
            </div>

            <div className="teacher-profile-fields">
              <ProfileField
                label="Full Name"
                icon={<UserRound size={16} />}
                value={form.name}
                editing={isEditing}
                onChange={(value) => updateField("name", value)}
                placeholder="Enter your full name"
              />

              <ProfileField
                label="Email Address"
                icon={<Mail size={16} />}
                value={form.email}
                editing={isEditing}
                onChange={(value) => updateField("email", value)}
                placeholder="Enter your email"
                type="email"
              />

              <ProfileField
                label="Phone Number"
                icon={<Phone size={16} />}
                value={form.phone}
                editing={isEditing}
                onChange={(value) => updateField("phone", value)}
                placeholder="Add your phone number"
              />

              <ProfileField
                label="Location"
                icon={<MapPin size={16} />}
                value={form.location}
                editing={isEditing}
                onChange={(value) => updateField("location", value)}
                placeholder="City, State"
              />
            </div>
          </section>

          <section className="teacher-profile-card">
            <div className="teacher-profile-card-heading">
              <div className="teacher-profile-card-icon">
                <BookOpen size={19} />
              </div>
              <div>
                <h3>Teaching Information</h3>
                <p>Your professional teaching details</p>
              </div>
            </div>

            <div className="teacher-profile-fields">
              <ProfileField
                label="Highest Qualification"
                icon={<GraduationCap size={16} />}
                value={form.qualification}
                editing={isEditing}
                onChange={(value) => updateField("qualification", value)}
                placeholder="e.g. M.Sc. Mathematics"
              />

              <ProfileField
                label="Teaching Experience"
                icon={<BriefcaseBusiness size={16} />}
                value={form.experience}
                editing={isEditing}
                onChange={(value) => updateField("experience", value)}
                placeholder="e.g. 5 years"
              />

              <ProfileField
                label="Subjects"
                icon={<BookOpen size={16} />}
                value={form.subjects}
                editing={isEditing}
                onChange={(value) => updateField("subjects", value)}
                placeholder="e.g. Mathematics, Physics"
              />
            </div>
          </section>
        </div>

        <section className="teacher-profile-card teacher-profile-bio-card">
          <div className="teacher-profile-card-heading">
            <div className="teacher-profile-card-icon">
              <CalendarDays size={19} />
            </div>
            <div>
              <h3>About Me</h3>
              <p>A short introduction for your students</p>
            </div>
          </div>

          {isEditing ? (
            <textarea
              className="teacher-profile-textarea"
              value={form.bio}
              onChange={(event) => updateField("bio", event.target.value)}
              placeholder="Write a little about yourself..."
              rows={4}
            />
          ) : (
            <p className="teacher-profile-bio">
              {profile.bio || "You haven't added an introduction yet."}
            </p>
          )}
        </section>

        {isEditing && (
          <div className="teacher-profile-save-row">
            <button
              type="button"
              className="teacher-profile-cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button type="submit" className="teacher-profile-save-btn">
              <Check size={17} />
              Save Changes
            </button>
          </div>
        )}
      </form>
    </main>
  );
}

function ProfileField({
  label,
  icon,
  value,
  editing,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div className="teacher-profile-field">
      <label>{label}</label>

      {editing ? (
        <div className="teacher-profile-input-wrap">
          <span>{icon}</span>
          <input
            type={type}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
          />
        </div>
      ) : (
        <div className="teacher-profile-value">
          <span className="teacher-profile-value-icon">{icon}</span>
          <span>{value || "Not added yet"}</span>
        </div>
      )}
    </div>
  );
}
