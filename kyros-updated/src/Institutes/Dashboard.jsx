import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext.jsx";
import { roleHome } from "../config/roles.js";
import InstituteNavbar from "./Navbar.jsx";
import InstituteTopbar from "./TopBar.jsx";
import Analytics from "./Analytics.jsx";
import Attendance from "./Attendance.jsx";
import Batches from "./Batches.jsx";
import BatchDetails from "./BatchesDetails.jsx";
import Communication from "./Communication.jsx";
import Courses from "./Courses.jsx";
import CourseDetails from "./CoursesDetail.jsx";
import Faculty from "./Faculty.jsx";
import FacultyDetails from "./FacultyDetails.jsx";
import LearningInsights from "./LearningInsights.jsx";
import Notifications from "./Notification.jsx";
import Overview from "./Overview.jsx";
import Pagination from "./Pagination.jsx";
import Profile from "./Profile.jsx";
import Settings from "./Settings.jsx";
import StudentDetails from "./StudentDetails.jsx";
import Students from "./Students.jsx";  

export default function InstituteDashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname.split("/").filter(Boolean).at(-1) || "overview";
  const setActiveTab = (tab) => navigate(`/app/institute/${tab}`);

  // Replace this demo object with your authenticated institute user.
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== "institute") return <Navigate to={roleHome(user.role)} replace />;

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview onNavigate={setActiveTab} />;

      case "students":
        return <Students />;

      case "faculty":
        return <Faculty />

      case "batches":
        return <Batches />;

      case "courses":
        return <Courses />

      case "analytics":
        return <Analytics />

      case "attendance":
        return <Attendance />

      case "notifications":
        return <Notifications />

      case "communication":
        return <Communication />

      case "profile":
        return <Profile user={user} />;

      case "settings":
        return <Settings />

      default:
        return <Overview onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="institute-dashboard">
      <InstituteNavbar
        activeTab={activeTab}
        onNavigate={setActiveTab}
        user={user}
        onLogout={logout}
      />

      <main className="institute-main">
      <InstituteTopbar
          activeTab={activeTab}
          user={user}
          onNavigate={setActiveTab}
        />

        <div className="institute-page-content">
          {renderContent()}
        </div>

        <footer className="institute-footer">
          <span>KYROS Institute Workspace</span>
          <span>Empowering better learning, together.</span>
        </footer>
      </main>
    </div>
  );
}

