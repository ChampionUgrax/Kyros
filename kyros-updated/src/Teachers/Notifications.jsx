
import { useMemo, useState } from "react";
import {
  Bell,
  BookOpen,
  Users,
  ClipboardCheck,
  MessageCircle,
  Info,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  Clock3,
  BellRing,
} from "lucide-react";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "student",
    title: "Student needs your attention",
    message: "Aarav Sharma has struggled with quadratic equations in the latest practice session.",
    time: "10 minutes ago",
    date: "Today",
    read: false,
  },
  {
    id: 2,
    type: "class",
    title: "Class performance updated",
    message: "The learning analytics for Class 10A are now available.",
    time: "45 minutes ago",
    date: "Today",
    read: false,
  },
  {
    id: 3,
    type: "assignment",
    title: "New assignment submissions",
    message: "12 students have submitted the Algebra Practice assignment.",
    time: "2 hours ago",
    date: "Today",
    read: false,
  },
  {
    id: 4,
    type: "message",
    title: "New message received",
    message: "Priya Verma sent you a message regarding the upcoming revision session.",
    time: "Yesterday",
    date: "Yesterday",
    read: true,
  },
  {
    id: 5,
    type: "student",
    title: "Learning milestone achieved",
    message: "Rohan Mehta has completed 5 consecutive days of learning activity.",
    time: "Yesterday",
    date: "Yesterday",
    read: true,
  },
  {
    id: 6,
    type: "system",
    title: "Welcome to KYROS",
    message: "Your teacher dashboard is ready. Explore your classes and student insights.",
    time: "2 days ago",
    date: "Earlier",
    read: true,
  },
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "read", label: "Read" },
];

