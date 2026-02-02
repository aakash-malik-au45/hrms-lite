import { useEffect, useState } from "react";
import { api } from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <div className="container">Loading...</div>;

  return (
<div className="container">
  <h1>Dashboard</h1>

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
</div>

  );
}
