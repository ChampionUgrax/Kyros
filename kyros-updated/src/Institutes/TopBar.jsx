
import {
  Search,
  Bell,
  CalendarDays,
  ChevronRight,
  LayoutDashboard,
  Users,
  GraduationCap,
  Layers,
  BookOpen,
  ChartNoAxesColumn,
  CalendarCheck,
  MessageCircle,
  UserRound,
  Settings,
} from "lucide-react";

const PAGE_DETAILS = {
  overview: {
    title: "Overview",
    description: "Monitor your institute's overall performance.",
    icon: LayoutDashboard,
  },
  students: {
    title: "Students",
    description: "Manage student records and enrollment.",
    icon: Users,
  },
  faculty: {
    title: "Faculty",
    description: "Manage your institute's teaching team.",
    icon: GraduationCap,
  },
  batches: {
    title: "Batches",
    description: "Organize students into learning batches.",
    icon: Layers,
  },
  courses: {
    title: "Courses",
    description: "Manage subjects and academic programs.",
    icon: BookOpen,
  },
  analytics: {
    title: "Analytics",
    description: "Understand institute-wide learning trends.",
    icon: ChartNoAxesColumn,
  },
  attendance: {
    title: "Attendance",
    description: "Monitor attendance across your batches.",
    icon: CalendarCheck,
  },
  notifications: {
    title: "Notifications",
    description: "Stay updated with institute activities.",
    icon: Bell,
  },
  communication: {
    title: "Communication",
    description: "Connect with students and faculty.",
    icon: MessageCircle,
  },
  profile: {
    title: "My Profile",
    description: "Manage your administrator profile.",
    icon: UserRound,
  },
  settings: {
    title: "Settings",
    description: "Configure your institute workspace.",
    icon: Settings,
  },
};

export default function InstituteTopbar({
  activeTab,
  user,
  onNavigate,
}) {
  const page = PAGE_DETAILS[activeTab] || PAGE_DETAILS.overview;
  const PageIcon = page.icon;

  const instituteName =
    user?.instituteName || "KYROS Institute";

  const initials = user?.name
    ?.trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "IA";

  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      const query = event.currentTarget.value.trim();

      if (query) {
        console.log("Institute workspace search:", query);
      }
    }
  };

  return (
    <header className="institute-topbar">
      {/* PAGE TITLE */}
      <div className="institute-topbar-page">
        <div className="institute-topbar-page-icon">
          <PageIcon size={19} />
        </div>

        <div className="institute-topbar-page-info">
          <div className="institute-topbar-breadcrumb">
            <span>Institute Workspace</span>
            <ChevronRight size={13} />
            <span className="current">{page.title}</span>
          </div>

          <h1>{page.title}</h1>
          <p>{page.description}</p>
        </div>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="institute-topbar-actions">
        {/* SEARCH */}
        <div className="institute-topbar-search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Search institute..."
            onKeyDown={handleSearch}
            aria-label="Search institute workspace"
          />

          <kbd>Enter</kbd>
        </div>

        {/* DATE */}
        <div className="institute-topbar-date">
          <CalendarDays size={17} />
          <span>{formattedDate}</span>
        </div>

        {/* NOTIFICATIONS */}
        <button
          type="button"
          className={`institute-topbar-icon-button ${
            activeTab === "notifications" ? "active" : ""
          }`}
          onClick={() => onNavigate?.("notifications")}
          aria-label="Open notifications"
          title="Notifications"
        >
          <Bell size={19} />
        </button>

        {/* ADMIN AVATAR */}
        <button
          type="button"
          className="institute-topbar-user"
          onClick={() => onNavigate?.("profile")}
          title={`${instituteName} administrator profile`}
        >
          <div className="institute-topbar-avatar">
            {initials}
          </div>

          <div className="institute-topbar-user-info">
            <strong>{user?.name || "Admin"}</strong>
            <span>Institute Admin</span>
          </div>
        </button>
      </div>
    </header>
  );
}
