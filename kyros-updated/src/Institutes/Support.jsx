
import { useMemo, useState } from "react";
import {
  Headphones,
  Search,
  Plus,
  MessageCircle,
  Mail,
  Phone,
  Clock3,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FileQuestion,
  BookOpen,
  CreditCard,
  ShieldCheck,
  Users,
  Settings,
  GraduationCap,
  Send,
  X,
  ArrowLeft,
  Paperclip,
  CheckCircle2,
  CircleAlert,
  Ticket,
  LifeBuoy,
  ExternalLink,
} from "lucide-react";

const FAQS = [
  {
    id: 1,
    category: "Students",
    question: "How do I add a new student to KYROS?",
    answer:
      "Open Student Management from your institute dashboard, select Add Student, enter the student's details, choose their batch and submit the form. The student will appear in your student directory.",
  },
  {
    id: 2,
    category: "Students",
    question: "Can I edit a student's enrollment information?",
    answer:
      "Yes. Open the Students page, find the student and select Edit from their profile actions. You can update the fields supported by your current student management setup.",
  },
  {
    id: 3,
    category: "Batches",
    question: "How can I create a new batch?",
    answer:
      "Navigate to Batches, click Add Batch, enter the batch name, academic year, course, faculty and dates, then save your changes.",
  },
  {
    id: 4,
    category: "Faculty",
    question: "How do I assign faculty to a course?",
    answer:
      "Open Courses or Faculty Management, select the relevant record and use the course assignment controls to associate faculty with the course.",
  },
  {
    id: 5,
    category: "Attendance",
    question: "How can I review student attendance?",
    answer:
      "Use the Attendance section to filter attendance records by date, batch and status. You can review individual student attendance and export available records.",
  },
  {
    id: 6,
    category: "Account & Security",
    question: "How can I update my institute account settings?",
    answer:
      "Open your profile menu and select Settings. You can manage institute information, appearance preferences, notification preferences and academic settings.",
  },
  {
    id: 7,
    category: "Analytics",
    question: "Why are some analytics not showing?",
    answer:
      "Analytics depend on the records available to the dashboard. If the institute has not added enough student, attendance or course data, some charts may show limited or sample information.",
  },
  {
    id: 8,
    category: "Technical",
    question: "What should I do if the dashboard is not loading?",
    answer:
      "Refresh the page, check your internet connection and sign in again if needed. If the issue continues, create a technical support ticket and include the page name and a description of the problem.",
  },
];

const FAQ_CATEGORIES = [
  { label: "All topics", icon: BookOpen },
  { label: "Students", icon: Users },
  { label: "Batches", icon: GraduationCap },
  { label: "Faculty", icon: Users },
  { label: "Attendance", icon: Clock3 },
  { label: "Account & Security", icon: ShieldCheck },
  { label: "Analytics", icon: CreditCard },
  { label: "Technical", icon: Settings },
];

const INITIAL_TICKETS = [
  {
    id: "KYR-1024",
    subject: "Unable to update student information",
    category: "Students",
    priority: "Medium",
    status: "In Progress",
    createdAt: "29 Oct 2026",
    updatedAt: "30 Oct 2026",
    description:
      "The student profile does not seem to save the updated phone number.",
    messages: [
      {
        id: 1,
        sender: "You",
        message: "The student profile does not seem to save the updated phone number.",
        date: "29 Oct 2026 · 11:20 AM",
      },
      {
        id: 2,
        sender: "KYROS Support",
        message:
          "Thank you for reporting this. We are reviewing the issue.",
        date: "30 Oct 2026 · 10:15 AM",
      },
    ],
  },
  {
    id: "KYR-1023",
    subject: "Question about batch creation",
    category: "Batches",
    priority: "Low",
    status: "Resolved",
    createdAt: "25 Oct 2026",
    updatedAt: "27 Oct 2026",
    description: "Need guidance on assigning faculty during batch creation.",
    messages: [
      {
        id: 1,
        sender: "You",
        message: "Need guidance on assigning faculty during batch creation.",
        date: "25 Oct 2026 · 02:10 PM",
      },
      {
        id: 2,
        sender: "KYROS Support",
        message:
          "You can select the faculty member from the Faculty dropdown while creating a batch.",
        date: "27 Oct 2026 · 12:30 PM",
      },
    ],
  },
];

