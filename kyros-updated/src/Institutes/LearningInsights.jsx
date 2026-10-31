import { useMemo, useState } from "react";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Activity,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";

import ChartCard from "./ChartCard.jsx";

const PERIODS = ["This week", "This month", "This semester"];

const LEARNING_DATA = {
  "This week": {
    averageScore: 76,
    improvement: "+3.8%",
    completion: 82,
    engagement: 88,
    trend: [
      { day: "Mon", score: 65, attendance: 78 },
      { day: "Tue", score: 69, attendance: 82 },
      { day: "Wed", score: 72, attendance: 85 },
      { day: "Thu", score: 70, attendance: 80 },
      { day: "Fri", score: 76, attendance: 89 },
      { day: "Sat", score: 81, attendance: 91 },
    ],
  },
  "This month": {
    averageScore: 74,
    improvement: "+5.2%",
    completion: 79,
    engagement: 84,
    trend: [
      { day: "Week 1", score: 62, attendance: 76 },
      { day: "Week 2", score: 68, attendance: 81 },
      { day: "Week 3", score: 71, attendance: 83 },
      { day: "Week 4", score: 74, attendance: 87 },
    ],
  },
  "This semester": {
    averageScore: 72,
    improvement: "+8.4%",
    completion: 76,
    engagement: 81,
    trend: [
      { day: "Aug", score: 58, attendance: 72 },
      { day: "Sep", score: 63, attendance: 78 },
      { day: "Oct", score: 68, attendance: 82 },
      { day: "Nov", score: 72, attendance: 85 },
    ],
  },
};

const BATCHES = [
  { id: "all", name: "All batches" },
  { id: "cse-a", name: "B.Tech CSE - A" },
  { id: "cse-b", name: "B.Tech CSE - B" },
  { id: "ds-a", name: "Data Science - A" },
  { id: "mba-a", name: "MBA - A" },
];

const TOPIC_DATA = [
  {
    topic: "Data Structures",
    course: "Computer Science",
    mastery: 88,
    students: 124,
    status: "Strong",
  },
  {
    topic: "Database Management",
    course: "Computer Science",
    mastery: 74,
    students: 118,
    status: "Good",
  },
  {
    topic: "Operating Systems",
    course: "Computer Science",
    mastery: 58,
    students: 106,
    status: "Needs attention",
  },
  {
    topic: "Linear Algebra",
    course: "Applied Mathematics",
    mastery: 46,
    students: 92,
    status: "Critical",
  },
  {
    topic: "Probability",
    course: "Applied Mathematics",
    mastery: 67,
    students: 98,
    status: "Good",
  },
  {
    topic: "Web Development",
    course: "Computer Science",
    mastery: 91,
    students: 132,
    status: "Strong",
  },
];

const BATCH_PERFORMANCE = [
  { batch: "CSE - A", score: 82, engagement: 88, completion: 85 },
  { batch: "CSE - B", score: 76, engagement: 81, completion: 78 },
  { batch: "DS - A", score: 71, engagement: 79, completion: 73 },
  { batch: "MBA - A", score: 68, engagement: 74, completion: 70 },
];

const STUDENTS_AT_RISK = [
  {
    id: "STU-1024",
    name: "Aarav Sharma",
    batch: "B.Tech CSE - B",
    weakTopic: "Operating Systems",
    score: 42,
    attendance: 61,
    risk: "High",
  },
  {
    id: "STU-1087",
    name: "Diya Mehta",
    batch: "Data Science - A",
    weakTopic: "Linear Algebra",
    score: 48,
    attendance: 68,
    risk: "High",
  },
  {
    id: "STU-1132",
    name: "Kabir Verma",
    batch: "B.Tech CSE - A",
    weakTopic: "Database Management",
    score: 55,
    attendance: 72,
    risk: "Medium",
  },
  {
    id: "STU-1195",
    name: "Ananya Singh",
    batch: "MBA - A",
    weakTopic: "Quantitative Methods",
    score: 59,
    attendance: 74,
    risk: "Medium",
  },
];

function MetricCard({
  title,
  value,
  note,
  icon: Icon,
  color,
  background,
  trend,
}) {
  return (
    <div className="learning-insight-metric">
      <div className="learning-insight-metric-top">
        <span>{title}</span>
        <div style={{ color, background }}>
          <Icon size={19} />
        </div>
      </div>

      <strong>{value}</strong>

      <div className="learning-insight-metric-bottom">
        {trend && (
          <span className="learning-insight-trend">
            <TrendingUp size={13} />
            {trend}
          </span>
        )}
        <span>{note}</span>
      </div>
    </div>
  );
}

function MasteryBar({ value }) {
  const color =
    value >= 80 ? "#55B98E" : value >= 65 ? "#65A5DA" : value >= 50 ? "#E8A65C" : "#DF7777";

  return (
    <div className="learning-mastery-bar-wrap">
      <div className="learning-mastery-track">
        <div
          className="learning-mastery-fill"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <strong>{value}%</strong>
    </div>
  );
}

