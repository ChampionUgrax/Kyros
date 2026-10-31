import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  BrainCircuit,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Search,
  Users,
  Target,
  TrendingUp,
} from "lucide-react";

const DEMO_MISCONCEPTIONS = [
  {
    id: 1,
    topic: "Linear Equations",
    subject: "Mathematics",
    className: "Class 10A",
    severity: "High",
    affected: 18,
    percentage: 72,
    misconception: "Students believe that a variable must always have a positive value.",
    correctConcept:
      "Variables can represent positive numbers, negative numbers, zero, or other values depending on the equation.",
    intervention:
      "Use number-line examples and ask students to solve equations containing negative values.",
    students: ["Aarav Sharma", "Riya Mehta", "Kabir Singh", "Ananya Gupta"],
  },
  {
    id: 2,
    topic: "Photosynthesis",
    subject: "Science",
    className: "Class 10A",
    severity: "Medium",
    affected: 12,
    percentage: 48,
    misconception: "Students think plants get their food directly from the soil.",
    correctConcept:
      "Plants prepare glucose through photosynthesis using sunlight, water, and carbon dioxide.",
    intervention:
      "Use a labelled photosynthesis diagram and demonstrate the role of each input.",
    students: ["Priya Verma", "Rohan Mehta", "Aarav Sharma"],
  },
  {
    id: 3,
    topic: "Trigonometric Ratios",
    subject: "Mathematics",
    className: "Class 10B",
    severity: "High",
    affected: 15,
    percentage: 60,
    misconception: "Students confuse opposite and adjacent sides when identifying an angle.",
    correctConcept:
      "Opposite and adjacent sides are identified relative to the chosen reference angle.",
    intervention:
      "Practise identifying sides from different reference angles before introducing formulas.",
    students: ["Dev Patel", "Ishita Jain", "Manav Rao"],
  },
  {
    id: 4,
    topic: "Electric Current",
    subject: "Science",
    className: "Class 9A",
    severity: "Low",
    affected: 6,
    percentage: 24,
    misconception: "Students believe current gets consumed as it passes through a bulb.",
    correctConcept:
      "In a simple series circuit, current is the same at every point in the circuit.",
    intervention:
      "Draw a series circuit and compare current readings at different points.",
    students: ["Neha Sharma", "Arjun Das"],
  },
  {
    id: 5,
    topic: "Quadratic Equations",
    subject: "Mathematics",
    className: "Class 10A",
    severity: "Medium",
    affected: 10,
    percentage: 40,
    misconception: "Students assume every quadratic equation has two distinct real roots.",
    correctConcept:
      "The discriminant determines whether the roots are distinct real, equal real, or non-real.",
    intervention:
      "Compare equations with positive, zero, and negative discriminants.",
    students: ["Aarav Sharma", "Kavya Nair", "Ishaan Roy"],
  },
];

const severityClass = {
  High: "high",
  Medium: "medium",
  Low: "low",
};

