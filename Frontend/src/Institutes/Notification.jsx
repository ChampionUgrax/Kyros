import { useMemo, useState } from "react";
import {
  Bell,
  Search,
  CheckCheck,
  Archive,
  Trash2,
  MoreHorizontal,
  Users,
  GraduationCap,
  CalendarDays,
  BookOpen,
  AlertTriangle,
  Settings,
  Info,
  Check,
  X,
  MailOpen,
  Clock3,
  Filter,
} from "lucide-react";

const INITIAL_NOTIFICATIONS = [
  {
    id: "not-001",
    title: "Low attendance alert",
    message:
      "12 students in B.Tech CSE - B have attendance below the institute's minimum threshold.",
    category: "Attendance",
    type: "warning",
    date: "2026-10-31T09:15:00",
    read: false,
    archived: false,
    sender: "Attendance Monitor",
    details:
      "The attendance monitoring system has identified 12 students whose attendance is below the configured threshold. Review their attendance records and coordinate with the assigned faculty.",
  },
  {
    id: "not-002",
    title: "New faculty member added",
    message:
      "Dr. Neha Kapoor has been added to the institute faculty directory.",
    category: "Faculty",
    type: "success",
    date: "2026-10-31T08:30:00",
    read: false,
    archived: false,
    sender: "Faculty Management",
    details:
      "A new faculty profile has been created. You can review the faculty member's department, assigned courses, and profile information from the Faculty section.",
  },
  {
    id: "not-003",
    title: "Course completion update",
    message:
      "Data Structures has reached 85% completion in B.Tech CSE - A.",
    category: "Academic",
    type: "info",
    date: "2026-10-30T16:45:00",
    read: true,
    archived: false,
    sender: "Learning Insights",
    details:
      "The latest course progress update indicates that the Data Structures course in B.Tech CSE - A has reached 85% completion. Review the learning insights dashboard for topic-level progress.",
  },
  {
    id: "not-004",
    title: "New student enrollment",
    message:
      "8 new students have been added to the Data Science - A batch.",
    category: "Students",
    type: "success",
    date: "2026-10-30T13:20:00",
    read: false,
    archived: false,
    sender: "Student Management",
    details:
      "Eight student profiles have been added to the Data Science - A batch. Check the Students section to review their enrollment information.",
  },
  {
    id: "not-005",
    title: "Learning performance needs attention",
    message:
      "Linear Algebra mastery is below 50% across the assessed students.",
    category: "Academic",
    type: "warning",
    date: "2026-10-29T11:10:00",
    read: false,
    archived: false,
    sender: "Learning Insights",
    details:
      "The demo learning insights indicate low mastery in Linear Algebra. Consider reviewing assessment performance and arranging additional practice sessions.",
  },
  {
    id: "not-006",
    title: "Scheduled maintenance",
    message:
      "A platform maintenance window is scheduled for Sunday at 12:00 AM.",
    category: "System",
    type: "info",
    date: "2026-10-28T10:00:00",
    read: true,
    archived: false,
    sender: "KYROS System",
    details:
      "The platform is scheduled for maintenance. Some services may be temporarily unavailable during the maintenance window.",
  },
  {
    id: "not-007",
    title: "Faculty meeting reminder",
    message:
      "The monthly faculty coordination meeting is scheduled for tomorrow.",
    category: "Faculty",
    type: "info",
    date: "2026-10-27T14:30:00",
    read: true,
    archived: true,
    sender: "Institute Administration",
    details:
      "The monthly faculty coordination meeting is scheduled for tomorrow. Please confirm the agenda and notify the relevant faculty members.",
  },
  {
    id: "not-008",
    title: "Batch capacity approaching limit",
    message:
      "B.Tech CSE - A has reached 90% of its student capacity.",
    category: "Students",
    type: "warning",
    date: "2026-10-26T09:00:00",
    read: true,
    archived: true,
    sender: "Batch Management",
    details:
      "The batch is approaching its configured student capacity. Review available seats before adding further enrollments.",
  },
];

const CATEGORIES = [
  "All categories",
  "Attendance",
  "Students",
  "Faculty",
  "Academic",
  "System",
];

