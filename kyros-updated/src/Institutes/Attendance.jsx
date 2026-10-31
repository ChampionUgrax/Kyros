
import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Search,
  Users,
  XCircle,
  ClipboardCheck,
  ChevronDown,
} from "lucide-react";

const initialAttendance = [
  {
    id: "1",
    name: "Aarav Sharma",
    enrollmentId: "KYR2026001",
    batch: "B.Tech CSE - A",
    course: "Data Structures",
    date: "2026-10-31",
    checkIn: "09:02 AM",
    status: "Present",
  },
  {
    id: "2",
    name: "Ananya Verma",
    enrollmentId: "KYR2026002",
    batch: "B.Tech CSE - A",
    course: "Data Structures",
    date: "2026-10-31",
    checkIn: "09:18 AM",
    status: "Late",
  },
  {
    id: "3",
    name: "Rohan Mehta",
    enrollmentId: "KYR2026003",
    batch: "B.Tech CSE - A",
    course: "Data Structures",
    date: "2026-10-31",
    checkIn: "--",
    status: "Absent",
  },
  {
    id: "4",
    name: "Diya Gupta",
    enrollmentId: "KYR2026004",
    batch: "B.Tech CSE - B",
    course: "Web Development",
    date: "2026-10-31",
    checkIn: "08:55 AM",
    status: "Present",
  },
  {
    id: "5",
    name: "Kabir Singh",
    enrollmentId: "KYR2026005",
    batch: "B.Tech CSE - B",
    course: "Web Development",
    date: "2026-10-31",
    checkIn: "09:25 AM",
    status: "Late",
  },
  {
    id: "6",
    name: "Meera Joshi",
    enrollmentId: "KYR2026006",
    batch: "B.Tech IT - A",
    course: "Database Systems",
    date: "2026-10-31",
    checkIn: "08:48 AM",
    status: "Present",
  },
  {
    id: "7",
    name: "Aditya Rao",
    enrollmentId: "KYR2026007",
    batch: "B.Tech IT - A",
    course: "Database Systems",
    date: "2026-10-31",
    checkIn: "--",
    status: "Absent",
  },
  {
    id: "8",
    name: "Ishita Jain",
    enrollmentId: "KYR2026008",
    batch: "B.Tech ECE - A",
    course: "Computer Networks",
    date: "2026-10-31",
    checkIn: "09:05 AM",
    status: "Present",
  },
  {
    id: "9",
    name: "Vivaan Kapoor",
    enrollmentId: "KYR2026009",
    batch: "B.Tech ECE - A",
    course: "Computer Networks",
    date: "2026-10-31",
    checkIn: "09:32 AM",
    status: "Late",
  },
  {
    id: "10",
    name: "Sara Khan",
    enrollmentId: "KYR2026010",
    batch: "B.Tech CSE - A",
    course: "Data Structures",
    date: "2026-10-30",
    checkIn: "09:01 AM",
    status: "Present",
  },
  {
    id: "11",
    name: "Arjun Patel",
    enrollmentId: "KYR2026011",
    batch: "B.Tech CSE - B",
    course: "Web Development",
    date: "2026-10-30",
    checkIn: "--",
    status: "Absent",
  },
  {
    id: "12",
    name: "Myra Das",
    enrollmentId: "KYR2026012",
    batch: "B.Tech IT - A",
    course: "Database Systems",
    date: "2026-10-30",
    checkIn: "09:12 AM",
    status: "Late",
  },
];

const batchOptions = [
  "All batches",
  "B.Tech CSE - A",
  "B.Tech CSE - B",
  "B.Tech IT - A",
  "B.Tech ECE - A",
];

function SummaryCard({ icon: Icon, title, value, detail, tone }) {
  return (
    <article className="institute-attendance-summary-card">
      <div className="institute-attendance-summary-top">
        <div className={`institute-attendance-summary-icon ${tone}`}>
          <Icon size={20} />
        </div>
        <span className="institute-attendance-summary-detail">{detail}</span>
      </div>
      <p>{title}</p>
      <h3>{value}</h3>
    </article>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`institute-attendance-status institute-attendance-status-${status.toLowerCase()}`}
    >
      <span />
      {status}
    </span>
  );
}