const CATEGORY_CONFIG = {
  student: {
    label: "Student",
    icon: Users,
    className: "student",
  },
  class: {
    label: "Class",
    icon: BookOpen,
    className: "class",
  },
  assignment: {
    label: "Assignment",
    icon: ClipboardCheck,
    className: "assignment",
  },
  message: {
    label: "Message",
    icon: MessageCircle,
    className: "message",
  },
  system: {
    label: "System",
    icon: Info,
    className: "system",
  },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");

  const unreadCount = notifications.filter((item) => !item.read).length;
  const readCount = notifications.length - unreadCount;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const matchesReadFilter =
        activeFilter === "all" ||
        (activeFilter === "unread" && !item.read) ||
        (activeFilter === "read" && item.read);

      const matchesCategory =
        activeCategory === "all" || item.type === activeCategory;

      return matchesReadFilter && matchesCategory;
    });
  }, [notifications, activeFilter, activeCategory]);

  const groupedNotifications = useMemo(() => {
    const groups = ["Today", "Yesterday", "Earlier"];

    return groups
      .map((date) => ({
        date,
        items: filteredNotifications.filter((item) => item.date === date),
      }))
      .filter((group) => group.items.length > 0);
  }, [filteredNotifications]);

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, read: true } : item
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((item) => ({ ...item, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  const clearReadNotifications = () => {
    setNotifications((current) => current.filter((item) => !item.read));
  };

  return (
    <main className="teacher-notifications-page">
      <header className="teacher-notifications-header">
        <div>
          <span className="teacher-notifications-eyebrow">
            STAY UPDATED
          </span>
          <h1>Notifications</h1>
          <p>Keep track of your classes, students, and important updates.</p>
        </div>

        <div className="teacher-notifications-header-icon">
          <BellRing size={24} />
          {unreadCount > 0 && (
            <span className="teacher-notifications-header-count">
              {unreadCount}
            </span>
          )}
        </div>
      </header>

      <section className="teacher-notifications-stats">
        <div className="teacher-notification-stat">
          <div className="teacher-notification-stat-icon total">
            <Bell size={19} />
          </div>
          <div>
            <span>Total notifications</span>
            <strong>{notifications.length}</strong>
          </div>
        </div>

        <div className="teacher-notification-stat">
          <div className="teacher-notification-stat-icon unread">
            <BellRing size={19} />
          </div>
          <div>
            <span>Unread</span>
            <strong>{unreadCount}</strong>
          </div>
        </div>

        <div className="teacher-notification-stat">
          <div className="teacher-notification-stat-icon read">
            <CheckCheck size={19} />
          </div>
          <div>
            <span>Read</span>
            <strong>{readCount}</strong>
          </div>
        </div>
      </section>

      <section className="teacher-notifications-panel">
        <div className="teacher-notifications-toolbar">
          <div className="teacher-notifications-tabs">
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                className={`teacher-notification-tab ${
                  activeFilter === filter.id ? "active" : ""
                }`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
                {filter.id === "unread" && unreadCount > 0 && (
                  <span className="teacher-notification-tab-count">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="teacher-notifications-actions">
            <button
              className="teacher-notification-action"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCheck size={15} />
              Mark all as read
            </button>

            <button
              className="teacher-notification-action clear"
              onClick={clearReadNotifications}
              disabled={readCount === 0}
            >
              <Trash2 size={15} />
              Clear read
            </button>
          </div>
        </div>

        <div className="teacher-notifications-category">
          <span>
            <Filter size={15} />
            Category
          </span>

          <select
            value={activeCategory}
            onChange={(event) => setActiveCategory(event.target.value)}
            aria-label="Filter notifications by category"
          >
            <option value="all">All categories</option>
            <option value="student">Students</option>
            <option value="class">Classes</option>
            <option value="assignment">Assignments</option>
            <option value="message">Messages</option>
            <option value="system">System</option>
          </select>
        </div>

        <div className="teacher-notifications-list">
          {groupedNotifications.length > 0 ? (
            groupedNotifications.map((group) => (
              <div className="teacher-notification-group" key={group.date}>
                <div className="teacher-notification-date">
                  <span>{group.date}</span>
                  <div />
                </div>

                {group.items.map((item) => {
                  const config = CATEGORY_CONFIG[item.type];
                  const Icon = config.icon;

                  return (
                    <article
                      key={item.id}
                      className={`teacher-notification-card ${
                        !item.read ? "unread" : ""
                      }`}
                    >
                      <div
                        className={`teacher-notification-icon ${config.className}`}
                      >
                        <Icon size={19} />
                      </div>

                      <div className="teacher-notification-content">
                        <div className="teacher-notification-title-row">
                          <h3>{item.title}</h3>
                          {!item.read && (
                            <span className="teacher-notification-unread-dot" />
                          )}
                        </div>

                        <p>{item.message}</p>

                        <div className="teacher-notification-meta">
                          <span className="teacher-notification-category-label">
                            {config.label}
                          </span>
                          <span className="teacher-notification-time">
                            <Clock3 size={12} />
                            {item.time}
                          </span>
                        </div>
                      </div>

                      <div className="teacher-notification-card-actions">
                        {!item.read && (
                          <button
                            title="Mark as read"
                            aria-label={`Mark ${item.title} as read`}
                            onClick={() => markAsRead(item.id)}
                          >
                            <Check size={16} />
                          </button>
                        )}

                        <button
                          title="Delete notification"
                          aria-label={`Delete ${item.title}`}
                          onClick={() => deleteNotification(item.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ))
          ) : (
            <div className="teacher-notifications-empty">
              <div className="teacher-notifications-empty-icon">
                <Bell size={26} />
              </div>
              <h3>No notifications found</h3>
              <p>
                {activeFilter === "unread"
                  ? "You're all caught up. There are no unread notifications."
                  : "There are no notifications matching your selected filters."}
              </p>
              {(activeFilter !== "all" || activeCategory !== "all") && (
                <button
                  onClick={() => {
                    setActiveFilter("all");
                    setActiveCategory("all");
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        <footer className="teacher-notifications-footer">
          Showing {filteredNotifications.length} of {notifications.length}{" "}
          notifications
        </footer>
      </section>
    </main>
  );
}