const FILTERS = [
  { label: "All notifications", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Read", value: "read" },
  { label: "Archived", value: "archived" },
];

function getCategoryIcon(category) {
  const icons = {
    Attendance: CalendarDays,
    Students: Users,
    Faculty: GraduationCap,
    Academic: BookOpen,
    System: Settings,
  };

  return icons[category] || Bell;
}

function getRelativeDate(dateValue) {
  const date = new Date(dateValue);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (Number.isNaN(date.getTime())) return "";

  if (diff < 0) {
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function NotificationIcon({ category, type }) {
  const Icon = getCategoryIcon(category);

  return (
    <div className={`institute-notification-icon ${type}`}>
      <Icon size={19} strokeWidth={1.9} />
    </div>
  );
}

export default function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [search, setSearch] = useState("");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  const unreadCount = notifications.filter(
    (item) => !item.read && !item.archived
  ).length;

  const counts = {
    all: notifications.filter((item) => !item.archived).length,
    unread: unreadCount,
    read: notifications.filter((item) => item.read && !item.archived).length,
    archived: notifications.filter((item) => item.archived).length,
  };

  const filteredNotifications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return notifications
      .filter((item) => {
        if (activeFilter === "unread" && (item.read || item.archived)) {
          return false;
        }

        if (activeFilter === "read" && (!item.read || item.archived)) {
          return false;
        }

        if (activeFilter === "archived" && !item.archived) {
          return false;
        }

        if (activeFilter === "all" && item.archived) {
          return false;
        }

        const matchesCategory =
          categoryFilter === "All categories" ||
          item.category === categoryFilter;

        const matchesSearch =
          item.title.toLowerCase().includes(query) ||
          item.message.toLowerCase().includes(query) ||
          item.sender.toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [notifications, activeFilter, categoryFilter, search]);

  const updateNotification = (id, updates) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    );

    setSelectedNotification((current) =>
      current?.id === id ? { ...current, ...updates } : current
    );
    setOpenMenu(null);
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((item) =>
        item.archived ? item : { ...item, read: true }
      )
    );

    setSelectedNotification((current) =>
      current ? { ...current, read: true } : current
    );
  };

  const archiveNotification = (id) => {
    updateNotification(id, { archived: true });
  };

  const deleteNotification = (id) => {
    setNotifications((current) =>
      current.filter((item) => item.id !== id)
    );

    if (selectedNotification?.id === id) {
      setSelectedNotification(null);
    }

    setOpenMenu(null);
  };

  const clearArchived = () => {
    setNotifications((current) =>
      current.filter((item) => !item.archived)
    );
  };

  const openNotification = (item) => {
    if (!item.read) {
      updateNotification(item.id, { read: true });
    }

    setSelectedNotification({ ...item, read: true });
    setOpenMenu(null);
  };

  return (
    <div className="institute-notifications-page">
      {/* Header */}
      <div className="institute-notifications-header">
        <div>
          <div className="institute-notifications-eyebrow">
            <Bell size={14} />
            INSTITUTE UPDATES
          </div>

          <h1>Notifications</h1>

          <p>
            Stay informed about academic activities, student progress, and
            important institute updates.
          </p>
        </div>

        <div className="institute-notification-header-actions">
          {activeFilter === "archived" ? (
            <button
              type="button"
              className="institute-notification-secondary-btn"
              onClick={clearArchived}
              disabled={counts.archived === 0}
            >
              <Trash2 size={15} />
              Clear archived
            </button>
          ) : (
            <button
              type="button"
              className="institute-notification-secondary-btn"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCheck size={15} />
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="institute-notification-summary">
        <div className="institute-notification-summary-icon">
          <Bell size={21} />
        </div>

        <div>
          <strong>
            {unreadCount === 0
              ? "You're all caught up!"
              : `You have ${unreadCount} unread notifications`}
          </strong>
          <span>
            {unreadCount === 0
              ? "There are no pending updates to review."
              : "Review the latest updates from your institute workspace."}
          </span>
        </div>

        <div className="institute-notification-summary-count">
          <strong>{unreadCount}</strong>
          <span>Unread</span>
        </div>
      </div>

      {/* Filters */}
      <div className="institute-notification-toolbar">
        <div className="institute-notification-tabs">
          {FILTERS.map((filter) => (
            <button
              type="button"
              key={filter.value}
              className={
                activeFilter === filter.value ? "active" : ""
              }
              onClick={() => {
                setActiveFilter(filter.value);
                setSelectedNotification(null);
              }}
            >
              {filter.label}
              <span>{counts[filter.value]}</span>
            </button>
          ))}
        </div>

        <div className="institute-notification-controls">
          <label className="institute-notification-search">
            <Search size={16} />
            <input
              type="search"
              placeholder="Search notifications..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <label className="institute-notification-category">
            <Filter size={15} />
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              aria-label="Filter by category"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Notification list and details */}
      <div className="institute-notification-layout">
        <section className="institute-notification-list">
          <div className="institute-notification-list-heading">
            <div>
              <h2>
                {FILTERS.find((item) => item.value === activeFilter)?.label}
              </h2>
              <span>
                {filteredNotifications.length} notifications
              </span>
            </div>

            <span className="institute-notification-sort">
              <Clock3 size={13} />
              Newest first
            </span>
          </div>

          {filteredNotifications.length > 0 ? (
            <div className="institute-notification-items">
              {filteredNotifications.map((item) => (
                <article
                  key={item.id}
                  className={[
                    "institute-notification-item",
                    !item.read ? "unread" : "",
                    selectedNotification?.id === item.id ? "selected" : "",
                  ].join(" ")}
                  onClick={() => openNotification(item)}
                >
                  {!item.read && !item.archived && (
                    <span className="institute-notification-unread-dot" />
                  )}

                  <NotificationIcon
                    category={item.category}
                    type={item.type}
                  />

                  <div className="institute-notification-content">
                    <div className="institute-notification-item-top">
                      <strong>{item.title}</strong>
                      <span>{getRelativeDate(item.date)}</span>
                    </div>

                    <p>{item.message}</p>

                    <div className="institute-notification-item-bottom">
                      <span className="institute-notification-category-tag">
                        {item.category}
                      </span>
                      <span>{item.sender}</span>
                    </div>
                  </div>

                  <div
                    className="institute-notification-menu-wrap"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="institute-notification-menu-trigger"
                      aria-label="Notification actions"
                      onClick={() =>
                        setOpenMenu(
                          openMenu === item.id ? null : item.id
                        )
                      }
                    >
                      <MoreHorizontal size={19} />
                    </button>

                    {openMenu === item.id && (
                      <div className="institute-notification-menu">
                        <button
                          type="button"
                          onClick={() =>
                            updateNotification(item.id, {
                              read: !item.read,
                            })
                          }
                        >
                          <MailOpen size={14} />
                          Mark as {item.read ? "unread" : "read"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            updateNotification(item.id, {
                              archived: !item.archived,
                            })
                          }
                        >
                          <Archive size={14} />
                          {item.archived ? "Restore" : "Archive"}
                        </button>

                        <button
                          type="button"
                          className="danger"
                          onClick={() => deleteNotification(item.id)}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="institute-notification-empty">
              <div>
                <Bell size={25} />
              </div>
              <h3>No notifications found</h3>
              <p>
                Try changing your filters or search for something else.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategoryFilter("All categories");
                }}
              >
                Reset filters
              </button>
            </div>
          )}
        </section>

        {/* Details panel */}
        <aside className="institute-notification-detail">
          {selectedNotification ? (
            <>
              <div className="institute-notification-detail-header">
                <span>NOTIFICATION DETAILS</span>
                <button
                  type="button"
                  onClick={() => setSelectedNotification(null)}
                  aria-label="Close notification details"
                >
                  <X size={17} />
                </button>
              </div>

              <NotificationIcon
                category={selectedNotification.category}
                type={selectedNotification.type}
              />

              <span className="institute-notification-detail-category">
                {selectedNotification.category}
              </span>

              <h3>{selectedNotification.title}</h3>

              <p className="institute-notification-detail-message">
                {selectedNotification.details ||
                  selectedNotification.message}
              </p>

              <div className="institute-notification-detail-meta">
                <div>
                  <span>Received from</span>
                  <strong>{selectedNotification.sender}</strong>
                </div>

                <div>
                  <span>Date and time</span>
                  <strong>
                    {new Date(selectedNotification.date).toLocaleString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong>
                    {selectedNotification.archived
                      ? "Archived"
                      : selectedNotification.read
                        ? "Read"
                        : "Unread"}
                  </strong>
                </div>
              </div>

              <div className="institute-notification-detail-actions">
                <button
                  type="button"
                  onClick={() =>
                    updateNotification(selectedNotification.id, {
                      archived: !selectedNotification.archived,
                    })
                  }
                >
                  <Archive size={15} />
                  {selectedNotification.archived ? "Restore" : "Archive"}
                </button>

                <button
                  type="button"
                  className="institute-notification-delete-btn"
                  onClick={() =>
                    deleteNotification(selectedNotification.id)
                  }
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            </>
          ) : (
            <div className="institute-notification-detail-empty">
              <div className="institute-notification-detail-empty-icon">
                <Info size={23} />
              </div>
              <h3>Notification details</h3>
              <p>
                Select a notification to read its full message and manage
                its status.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}