export default function Misconceptions() {
  const [classFilter, setClassFilter] = useState("All Classes");
  const [subjectFilter, setSubjectFilter] = useState("All Subjects");
  const [severityFilter, setSeverityFilter] = useState("All Severity");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const filteredData = useMemo(() => {
    return DEMO_MISCONCEPTIONS.filter((item) => {
      const matchesClass =
        classFilter === "All Classes" || item.className === classFilter;

      const matchesSubject =
        subjectFilter === "All Subjects" || item.subject === subjectFilter;

      const matchesSeverity =
        severityFilter === "All Severity" || item.severity === severityFilter;

      const matchesSearch =
        `${item.topic} ${item.misconception} ${item.subject}`
          .toLowerCase()
          .includes(search.toLowerCase());

      return (
        matchesClass &&
        matchesSubject &&
        matchesSeverity &&
        matchesSearch
      );
    });
  }, [classFilter, subjectFilter, severityFilter, search]);

  const totalAffected = filteredData.reduce(
    (total, item) => total + item.affected,
    0
  );

  const highPriority = filteredData.filter(
    (item) => item.severity === "High"
  ).length;

  const averageImpact = filteredData.length
    ? Math.round(
        filteredData.reduce((total, item) => total + item.percentage, 0) /
          filteredData.length
      )
    : 0;

  return (
    <div className="teacher-misconceptions">
      <div className="teacher-misconceptions-heading">
        <div>
          <span className="teacher-misconceptions-eyebrow">
            LEARNING INSIGHTS
          </span>
          <h1>Misconceptions</h1>
          <p>
            Discover where students are getting confused and help them
            build stronger conceptual understanding.
          </p>
        </div>

        <div className="teacher-misconceptions-heading-icon">
          <BrainCircuit size={27} />
        </div>
      </div>

      {/* Summary cards */}
      <div className="teacher-misconception-stats">
        <div className="teacher-misconception-stat">
          <div className="teacher-misconception-stat-icon purple">
            <BrainCircuit size={20} />
          </div>
          <div>
            <span>Identified misconceptions</span>
            <strong>{filteredData.length}</strong>
            <small>Across selected filters</small>
          </div>
        </div>

        <div className="teacher-misconception-stat">
          <div className="teacher-misconception-stat-icon blue">
            <Users size={20} />
          </div>
          <div>
            <span>Students affected</span>
            <strong>{totalAffected}</strong>
            <small>Across matching topics</small>
          </div>
        </div>

        <div className="teacher-misconception-stat">
          <div className="teacher-misconception-stat-icon orange">
            <AlertTriangle size={20} />
          </div>
          <div>
            <span>High-priority topics</span>
            <strong>{highPriority}</strong>
            <small>Need immediate attention</small>
          </div>
        </div>

        <div className="teacher-misconception-stat">
          <div className="teacher-misconception-stat-icon green">
            <TrendingUp size={20} />
          </div>
          <div>
            <span>Average student impact</span>
            <strong>{averageImpact}%</strong>
            <small>Average affected percentage</small>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="teacher-misconception-toolbar">
        <div className="teacher-misconception-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search topics or misconceptions..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          value={classFilter}
          onChange={(event) => setClassFilter(event.target.value)}
        >
          <option>All Classes</option>
          <option>Class 10A</option>
          <option>Class 10B</option>
          <option>Class 9A</option>
        </select>

        <select
          value={subjectFilter}
          onChange={(event) => setSubjectFilter(event.target.value)}
        >
          <option>All Subjects</option>
          <option>Mathematics</option>
          <option>Science</option>
        </select>

        <select
          value={severityFilter}
          onChange={(event) => setSeverityFilter(event.target.value)}
        >
          <option>All Severity</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      {/* Misconception list */}
      <div className="teacher-misconception-list-heading">
        <div>
          <h2>Identified learning gaps</h2>
          <p>
            {filteredData.length} {filteredData.length === 1 ? "topic" : "topics"}{" "}
            found
          </p>
        </div>
        <span className="teacher-misconception-demo-label">
          Demo insights
        </span>
      </div>

      <div className="teacher-misconception-list">
        {filteredData.map((item) => {
          const isExpanded = expandedId === item.id;

          return (
            <article
              className={`teacher-misconception-card ${
                isExpanded ? "expanded" : ""
              }`}
              key={item.id}
            >
              <div className="teacher-misconception-card-main">
                <div className="teacher-misconception-card-content">
                  <div className="teacher-misconception-card-meta">
                    <span className="teacher-misconception-subject">
                      {item.subject}
                    </span>
                    <span>{item.className}</span>
                    <span
                      className={`teacher-misconception-severity ${
                        severityClass[item.severity]
                      }`}
                    >
                      {item.severity} priority
                    </span>
                  </div>

                  <h3>{item.topic}</h3>
                  <p className="teacher-misconception-description">
                    {item.misconception}
                  </p>
                </div>

                <div className="teacher-misconception-impact">
                  <strong>{item.affected}</strong>
                  <span>students affected</span>
                  <div className="teacher-misconception-progress">
                    <div
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <small>{item.percentage}% of class</small>
                </div>

                <button
                  className="teacher-misconception-expand"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : item.id)
                  }
                  aria-label={
                    isExpanded ? "Collapse details" : "Expand details"
                  }
                >
                  {isExpanded ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
              </div>

              {isExpanded && (
                <div className="teacher-misconception-details">
                  <div className="teacher-misconception-detail-grid">
                    <div className="teacher-misconception-detail wrong">
                      <span>
                        <AlertTriangle size={16} /> Common misunderstanding
                      </span>
                      <p>{item.misconception}</p>
                    </div>

                    <div className="teacher-misconception-detail correct">
                      <span>
                        <BookOpen size={16} /> Correct understanding
                      </span>
                      <p>{item.correctConcept}</p>
                    </div>
                  </div>

                  <div className="teacher-misconception-intervention">
                    <div className="teacher-misconception-intervention-icon">
                      <Lightbulb size={19} />
                    </div>
                    <div>
                      <strong>Suggested teaching intervention</strong>
                      <p>{item.intervention}</p>
                    </div>
                  </div>

                  <div className="teacher-misconception-students">
                    <div>
                      <Users size={17} />
                      <strong>Sample affected students</strong>
                    </div>
                    <div className="teacher-misconception-student-tags">
                      {item.students.map((student) => (
                        <span key={student}>{student}</span>
                      ))}
                      <small>
                        Sample names only; connect real student records later.
                      </small>
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}

        {filteredData.length === 0 && (
          <div className="teacher-misconception-empty">
            <Target size={30} />
            <h3>No misconceptions found</h3>
            <p>Try changing your filters or search term.</p>
            <button
              onClick={() => {
                setClassFilter("All Classes");
                setSubjectFilter("All Subjects");
                setSeverityFilter("All Severity");
                setSearch("");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}