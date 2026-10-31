
import { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  Bell,
  Palette,
  ShieldCheck,
  BookOpen,
  Mail,
  Smartphone,
  Moon,
  Sun,
  Globe,
  Save,
  RotateCcw,
  Check,
  ChevronRight,
} from "lucide-react";

const DEFAULT_SETTINGS = {
  emailNotifications: true,
  studentAlerts: true,
  classUpdates: true,
  weeklyReports: false,
  soundNotifications: true,
  language: "English",
  timezone: "Asia/Kolkata",
  theme: "light",
  compactMode: false,
  showStudentActivity: true,
  profileVisibility: "students",
};

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`teacher-settings-toggle ${checked ? "enabled" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  );
}

function SettingRow({
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <div className="teacher-settings-row">
      <div className="teacher-settings-row-icon">
        <Icon size={19} />
      </div>

      <div className="teacher-settings-row-content">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <div className="teacher-settings-control">
        {children}
      </div>
    </div>
  );
}

function SettingsSection({ icon: Icon, title, description, children }) {
  return (
    <section className="teacher-settings-section">
      <div className="teacher-settings-section-heading">
        <div className="teacher-settings-section-icon">
          <Icon size={20} />
        </div>

        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>

      <div className="teacher-settings-section-body">
        {children}
      </div>
    </section>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("kyros_teacher_settings");

      if (stored) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...JSON.parse(stored),
        });
      }
    } catch {
      console.error("Could not load teacher settings.");
    }
  }, []);

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setSaved(false);
  };

  const saveSettings = () => {
    localStorage.setItem(
      "kyros_teacher_settings",
      JSON.stringify(settings)
    );

    setSaved(true);
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem("kyros_teacher_settings");
    setSaved(false);
  };

  return (
    <div className="teacher-settings-page">

      {/* HEADER */}
      <div className="teacher-settings-header">
        <div>
          <div className="teacher-settings-eyebrow">
            <SettingsIcon size={15} />
            ACCOUNT PREFERENCES
          </div>

          <h1>Settings</h1>

          <p>
            Manage your teaching workspace and personalize your
            KYROS experience.
          </p>
        </div>

        <div className="teacher-settings-header-icon">
          <SettingsIcon size={30} />
        </div>
      </div>

      {/* SETTINGS CONTENT */}
      <div className="teacher-settings-content">

        {/* NOTIFICATIONS */}
        <SettingsSection
          icon={Bell}
          title="Notifications"
          description="Choose what updates you want to receive."
        >
          <SettingRow
            icon={Mail}
            title="Email notifications"
            description="Receive important updates through email."
          >
            <Toggle
              checked={settings.emailNotifications}
              onChange={(value) =>
                updateSetting("emailNotifications", value)
              }
            />
          </SettingRow>

          <SettingRow
            icon={BookOpen}
            title="Student activity alerts"
            description="Get notified about important student activities."
          >
            <Toggle
              checked={settings.studentAlerts}
              onChange={(value) =>
                updateSetting("studentAlerts", value)
              }
            />
          </SettingRow>

          <SettingRow
            icon={Bell}
            title="Class updates"
            description="Receive updates about your classes and batches."
          >
            <Toggle
              checked={settings.classUpdates}
              onChange={(value) =>
                updateSetting("classUpdates", value)
              }
            />
          </SettingRow>

          <SettingRow
            icon={Mail}
            title="Weekly teaching report"
            description="Get a weekly summary of your teaching performance."
          >
            <Toggle
              checked={settings.weeklyReports}
              onChange={(value) =>
                updateSetting("weeklyReports", value)
              }
            />
          </SettingRow>

          <SettingRow
            icon={Smartphone}
            title="Sound notifications"
            description="Enable notification sounds in your workspace."
          >
            <Toggle
              checked={settings.soundNotifications}
              onChange={(value) =>
                updateSetting("soundNotifications", value)
              }
            />
          </SettingRow>
        </SettingsSection>

        {/* APPEARANCE */}
        <SettingsSection
          icon={Palette}
          title="Appearance"
          description="Personalize how your teaching workspace looks."
        >
          <SettingRow
            icon={Palette}
            title="Workspace theme"
            description="Choose your preferred interface appearance."
          >
            <div className="teacher-settings-theme-options">
              <button
                type="button"
                className={
                  settings.theme === "light" ? "selected" : ""
                }
                onClick={() => updateSetting("theme", "light")}
              >
                <Sun size={16} />
                Light
              </button>

              <button
                type="button"
                className={
                  settings.theme === "dark" ? "selected" : ""
                }
                onClick={() => updateSetting("theme", "dark")}
              >
                <Moon size={16} />
                Dark
              </button>
            </div>
          </SettingRow>

          <SettingRow
            icon={BookOpen}
            title="Compact workspace"
            description="Use a more compact layout to fit more information."
          >
            <Toggle
              checked={settings.compactMode}
              onChange={(value) =>
                updateSetting("compactMode", value)
              }
            />
          </SettingRow>
        </SettingsSection>

        {/* TEACHING PREFERENCES */}
        <SettingsSection
          icon={BookOpen}
          title="Teaching preferences"
          description="Control how student information appears in your workspace."
        >
          <SettingRow
            icon={BookOpen}
            title="Show student activity"
            description="Display relevant student activity in your dashboard."
          >
            <Toggle
              checked={settings.showStudentActivity}
              onChange={(value) =>
                updateSetting("showStudentActivity", value)
              }
            />
          </SettingRow>

          <SettingRow
            icon={ShieldCheck}
            title="Student profile visibility"
            description="Choose who can view your teaching profile."
          >
            <select
              className="teacher-settings-select"
              value={settings.profileVisibility}
              onChange={(event) =>
                updateSetting("profileVisibility", event.target.value)
              }
            >
              <option value="students">My students</option>
              <option value="institute">My institute</option>
              <option value="private">Only me</option>
            </select>
          </SettingRow>
        </SettingsSection>

        {/* LANGUAGE AND REGION */}
        <SettingsSection
          icon={Globe}
          title="Language & region"
          description="Set your preferred language and timezone."
        >
          <SettingRow
            icon={Globe}
            title="Language"
            description="Choose your preferred workspace language."
          >
            <select
              className="teacher-settings-select"
              value={settings.language}
              onChange={(event) =>
                updateSetting("language", event.target.value)
              }
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </SettingRow>

          <SettingRow
            icon={Globe}
            title="Timezone"
            description="Your timezone for schedules and reports."
          >
            <select
              className="teacher-settings-select"
              value={settings.timezone}
              onChange={(event) =>
                updateSetting("timezone", event.target.value)
              }
            >
              <option value="Asia/Kolkata">
                India (GMT +5:30)
              </option>
              <option value="UTC">UTC</option>
              <option value="Asia/Dubai">
                Dubai (GMT +4:00)
              </option>
            </select>
          </SettingRow>
        </SettingsSection>

        {/* PRIVACY */}
        <SettingsSection
          icon={ShieldCheck}
          title="Privacy & security"
          description="Manage your account privacy preferences."
        >
          <SettingRow
            icon={ShieldCheck}
            title="Student data privacy"
            description="Student information should only be accessed for teaching purposes."
          >
            <span className="teacher-settings-protected">
              <ShieldCheck size={15} />
              Protected
            </span>
          </SettingRow>

          <div className="teacher-settings-privacy-note">
            <ShieldCheck size={18} />
            <p>
              KYROS is designed to protect student information.
              Institute-level access and student data permissions
              should follow your organization's privacy policies.
            </p>
          </div>
        </SettingsSection>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="teacher-settings-footer">
        <button
          type="button"
          className="teacher-settings-reset"
          onClick={resetSettings}
        >
          <RotateCcw size={17} />
          Reset to default
        </button>

        <div className="teacher-settings-save-area">
          {saved && (
            <span className="teacher-settings-saved">
              <Check size={16} />
              Settings saved
            </span>
          )}

          <button
            type="button"
            className="teacher-settings-save"
            onClick={saveSettings}
          >
            <Save size={17} />
            Save changes
            <ChevronRight size={17} />
          </button>
        </div>
      </div>

    </div>
  );
}
