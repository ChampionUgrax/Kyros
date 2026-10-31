
import { useState, useEffect, useRef } from "react";
import {
  UserRound,
  Settings,
  LogOut,
  Trash2,
  ChevronUp,
} from "lucide-react";

export default function ProfileMenu({
  user,
  onNavigate,
  onLogout,
  onDeleteAccount,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const firstName = user?.name?.trim().split(/\s+/)[0] || "Student";
  const initial = firstName.charAt(0).toUpperCase();

  const handleNavigate = (page) => {
    setIsOpen(false);
    onNavigate(page);
  };

  return (
    <div className="kyros-profile-menu" ref={menuRef}>
      {isOpen && (
        <div className="kyros-profile-dropdown">
          <div className="kyros-dropdown-header">
            <div className="kyros-profile-avatar">
              {initial}
            </div>

            <div className="kyros-dropdown-user">
              <strong>{user?.name || "Student"}</strong>
              <span>{user?.email || "Student account"}</span>
            </div>
          </div>

          <div className="kyros-dropdown-divider" />

          <button
            className="kyros-dropdown-item"
            onClick={() => handleNavigate("profile")}
          >
            <UserRound size={17} />
            <span>My Profile</span>
          </button>

          <button
            className="kyros-dropdown-item"
            onClick={() => handleNavigate("settings")}
          >
            <Settings size={17} />
            <span>Settings</span>
          </button>

          <div className="kyros-dropdown-divider" />

          <button
            className="kyros-dropdown-item"
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
          >
            <LogOut size={17} />
            <span>Log out</span>
          </button>

          <button
            className="kyros-dropdown-item kyros-delete-item"
            onClick={() => {
              setIsOpen(false);
              onDeleteAccount();
            }}
          >
            <Trash2 size={17} />
            <span>Delete account</span>
          </button>
        </div>
      )}

      <button
        type="button"
        className={`kyros-profile-trigger ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <div className="kyros-profile-avatar">
          {initial}
        </div>

        <div className="kyros-profile-trigger-info">
          <strong>{user?.name || "Student"}</strong>
          <span>Student account</span>
        </div>

        <ChevronUp
          size={17}
          className={`kyros-profile-chevron ${isOpen ? "" : "closed"}`}
        />
      </button>
    </div>
  );
}
