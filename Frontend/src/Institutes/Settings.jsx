
import { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  Building2,
  Palette,
  Bell,
  ShieldCheck,
  GraduationCap,
  Globe2,
  Clock3,
  CalendarDays,
  Save,
  RotateCcw,
  CheckCircle2,
  Sun,
  Moon,
  Monitor,
  LockKeyhole,
  Mail,
  Smartphone,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

const STORAGE_KEY = "kyros_institute_settings";

const DEFAULT_SETTINGS = {
  instituteName: "KYROS Learning Institute",
  instituteEmail: "admin@kyros.edu",
  language: "English",
  timezone: "Asia/Kolkata",
  dateFormat: "DD/MM/YYYY",
  theme: "light",
  compactMode: false,
  emailNotifications: true,
  announcementAlerts: true,
  attendanceAlerts: true,
  academicUpdates: true,
  securityAlerts: true,
  twoFactorEnabled: false,
  sessionTimeout: "30",
  academicYear: "2026-27",
  currentSemester: "Semester 1",
  attendanceThreshold: "75",
  lowPerformanceAlerts: true,
};

const SETTINGS_SECTIONS = [
  { id: "general", label: "General", icon: Building2 },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Privacy & Security", icon: ShieldCheck },
  { id: "academic", label: "Academic", icon: GraduationCap },
];

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
      : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function SettingsField({ label, description, children }) {
  return (
    <div className="institute-settings-field">
      <div className="institute-settings-field-copy">
        <label>{label}</label>
        {description && <p>{description}</p>}
      </div>
      <div className="institute-settings-field-control">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      className={`institute-settings-toggle ${checked ? "enabled" : ""}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  );
}

function SettingsSelect({ value, onChange, children, ariaLabel }) {
  return (
    <select
      className="institute-settings-select"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label={ariaLabel}
    >
      {children}
    </select>
  );
}

function SettingsCard({ title, description, children }) {
  return (
    <section className="institute-settings-card">
      <div className="institute-settings-card-heading">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
      <div className="institute-settings-card-content">{children}</div>
    </section>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState(loadSettings);
  const [activeSection, setActiveSection] = useState("general");
  const [savedMessage, setSavedMessage] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY) {
        setSettings(loadSettings());
        setHasChanges(false);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const updateSetting = (key, value) => {
    setSettings((previous) => ({ ...previous, [key]: value }));
    setHasChanges(true);
    setSavedMessage("");
  };

  const saveSettings = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setHasChanges(false);
      setSavedMessage("Your settings have been saved.");
    } catch {
      setSavedMessage("Unable to save settings in this browser.");
    }
  };

  const resetSettings = () => {
    const confirmed = window.confirm(
      "Reset all institute settings to their default values?"
    );

    if (!confirmed) return;

    setSettings({ ...DEFAULT_SETTINGS });
    setHasChanges(true);
    setSavedMessage("");
  };

  const renderGeneral = () => (
    <>
      <SettingsCard
        title="Institute details"
        description="Manage the basic information used across your workspace."
      >
        <SettingsField label="Institute name" description="Your institute's display name.">
          <input
            className="institute-settings-input"
            value={settings.instituteName}
            onChange={(e) => updateSetting("instituteName", e.target.value)}
            placeholder="Enter institute name"
          />
        </SettingsField>

        <SettingsField label="Administrator email" description="Email associated with institute administration.">
          <input
            className="institute-settings-input"
            type="email"
            value={settings.instituteEmail}
            onChange={(e) => updateSetting("instituteEmail", e.target.value)}
            placeholder="admin@example.com"
          />
        </SettingsField>
      </SettingsCard>

      <SettingsCard
        title="Regional preferences"
        description="Choose how dates, time and language appear in your workspace."
      >
        <SettingsField label="Language" description="Preferred workspace language.">
          <SettingsSelect
            value={settings.language}
            onChange={(value) => updateSetting("language", value)}
            ariaLabel="Workspace language"
          >
            <option>English</option>
            <option>Hindi</option>
          </SettingsSelect>
        </SettingsField>

        <SettingsField label="Timezone" description="Used for attendance records and scheduled activities.">
          <SettingsSelect
            value={settings.timezone}
            onChange={(value) => updateSetting("timezone", value)}
            ariaLabel="Timezone"
          >
            <option value="Asia/Kolkata">India Standard Time (IST)</option>
            <option value="Asia/Dubai">Gulf Standard Time</option>
            <option value="UTC">UTC</option>
          </SettingsSelect>
        </SettingsField>

        <SettingsField label="Date format">
          <SettingsSelect
            value={settings.dateFormat}
            onChange={(value) => updateSetting("dateFormat", value)}
            ariaLabel="Date format"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </SettingsSelect>
        </SettingsField>
      </SettingsCard>
    </>
  );

  const renderAppearance = () => (
    <>
      <SettingsCard
        title="Workspace theme"
        description="Choose your preferred visual appearance."
      >
        <div className="institute-settings-theme-options">
          {[
            { value: "light", label: "Light", icon: Sun },
            { value: "dark", label: "Dark", icon: Moon },
            { value: "system", label: "System", icon: Monitor },
          ].map(({ value, label, icon: Icon }) => (
            <button
              type="button"
              key={value}
              className={`institute-settings-theme-option ${
                settings.theme === value ? "selected" : ""
              }`}
              onClick={() => updateSetting("theme", value)}
            >
              <Icon size={21} />
              <span>{label}</span>
              {settings.theme === value && <CheckCircle2 size={15} />}
            </button>
          ))}
        </div>
        <p className="institute-settings-note">
          Theme selection is saved as a preference. Applying dark or system
          themes across the workspace requires theme integration.
        </p>
      </SettingsCard>

      <SettingsCard
        title="Interface preferences"
        description="Adjust how information is displayed."
      >
        <SettingsField
          label="Compact mode"
          description="Use tighter spacing in tables and workspace panels."
        >
          <Toggle
            checked={settings.compactMode}
            onChange={(value) => updateSetting("compactMode", value)}
            label="Compact mode"
          />
        </SettingsField>
      </SettingsCard>
    </>
  );

  const renderNotifications = () => (
    <SettingsCard
      title="Notification preferences"
      description="Choose which updates you want to receive."
    >
      <SettingsField label="Email notifications" description="Receive important updates through email.">
        <Toggle
          checked={settings.emailNotifications}
          onChange={(value) => updateSetting("emailNotifications", value)}
          label="Email notifications"
        />
      </SettingsField>

      <SettingsField label="Announcement alerts" description="Updates when institute announcements are published.">
        <Toggle
          checked={settings.announcementAlerts}
          onChange={(value) => updateSetting("announcementAlerts", value)}
          label="Announcement alerts"
        />
      </SettingsField>

      <SettingsField label="Attendance alerts" description="Notifications for absences and attendance changes.">
        <Toggle
          checked={settings.attendanceAlerts}
          onChange={(value) => updateSetting("attendanceAlerts", value)}
          label="Attendance alerts"
        />
      </SettingsField>

      <SettingsField label="Academic updates" description="Course, batch and academic schedule updates.">
        <Toggle
          checked={settings.academicUpdates}
          onChange={(value) => updateSetting("academicUpdates", value)}
          label="Academic updates"
        />
      </SettingsField>

      <SettingsField label="Security alerts" description="Important account and security notifications.">
        <Toggle
          checked={settings.securityAlerts}
          onChange={(value) => updateSetting("securityAlerts", value)}
          label="Security alerts"
        />
      </SettingsField>
    </SettingsCard>
  );

  const renderSecurity = () => (
    <>
      <SettingsCard
        title="Account security"
        description="Manage preferences related to administrator account protection."
      >
        <SettingsField
          label="Two-factor authentication"
          description="Enable an additional verification step when signing in."
        >
          <Toggle
            checked={settings.twoFactorEnabled}
            onChange={(value) => updateSetting("twoFactorEnabled", value)}
            label="Two-factor authentication"
          />
        </SettingsField>

        <SettingsField
          label="Session timeout"
          description="Preferred inactivity period before a session expires."
        >
          <SettingsSelect
            value={settings.sessionTimeout}
            onChange={(value) => updateSetting("sessionTimeout", value)}
            ariaLabel="Session timeout"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
          </SettingsSelect>
        </SettingsField>
      </SettingsCard>

      <div className="institute-settings-security-notice">
        <div className="institute-settings-security-notice-icon">
          <LockKeyhole size={19} />
        </div>
        <div>
          <h4>Authentication settings</h4>
          <p>
            These controls currently save preferences only. Actual two-factor
            authentication, password changes and session expiry must be
            implemented by your authentication backend.
          </p>
        </div>
      </div>
    </>
  );

  const renderAcademic = () => (
    <>
      <SettingsCard
        title="Academic calendar"
        description="Set the institute's current academic period."
      >
        <SettingsField label="Academic year" description="Current academic session.">
          <SettingsSelect
            value={settings.academicYear}
            onChange={(value) => updateSetting("academicYear", value)}
            ariaLabel="Academic year"
          >
            <option value="2025-26">2025–26</option>
            <option value="2026-27">2026–27</option>
            <option value="2027-28">2027–28</option>
          </SettingsSelect>
        </SettingsField>

        <SettingsField label="Current semester">
          <SettingsSelect
            value={settings.currentSemester}
            onChange={(value) => updateSetting("currentSemester", value)}
            ariaLabel="Current semester"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
              <option key={semester} value={`Semester ${semester}`}>
                Semester {semester}
              </option>
            ))}
          </SettingsSelect>
        </SettingsField>
      </SettingsCard>

      <SettingsCard
        title="Academic monitoring"
        description="Configure thresholds for institute-level learning insights."
      >
        <SettingsField
          label="Minimum attendance threshold"
          description="Students below this percentage can be flagged for attention."
        >
          <div className="institute-settings-percentage">
            <input
              type="number"
              min="1"
              max="100"
              value={settings.attendanceThreshold}
              onChange={(e) =>
                updateSetting("attendanceThreshold", e.target.value)
              }
            />
            <span>%</span>
          </div>
        </SettingsField>

        <SettingsField
          label="Low performance alerts"
          description="Flag students who may need additional academic support."
        >
          <Toggle
            checked={settings.lowPerformanceAlerts}
            onChange={(value) => updateSetting("lowPerformanceAlerts", value)}
            label="Low performance alerts"
          />
        </SettingsField>
      </SettingsCard>
    </>
  );

  const activeSectionData = SETTINGS_SECTIONS.find(
    (section) => section.id === activeSection
  );

  const renderSection = () => {
    switch (activeSection) {
      case "general":
        return renderGeneral();
      case "appearance":
        return renderAppearance();
      case "notifications":
        return renderNotifications();
      case "security":
        return renderSecurity();
      case "academic":
        return renderAcademic();
      default:
        return renderGeneral();
    }
  };

  return (
    <div className="institute-settings-page">
      <div className="institute-settings-header">
        <div>
          <span className="institute-settings-eyebrow">WORKSPACE CONTROL</span>
          <h1>Settings</h1>
          <p>Configure your institute workspace and preferences.</p>
        </div>

        <div className="institute-settings-header-icon">
          <SettingsIcon size={23} />
        </div>
      </div>

      <div className="institute-settings-layout">
        <aside className="institute-settings-sidebar">
          <span className="institute-settings-sidebar-label">
            SETTINGS MENU
          </span>

          {SETTINGS_SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              className={`institute-settings-nav-item ${
                activeSection === id ? "active" : ""
              }`}
              onClick={() => setActiveSection(id)}
            >
              <Icon size={17} />
              <span>{label}</span>
              <ChevronRight size={14} className="institute-settings-nav-arrow" />
            </button>
          ))}

          <div className="institute-settings-sidebar-help">
            <ShieldCheck size={18} />
            <strong>Need assistance?</strong>
            <span>Contact your workspace support team for help.</span>
          </div>
        </aside>

        <main className="institute-settings-main">
          <div className="institute-settings-section-header">
            <div>
              <h2>{activeSectionData?.label}</h2>
              <p>Manage your {activeSectionData?.label.toLowerCase()} preferences.</p>
            </div>
          </div>

          {renderSection()}

          <div className="institute-settings-feedback">
            {savedMessage && (
              <span className="institute-settings-saved-message">
                <CheckCircle2 size={15} />
                {savedMessage}
              </span>
            )}
          </div>

          <div className="institute-settings-footer">
            <button
              type="button"
              className="institute-settings-reset-btn"
              onClick={resetSettings}
            >
              <RotateCcw size={14} />
              Reset defaults
            </button>

            <button
              type="button"
              className="institute-settings-save-btn"
              onClick={saveSettings}
              disabled={!hasChanges}
            >
              <Save size={15} />
              Save changes
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
