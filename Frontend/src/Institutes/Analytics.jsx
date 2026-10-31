
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  GraduationCap,
  TrendingUp,
  Users,
} from "lucide-react";

const analyticsData = {
  "7 days": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    performance: [65, 69, 67, 74, 72, 78, 82],
    attendance: [82, 85, 80, 88, 86, 90, 92],
  },
  "30 days": {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    performance: [62, 68, 73, 81],
    attendance: [78, 82, 87, 91],
  },
  "90 days": {
    labels: ["Month 1", "Month 2", "Month 3"],
    performance: [58, 69, 81],
    attendance: [74, 83, 91],
  },
  "This year": {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    performance: [55, 61, 64, 70, 76, 81],
    attendance: [72, 75, 79, 84, 87, 91],
  },
};

const batchData = [
  { name: "B.Tech CSE - A", students: 120, performance: 86, attendance: 92 },
  { name: "B.Tech CSE - B", students: 105, performance: 82, attendance: 89 },
  { name: "B.Tech IT - A", students: 90, performance: 78, attendance: 85 },
  { name: "B.Tech ECE - A", students: 75, performance: 74, attendance: 81 },
];

const courseData = [
  { name: "Data Structures", completion: 88, score: 84, students: 180 },
  { name: "Web Development", completion: 76, score: 79, students: 145 },
  { name: "Database Systems", completion: 68, score: 74, students: 120 },
  { name: "Computer Networks", completion: 59, score: 71, students: 95 },
];

const distribution = [
  { label: "Excellent", count: 320, percentage: 32, color: "#328bda" },
  { label: "Good", count: 410, percentage: 41, color: "#56b7c9" },
  { label: "Average", count: 210, percentage: 21, color: "#e9b65d" },
  { label: "Needs attention", count: 60, percentage: 6, color: "#e58b85" },
];

function MetricCard({ icon: Icon, title, value, change, subtitle, tone }) {
  const positive = !change.startsWith("-");

  return (
    <article className="institute-analytics-metric">
      <div className="institute-analytics-metric-top">
        <div className={`institute-analytics-metric-icon ${tone}`}>
          <Icon size={20} />
        </div>

        <span className={`institute-analytics-change ${positive ? "positive" : "negative"}`}>
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </span>
      </div>

      <p className="institute-analytics-metric-title">{title}</p>
      <h3>{value}</h3>
      <span className="institute-analytics-metric-subtitle">{subtitle}</span>
    </article>
  );
}

