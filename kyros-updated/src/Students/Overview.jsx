
import { BrainCircuit, ChevronRight } from "lucide-react";
import { Panel } from "../components/Panels.jsx";

export default function Overview({ firstName, onNavigate }) {
  return (
    <>
      <section className="student-welcome">
        <div>
          <span className="student-eyebrow">
            YOUR LEARNING SPACE
          </span>
          <h2>Welcome back, {firstName}!</h2>
          <p>Let's make today a meaningful learning day.</p>
        </div>

        <div className="student-welcome-icon">
          <BrainCircuit size={34} />
        </div>
      </section>

      <section className="student-section">
        <div className="student-section-heading">
          <div>
            <h2>Your learning overview</h2>
            <p>A snapshot of your learning activity.</p>
          </div>
        </div>

        <Panel
          title="Learning statistics"
          endpoint="/student/overview"
          type="stats"
          empty="Your learning statistics will appear here once you start learning."
        />
      </section>

      <div className="student-content-grid">
        <section className="student-section">
          <div className="student-section-heading">
            <div>
              <h2>Topics to improve</h2>
              <p>Identify concepts that need more attention.</p>
            </div>

            <button
              className="student-text-link"
              onClick={() => onNavigate("weak")}
            >
              View all <ChevronRight size={16} />
            </button>
          </div>

          <Panel
            endpoint="/student/weak-topics"
            type="heatmap"
            empty="Take a quiz to discover topics that need improvement."
          />
        </section>

        <section className="student-section">
          <div className="student-section-heading">
            <div>
              <h2>Focus leaderboard</h2>
              <p>Stay motivated with your learning community.</p>
            </div>
          </div>

          <Panel
            endpoint="/student/leaderboard"
            type="leaderboard"
            empty="Join a focus group to see the leaderboard."
          />
        </section>
      </div>

      <section className="student-section">
        <div className="student-section-heading">
          <div>
            <h2>Accountability groups</h2>
            <p>Learn consistently with other students.</p>
          </div>
        </div>

        <Panel
          endpoint="/student/groups"
          type="list"
          empty="You haven't joined an accountability group yet."
        />
      </section>
    </>
  );
}