const CONTACT_OPTIONS = [
  {
    icon: Mail,
    title: "Email support",
    detail: "support@kyros.edu",
    description: "For detailed queries and attachments",
  },
  {
    icon: MessageCircle,
    title: "Support tickets",
    detail: "Track your requests",
    description: "Create and follow up on issues",
  },
  {
    icon: Clock3,
    title: "Support hours",
    detail: "Monday – Friday",
    description: "9:00 AM – 6:00 PM IST",
  },
];

function SupportStat({ icon: Icon, label, value, tone }) {
  return (
    <div className="institute-support-stat">
      <div className={`institute-support-stat-icon ${tone}`}>
        <Icon size={18} />
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function TicketStatus({ status }) {
  const normalized = status.toLowerCase().replace(/\s+/g, "-");

  return (
    <span className={`institute-support-ticket-status ${normalized}`}>
      <span />
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  return (
    <span className={`institute-support-priority ${priority.toLowerCase()}`}>
      {priority}
    </span>
  );
}

function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="institute-support-empty">
      <div className="institute-support-empty-icon">
        <Icon size={25} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}

export default function Support() {
  const [activeTab, setActiveTab] = useState("help");
  const [activeCategory, setActiveCategory] = useState("All topics");
  const [faqSearch, setFaqSearch] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(1);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketSearch, setTicketSearch] = useState("");
  const [ticketStatusFilter, setTicketStatusFilter] = useState("All");
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "Technical",
    priority: "Medium",
    description: "",
  });
  const [reply, setReply] = useState("");
  const [formError, setFormError] = useState("");

  const filteredFaqs = useMemo(() => {
    const query = faqSearch.trim().toLowerCase();

    return FAQS.filter((faq) => {
      const matchesCategory =
        activeCategory === "All topics" || faq.category === activeCategory;

      const matchesSearch =
        !query ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, faqSearch]);

  const filteredTickets = useMemo(() => {
    const query = ticketSearch.trim().toLowerCase();

    return tickets.filter((ticketItem) => {
      const matchesSearch =
        ticketItem.id.toLowerCase().includes(query) ||
        ticketItem.subject.toLowerCase().includes(query);

      const matchesStatus =
        ticketStatusFilter === "All" ||
        ticketItem.status === ticketStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tickets, ticketSearch, ticketStatusFilter]);

  const openTickets = tickets.filter(
    (ticketItem) => ticketItem.status !== "Resolved"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticketItem) => ticketItem.status === "Resolved"
  ).length;

  const createTicket = (event) => {
    event.preventDefault();
    setFormError("");

    if (!ticketForm.subject.trim() || !ticketForm.description.trim()) {
      setFormError("Please enter a subject and describe your issue.");
      return;
    }

    const now = new Date();
    const newTicket = {
      id: `KYR-${Date.now().toString().slice(-5)}`,
      subject: ticketForm.subject.trim(),
      category: ticketForm.category,
      priority: ticketForm.priority,
      status: "Open",
      createdAt: now.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      updatedAt: "Just now",
      description: ticketForm.description.trim(),
      messages: [
        {
          id: 1,
          sender: "You",
          message: ticketForm.description.trim(),
          date: "Just now",
        },
      ],
    };

    setTickets((current) => [newTicket, ...current]);
    setTicketForm({
      subject: "",
      category: "Technical",
      priority: "Medium",
      description: "",
    });
    setShowTicketForm(false);
    setSelectedTicket(newTicket);
    setActiveTab("tickets");
  };

  const sendReply = (event) => {
    event.preventDefault();

    if (!reply.trim() || !selectedTicket) return;

    const updatedTicket = {
      ...selectedTicket,
      updatedAt: "Just now",
      messages: [
        ...selectedTicket.messages,
        {
          id: Date.now(),
          sender: "You",
          message: reply.trim(),
          date: "Just now",
        },
      ],
    };

    setTickets((current) =>
      current.map((item) =>
        item.id === updatedTicket.id ? updatedTicket : item
      )
    );
    setSelectedTicket(updatedTicket);
    setReply("");
  };

  const closeTicketDetails = () => {
    setSelectedTicket(null);
  };

  return (
    <div className="institute-support-page">
      <div className="institute-support-header">
        <div>
          <div className="institute-support-eyebrow">
            <LifeBuoy size={14} />
            HELP CENTRE
          </div>
          <h1>Help & Support</h1>
          <p>
            Find answers, resolve issues and get assistance with your KYROS
            institute workspace.
          </p>
        </div>
        <button
          type="button"
          className="institute-support-create-btn"
          onClick={() => setShowTicketForm(true)}
        >
          <Plus size={16} />
          Create support ticket
        </button>
      </div>

      <div className="institute-support-hero">
        <div className="institute-support-hero-copy">
          <span>WE'RE HERE TO HELP</span>
          <h2>How can we help you today?</h2>
          <p>
            Search our help articles or raise a support request. We'll help you
            find the right solution.
          </p>
          <div className="institute-support-hero-search">
            <Search size={17} />
            <input
              value={faqSearch}
              onChange={(event) => {
                setFaqSearch(event.target.value);
                setActiveTab("help");
              }}
              placeholder="Search for help, questions or topics..."
              aria-label="Search help articles"
            />
            {faqSearch && (
              <button
                type="button"
                onClick={() => setFaqSearch("")}
                aria-label="Clear help search"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
        <div className="institute-support-hero-illustration">
          <div className="institute-support-illustration-orbit orbit-one" />
          <div className="institute-support-illustration-orbit orbit-two" />
          <div className="institute-support-illustration-circle">
            <Headphones size={43} strokeWidth={1.5} />
          </div>
          <div className="institute-support-floating-icon one">
            <MessageCircle size={17} />
          </div>
          <div className="institute-support-floating-icon two">
            <CheckCircle2 size={17} />
          </div>
        </div>
      </div>

      <div className="institute-support-stats">
        <SupportStat
          icon={Ticket}
          label="Total tickets"
          value={tickets.length}
          tone="blue"
        />
        <SupportStat
          icon={Clock3}
          label="Open requests"
          value={openTickets}
          tone="orange"
        />
        <SupportStat
          icon={CheckCircle2}
          label="Resolved tickets"
          value={resolvedTickets}
          tone="green"
        />
        <SupportStat
          icon={BookOpen}
          label="Help articles"
          value={FAQS.length}
          tone="purple"
        />
      </div>

      <div className="institute-support-tabs">
        <button
          type="button"
          className={activeTab === "help" ? "active" : ""}
          onClick={() => {
            setActiveTab("help");
            closeTicketDetails();
          }}
        >
          <BookOpen size={15} />
          Help articles
        </button>
        <button
          type="button"
          className={activeTab === "tickets" ? "active" : ""}
          onClick={() => {
            setActiveTab("tickets");
            closeTicketDetails();
          }}
        >
          <Ticket size={15} />
          My tickets
          {openTickets > 0 && (
            <span className="institute-support-tab-count">{openTickets}</span>
          )}
        </button>
        <button
          type="button"
          className={activeTab === "contact" ? "active" : ""}
          onClick={() => {
            setActiveTab("contact");
            closeTicketDetails();
          }}
        >
          <MessageCircle size={15} />
          Contact support
        </button>
      </div>

      {activeTab === "help" && (
        <div className="institute-support-help-layout">
          <aside className="institute-support-categories">
            <h3>Help topics</h3>
            {FAQ_CATEGORIES.map(({ label, icon: Icon }) => (
              <button
                type="button"
                key={label}
                className={activeCategory === label ? "active" : ""}
                onClick={() => setActiveCategory(label)}
              >
                <Icon size={15} />
                {label}
                <ChevronRight size={13} />
              </button>
            ))}
          </aside>

          <section className="institute-support-faq-section">
            <div className="institute-support-section-heading">
              <div>
                <h2>
                  {activeCategory === "All topics"
                    ? "Frequently asked questions"
                    : activeCategory}
                </h2>
                <p>Find quick answers to common questions.</p>
              </div>
              <span>{filteredFaqs.length} articles</span>
            </div>

            <div className="institute-support-faq-list">
              {filteredFaqs.map((faq) => {
                const isOpen = expandedFaq === faq.id;

                return (
                  <article
                    className={`institute-support-faq-item ${isOpen ? "expanded" : ""}`}
                    key={faq.id}
                  >
                    <button
                      type="button"
                      className="institute-support-faq-question"
                      onClick={() =>
                        setExpandedFaq(isOpen ? null : faq.id)
                      }
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp size={17} />
                      ) : (
                        <ChevronDown size={17} />
                      )}
                    </button>
                    {isOpen && (
                      <div className="institute-support-faq-answer">
                        <span>{faq.category}</span>
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </article>
                );
              })}

              {filteredFaqs.length === 0 && (
                <EmptyState
                  icon={FileQuestion}
                  title="No matching articles"
                  description="Try another search term or select a different help topic."
                  action={
                    <button
                      type="button"
                      onClick={() => {
                        setFaqSearch("");
                        setActiveCategory("All topics");
                      }}
                    >
                      Clear search
                    </button>
                  }
                />
              )}
            </div>
          </section>
        </div>
      )}

      {activeTab === "tickets" && (
        <section className="institute-support-ticket-section">
          {selectedTicket ? (
            <div className="institute-support-ticket-detail">
              <button
                type="button"
                className="institute-support-back-btn"
                onClick={closeTicketDetails}
              >
                <ArrowLeft size={15} />
                Back to tickets
              </button>

              <div className="institute-support-ticket-detail-header">
                <div>
                  <span>{selectedTicket.id}</span>
                  <h2>{selectedTicket.subject}</h2>
                  <p>
                    Created {selectedTicket.createdAt} · {selectedTicket.category}
                  </p>
                </div>
                <TicketStatus status={selectedTicket.status} />
              </div>

              <div className="institute-support-ticket-metadata">
                <div>
                  <span>Priority</span>
                  <PriorityBadge priority={selectedTicket.priority} />
                </div>
                <div>
                  <span>Last updated</span>
                  <strong>{selectedTicket.updatedAt}</strong>
                </div>
                <div>
                  <span>Category</span>
                  <strong>{selectedTicket.category}</strong>
                </div>
              </div>

              <div className="institute-support-conversation">
                <h3>Conversation</h3>
                {selectedTicket.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`institute-support-message ${message.sender === "You" ? "own" : ""}`}
                  >
                    <div className="institute-support-message-avatar">
                      {message.sender === "You" ? (
                        <Users size={14} />
                      ) : (
                        <Headphones size={14} />
                      )}
                    </div>
                    <div className="institute-support-message-body">
                      <div>
                        <strong>{message.sender}</strong>
                        <span>{message.date}</span>
                      </div>
                      <p>{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {selectedTicket.status !== "Resolved" && (
                <form
                  className="institute-support-reply-form"
                  onSubmit={sendReply}
                >
                  <textarea
                    rows="3"
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                    placeholder="Write a follow-up message..."
                  />
                  <div>
                    <span>Replies are saved locally in this demo.</span>
                    <button type="submit" disabled={!reply.trim()}>
                      <Send size={14} />
                      Send reply
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <>
              <div className="institute-support-section-heading">
                <div>
                  <h2>My support tickets</h2>
                  <p>Track your submitted requests and their progress.</p>
                </div>
                <button
                  type="button"
                  className="institute-support-small-create-btn"
                  onClick={() => setShowTicketForm(true)}
                >
                  <Plus size={14} />
                  New ticket
                </button>
              </div>

              <div className="institute-support-ticket-toolbar">
                <div className="institute-support-ticket-search">
                  <Search size={15} />
                  <input
                    value={ticketSearch}
                    onChange={(event) => setTicketSearch(event.target.value)}
                    placeholder="Search tickets..."
                  />
                </div>
                <select
                  value={ticketStatusFilter}
                  onChange={(event) => setTicketStatusFilter(event.target.value)}
                >
                  <option value="All">All statuses</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              {filteredTickets.length > 0 ? (
                <div className="institute-support-ticket-list">
                  {filteredTickets.map((ticketItem) => (
                    <button
                      type="button"
                      className="institute-support-ticket-row"
                      key={ticketItem.id}
                      onClick={() => setSelectedTicket(ticketItem)}
                    >
                      <div className="institute-support-ticket-icon">
                        <Ticket size={17} />
                      </div>
                      <div className="institute-support-ticket-main">
                        <div className="institute-support-ticket-title">
                          <strong>{ticketItem.subject}</strong>
                          <span>{ticketItem.id}</span>
                        </div>
                        <p>
                          {ticketItem.category} · Created {ticketItem.createdAt}
                        </p>
                      </div>
                      <PriorityBadge priority={ticketItem.priority} />
                      <TicketStatus status={ticketItem.status} />
                      <ChevronRight
                        size={16}
                        className="institute-support-ticket-chevron"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Ticket}
                  title="No tickets found"
                  description="There are no tickets matching your search or status filter."
                  action={
                    <button
                      type="button"
                      onClick={() => {
                        setTicketSearch("");
                        setTicketStatusFilter("All");
                      }}
                    >
                      Clear filters
                    </button>
                  }
                />
              )}
            </>
          )}
        </section>
      )}

      {activeTab === "contact" && (
        <section className="institute-support-contact-section">
          <div className="institute-support-section-heading">
            <div>
              <h2>Get in touch</h2>
              <p>Choose a support channel for your query.</p>
            </div>
          </div>

          <div className="institute-support-contact-grid">
            {CONTACT_OPTIONS.map(({ icon: Icon, title, detail, description }) => (
              <div className="institute-support-contact-card" key={title}>
                <div className="institute-support-contact-icon">
                  <Icon size={20} />
                </div>
                <h3>{title}</h3>
                <strong>{detail}</strong>
                <p>{description}</p>
                {title === "Email support" && (
                  <a href="mailto:support@kyros.edu">
                    Email us <ExternalLink size={13} />
                  </a>
                )}
                {title === "Support tickets" && (
                  <button
                    type="button"
                    onClick={() => setShowTicketForm(true)}
                  >
                    Create a ticket <ChevronRight size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="institute-support-contact-note">
            <ShieldCheck size={19} />
            <div>
              <strong>Need urgent assistance?</strong>
              <p>
                Create a ticket with High priority and include the relevant
                details. The support team can review it once ticket submission
                is connected to the backend.
              </p>
            </div>
          </div>
        </section>
      )}

      {showTicketForm && (
        <div
          className="institute-support-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowTicketForm(false);
              setFormError("");
            }
          }}
        >
          <form
            className="institute-support-ticket-modal"
            onSubmit={createTicket}
          >
            <div className="institute-support-modal-heading">
              <div>
                <span>KYROS HELP CENTRE</span>
                <h2>Create a support ticket</h2>
                <p>Tell us what you need help with.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowTicketForm(false);
                  setFormError("");
                }}
                aria-label="Close ticket form"
              >
                <X size={18} />
              </button>
            </div>

            <div className="institute-support-form-fields">
              <label>
                Issue subject
                <input
                  required
                  maxLength={100}
                  value={ticketForm.subject}
                  onChange={(event) =>
                    setTicketForm({
                      ...ticketForm,
                      subject: event.target.value,
                    })
                  }
                  placeholder="Briefly describe your issue"
                />
              </label>

              <div className="institute-support-form-row">
                <label>
                  Category
                  <select
                    value={ticketForm.category}
                    onChange={(event) =>
                      setTicketForm({
                        ...ticketForm,
                        category: event.target.value,
                      })
                    }
                  >
                    {FAQ_CATEGORIES.filter(
                      (category) => category.label !== "All topics"
                    ).map((category) => (
                      <option key={category.label} value={category.label}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Priority
                  <select
                    value={ticketForm.priority}
                    onChange={(event) =>
                      setTicketForm({
                        ...ticketForm,
                        priority: event.target.value,
                      })
                    }
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </label>
              </div>

              <label>
                Describe your issue
                <textarea
                  required
                  rows="5"
                  maxLength={1500}
                  value={ticketForm.description}
                  onChange={(event) =>
                    setTicketForm({
                      ...ticketForm,
                      description: event.target.value,
                    })
                  }
                  placeholder="Explain what happened, what you expected and any steps to reproduce the issue..."
                />
                <small>{ticketForm.description.length}/1500 characters</small>
              </label>

              {formError && (
                <div className="institute-support-form-error">
                  <CircleAlert size={14} />
                  {formError}
                </div>
              )}
            </div>

            <div className="institute-support-modal-actions">
              <button
                type="button"
                className="institute-support-cancel-btn"
                onClick={() => {
                  setShowTicketForm(false);
                  setFormError("");
                }}
              >
                Cancel
              </button>
              <button type="submit" className="institute-support-submit-btn">
                <Send size={14} />
                Submit ticket
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
