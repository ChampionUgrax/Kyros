import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Logo } from '../components/Nav.jsx';
import { Panel, Upload } from '../components/Panels.jsx';
import Flashcards from '../components/Flashcards.jsx';
import { useAuth } from '../services/AuthContext.jsx';
import { roleHome } from '../config/roles.js';

// Each tab = list of panels (endpoint + renderer type) or a custom component.
const DASH = {
  student: [
    { id: 'home', label: 'Home', icon: '🏠', panels: [{ title: 'Your progress', endpoint: '/student/overview', type: 'stats' }] },
    { id: 'revise', label: 'Revise', icon: '🃏', custom: Flashcards },
    { id: 'weak', label: 'Weak topics', icon: '🔥', panels: [{ title: 'Topic heatmap', endpoint: '/student/weak-topics', type: 'heatmap', empty: 'Take a quiz to see where you’re weak.' }] },
    { id: 'focus', label: 'Focus', icon: '⏱️', panels: [
      { title: 'Leaderboard', endpoint: '/student/leaderboard', type: 'leaderboard', empty: 'Join a group to compare focus hours.' },
      { title: 'Accountability groups', endpoint: '/student/groups', type: 'list', empty: 'No groups yet.' }] },
    { id: 'upload', label: 'Upload', icon: '📄', custom: Upload },
  ],
  teacher: [
    { id: 'home', label: 'Home', icon: '🏠', panels: [{ title: 'Overview', endpoint: '/teacher/overview', type: 'stats' }] },
    { id: 'mis', label: 'Misconceptions', icon: '🧩', panels: [
      { title: 'Class-wide misconceptions', endpoint: '/teacher/misconceptions', type: 'list', empty: 'No shared misconceptions detected yet.' },
      { title: 'Topic heatmap', endpoint: '/teacher/class-heatmap', type: 'heatmap' }] },
    { id: 'classes', label: 'Classes', icon: '🎓', panels: [{ title: 'Your classes', endpoint: '/teacher/classes', type: 'list', empty: 'No classes assigned.' }] },
  ],
  institute: [
    { id: 'home', label: 'Home', icon: '🏠', panels: [{ title: 'Institute overview', endpoint: '/institute/overview', type: 'stats' }] },
    { id: 'teachers', label: 'Teachers', icon: '🧑‍🏫', panels: [{ title: 'Teachers', endpoint: '/institute/teachers', type: 'list', empty: 'No teachers added yet.' }] },
    { id: 'batches', label: 'Batches', icon: '🗂️', panels: [{ title: 'Batches', endpoint: '/institute/batches', type: 'list', empty: 'No batches created yet.' }] },
  ],
};
export default function Dashboard({ role }) {
  const { user, logout } = useAuth();
  const tabs = DASH[role]; const [tab, setTab] = useState(tabs[0].id);
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== role) return <Navigate to={roleHome(user.role)} replace />;
  const cur = tabs.find((t) => t.id === tab); const Custom = cur.custom;
  return (
    <div className="shell glass-main-frame">
      <aside className="glass-sidebar">
        <Logo />
        <nav>{tabs.map((t) => <button key={t.id} className={t.id === tab ? 'on' : ''} onClick={() => setTab(t.id)}><span>{t.icon}</span><em>{t.label}</em></button>)}</nav>
        <button className="link out" onClick={logout}>Log out</button>
      </aside>
      <main key={tab} className="main">
        <h1>{tab === 'home' ? `Hi, ${user.name?.split(' ')[0] || 'there'}` : cur.label}</h1>
        {Custom ? <Custom /> : cur.panels.map((p) => <Panel key={p.endpoint} {...p} />)}
      </main>
    </div>
  );
}
