import { useState } from "react";
import { api } from "../api";

export default function Attendance() {
  
  const [records, setRecords] = useState([]);

  const [form, setForm] = useState({
    employee_id: "",
    date: "",
    status: "PRESENT",
  });

const load = async () => {
  if (!form.employee_id) return;

  const res = await api.get(
    `/attendance/${form.employee_id}`
  );
  setRecords(res.data);
};

  const submit = async () => {
    await api.post("/attendance", form);
    load();
  };

  return (
    <div className="container">
      <h1 className="page-title"> Attendance</h1>

      <div style={{ display: "flex", gap: 10 }}>
       <input
  placeholder="Employee ID"
  value={form.employee_id}
  onChange={(e) =>
    setForm({ ...form, employee_id: e.target.value })
  }
/>

        <button className="secondary" onClick={load}>
          View
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <input
          type="date"
          onChange={(e) =>
            setForm({ ...form, date: e.target.value })
          }
        />

        <select
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
        >
          <option>PRESENT</option>
          <option>ABSENT</option>
        </select>

        <button onClick={submit}>Mark</button>
      </div>

      <ul>
        {records.map((r) => (
          <li key={r.id}>
            {r.date} - {r.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
