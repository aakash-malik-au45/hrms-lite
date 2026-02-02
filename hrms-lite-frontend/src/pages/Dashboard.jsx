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

      <div style={{ display: "flex", gap: 16 }}>
        <div className="card">Total Employees: {stats.total_employees}</div>
        <div className="card">Present Today: {stats.present_today}</div>
        <div className="card">Absent Today: {stats.absent_today}</div>
      </div>
    </div>
  );
}
