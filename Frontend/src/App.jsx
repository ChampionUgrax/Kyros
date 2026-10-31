import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./services/AuthContext.jsx";
import Landing from "./pages/Landing.jsx";
import Extension from "./pages/Extension.jsx";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { ROLES } from "./config/roles.js";
import StudentDashboard from "./Students/Dashboard.jsx";

/* Teachers Dashboard */
import TeacherChat from "./Teachers/Chat.jsx";
import TeacherDashboard from "./Teachers/Dashboard.jsx";
import ClassHeatmap from "./Teachers/ClassHeatmap.jsx";

/* Institute Dashboard */
import InstituteDashboard from "./Institutes/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/extension" element={<Extension />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/institute" element={<Navigate to="/app/institute" replace />} />
          {ROLES.map((r) => (
            <Route
              key={r.value}
              path={`${r.home}/*`}
              element={
                r.value === "student" ? (
                  <StudentDashboard />
                ) : r.value === "teacher" ? (
                  <TeacherDashboard />
                ) : r.value === "institute" ? (
                  <InstituteDashboard />
                ) : (
                  <Dashboard role={r.value} />
                )
              }
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
