import Flashcards from "../components/Flashcards.jsx";
import { BookOpenCheck, CalendarClock, Layers3, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Revision() {
  return (
    <div className="student-page-stack student-revision-page">
      <section className="student-page-intro student-revision-hero">
        <div><span className="student-page-kicker"><BookOpenCheck size={16} /> SPACED PRACTICE</span><h2>Revision Studio</h2><p>Short, regular reviews help you keep important ideas fresh.</p></div>
        <div className="student-revision-hero-mark"><Sparkles size={28} /></div>
      </section>
      <section className="student-page-stats" aria-label="Revision overview"><div className="student-page-stat"><span>Cards due</span><strong>13</strong><small>Across your revision decks</small></div><div className="student-page-stat"><span>Active decks</span><strong><Layers3 size={19} /> 2</strong><small>Ready for a review</small></div><div className="student-page-stat"><span>Suggested session</span><strong>10 min</strong><small><CalendarClock size={15} /> A quick daily check-in</small></div></section>
      <section className="student-page-section student-revision-decks"><div className="student-page-section-heading"><div><h3>Your revision decks</h3><p>Choose a deck to start a flashcard session.</p></div></div><Flashcards /></section>
      <section className="student-page-callout"><div><h3>Keep your study material close</h3><p>Add notes to build out your personal learning library.</p></div><Link className="student-page-button" to="/app/student/materials">Open materials <BookOpenCheck size={16} /></Link></section>
    </div>
  );
}
