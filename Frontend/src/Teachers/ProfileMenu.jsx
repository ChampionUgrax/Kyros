
import { useState, useRef, useEffect } from "react";
import {
  UserRound,
  Settings,
  LogOut,
  Trash2,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export default function ProfileMenu({
  user,
  onNavigate,
  onLogout,
  onDeleteAccount,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const name = user?.name || "Teacher";
  const email = user?.email || "teacher@example.com";
  const initials = getInitials(name) || "T";

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleNavigate = (tab) => {
    setIsOpen(false);
    onNavigate?.(tab);
  };

  const handleLogout = () => {
    setIsOpen(false);
    onLogout?.();
  };

  const handleDelete = () => {
    setIsOpen(false);

    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmed) {
      onDeleteAccount?.();
    }
  };

  return (
    <div className="teacher-profile-menu" ref={menuRef}>
      <button
        type="button"
        className={`teacher-profile-menu-trigger ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Open profile menu"
      >
        <span className="teacher-profile-menu-avatar">{initials}</span>

        <span className="teacher-profile-menu-user">
          <strong>{name}</strong>
          <small>Teacher</small>
        </span>

        <ChevronDown
          size={16}
          className={`teacher-profile-menu-chevron ${
            isOpen ? "rotated" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="teacher-profile-menu-dropdown" role="menu">
          <div className="teacher-profile-menu-header">
            <div className="teacher-profile-menu-avatar large">
              {initials}
            </div>

            <div className="teacher-profile-menu-header-info">
              <strong>{name}</strong>
              <span>{email}</span>
              <small>
                <ShieldCheck size={12} />
                Teacher Account
              </small>
            </div>
          </div>

          <div className="teacher-profile-menu-divider" />

          <button
            type="button"
            role="menuitem"
            onClick={() => handleNavigate("profile")}
          >
            <UserRound size={17} />
            <span>My Profile</span>
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => handleNavigate("settings")}
          >
            <Settings size={17} />
            <span>Settings</span>
          </button>

          <div className="teacher-profile-menu-divider" />

          <button
            type="button"
            role="menuitem"
            className="logout"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            <span>Log Out</span>
          </button>

          <button
            type="button"
            role="menuitem"
            className="delete"
            onClick={handleDelete}
          >
            <Trash2 size={17} />
            <span>Delete Account</span>
          </button>
        </div>
      )}
    </div>
  );
}