function TrendChart({ labels, values, color = "#398bd4" }) {
  const width = 640;
  const height = 230;
  const left = 36;
  const right = 12;
  const top = 18;
  const bottom = 30;

  const points = values.map((value, index) => {
    const x =
      left +
      (index * (width - left - right)) / Math.max(values.length - 1, 1);

    const y =
      top +
      ((100 - value) / 100) * (height - top - bottom);

    return { x, y, value };
  });

  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${left},${height - bottom} ${line} ${points[points.length - 1].x},${height - bottom}`;

  return (
    <div className="institute-analytics-chart">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Analytics trend chart"
        preserveAspectRatio="none"
      >
        {[0, 25, 50, 75, 100].map((value) => {
          const y = top + ((100 - value) / 100) * (height - top - bottom);

          return (
            <g key={value}>
              <line
                x1={left}
                y1={y}
                x2={width - right}
                y2={y}
                stroke="#e8eef5"
                strokeDasharray="4 5"
              />
              <text
                x="2"
                y={y + 4}
                fontSize="10"
                fill="#8b98a9"
              >
                {value}
              </text>
            </g>
          );
        })}

        <polygon points={area} fill={color} opacity="0.10" />

        <polyline
          points={line}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="5"
              fill="white"
              stroke={color}
              strokeWidth="2.5"
            />
            <text
              x={point.x}
              y={height - 8}
              textAnchor="middle"
              fontSize="10"
              fill="#8290a1"
            >
              {labels[index]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function Analytics() {
  const [period, setPeriod] = useState("30 days");
  const [metric, setMetric] = useState("performance");
  const [batchFilter, setBatchFilter] = useState("All batches");

  const trend = analyticsData[period];

  const chartValues =
    metric === "performance" ? trend.performance : trend.attendance;

  const chartTitle =
    metric === "performance" ? "Average academic performance" : "Student attendance";

  const filteredBatches = useMemo(() => {
    if (batchFilter === "All batches") return batchData;
    return batchData.filter((batch) => batch.name.includes(batchFilter));
  }, [batchFilter]);

  return (
    <div className="institute-analytics">
      {/* Page heading */}
      <div className="institute-analytics-heading">
        <div>
          <div className="institute-analytics-eyebrow">
            <Activity size={15} />
            INSTITUTE INSIGHTS
          </div>

          <h1>Analytics & Reports</h1>
          <p>
            Understand academic performance, monitor attendance, and track
            your institute's overall progress.
          </p>
        </div>

        <div className="institute-analytics-date">
          <CalendarDays size={17} />
          <span>Demo academic data</span>
        </div>
      </div>

      {/* KPI cards */}
      <section className="institute-analytics-metrics">
        <MetricCard
          icon={Users}
          title="Total Students"
          value="1,000"
          change="+12.5%"
          subtitle="Compared to previous period"
          tone="blue"
        />

        <MetricCard
          icon={TrendingUp}
          title="Average Performance"
          value="81.4%"
          change="+8.2%"
          subtitle="Across all active batches"
          tone="purple"
        />

        <MetricCard
          icon={CheckCircle2}
          title="Average Attendance"
          value="89.6%"
          change="+4.6%"
          subtitle="Student attendance rate"
          tone="cyan"
        />

        <MetricCard
          icon={BookOpen}
          title="Course Completion"
          value="72.8%"
          change="+6.3%"
          subtitle="Across all active courses"
          tone="orange"
        />
      </section>

      {/* Main trend chart */}
      <section className="institute-analytics-panel institute-analytics-trend-panel">
        <div className="institute-analytics-panel-heading">
          <div>
            <h2>Performance Overview</h2>
            <p>Track academic progress and attendance over time.</p>
          </div>

          <select
            className="institute-analytics-select"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
          >
            {Object.keys(analyticsData).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="institute-analytics-chart-controls">
          <button
            type="button"
            className={metric === "performance" ? "active" : ""}
            onClick={() => setMetric("performance")}
          >
            <span className="institute-analytics-legend-dot performance-dot" />
            Performance
          </button>

          <button
            type="button"
            className={metric === "attendance" ? "active" : ""}
            onClick={() => setMetric("attendance")}
          >
            <span className="institute-analytics-legend-dot attendance-dot" />
            Attendance
          </button>
        </div>

        <div className="institute-analytics-chart-title">
          <h3>{chartTitle}</h3>
          <span>{chartValues[chartValues.length - 1]}% latest</span>
        </div>

        <TrendChart
          labels={trend.labels}
          values={chartValues}
          color={metric === "performance" ? "#398bd4" : "#35a99d"}
        />
      </section>

      {/* Batch comparison */}
      <section className="institute-analytics-panel">
        <div className="institute-analytics-panel-heading">
          <div>
            <h2>Batch Performance</h2>
            <p>Compare academic outcomes across your batches.</p>
          </div>

          <select
            className="institute-analytics-select"
            value={batchFilter}
            onChange={(event) => setBatchFilter(event.target.value)}
          >
            <option>All batches</option>
            <option>B.Tech CSE</option>
            <option>B.Tech IT</option>
            <option>B.Tech ECE</option>
          </select>
        </div>

        <div className="institute-analytics-batch-list">
          {filteredBatches.map((batch) => (
            <div className="institute-analytics-batch-row" key={batch.name}>
              <div className="institute-analytics-batch-info">
                <div className="institute-analytics-batch-icon">
                  <GraduationCap size={19} />
                </div>

                <div>
                  <strong>{batch.name}</strong>
                  <span>{batch.students} students</span>
                </div>
              </div>

              <div className="institute-analytics-batch-score">
                <div className="institute-analytics-score-label">
                  <span>Performance</span>
                  <strong>{batch.performance}%</strong>
                </div>
                <div className="institute-analytics-progress">
                  <span style={{ width: `${batch.performance}%` }} />
                </div>
              </div>

              <div className="institute-analytics-batch-score attendance-score">
                <div className="institute-analytics-score-label">
                  <span>Attendance</span>
                  <strong>{batch.attendance}%</strong>
                </div>
                <div className="institute-analytics-progress">
                  <span style={{ width: `${batch.attendance}%` }} />
                </div>
              </div>
            </div>
          ))}

          {filteredBatches.length === 0 && (
            <p className="institute-analytics-empty">No batches found.</p>
          )}
        </div>
      </section>

      {/* Lower analytics grid */}
      <div className="institute-analytics-lower-grid">
        {/* Course performance */}
        <section className="institute-analytics-panel">
          <div className="institute-analytics-panel-heading">
            <div>
              <h2>Course Insights</h2>
              <p>Progress across active courses.</p>
            </div>
            <BookOpen size={19} className="institute-analytics-heading-icon" />
          </div>

          <div className="institute-analytics-course-list">
            {courseData.map((course) => (
              <div className="institute-analytics-course" key={course.name}>
                <div className="institute-analytics-course-top">
                  <div>
                    <strong>{course.name}</strong>
                    <span>{course.students} enrolled students</span>
                  </div>
                  <strong>{course.completion}%</strong>
                </div>

                <div className="institute-analytics-progress">
                  <span style={{ width: `${course.completion}%` }} />
                </div>

                <div className="institute-analytics-course-bottom">
                  <span>Completion rate</span>
                  <span>Avg. score: {course.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Student distribution */}
        <section className="institute-analytics-panel">
          <div className="institute-analytics-panel-heading">
            <div>
              <h2>Student Distribution</h2>
              <p>Students grouped by performance.</p>
            </div>
            <Award size={19} className="institute-analytics-heading-icon" />
          </div>

          <div className="institute-analytics-distribution-total">
            <div>
              <h3>1,000</h3>
              <span>Total students</span>
            </div>
            <span className="institute-analytics-distribution-badge">
              Academic overview
            </span>
          </div>

          <div className="institute-analytics-distribution-bar">
            {distribution.map((item) => (
              <span
                key={item.label}
                style={{
                  width: `${item.percentage}%`,
                  background: item.color,
                }}
                title={`${item.label}: ${item.percentage}%`}
              />
            ))}
          </div>

          <div className="institute-analytics-distribution-list">
            {distribution.map((item) => (
              <div className="institute-analytics-distribution-item" key={item.label}>
                <div>
                  <span
                    className="institute-analytics-distribution-dot"
                    style={{ background: item.color }}
                  />
                  <span>{item.label}</span>
                </div>
                <strong>{item.count} <small>({item.percentage}%)</small></strong>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="institute-analytics-footnote">
        <Activity size={15} />
        <span>
          These are illustrative demo figures. Connect the institute analytics
          API to display actual student and course data.
        </span>
      </div>
    </div>
  );
}
