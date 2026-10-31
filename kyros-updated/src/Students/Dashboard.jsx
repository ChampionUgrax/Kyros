
import { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import StudentNavbar from "./Navbar.jsx";
import StudentTopbar from "./TopBar.jsx";

import Overview from "./Overview.jsx";
import MyLearning from "./MyLearning.jsx";
import AIAssistant from "./AiAssisstant.jsx";
import WeakTopics from "./WeakTopics.jsx";
import Revision from "./Revision.jsx";
import Focus from "./Focus.jsx";
import Notifications from "./Notification.jsx";
import Chat from "./ChatLive.jsx";
import MyMaterials from "./MyMaterial.jsx";
import MyProfile from "./MyProfile.jsx";
import Settings from "./Settings.jsx";
import "./StudentPages.css";

const STUDENT_TABS = new Set([
  "overview", "learning", "assistant", "weak", "revision", "focus",
  "notifications", "chat", "materials", "profile", "settings",
]);

import { useAuth } from "../services/AuthContext.jsx";
import { roleHome } from "../config/roles.js";

export default function StudentDashboard() {
  const { user, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const routeSegment = location.pathname.split("/").filter(Boolean).at(-1);
  const activeTab = STUDENT_TABS.has(routeSegment) ? routeSegment : "overview";
  const setActiveTab = (tab) => navigate(`/app/student/${tab}`);

  useEffect(() => {
    if (routeSegment !== activeTab) {
      navigate("/app/student/overview", { replace: true });
    }
  }, [activeTab, navigate, routeSegment]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role !== "student") {
    return <Navigate to={roleHome(user.role)} replace />;
  }

  const firstName =
    user.name?.trim().split(/\s+/)[0] || "Student";

  const deleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your demo account? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      const users = JSON.parse(
        localStorage.getItem("kyros_mock_users") || "[]"
      );

      const updatedUsers = users.filter(
        (item) =>
          !(
            item.email === user.email &&
            item.role === user.role
          )
      );

      localStorage.setItem(
        "kyros_mock_users",
        JSON.stringify(updatedUsers)
      );
    } catch (error) {
      console.error("Unable to remove demo account:", error);
    }

    logout();
  };

  const renderPage = () => {
    switch (activeTab) {
      case "overview":
        return (
          <Overview
            firstName={firstName}
            onNavigate={setActiveTab}
          />
        );

      case "learning":
        return <MyLearning onNavigate={setActiveTab} />;

      case "assistant":
        return <AIAssistant onNavigate={setActiveTab} />;

      case "weak":
        return <WeakTopics onNavigate={setActiveTab} />;

      case "revision":
        return <Revision />;

      case "focus":
        return <Focus />;

      case "notifications":
        return <Notifications />;

      case "chat":
        return <Chat />;

      case "materials":
        return <MyMaterials />;

      case "profile":
        return <MyProfile user={user} />;

      case "settings":
        return <Settings />;

      default:
        return (
          <Overview
            firstName={firstName}
            onNavigate={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="student-dashboard">

      <StudentNavbar
        activeTab={activeTab}
        onNavigate={setActiveTab}
        user={user}
        onLogout={logout}
        onDeleteAccount={deleteAccount}
      />

      <main className="student-main">

        <StudentTopbar
          activeTab={activeTab}
          onNavigate={setActiveTab}
          user={user}
        />

        <div className="student-page-content">
          {renderPage()}
        </div>

        <footer className="student-footer">
          <span>KYROS Learning Workspace</span>
          <span>Learn smarter, one step at a time.</span>
        </footer>

      </main>
    </div>
  );
}
