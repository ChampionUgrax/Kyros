
import { useState } from "react";

import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Layers,
  BookOpen,
  ChartNoAxesColumn,
  CalendarCheck,
  Bell,
  MessageCircle,
  X,
  Menu,
} from "lucide-react";

import { Logo } from "../components/Nav.jsx";
import ProfileMenu from "./ProfileMenu.jsx";

const INSTITUTE_NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "students", label: "Students", icon: Users },
  { id: "faculty", label: "Faculty", icon: GraduationCap },
  { id: "batches", label: "Batches", icon: Layers },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "analytics", label: "Analytics", icon: ChartNoAxesColumn },
  { id: "attendance", label: "Attendance", icon: CalendarCheck },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "communication", label: "Communication", icon: MessageCircle },
];

export default function InstituteNavbar({
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
          className="institute-mobile-overlay"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`institute-sidebar ${
          mobileOpen ? "mobile-open" : ""
        }`}
      >
        {/* BRAND */}
        <div className="institute-sidebar-brand">
          <Logo />

          <button
            type="button"
            className="institute-close-menu"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* INSTITUTE IDENTITY */}
        <div className="institute-identity">
          <div className="institute-identity-avatar">
            {(user?.instituteName || "KYROS Institute")
              .trim()
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="institute-identity-info">
            <strong>
              {user?.instituteName || "KYROS Institute"}
            </strong>
            <span>Institute Admin</span>
          </div>
        </div>

        <div className="institute-sidebar-label">
          INSTITUTE MANAGEMENT
        </div>

        {/* NAVIGATION */}
        <nav className="institute-nav">
          {INSTITUTE_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                type="button"
                key={item.id}
                className={`institute-nav-item ${
                  isActive ? "active" : ""
                }`}
                onClick={() => navigate(item.id)}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={19} />

                <span>{item.label}</span>

                {isActive && (
                  <span className="institute-nav-indicator" />
                )}
              </button>
            );
          })}
        </nav>

        {/* ADMIN PROFILE */}
        <div className="institute-sidebar-bottom">
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
        className="institute-menu-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <Menu size={21} />
      </button>
    </>
  );
}
