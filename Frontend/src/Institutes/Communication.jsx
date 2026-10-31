
import { useMemo, useState } from "react";
import {
  Megaphone,
  MessageSquare,
  Search,
  Plus,
  Send,
  Paperclip,
  MoreHorizontal,
  Users,
  GraduationCap,
  UserRound,
  Clock3,
  CheckCheck,
  X,
  Pin,
  Trash2,
  Edit3,
  Bell,
  CalendarDays,
} from "lucide-react";

const initialAnnouncements = [
  {
    id: 1,
    title: "Mid-semester examinations schedule",
    message:
      "The mid-semester examinations will begin from 16 November. Students are requested to check their respective timetables and contact their faculty for any clarification.",
    audience: "All Students",
    date: "30 Oct 2026",
    status: "Published",
    author: "Institute Admin",
    pinned: true,
  },
  {
    id: 2,
    title: "Faculty development workshop",
    message:
      "A faculty development workshop on modern teaching methodologies will be conducted this Saturday in Seminar Hall 2.",
    audience: "Faculty",
    date: "29 Oct 2026",
    status: "Published",
    author: "Institute Admin",
    pinned: false,
  },
  {
    id: 3,
    title: "Assignment submission reminder",
    message:
      "Please ensure that all pending assignments are submitted before the deadline. Contact your batch faculty if you need assistance.",
    audience: "B.Tech CSE - A",
    date: "28 Oct 2026",
    status: "Draft",
    author: "Institute Admin",
    pinned: false,
  },
];

const initialConversations = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Faculty",
    avatar: "RS",
    preview: "I have uploaded the updated course material.",
    time: "10:42 AM",
    unread: 2,
    messages: [
      {
        id: 1,
        sender: "them",
        text: "Good morning. I wanted to discuss the upcoming assessment schedule.",
        time: "10:30 AM",
      },
      {
        id: 2,
        sender: "me",
        text: "Sure. Please share the proposed schedule.",
        time: "10:35 AM",
      },
      {
        id: 3,
        sender: "them",
        text: "I have uploaded the updated course material.",
        time: "10:42 AM",
      },
    ],
  },
  {
    id: 2,
    name: "Aarav Mehta",
    role: "Student",
    avatar: "AM",
    preview: "Thank you for resolving my query.",
    time: "Yesterday",
    unread: 0,
    messages: [
      {
        id: 1,
        sender: "them",
        text: "I was unable to access the learning materials for my batch.",
        time: "Yesterday",
      },
      {
        id: 2,
        sender: "me",
        text: "The issue has been forwarded to the academic team.",
        time: "Yesterday",
      },
      {
        id: 3,
        sender: "them",
        text: "Thank you for resolving my query.",
        time: "Yesterday",
      },
    ],
  },
  {
    id: 3,
    name: "Priya Verma",
    role: "Faculty",
    avatar: "PV",
    preview: "Can we schedule a faculty meeting?",
    time: "Yesterday",
    unread: 1,
    messages: [
      {
        id: 1,
        sender: "them",
        text: "Can we schedule a faculty meeting?",
        time: "Yesterday",
      },
    ],
  },
  {
    id: 4,
    name: "Batch CSE - B",
    role: "Batch",
    avatar: "CB",
    preview: "We have received the announcement.",
    time: "27 Oct",
    unread: 0,
    messages: [
      {
        id: 1,
        sender: "them",
        text: "We have received the announcement.",
        time: "27 Oct",
      },
    ],
  },
];

