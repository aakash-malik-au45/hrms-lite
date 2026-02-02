import { useEffect, useState } from "react";
import { api } from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

useEffect(() => {
  api
    .get("/dashboard")
    .then((res) => setStats(res.data))
    .catch((err) => {
      console.error("Dashboard API error:", err);
    });
}, []);


  if (!stats) return <div className="container">Loading...</div>;

  return (
<div className="container">
  <h1 className="page-title">Dashboard</h1>

  <div className="dashboard-grid">
    <div className="dashboard-tile">
      <h2>Total Employees</h2>
      <p>{stats.total_employees}</p>
    </div>

    <div className="dashboard-tile">
      <h2>Present Today</h2>
      <p>{stats.present_today}</p>
    </div>

    <div className="dashboard-tile">
      <h2>Absent Today</h2>
      <p>{stats.absent_today}</p>
    </div>
  </div>

  {/* 👇 NEW SUMMARY SECTION */}
  <div className="card" style={{ marginTop: "32px" }}>
    <h2>Today's Attendance Summary</h2>

    <div className="dashboard-grid">
      <div>
        <h3>Present</h3>
        <ul>
          {stats.present_list.length === 0 && <li>None</li>}
          {stats.present_list.map((name, idx) => (
            <li key={idx}>{name}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Absent</h3>
        <ul>
          {stats.absent_list.length === 0 && <li>None</li>}
          {stats.absent_list.map((name, idx) => (
            <li key={idx}>{name}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
</div>


  );
}
