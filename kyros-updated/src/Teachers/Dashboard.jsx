import { useLocation, useNavigate, Navigate } from "react-router-dom";
import {
  Bell,
  BookOpen,
  BrainCircuit,
  ChartNoAxesColumn,
  MessageCircle,
  Sparkles,
  Users,
  GraduationCap,
  TrendingUp,
  Clock3,
} from "lucide-react";

import TeacherNavbar from "./Navbar.jsx";

import { Panel } from "../components/Panels.jsx";
import { useAuth } from "../services/AuthContext.jsx";
import { roleHome } from "../config/roles.js";
import TeacherChat from "./Chat.jsx";
import ClassHeatmap from "./ClassHeatmap.jsx";
import Misconceptions from "./Misconceptions.jsx";
import Myclasses from "./Myclasses.jsx";
import MyProfile from "./MyProfile.jsx";
import Notifications from "./Notifications.jsx";
import Overview from "./Overview.jsx";
import Settings from "./Settings.jsx";

function ComingSoon({ title, description }) {
  return (
    <section className="teacher-placeholder glass-card">
      <div className="teacher-placeholder-icon">
        <Sparkles size={25} />
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      <span>This section will be available as we build your workspace.</span>
    </section>
  );
}

function TeacherOverview({ user, onNavigate }) {
  const firstName = user?.name?.trim().split(/\s+/)[0] || "Teacher";

  return (
    <>
      {/* WELCOME */}
      <section className="teacher-welcome">
        <div>
          <span className="teacher-eyebrow">YOUR TEACHING SPACE</span>

          <h1>Welcome back, {firstName}!</h1>

          <p>Here's what's happening in your classrooms today.</p>
        </div>

        <div className="teacher-welcome-icon">
          <GraduationCap size={35} />
        </div>
      </section>

      {/* STATISTICS */}
      <section className="teacher-section">
        <div className="teacher-section-heading">
          <div>
            <h2>Your teaching overview</h2>
            <p>A snapshot of your classroom activity.</p>
          </div>
        </div>

        <Panel
          title="Teaching statistics"
          endpoint="/teacher/overview"
          type="stats"
          empty="Your teaching statistics will appear here."
        />
      </section>

      {/* PERFORMANCE + MISCONCEPTIONS */}
      <div className="teacher-content-grid">
        <section className="teacher-section">
          <div className="teacher-section-heading">
            <div>
              <h2>Class performance</h2>
              <p>Understand topic-wise learning progress.</p>
            </div>

            <button
              className="teacher-text-link"
              onClick={() => onNavigate("heatmap")}
            >
              View heatmap
              <ChartNoAxesColumn size={16} />
            </button>
          </div>

          <Panel
            endpoint="/teacher/class-heatmap"
            type="heatmap"
            empty="Class performance data will appear here."
          />
        </section>

        <section className="teacher-section">
          <div className="teacher-section-heading">
            <div>
              <h2>Common misconceptions</h2>
              <p>Identify concepts students find difficult.</p>
            </div>

            <button
              className="teacher-text-link"
              onClick={() => onNavigate("misconceptions")}
            >
              View all
              <BrainCircuit size={16} />
            </button>
          </div>

          <Panel
            endpoint="/teacher/misconceptions"
            type="list"
            empty="No misconceptions have been identified yet."
          />
        </section>
      </div>

      {/* MY CLASSES */}
      <section className="teacher-section">
        <div className="teacher-section-heading">
          <div>
            <h2>My Classes</h2>
            <p>Quick access to your teaching groups.</p>
          </div>

          <button
            className="teacher-text-link"
            onClick={() => onNavigate("classes")}
          >
            View all classes
            <BookOpen size={16} />
          </button>
        </div>

        <Panel
          endpoint="/teacher/classes"
          type="list"
          empty="Your assigned classes will appear here."
        />
      </section>

      {/* QUICK ACTIONS */}
      <section className="teacher-section">
        <div className="teacher-section-heading">
          <div>
            <h2>Quick actions</h2>
            <p>Jump directly to your teaching tools.</p>
          </div>
        </div>

        <div className="teacher-quick-actions">
          <button onClick={() => onNavigate("classes")}>
            <span className="teacher-action-icon">
              <Users size={21} />
            </span>
            <strong>Manage Classes</strong>
            <span>View your students and classes</span>
          </button>

          <button onClick={() => onNavigate("misconceptions")}>
            <span className="teacher-action-icon">
              <BrainCircuit size={21} />
            </span>
            <strong>Review Misconceptions</strong>
            <span>Find learning gaps</span>
          </button>

          <button onClick={() => onNavigate("heatmap")}>
            <span className="teacher-action-icon">
              <TrendingUp size={21} />
            </span>
            <strong>Analyze Performance</strong>
            <span>Explore class heatmaps</span>
          </button>
        </div>
      </section>
    </>
  );
}

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname.split("/").filter(Boolean).at(-1) || "overview";
  const setActiveTab = (tab) => navigate(`/app/teacher/${tab}`);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role !== "teacher") {
    return <Navigate to={roleHome(user.role)} replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview user={user} onNavigate={setActiveTab} />;

      case "classes":
        return <Myclasses />;

      case "misconceptions":
        return <Misconceptions />;

      case "heatmap":
        return <ClassHeatmap />;

      case "notifications":
        return <Notifications />;

      case "chat":
        return <TeacherChat />;

      case "profile":
        return <MyProfile />;

      case "settings":
        return (
          <Settings
          />
        );

      default:
        return <TeacherOverview user={user} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="teacher-dashboard">
      <TeacherNavbar
        activeTab={activeTab}
        onNavigate={setActiveTab}
        user={user}
        onLogout={logout}
      />

      <main className="teacher-main">
        <header className="teacher-topbar">
          <div className="teacher-topbar-left">
            <span className="teacher-topbar-label">TEACHER WORKSPACE</span>
            <p>Understand your students. Improve learning.</p>
          </div>

          <button
            type="button"
            className="teacher-topbar-notification"
            onClick={() => setActiveTab("notifications")}
            aria-label="View notifications"
          >
            <Bell size={19} />
          </button>
        </header>

        <div className="teacher-page-content">{renderContent()}</div>

        <footer className="teacher-footer">
          <span>KYROS Teaching Workspace</span>
          <span>Empowering better learning, together.</span>
        </footer>
      </main>
    </div>
  );
}
