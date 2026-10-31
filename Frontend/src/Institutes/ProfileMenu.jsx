
import { useEffect, useRef, useState } from "react";

import {
  UserRound,
  Settings,
  LogOut,
  Trash2,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";

export default function ProfileMenu({
  user,
  onNavigate,
  onLogout,
  onDeleteAccount,
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const name = user?.name || "Institute Admin";
  const email = user?.email || "admin@institute.com";

  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const navigate = (page) => {
    setOpen(false);
    onNavigate?.(page);
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this institute admin account? This action cannot be undone."
    );

    if (confirmed) {
      setOpen(false);
      onDeleteAccount?.();
    }
  };

  const handleLogout = () => {
    setOpen(false);
    onLogout?.();
  };

  return (
    <div className="institute-profile-menu" ref={menuRef}>
      {open && (
        <div className="institute-profile-dropdown">
          <div className="institute-profile-dropdown-header">
            <div className="institute-profile-avatar">
              {initials}
            </div>

            <div className="institute-profile-details">
              <strong>{name}</strong>
              <span>{email}</span>
              <small>
                <ShieldCheck size={12} />
                Institute Administrator
              </small>
            </div>
          </div>

          <div className="institute-dropdown-divider" />

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

          <div className="institute-dropdown-divider" />

          <button type="button" onClick={handleLogout}>
            <LogOut size={17} />
            <span>Log out</span>
          </button>

          <button
            type="button"
            className="institute-delete-account"
            onClick={handleDelete}
          >
            <Trash2 size={17} />
            <span>Delete Account</span>
          </button>
        </div>
      )}

      <button
        type="button"
        className={`institute-sidebar-user ${
          open ? "profile-active" : ""
        }`}
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <div className="institute-profile-avatar">
          {initials}
        </div>

        <div className="institute-profile-details">
          <strong>{name}</strong>
          <span>Administrator</span>
        </div>

        <ChevronDown
          size={17}
          className={open ? "institute-chevron-open" : ""}
        />
      </button>
    </div>
  );
}