export default function LearningInsights() {
  const [period, setPeriod] = useState("This month");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [topicSearch, setTopicSearch] = useState("");
  const [topicStatus, setTopicStatus] = useState("All");

  const currentData = LEARNING_DATA[period];

  const filteredTopics = useMemo(() => {
    const query = topicSearch.trim().toLowerCase();

    return TOPIC_DATA.filter((item) => {
      const matchesSearch =
        item.topic.toLowerCase().includes(query) ||
        item.course.toLowerCase().includes(query);

      const matchesStatus =
        topicStatus === "All" || item.status === topicStatus;

      return matchesSearch && matchesStatus;
    });
  }, [topicSearch, topicStatus]);

  const filteredBatchPerformance = useMemo(() => {
    if (selectedBatch === "all") return BATCH_PERFORMANCE;

    const selected = BATCHES.find((batch) => batch.id === selectedBatch);
    if (!selected) return BATCH_PERFORMANCE;

    const batchName = selected.name
      .replace("B.Tech ", "")
      .replace("Data Science - A", "DS - A");

    return BATCH_PERFORMANCE.filter((item) =>
      item.batch.toLowerCase().includes(batchName.toLowerCase())
    );
  }, [selectedBatch]);

  const visibleAtRisk = useMemo(() => {
    if (selectedBatch === "all") return STUDENTS_AT_RISK;

    const selected = BATCHES.find((batch) => batch.id === selectedBatch);
    return STUDENTS_AT_RISK.filter(
      (student) => student.batch === selected?.name
    );
  }, [selectedBatch]);

  return (
    <div className="learning-insights-page">
      <div className="learning-insights-header">
        <div>
          <div className="learning-insights-eyebrow">
            <Brain size={15} />
            INSTITUTE INTELLIGENCE
          </div>

          <h1>Learning Insights</h1>
          <p>
            Understand learning patterns, identify knowledge gaps, and make
            better academic decisions.
          </p>
        </div>

        <div className="learning-insights-filters">
          <label className="learning-insights-filter">
            <Filter size={15} />
            <select
              value={selectedBatch}
              onChange={(event) => setSelectedBatch(event.target.value)}
              aria-label="Filter by batch"
            >
              {BATCHES.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))}
            </select>
          </label>

          <select
            className="learning-insights-period"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            aria-label="Select time period"
          >
            {PERIODS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section className="learning-insights-metrics">
        <MetricCard
          title="Average Learning Score"
          value={`${currentData.averageScore}%`}
          note="Across assessed students"
          trend={currentData.improvement}
          icon={Target}
          color="#65A5DA"
          background="rgba(101,165,218,.13)"
        />

        <MetricCard
          title="Learning Completion"
          value={`${currentData.completion}%`}
          note="Course content completed"
          trend="+4.1%"
          icon={BookOpen}
          color="#8B83D9"
          background="rgba(139,131,217,.13)"
        />

        <MetricCard
          title="Student Engagement"
          value={`${currentData.engagement}%`}
          note="Learning activity indicator"
          trend="+2.6%"
          icon={Activity}
          color="#55B98E"
          background="rgba(85,185,142,.13)"
        />

        <MetricCard
          title="Students At Risk"
          value={visibleAtRisk.length}
          note="Require additional support"
          icon={AlertTriangle}
          color="#E8A65C"
          background="rgba(232,166,92,.14)"
        />
      </section>

      <section className="learning-insights-chart-grid">
        <div className="learning-insights-chart-main">
          <ChartCard
            title="Learning Performance Trend"
            subtitle={`Average learning score over ${period.toLowerCase()}`}
            type="line"
            data={currentData.trend}
            xKey="day"
            series={[
              {
                dataKey: "score",
                label: "Learning score",
                color: "#65A5DA",
              },
              {
                dataKey: "attendance",
                label: "Attendance",
                color: "#8B83D9",
              },
            ]}
            height={285}
            showLegend
            showGrid
          />
        </div>

        <div className="learning-insights-chart-side">
          <div className="learning-insights-panel learning-insights-score-panel">
            <div className="learning-insights-panel-heading">
              <div>
                <h3>Learning Overview</h3>
                <p>Current institute snapshot</p>
              </div>
              <div className="learning-insights-panel-icon">
                <Brain size={18} />
              </div>
            </div>

            <div className="learning-overview-score">
              <div className="learning-overview-score-ring">
                <div>
                  <strong>{currentData.averageScore}%</strong>
                  <span>Average</span>
                </div>
              </div>
            </div>

            <div className="learning-overview-legend">
              <div>
                <span className="legend-dot strong" />
                <span>Strong learning</span>
                <strong>32%</strong>
              </div>
              <div>
                <span className="legend-dot moderate" />
                <span>Moderate learning</span>
                <strong>48%</strong>
              </div>
              <div>
                <span className="legend-dot weak" />
                <span>Needs support</span>
                <strong>20%</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="learning-insights-section">
        <div className="learning-insights-section-heading">
          <div>
            <h2>Topic Mastery</h2>
            <p>See which concepts students understand and where they struggle.</p>
          </div>
          <span className="learning-insights-section-count">
            {filteredTopics.length} topics
          </span>
        </div>

        <div className="learning-topic-toolbar">
          <div className="learning-topic-search">
            <Search size={16} />
            <input
              value={topicSearch}
              onChange={(event) => setTopicSearch(event.target.value)}
              placeholder="Search topic or course..."
            />
          </div>

          <select
            value={topicStatus}
            onChange={(event) => setTopicStatus(event.target.value)}
            aria-label="Filter topic mastery"
          >
            <option value="All">All mastery levels</option>
            <option value="Strong">Strong</option>
            <option value="Good">Good</option>
            <option value="Needs attention">Needs attention</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <div className="learning-insights-panel learning-topic-table-wrap">
          <table className="learning-topic-table">
            <thead>
              <tr>
                <th>Topic</th>
                <th>Course</th>
                <th>Students assessed</th>
                <th>Mastery level</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredTopics.map((item) => (
                <tr key={item.topic}>
                  <td>
                    <strong>{item.topic}</strong>
                  </td>
                  <td>{item.course}</td>
                  <td>{item.students}</td>
                  <td>
                    <MasteryBar value={item.mastery} />
                  </td>
                  <td>
                    <span
                      className={`learning-topic-status ${item.status
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredTopics.length === 0 && (
                <tr>
                  <td colSpan="5" className="learning-topic-empty">
                    No topics match your search or selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="learning-insights-bottom-grid">
        <div className="learning-insights-section learning-batch-section">
          <div className="learning-insights-section-heading">
            <div>
              <h2>Batch Performance</h2>
              <p>Compare learning outcomes across batches.</p>
            </div>
          </div>

          <div className="learning-insights-panel learning-batch-panel">
            {filteredBatchPerformance.length > 0 ? (
              filteredBatchPerformance.map((batch) => (
                <div className="learning-batch-row" key={batch.batch}>
                  <div className="learning-batch-row-heading">
                    <strong>{batch.batch}</strong>
                    <span>{batch.score}% average score</span>
                  </div>

                  <div className="learning-batch-bars">
                    <div>
                      <span>Performance</span>
                      <div className="learning-batch-track">
                        <div
                          style={{ width: `${batch.score}%` }}
                          className="performance"
                        />
                      </div>
                    </div>

                    <div>
                      <span>Engagement</span>
                      <div className="learning-batch-track">
                        <div
                          style={{ width: `${batch.engagement}%` }}
                          className="engagement"
                        />
                      </div>
                    </div>

                    <div>
                      <span>Completion</span>
                      <div className="learning-batch-track">
                        <div
                          style={{ width: `${batch.completion}%` }}
                          className="completion"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="learning-insights-empty">
                No batch comparison data is available for this selection.
              </div>
            )}
          </div>
        </div>

        <div className="learning-insights-section learning-risk-section">
          <div className="learning-insights-section-heading">
            <div>
              <h2>Students Needing Support</h2>
              <p>Students who may benefit from intervention.</p>
            </div>
            <span className="learning-risk-count">
              {visibleAtRisk.length}
            </span>
          </div>

          <div className="learning-insights-panel learning-risk-panel">
            {visibleAtRisk.length > 0 ? (
              visibleAtRisk.map((student) => (
                <div className="learning-risk-student" key={student.id}>
                  <div className="learning-risk-avatar">
                    {student.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </div>

                  <div className="learning-risk-student-info">
                    <strong>{student.name}</strong>
                    <span>{student.weakTopic}</span>
                    <small>
                      Score: {student.score}% · Attendance: {student.attendance}%
                    </small>
                  </div>

                  <span
                    className={`learning-risk-badge ${student.risk.toLowerCase()}`}
                  >
                    {student.risk}
                  </span>
                </div>
              ))
            ) : (
              <div className="learning-insights-empty">
                No at-risk students are listed for this batch.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="learning-insights-recommendation">
        <div className="learning-recommendation-icon">
          <Lightbulb size={21} />
        </div>

        <div>
          <span>RECOMMENDED ACTION</span>
          <h3>Prioritise foundational concept revision</h3>
          <p>
            Linear Algebra and Operating Systems currently show lower topic
            mastery in this demo dataset. Consider arranging focused revision
            sessions and additional practice assessments.
          </p>
        </div>

        <div className="learning-recommendation-decoration">
          <ChevronRight size={20} />
        </div>
      </section>
    </div>
  );
}
