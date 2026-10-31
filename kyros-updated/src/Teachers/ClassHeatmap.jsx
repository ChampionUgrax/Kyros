import { useMemo, useState } from "react";
import {
  Activity,
  BookOpen,
  ChevronDown,
  TrendingDown,
  TrendingUp,
  Users,
  Target,
  Info,
} from "lucide-react";

const DEMO_DATA = {
  "Class 10A": {
    Mathematics: [
      { topic: "Quadratic Equations", scores: [82, 48, 56, 62] },
      { topic: "Polynomials", scores: [88, 84, 79, 86] },
      { topic: "Arithmetic Progressions", scores: [76, 68, 72, 70] },
      { topic: "Triangles", scores: [58, 45, 52, 61] },
      { topic: "Coordinate Geometry", scores: [91, 85, 88, 90] },
      { topic: "Trigonometry", scores: [64, 55, 59, 53] },
    ],
    Science: [
      { topic: "Chemical Reactions", scores: [85, 78, 82, 80] },
      { topic: "Acids and Bases", scores: [72, 64, 69, 74] },
      { topic: "Electricity", scores: [54, 43, 48, 51] },
      { topic: "Light", scores: [89, 82, 86, 84] },
      { topic: "Life Processes", scores: [78, 72, 74, 80] },
      { topic: "Our Environment", scores: [92, 88, 90, 91] },
    ],
  },
  "Class 10B": {
    Mathematics: [
      { topic: "Quadratic Equations", scores: [68, 55, 61, 58] },
      { topic: "Polynomials", scores: [76, 72, 75, 79] },
      { topic: "Arithmetic Progressions", scores: [84, 77, 80, 82] },
      { topic: "Triangles", scores: [49, 42, 45, 50] },
      { topic: "Coordinate Geometry", scores: [80, 75, 78, 81] },
      { topic: "Trigonometry", scores: [58, 51, 55, 54] },
    ],
    Science: [
      { topic: "Chemical Reactions", scores: [78, 72, 76, 80] },
      { topic: "Acids and Bases", scores: [82, 78, 80, 84] },
      { topic: "Electricity", scores: [61, 52, 55, 58] },
      { topic: "Light", scores: [74, 68, 72, 76] },
      { topic: "Life Processes", scores: [88, 82, 85, 86] },
      { topic: "Our Environment", scores: [91, 89, 90, 92] },
    ],
  },
  "Class 9A": {
    Mathematics: [
      { topic: "Number Systems", scores: [90, 85, 88, 91] },
      { topic: "Polynomials", scores: [72, 65, 69, 74] },
      { topic: "Coordinate Geometry", scores: [58, 48, 52, 55] },
      { topic: "Linear Equations", scores: [84, 78, 82, 80] },
      { topic: "Lines and Angles", scores: [67, 59, 63, 65] },
      { topic: "Triangles", scores: [76, 70, 73, 78] },
    ],
    Science: [
      { topic: "Matter Around Us", scores: [86, 82, 84, 88] },
      { topic: "Atoms and Molecules", scores: [64, 55, 59, 62] },
      { topic: "Motion", scores: [78, 70, 74, 76] },
      { topic: "Force and Laws", scores: [52, 45, 48, 50] },
      { topic: "Cell Biology", scores: [91, 86, 88, 90] },
      { topic: "Tissues", scores: [73, 67, 70, 74] },
    ],
  },
};

const SKILLS = [
  "Conceptual understanding",
  "Problem solving",
  "Accuracy",
  "Retention",
];

const STUDENT_COUNT = {
  "Class 10A": 28,
  "Class 10B": 26,
  "Class 9A": 30,
};

function getAverage(scores) {
  return Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length);
}

function getLevel(score) {
  if (score >= 80) return "strong";
  if (score >= 60) return "moderate";
  return "weak";
}

function getCellColor(score) {
  if (score >= 80) return "strong";
  if (score >= 60) return "moderate";
  return "weak";
}

