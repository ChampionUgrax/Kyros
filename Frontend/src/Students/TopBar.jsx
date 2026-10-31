
import { Bell, MessageCircle } from "lucide-react";

const PAGE_TITLES = {
  overview: "Overview",
  learning: "My Learning",
  assistant: "AI Assistant",
  weak: "Weak Topics",
  revision: "Revision",
  focus: "Focus",
  notifications: "Notifications",
  chat: "Chat",
  materials: "My Materials",
  profile: "My Profile",
  settings: "Settings",
};

export default function StudentTopbar({
  activeTab,
  onNavigate,
  user,
}) {
  const firstName =
    user?.name?.trim().split(/\s+/)[0] || "Student";

  return (
    <header className="student-topbar">
      <div className="student-topbar-heading">
        <span className="student-topbar-label">
          STUDENT WORKSPACE
        </span>
        <h1>{PAGE_TITLES[activeTab] || "Student Workspace"}</h1>
        <p>Hello {firstName}, keep making progress.</p>
      </div>

      <div className="student-topbar-actions">
        <button
          className={`student-notification ${
            activeTab === "notifications" ? "active" : ""
          }`}
          onClick={() => onNavigate("notifications")}
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={19} />
        </button>

        <button
          className={`student-notification ${
            activeTab === "chat" ? "active" : ""
          }`}
          onClick={() => onNavigate("chat")}
          aria-label="Messages"
          title="Messages"
        >
          <MessageCircle size={19} />
        </button>
      </div>
    </header>
  );
}