const audienceOptions = [
  "All Students",
  "Faculty",
  "B.Tech CSE - A",
  "B.Tech CSE - B",
  "All Members",
];

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function Communication() {
  const [activeTab, setActiveTab] = useState("announcements");
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [search, setSearch] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("All");
  const [announcementFilter, setAnnouncementFilter] = useState("All");
  const [composeOpen, setComposeOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [form, setForm] = useState({
    title: "",
    message: "",
    audience: "All Students",
    status: "Published",
  });

  const activeConversation = conversations.find(
    (conversation) => conversation.id === selectedConversation
  );

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.message.toLowerCase().includes(search.toLowerCase());

      const matchesAudience =
        audienceFilter === "All" ||
        item.audience === audienceFilter ||
        (audienceFilter === "Students" &&
          item.audience.toLowerCase().includes("student"));

      const matchesStatus =
        announcementFilter === "All" || item.status === announcementFilter;

      return matchesSearch && matchesAudience && matchesStatus;
    });
  }, [announcements, search, audienceFilter, announcementFilter]);

  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) =>
      `${conversation.name} ${conversation.role}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [conversations, search]);

  const openCreateModal = () => {
    setEditingAnnouncement(null);
    setForm({
      title: "",
      message: "",
      audience: "All Students",
      status: "Published",
    });
    setComposeOpen(true);
  };

  const openEditModal = (announcement) => {
    setEditingAnnouncement(announcement);
    setForm({
      title: announcement.title,
      message: announcement.message,
      audience: announcement.audience,
      status: announcement.status,
    });
    setComposeOpen(true);
  };

  const saveAnnouncement = (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.message.trim()) return;

    if (editingAnnouncement) {
      setAnnouncements((current) =>
        current.map((item) =>
          item.id === editingAnnouncement.id
            ? { ...item, ...form }
            : item
        )
      );
    } else {
      setAnnouncements((current) => [
        {
          id: Date.now(),
          ...form,
          date: new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          author: "Institute Admin",
          pinned: false,
        },
        ...current,
      ]);
    }

    setComposeOpen(false);
  };

  const deleteAnnouncement = (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    setAnnouncements((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  const togglePin = (id) => {
    setAnnouncements((current) =>
      current.map((item) =>
        item.id === id ? { ...item, pinned: !item.pinned } : item
      )
    );
  };

  const sendMessage = (event) => {
    event.preventDefault();

    if (!messageText.trim() || !activeConversation) return;

    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: messageText.trim(),
      time: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selectedConversation
          ? {
              ...conversation,
              preview: newMessage.text,
              time: newMessage.time,
              messages: [...conversation.messages, newMessage],
            }
          : conversation
      )
    );

    setMessageText("");
  };

  const selectConversation = (id) => {
    setSelectedConversation(id);
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === id ? { ...conversation, unread: 0 } : conversation
      )
    );
  };

  const unreadCount = conversations.reduce(
    (total, item) => total + item.unread,
    0
  );

  return (
    <div className="institute-communication">
      <div className="institute-communication-heading">
        <div>
          <span className="institute-eyebrow">INSTITUTE WORKSPACE</span>
          <h1>Communication</h1>
          <p>Keep students and faculty informed and connected.</p>
        </div>

        {activeTab === "announcements" && (
          <button className="institute-communication-primary" onClick={openCreateModal}>
            <Plus size={17} />
            Create announcement
          </button>
        )}
      </div>

      <div className="institute-communication-stats">
        <div className="institute-communication-stat">
          <span className="institute-communication-stat-icon blue">
            <Megaphone size={19} />
          </span>
          <div>
            <strong>{announcements.length}</strong>
            <span>Total announcements</span>
          </div>
        </div>

        <div className="institute-communication-stat">
          <span className="institute-communication-stat-icon violet">
            <MessageSquare size={19} />
          </span>
          <div>
            <strong>{conversations.length}</strong>
            <span>Conversations</span>
          </div>
        </div>

        <div className="institute-communication-stat">
          <span className="institute-communication-stat-icon orange">
            <Bell size={19} />
          </span>
          <div>
            <strong>{unreadCount}</strong>
            <span>Unread messages</span>
          </div>
        </div>
      </div>

      <div className="institute-communication-tabs">
        <button
          className={activeTab === "announcements" ? "active" : ""}
          onClick={() => {
            setActiveTab("announcements");
            setSearch("");
          }}
        >
          <Megaphone size={17} />
          Announcements
        </button>

        <button
          className={activeTab === "messages" ? "active" : ""}
          onClick={() => {
            setActiveTab("messages");
            setSearch("");
          }}
        >
          <MessageSquare size={17} />
          Direct messages
          {unreadCount > 0 && <span className="institute-message-count">{unreadCount}</span>}
        </button>
      </div>

      {activeTab === "announcements" ? (
        <section className="institute-announcements-panel">
          <div className="institute-communication-toolbar">
            <div className="institute-communication-search">
              <Search size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search announcements..."
              />
            </div>

            <div className="institute-communication-filters">
              <select
                value={audienceFilter}
                onChange={(event) => setAudienceFilter(event.target.value)}
              >
                <option value="All">All audiences</option>
                <option value="Students">Students</option>
                <option value="Faculty">Faculty</option>
                <option value="All Students">All Students</option>
                <option value="B.Tech CSE - A">B.Tech CSE - A</option>
                <option value="B.Tech CSE - B">B.Tech CSE - B</option>
              </select>

              <select
                value={announcementFilter}
                onChange={(event) => setAnnouncementFilter(event.target.value)}
              >
                <option value="All">All statuses</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
              </select>
            </div>
          </div>

          <div className="institute-announcement-list">
            {filteredAnnouncements.length ? (
              filteredAnnouncements.map((item) => (
                <article className="institute-announcement-card" key={item.id}>
                  <div className="institute-announcement-top">
                    <div className="institute-announcement-icon">
                      <Megaphone size={19} />
                    </div>

                    <div className="institute-announcement-main">
                      <div className="institute-announcement-title-row">
                        <h3>{item.title}</h3>
                        {item.pinned && (
                          <span className="institute-pinned-label">
                            <Pin size={12} /> Pinned
                          </span>
                        )}
                      </div>
                      <p>{item.message}</p>
                    </div>

                    <div className="institute-announcement-actions">
                      <button
                        title={item.pinned ? "Unpin" : "Pin"}
                        onClick={() => togglePin(item.id)}
                      >
                        <Pin size={16} />
                      </button>
                      <button
                        title="Edit"
                        onClick={() => openEditModal(item)}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => deleteAnnouncement(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="institute-announcement-footer">
                    <div className="institute-announcement-meta">
                      <span><Users size={14} /> {item.audience}</span>
                      <span><CalendarDays size={14} /> {item.date}</span>
                      <span>By {item.author}</span>
                    </div>
                    <span
                      className={`institute-announcement-status ${item.status.toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <div className="institute-communication-empty">
                <Megaphone size={30} />
                <h3>No announcements found</h3>
                <p>Try changing your filters or create a new announcement.</p>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="institute-messages-panel">
          <aside className="institute-conversation-sidebar">
            <div className="institute-conversation-sidebar-heading">
              <div>
                <h3>Inbox</h3>
                <span>{conversations.length} conversations</span>
              </div>
              <button title="New message" onClick={() => window.alert("New conversation creation can be connected to the backend later.")}>
                <Plus size={18} />
              </button>
            </div>

            <div className="institute-communication-search conversation-search">
              <Search size={16} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search people..."
              />
            </div>

            <div className="institute-conversation-list">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  className={`institute-conversation-item ${
                    selectedConversation === conversation.id ? "selected" : ""
                  }`}
                  onClick={() => selectConversation(conversation.id)}
                >
                  <span className="institute-conversation-avatar">
                    {conversation.avatar}
                  </span>
                  <span className="institute-conversation-info">
                    <span className="institute-conversation-name-row">
                      <strong>{conversation.name}</strong>
                      <small>{conversation.time}</small>
                    </span>
                    <span className="institute-conversation-preview">
                      {conversation.preview}
                    </span>
                    <span className="institute-conversation-role">
                      {conversation.role}
                    </span>
                  </span>
                  {conversation.unread > 0 && (
                    <span className="institute-conversation-unread">
                      {conversation.unread}
                    </span>
                  )}
                </button>
              ))}

              {!filteredConversations.length && (
                <div className="institute-conversation-no-results">
                  No conversations found.
                </div>
              )}
            </div>
          </aside>

          <div className="institute-chat-window">
            {activeConversation ? (
              <>
                <div className="institute-chat-header">
                  <span className="institute-conversation-avatar">
                    {activeConversation.avatar}
                  </span>
                  <div>
                    <strong>{activeConversation.name}</strong>
                    <span>{activeConversation.role}</span>
                  </div>
                  <button title="More options" onClick={() => window.alert("More conversation actions can be added later.")}>
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                <div className="institute-chat-messages">
                  <div className="institute-chat-date-divider">
                    <span>Conversation</span>
                  </div>

                  {activeConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`institute-chat-message-row ${
                        message.sender === "me" ? "sent" : "received"
                      }`}
                    >
                      <div className="institute-chat-bubble">
                        <p>{message.text}</p>
                        <span>
                          {message.time}
                          {message.sender === "me" && <CheckCheck size={13} />}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <form className="institute-chat-composer" onSubmit={sendMessage}>
                  <button
                    type="button"
                    title="Attachments are not connected yet"
                    onClick={() => window.alert("File attachments will be available after backend integration.")}
                  >
                    <Paperclip size={19} />
                  </button>
                  <input
                    value={messageText}
                    onChange={(event) => setMessageText(event.target.value)}
                    placeholder={`Message ${activeConversation.name}...`}
                  />
                  <button
                    className="institute-chat-send"
                    type="submit"
                    disabled={!messageText.trim()}
                    title="Send message"
                  >
                    <Send size={17} />
                  </button>
                </form>
              </>
            ) : (
              <div className="institute-communication-empty">
                <MessageSquare size={30} />
                <h3>Select a conversation</h3>
                <p>Choose someone from your inbox to view messages.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {composeOpen && (
        <div
          className="institute-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setComposeOpen(false);
          }}
        >
          <form className="institute-modal institute-communication-modal" onSubmit={saveAnnouncement}>
            <div className="institute-modal-header">
              <div>
                <span className="institute-modal-icon"><Megaphone size={19} /></span>
                <div>
                  <h2 className="institute-modal-heading">
                    {editingAnnouncement ? "Edit announcement" : "Create announcement"}
                  </h2>
                  <p>Share an update with your institute community.</p>
                </div>
              </div>
              <button
                type="button"
                className="institute-modal-close"
                onClick={() => setComposeOpen(false)}
              >
                <X size={19} />
              </button>
            </div>

            <div className="institute-modal-body">
              <div className="institute-form-section">
                <label className="institute-form-field">
                  Announcement title *
                  <input
                    required
                    maxLength={100}
                    value={form.title}
                    onChange={(event) =>
                      setForm({ ...form, title: event.target.value })
                    }
                    placeholder="e.g. Examination schedule released"
                  />
                </label>

                <label className="institute-form-field">
                  Message *
                  <textarea
                    required
                    rows={5}
                    maxLength={1000}
                    value={form.message}
                    onChange={(event) =>
                      setForm({ ...form, message: event.target.value })
                    }
                    placeholder="Write your announcement here..."
                  />
                  <span className="institute-form-hint">
                    {form.message.length}/1000 characters
                  </span>
                </label>

                <div className="institute-form-grid">
                  <label className="institute-form-field">
                    Send to
                    <select
                      value={form.audience}
                      onChange={(event) =>
                        setForm({ ...form, audience: event.target.value })
                      }
                    >
                      {audienceOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>

                  <label className="institute-form-field">
                    Status
                    <select
                      value={form.status}
                      onChange={(event) =>
                        setForm({ ...form, status: event.target.value })
                      }
                    >
                      <option value="Published">Publish now</option>
                      <option value="Draft">Save as draft</option>
                      <option value="Scheduled">Scheduled</option>
                    </select>
                  </label>
                </div>
                {form.status === "Scheduled" && (
                  <p className="institute-form-hint">
                    Scheduled is currently a demo status. Actual scheduling requires backend integration.
                  </p>
                )}
              </div>
            </div>

            <div className="institute-modal-footer">
              <button
                type="button"
                className="institute-btn-secondary"
                onClick={() => setComposeOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="institute-btn-primary">
                <Send size={15} />
                {form.status === "Draft" ? "Save draft" : "Save announcement"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
