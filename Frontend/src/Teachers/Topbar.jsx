
import {
  Search,
  Bell,
  CalendarDays,
  ChevronDown,
  LayoutDashboard,
  BookOpen,
  BrainCircuit,
  ChartNoAxesColumn,
  MessageCircle,
  UserRound,
  Settings,
} from "lucide-react";

const PAGE_DETAILS = {
  overview: {
    title: "Overview",
    description: "Your teaching workspace at a glance.",
    icon: LayoutDashboard,
  },
  classes: {
    title: "My Classes",
    description: "Manage your classes and students.",
    icon: BookOpen,
  },
  misconceptions: {
    title: "Misconceptions",
    description: "Understand and address learning gaps.",
    icon: BrainCircuit,
  },
  heatmap: {
    title: "Class Heatmap",
    description: "Explore student learning performance.",
    icon: ChartNoAxesColumn,
  },
  notifications: {
    title: "Notifications",
    description: "Stay updated with your teaching activities.",
    icon: Bell,
  },
  chat: {
    title: "Messages",
    description: "Connect with students and colleagues.",
    icon: MessageCircle,
  },
  profile: {
    title: "My Profile",
    description: "Manage your personal information.",
    icon: UserRound,
  },
  settings: {
    title: "Settings",
    description: "Customize your teaching workspace.",
    icon: Settings,
  },
};

export default function Topbar({
  activeTab,
  user,
  onNavigate,
}) {
  const page = PAGE_DETAILS[activeTab] || PAGE_DETAILS.overview;
  const PageIcon = page.icon;

  const firstName =
    user?.name?.trim().split(/\s+/)[0] || "Teacher";

  const initials = user?.name
    ?.trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "T";

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
        // Search integration can be connected later.
        console.log("Teacher workspace search:", query);
      }
    }
  };

  return (
    <header className="teacher-topbar">

      {/* LEFT: PAGE INFORMATION */}
      <div className="teacher-topbar-page">
        <div className="teacher-topbar-page-icon">
          <PageIcon size={19} />
        </div>

        <div className="teacher-topbar-page-info">
          <h1>{page.title}</h1>
          <p>{page.description}</p>
        </div>
      </div>

      {/* RIGHT: ACTIONS */}
      <div className="teacher-topbar-actions">

        {/* SEARCH */}
        <div className="teacher-topbar-search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Search your workspace..."
            onKeyDown={handleSearch}
            aria-label="Search your workspace"
          />

          <kbd>Enter</kbd>
        </div>

        {/* DATE */}
        <div className="teacher-topbar-date">
          <CalendarDays size={17} />
          <span>{formattedDate}</span>
        </div>

        {/* NOTIFICATIONS */}
        <button
          type="button"
          className={`teacher-topbar-icon-button ${
            activeTab === "notifications" ? "active" : ""
          }`}
          onClick={() => onNavigate?.("notifications")}
          aria-label="Open notifications"
          title="Notifications"
        >
          <Bell size={19} />
        </button>

        {/* USER */}
        <button
          type="button"
          className="teacher-topbar-user"
          onClick={() => onNavigate?.("profile")}
          title="Open profile"
        >
          <div className="teacher-topbar-avatar">
            {initials}
          </div>

          <div className="teacher-topbar-user-info">
            <strong>{firstName}</strong>
            <span>Teacher</span>
          </div>

          <ChevronDown size={15} />
        </button>

      </div>
    </header>
  );
}
