import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Plus,
  Send,
  Paperclip,
  MoreHorizontal,
  Phone,
  Video,
  ArrowLeft,
  MessageCircle,
  Users,
  CheckCheck,
  Smile,
} from "lucide-react";

const INITIAL_CHATS = [
  {
    id: 1,
    name: "Aarav Sharma",
    role: "Student · Class 10A",
    avatar: "AS",
    color: "blue",
    online: true,
    unread: 2,
    preview: "Thank you, ma'am!",
    time: "10:42 AM",
    messages: [
      {
        id: 1,
        text: "Good morning, ma'am!",
        time: "10:30 AM",
        sent: false,
      },
      {
        id: 2,
        text: "I had a doubt regarding quadratic equations.",
        time: "10:31 AM",
        sent: false,
      },
      {
        id: 3,
        text: "Good morning, Aarav. Sure, tell me what you're stuck on.",
        time: "10:35 AM",
        sent: true,
      },
      {
        id: 4,
        text: "I am having trouble understanding how to factorise the equation.",
        time: "10:39 AM",
        sent: false,
      },
      {
        id: 5,
        text: "Thank you, ma'am!",
        time: "10:42 AM",
        sent: false,
      },
    ],
  },
  {
    id: 2,
    name: "Class 10A",
    role: "Group · 28 members",
    avatar: "10A",
    color: "purple",
    online: false,
    unread: 4,
    preview: "The assignment is due tomorrow.",
    time: "9:50 AM",
    messages: [
      {
        id: 1,
        text: "Good morning everyone! Please complete the algebra worksheet.",
        time: "9:20 AM",
        sent: true,
      },
      {
        id: 2,
        text: "Ma'am, should we solve all the questions?",
        time: "9:35 AM",
        sent: false,
      },
      {
        id: 3,
        text: "Yes, please solve all 10 questions.",
        time: "9:42 AM",
        sent: true,
      },
      {
        id: 4,
        text: "The assignment is due tomorrow.",
        time: "9:50 AM",
        sent: false,
      },
    ],
  },
  {
    id: 3,
    name: "Priya Verma",
    role: "Student · Class 10B",
    avatar: "PV",
    color: "pink",
    online: true,
    unread: 0,
    preview: "I have completed the revision.",
    time: "Yesterday",
    messages: [
      {
        id: 1,
        text: "Ma'am, I have completed the revision worksheet.",
        time: "Yesterday",
        sent: false,
      },
      {
        id: 2,
        text: "That's great, Priya! Keep practising.",
        time: "Yesterday",
        sent: true,
      },
      {
        id: 3,
        text: "I have completed the revision.",
        time: "Yesterday",
        sent: false,
      },
    ],
  },
  {
    id: 4,
    name: "Rohan Mehta",
    role: "Student · Class 9A",
    avatar: "RM",
    color: "orange",
    online: false,
    unread: 0,
    preview: "Can we discuss this after class?",
    time: "Yesterday",
    messages: [
      {
        id: 1,
        text: "I wanted to discuss my recent test performance.",
        time: "Yesterday",
        sent: false,
      },
      {
        id: 2,
        text: "Of course. We can discuss it after class.",
        time: "Yesterday",
        sent: true,
      },
      {
        id: 3,
        text: "Can we discuss this after class?",
        time: "Yesterday",
        sent: false,
      },
    ],
  },
  {
    id: 5,
    name: "Science Faculty",
    role: "Group · 6 members",
    avatar: "SF",
    color: "green",
    online: false,
    unread: 0,
    preview: "Meeting scheduled for Friday.",
    time: "Mon",
    messages: [
      {
        id: 1,
        text: "The weekly faculty meeting is scheduled for Friday.",
        time: "Mon",
        sent: false,
      },
    ],
  },
];

function getCurrentTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TeacherChat() {
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState(1);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  const messageEndRef = useRef(null);
  const activeChat = chats.find((chat) => chat.id === activeChatId);

  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return chats;

    return chats.filter(
      (chat) =>
        chat.name.toLowerCase().includes(query) ||
        chat.role.toLowerCase().includes(query) ||
        chat.preview.toLowerCase().includes(query)
    );
  }, [chats, search]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChatId, activeChat?.messages.length]);

  function openChat(chatId) {
    setActiveChatId(chatId);
    setMobileChatOpen(true);

    setChats((previous) =>
      previous.map((chat) =>
        chat.id === chatId ? { ...chat, unread: 0 } : chat
      )
    );
  }

  function sendMessage(event) {
    event.preventDefault();

    const text = message.trim();
    if (!text || !activeChat) return;

    const newMessage = {
      id: Date.now(),
      text,
      time: getCurrentTime(),
      sent: true,
    };

    setChats((previous) =>
      previous.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              preview: text,
              time: "Now",
            }
          : chat
      )
    );

    setMessage("");
  }

  return (
    <section className="teacher-chat-page">
      <div className="teacher-chat-heading">
        <div>
          <span className="teacher-chat-eyebrow">COMMUNICATION</span>
          <h1>Messages</h1>
          <p>Stay connected with your students and fellow teachers.</p>
        </div>

        <button className="teacher-chat-new-button" type="button">
          <Plus size={18} />
          <span>New message</span>
        </button>
      </div>

      <div
        className={`teacher-chat-layout ${
          mobileChatOpen ? "mobile-chat-active" : ""
        }`}
      >
        {/* Conversation sidebar */}
        <aside className="teacher-chat-sidebar">
          <div className="teacher-chat-sidebar-heading">
            <div>
              <h2>Conversations</h2>
              <span>{chats.length} conversations</span>
            </div>

            <button
              type="button"
              className="teacher-chat-icon-button"
              aria-label="New conversation"
            >
              <Plus size={19} />
            </button>
          </div>

          <div className="teacher-chat-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="teacher-chat-filters">
            <span className="active">All messages</span>
            <span>Unread</span>
          </div>

          <div className="teacher-chat-list">
            {filteredChats.length === 0 ? (
              <div className="teacher-chat-no-results">
                <MessageCircle size={24} />
                <p>No conversations found</p>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <button
                  type="button"
                  key={chat.id}
                  className={`teacher-chat-contact ${
                    activeChatId === chat.id ? "selected" : ""
                  }`}
                  onClick={() => openChat(chat.id)}
                >
                  <div
                    className={`teacher-chat-avatar ${chat.color}`}
                  >
                    {chat.avatar}
                    {chat.online && (
                      <span className="teacher-chat-online-dot" />
                    )}
                  </div>

                  <div className="teacher-chat-contact-content">
                    <div className="teacher-chat-contact-top">
                      <strong>{chat.name}</strong>
                      <span>{chat.time}</span>
                    </div>

                    <div className="teacher-chat-contact-bottom">
                      <span>{chat.preview}</span>
                      {chat.unread > 0 && (
                        <span className="teacher-chat-unread">
                          {chat.unread}
                        </span>
                      )}
                    </div>

                    <small>{chat.role}</small>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="teacher-chat-sidebar-footer">
            <Users size={16} />
            <span>Connect with your learning community</span>
          </div>
        </aside>

        {/* Active conversation */}
        <main className="teacher-chat-window">
          {activeChat ? (
            <>
              <header className="teacher-chat-window-header">
                <button
                  type="button"
                  className="teacher-chat-back-button"
                  onClick={() => setMobileChatOpen(false)}
                  aria-label="Back to conversations"
                >
                  <ArrowLeft size={20} />
                </button>

                <div
                  className={`teacher-chat-avatar ${activeChat.color}`}
                >
                  {activeChat.avatar}
                  {activeChat.online && (
                    <span className="teacher-chat-online-dot" />
                  )}
                </div>

                <div className="teacher-chat-person-info">
                  <h2>{activeChat.name}</h2>
                  <span>
                    {activeChat.online ? "● Online" : activeChat.role}
                  </span>
                </div>

                <div className="teacher-chat-header-actions">
                  <button
                    type="button"
                    aria-label="Voice call"
                    title="Voice call (demo)"
                  >
                    <Phone size={18} />
                  </button>
                  <button
                    type="button"
                    aria-label="Video call"
                    title="Video call (demo)"
                  >
                    <Video size={19} />
                  </button>
                  <button
                    type="button"
                    aria-label="More options"
                    title="More options"
                  >
                    <MoreHorizontal size={21} />
                  </button>
                </div>
              </header>

              <div className="teacher-chat-date-divider">
                <span>Today</span>
              </div>

              <div className="teacher-chat-messages">
                {activeChat.messages.map((item) => (
                  <div
                    key={item.id}
                    className={`teacher-chat-message-row ${
                      item.sent ? "sent" : "received"
                    }`}
                  >
                    {!item.sent && (
                      <div
                        className={`teacher-chat-message-avatar ${activeChat.color}`}
                      >
                        {activeChat.avatar}
                      </div>
                    )}

                    <div className="teacher-chat-message-content">
                      <div className="teacher-chat-bubble">
                        {item.text}
                      </div>

                      <div className="teacher-chat-message-meta">
                        <span>{item.time}</span>
                        {item.sent && (
                          <CheckCheck size={14} className="teacher-chat-read-icon" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <div ref={messageEndRef} />
              </div>

              <form
                className="teacher-chat-composer"
                onSubmit={sendMessage}
              >
                <button
                  type="button"
                  className="teacher-chat-composer-action"
                  aria-label="Attach file (demo)"
                  title="Attachments are not enabled yet"
                >
                  <Paperclip size={19} />
                </button>

                <input
                  type="text"
                  placeholder={`Message ${activeChat.name}...`}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                />

                <button
                  type="button"
                  className="teacher-chat-composer-action emoji-action"
                  aria-label="Emoji (demo)"
                  title="Emoji picker is not enabled yet"
                >
                  <Smile size={19} />
                </button>

                <button
                  type="submit"
                  className="teacher-chat-send-button"
                  disabled={!message.trim()}
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </form>

              <p className="teacher-chat-demo-note">
                Demo mode · Messages are stored only in this page session.
              </p>
            </>
          ) : (
            <div className="teacher-chat-empty">
              <MessageCircle size={42} />
              <h2>Select a conversation</h2>
              <p>Choose a student or group to start messaging.</p>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}