
import { useState } from "react";

import {
  LayoutDashboard,
  BookOpen,
  BrainCircuit,
  Flame,
  Layers,
  Timer,
  Bell,
  MessageCircle,
  FolderOpen,
  UserRound,
  Settings,
  LogOut,
  Trash2,
  ChevronUp,
  X,
  Menu,
} from "lucide-react";

import { Logo } from "../components/Nav.jsx";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "learning", label: "My Learning", icon: BookOpen },
  { id: "assistant", label: "AI Assistant", icon: BrainCircuit },
  { id: "weak", label: "Weak Topics", icon: Flame },
  { id: "revision", label: "Revision", icon: Layers },
  { id: "focus", label: "Focus", icon: Timer },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "materials", label: "My Materials", icon: FolderOpen },
];

export default function StudentNavbar({
  activeTab,
  onNavigate,
  user,
  onLogout,
  onDeleteAccount,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const firstName =
    user?.name?.trim().split(/\s+/)[0] || "Student";

  const navigate = (page) => {
    onNavigate(page);
    setMobileOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = () => {
    setProfileOpen(false);
    setMobileOpen(false);
    onLogout();
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your demo account? This action cannot be undone."
    );

    if (confirmed) {
      setProfileOpen(false);
      setMobileOpen(false);
      onDeleteAccount();
    }
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <button
          className="student-mobile-overlay"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`student-sidebar ${
          mobileOpen ? "mobile-open" : ""
        }`}
      >
        {/* BRAND */}
        <div className="student-sidebar-brand">
          <Logo />

          <button
            type="button"
            className="student-close-menu"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION LABEL */}
        <div className="student-sidebar-label">
          LEARNING MENU
        </div>

        {/* NAVIGATION ITEMS */}
        <nav className="student-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                type="button"
                key={item.id}
                className={`student-nav-item ${
                  isActive ? "active" : ""
                }`}
                onClick={() => navigate(item.id)}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={19} />

                <span>{item.label}</span>

                {isActive && (
                  <span className="student-nav-indicator" />
                )}
              </button>
            );
          })}
        </nav>

        {/* PROFILE SECTION */}
        <div className="student-sidebar-bottom">
          <div className="student-profile-wrapper">

            {/* FLOATING PROFILE DROPDOWN */}
            {profileOpen && (
              <div className="student-profile-dropdown">

                <div className="student-profile-dropdown-header">
                  <div className="student-avatar">
                    {firstName.charAt(0).toUpperCase()}
                  </div>

                  <div className="student-user-details">
                    <strong>{user?.name || "Student"}</strong>
                    <span>{user?.email || "Student account"}</span>
                  </div>
                </div>

                <div className="student-dropdown-divider" />

                <button
                  type="button"
                  onClick={() => navigate("profile")}
                >
                  <UserRound size={17} />
                  <span>My Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("settings")}
                >
                  <Settings size={17} />
                  <span>Settings</span>
                </button>

                <div className="student-dropdown-divider" />

                <button
                  type="button"
                  onClick={handleLogout}
                >
                  <LogOut size={17} />
                  <span>Log out</span>
                </button>

                <button
                  type="button"
                  className="student-delete-account"
                  onClick={handleDelete}
                >
                  <Trash2 size={17} />
                  <span>Delete Account</span>
                </button>

              </div>
            )}

            {/* PROFILE TRIGGER */}
            <button
              type="button"
              className={`student-sidebar-user ${
                profileOpen ? "profile-active" : ""
              }`}
              onClick={() =>
                setProfileOpen((previous) => !previous)
              }
              aria-expanded={profileOpen}
              aria-haspopup="true"
            >
              <div className="student-avatar">
                {firstName.charAt(0).toUpperCase()}
              </div>

              <div className="student-user-details">
                <strong>{user?.name || "Student"}</strong>
                <span>Student account</span>
              </div>

              <ChevronUp
                size={17}
                className={
                  profileOpen
                    ? "student-chevron-open"
                    : "student-chevron-closed"
                }
              />
            </button>

          </div>
        </div>
      </aside>

      {/* MOBILE MENU BUTTON */}
      <button
        type="button"
        className="student-menu-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <Menu size={21} />
      </button>
    </>
  );
}
