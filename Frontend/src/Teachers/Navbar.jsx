

import { useState } from "react";

import {
  LayoutDashboard,
  BookOpen,
  BrainCircuit,
  ChartNoAxesColumn,
  Bell,
  MessageCircle,
  X,
  Menu,
} from "lucide-react";

import { Logo } from "../components/Nav.jsx";
import ProfileMenu from "./ProfileMenu.jsx";

const TEACHER_NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "classes", label: "My Classes", icon: BookOpen },
  { id: "misconceptions", label: "Misconceptions", icon: BrainCircuit },
  { id: "heatmap", label: "Class Heatmap", icon: ChartNoAxesColumn },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "chat", label: "Chat", icon: MessageCircle },
];

export default function TeacherNavbar({
  activeTab,
  onNavigate,
  user,
  onLogout,
  onDeleteAccount,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = (page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <button
          type="button"
          className="teacher-mobile-overlay"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        />
      )}

      {/* TEACHER SIDEBAR */}
      <aside
        className={`teacher-sidebar ${
          mobileOpen ? "mobile-open" : ""
        }`}
      >
        {/* BRAND */}
        <div className="teacher-sidebar-brand">
          <Logo />

          <button
            type="button"
            className="teacher-close-menu"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="teacher-sidebar-label">
          TEACHING MENU
        </div>

        {/* NAVIGATION */}
        <nav className="teacher-nav">
          {TEACHER_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                type="button"
                key={item.id}
                className={`teacher-nav-item ${
                  isActive ? "active" : ""
                }`}
                onClick={() => navigate(item.id)}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={19} />

                <span>{item.label}</span>

                {isActive && (
                  <span className="teacher-nav-indicator" />
                )}
              </button>
            );
          })}
        </nav>

        {/* PROFILE SECTION */}
        <div className="teacher-sidebar-bottom">
          <ProfileMenu
            user={user}
            onNavigate={navigate}
            onLogout={onLogout}
            onDeleteAccount={onDeleteAccount}
          />
        </div>
      </aside>

      {/* MOBILE MENU BUTTON */}
      <button
        type="button"
        className="teacher-menu-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <Menu size={21} />
      </button>
    </>
  );
}