export default function Attendance() {
  const [records, setRecords] = useState(initialAttendance);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("2026-10-31");
  const [selectedBatch, setSelectedBatch] = useState("All batches");
  const [selectedStatus, setSelectedStatus] = useState("All statuses");

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch =
        record.name.toLowerCase().includes(search.toLowerCase()) ||
        record.enrollmentId.toLowerCase().includes(search.toLowerCase());

      const matchesDate = !selectedDate || record.date === selectedDate;
      const matchesBatch =
        selectedBatch === "All batches" || record.batch === selectedBatch;
      const matchesStatus =
        selectedStatus === "All statuses" || record.status === selectedStatus;

      return matchesSearch && matchesDate && matchesBatch && matchesStatus;
    });
  }, [records, search, selectedDate, selectedBatch, selectedStatus]);

  const allDateRecords = records.filter(
    (record) => !selectedDate || record.date === selectedDate
  );

  const presentCount = allDateRecords.filter(
    (record) => record.status === "Present"
  ).length;

  const absentCount = allDateRecords.filter(
    (record) => record.status === "Absent"
  ).length;

  const lateCount = allDateRecords.filter(
    (record) => record.status === "Late"
  ).length;

  const totalCount = allDateRecords.length;

  const attendanceRate = totalCount
    ? Math.round(((presentCount + lateCount) / totalCount) * 100)
    : 0;

  function updateStatus(id, newStatus) {
    setRecords((current) =>
      current.map((record) =>
        record.id === id
          ? {
              ...record,
              status: newStatus,
              checkIn:
                newStatus === "Absent"
                  ? "--"
                  : record.checkIn === "--"
                    ? "09:00 AM"
                    : record.checkIn,
            }
          : record
      )
    );
  }

  function exportCSV() {
    const headers = [
      "Student Name",
      "Enrollment ID",
      "Batch",
      "Course",
      "Date",
      "Check In",
      "Status",
    ];

    const rows = filteredRecords.map((record) => [
      record.name,
      record.enrollmentId,
      record.batch,
      record.course,
      record.date,
      record.checkIn,
      record.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kyros-attendance-${selectedDate || "all-dates"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="institute-attendance">
      {/* Heading */}
      <div className="institute-attendance-heading">
        <div>
          <div className="institute-attendance-eyebrow">
            <ClipboardCheck size={15} />
            INSTITUTE MANAGEMENT
          </div>
          <h1>Attendance Management</h1>
          <p>
            Monitor student attendance, review daily records, and manage
            attendance status across your batches.
          </p>
        </div>

        <button
          type="button"
          className="institute-attendance-export"
          onClick={exportCSV}
          disabled={filteredRecords.length === 0}
        >
          <Download size={16} />
          Export report
        </button>
      </div>

      {/* Summary */}
      <section className="institute-attendance-summary">
        <SummaryCard
          icon={Users}
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          detail="Present + late"
          tone="blue"
        />
        <SummaryCard
          icon={CheckCircle2}
          title="Present Students"
          value={presentCount}
          detail="On time"
          tone="green"
        />
        <SummaryCard
          icon={XCircle}
          title="Absent Students"
          value={absentCount}
          detail="Not marked present"
          tone="red"
        />
        <SummaryCard
          icon={Clock3}
          title="Late Arrivals"
          value={lateCount}
          detail="After scheduled time"
          tone="orange"
        />
      </section>

      {/* Attendance register */}
      <section className="institute-attendance-panel">
        <div className="institute-attendance-panel-heading">
          <div>
            <h2>Attendance Register</h2>
            <p>Review and update attendance records.</p>
          </div>

          <span className="institute-attendance-record-count">
            {filteredRecords.length} records
          </span>
        </div>

        {/* Filters */}
        <div className="institute-attendance-filters">
          <div className="institute-attendance-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search student or enrollment ID..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <label className="institute-attendance-filter">
            <CalendarDays size={15} />
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              aria-label="Filter by date"
            />
          </label>

          <label className="institute-attendance-filter">
            <select
              value={selectedBatch}
              onChange={(event) => setSelectedBatch(event.target.value)}
              aria-label="Filter by batch"
            >
              {batchOptions.map((batch) => (
                <option key={batch}>{batch}</option>
              ))}
            </select>
            <ChevronDown size={14} />
          </label>

          <label className="institute-attendance-filter">
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              aria-label="Filter by status"
            >
              <option>All statuses</option>
              <option>Present</option>
              <option>Absent</option>
              <option>Late</option>
            </select>
            <ChevronDown size={14} />
          </label>
        </div>

        {/* Table */}
        <div className="institute-attendance-table-wrap">
          <table className="institute-attendance-table">
            <thead>
              <tr>
                <th>STUDENT</th>
                <th>BATCH</th>
                <th>COURSE</th>
                <th>CHECK IN</th>
                <th>STATUS</th>
                <th>UPDATE STATUS</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td>
                    <div className="institute-attendance-student">
                      <div className="institute-attendance-avatar">
                        {record.name
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <strong>{record.name}</strong>
                        <span>{record.enrollmentId}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="institute-attendance-table-text">
                      {record.batch}
                    </span>
                  </td>

                  <td>
                    <span className="institute-attendance-table-text">
                      {record.course}
                    </span>
                  </td>

                  <td>
                    <span className="institute-attendance-checkin">
                      {record.checkIn}
                    </span>
                  </td>

                  <td>
                    <StatusBadge status={record.status} />
                  </td>

                  <td>
                    <select
                      className="institute-attendance-status-select"
                      value={record.status}
                      onChange={(event) =>
                        updateStatus(record.id, event.target.value)
                      }
                      aria-label={`Update attendance for ${record.name}`}
                    >
                      <option>Present</option>
                      <option>Absent</option>
                      <option>Late</option>
                    </select>
                  </td>
                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan="6">
                    <div className="institute-attendance-no-results">
                      <Search size={24} />
                      <strong>No attendance records found</strong>
                      <span>Try changing your search or filters.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="institute-attendance-table-footer">
          <span>
            Showing {filteredRecords.length} of {allDateRecords.length} records
          </span>
          <span>Demo attendance register</span>
        </div>
      </section>

      <div className="institute-attendance-note">
        <ClipboardCheck size={16} />
        <span>
          Attendance changes are held in local page state only. They will reset
          when the page is refreshed. Connect the attendance API to save
          official records.
        </span>
      </div>
    </div>
  );
}