export default function ClassHeatmap() {
  const [selectedClass, setSelectedClass] = useState("Class 10A");
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [selectedCell, setSelectedCell] = useState(null);

  const topics = DEMO_DATA[selectedClass][selectedSubject];

  const summary = useMemo(() => {
    const allScores = topics.flatMap((topic) => topic.scores);
    const average = getAverage(allScores);
    const strong = topics.filter((topic) => getAverage(topic.scores) >= 80).length;
    const weak = topics.filter((topic) => getAverage(topic.scores) < 60).length;

    return {
      average,
      strong,
      weak,
      total: topics.length,
      students: STUDENT_COUNT[selectedClass],
    };
  }, [topics, selectedClass]);

  const selectedTopic =
    selectedCell === null ? null : topics[selectedCell];

  const weakestTopic = [...topics].sort(
    (a, b) => getAverage(a.scores) - getAverage(b.scores)
  )[0];

  return (
    <section className="teacher-heatmap-page">
      <div className="teacher-heatmap-heading">
        <div>
          <span className="teacher-heatmap-eyebrow">CLASS ANALYTICS</span>
          <h1>Class Heatmap</h1>
          <p>
            Understand learning patterns and identify topics that need attention.
          </p>
        </div>

        <div className="teacher-heatmap-filters">
          <label>
            <span>Class</span>
            <div className="teacher-heatmap-select-wrap">
              <Users size={15} />
              <select
                value={selectedClass}
                onChange={(event) => {
                  setSelectedClass(event.target.value);
                  setSelectedCell(null);
                }}
              >
                {Object.keys(DEMO_DATA).map((className) => (
                  <option key={className}>{className}</option>
                ))}
              </select>
              <ChevronDown size={15} />
            </div>
          </label>

          <label>
            <span>Subject</span>
            <div className="teacher-heatmap-select-wrap">
              <BookOpen size={15} />
              <select
                value={selectedSubject}
                onChange={(event) => {
                  setSelectedSubject(event.target.value);
                  setSelectedCell(null);
                }}
              >
                {Object.keys(DEMO_DATA[selectedClass]).map((subject) => (
                  <option key={subject}>{subject}</option>
                ))}
              </select>
              <ChevronDown size={15} />
            </div>
          </label>
        </div>
      </div>

      {/* Summary cards */}
      <div className="teacher-heatmap-stats">
        <div className="teacher-heatmap-stat">
          <div className="teacher-heatmap-stat-icon blue">
            <Target size={19} />
          </div>
          <div>
            <span>Overall understanding</span>
            <strong>{summary.average}%</strong>
            <small>Class average across topics</small>
          </div>
        </div>

        <div className="teacher-heatmap-stat">
          <div className="teacher-heatmap-stat-icon violet">
            <BookOpen size={19} />
          </div>
          <div>
            <span>Strong topics</span>
            <strong>{summary.strong}<small> / {summary.total}</small></strong>
            <small>Average score of 80% or higher</small>
          </div>
        </div>

        <div className="teacher-heatmap-stat">
          <div className="teacher-heatmap-stat-icon orange">
            <TrendingDown size={19} />
          </div>
          <div>
            <span>Topics needing attention</span>
            <strong>{summary.weak}</strong>
            <small>Average score below 60%</small>
          </div>
        </div>

        <div className="teacher-heatmap-stat">
          <div className="teacher-heatmap-stat-icon pink">
            <Users size={19} />
          </div>
          <div>
            <span>Students</span>
            <strong>{summary.students}</strong>
            <small>In the selected class</small>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="teacher-heatmap-card">
        <div className="teacher-heatmap-card-heading">
          <div>
            <h2>Learning performance map</h2>
            <p>
              {selectedClass} · {selectedSubject}
            </p>
          </div>

          <div className="teacher-heatmap-legend">
            <span><i className="strong" /> Strong</span>
            <span><i className="moderate" /> Moderate</span>
            <span><i className="weak" /> Needs attention</span>
          </div>
        </div>

        <div className="teacher-heatmap-scroll">
          <div className="teacher-heatmap-grid">
            <div className="teacher-heatmap-grid-header topic-header">
              Topics
            </div>

            {SKILLS.map((skill) => (
              <div className="teacher-heatmap-grid-header" key={skill}>
                {skill}
              </div>
            ))}

            {topics.map((topic, index) => (
              <div className="teacher-heatmap-grid-row" key={topic.topic}>
                <div className="teacher-heatmap-topic-name">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{topic.topic}</strong>
                </div>

                {topic.scores.map((score, skillIndex) => (
                  <button
                    type="button"
                    key={`${topic.topic}-${skillIndex}`}
                    className={`teacher-heatmap-cell ${getCellColor(score)} ${
                      selectedCell === index ? "active" : ""
                    }`}
                    onClick={() => setSelectedCell(index)}
                    title={`${topic.topic} · ${SKILLS[skillIndex]}: ${score}%`}
                  >
                    {score}%
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="teacher-heatmap-card-footer">
          <Info size={15} />
          <span>
            Select any topic row to view its skill-wise performance details.
            Demo data is illustrative, not actual student assessment data.
          </span>
        </div>
      </div>

      {/* Detail and insight panels */}
      <div className="teacher-heatmap-bottom-grid">
        <div className="teacher-heatmap-detail-card">
          <div className="teacher-heatmap-detail-heading">
            <div>
              <span>TOPIC BREAKDOWN</span>
              <h2>{selectedTopic?.topic || "Select a topic"}</h2>
            </div>
            <Activity size={20} />
          </div>

          {selectedTopic ? (
            <>
              <div className="teacher-heatmap-topic-average">
                <div>
                  <span>Average performance</span>
                  <strong>{getAverage(selectedTopic.scores)}%</strong>
                </div>
                <span className={`teacher-heatmap-status ${getLevel(getAverage(selectedTopic.scores))}`}>
                  {getLevel(getAverage(selectedTopic.scores)) === "strong"
                    ? "Strong"
                    : getLevel(getAverage(selectedTopic.scores)) === "moderate"
                    ? "Moderate"
                    : "Needs attention"}
                </span>
              </div>

              <div className="teacher-heatmap-skill-list">
                {SKILLS.map((skill, index) => (
                  <div className="teacher-heatmap-skill" key={skill}>
                    <div>
                      <span>{skill}</span>
                      <strong>{selectedTopic.scores[index]}%</strong>
                    </div>
                    <div className="teacher-heatmap-progress">
                      <span
                        className={getCellColor(selectedTopic.scores[index])}
                        style={{ width: `${selectedTopic.scores[index]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="teacher-heatmap-empty-text">
              Choose a topic from the heatmap to see its performance breakdown.
            </p>
          )}
        </div>

        <div className="teacher-heatmap-insight-card">
          <div className="teacher-heatmap-insight-icon">
            <TrendingDown size={20} />
          </div>
          <span className="teacher-heatmap-insight-label">PRIORITY INSIGHT</span>
          <h2>{weakestTopic.topic}</h2>
          <p>
            This is currently the lowest-performing topic in {selectedClass}.
            Consider revisiting the concepts and giving students additional
            practice.
          </p>
          <div className="teacher-heatmap-insight-score">
            <span>Topic average</span>
            <strong>{getAverage(weakestTopic.scores)}%</strong>
          </div>
        </div>
      </div>

      <div className="teacher-heatmap-demo-note">
        <Info size={14} />
        <span>
          This page currently displays sample data for UI demonstration.
          Connect assessment data when the KYROS backend is available.
        </span>
      </div>
    </section>
  );
}