import { useEffect, useState } from "react";
import { api } from "../api";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);

  const load = async () => {
    const res = await api.get(`/employees?page=${page}&limit=5`);
    setEmployees(res.data);
  };

  useEffect(() => {
    load();
  }, [page]);

  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });

  const submit = async () => {
    await api.post("/employees", form);
    load();
  };

  return (
    <div className="container">
      <h1 className="page-title"> Employees</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        {Object.keys(form).map((k) => (
          <input
            key={k}
            placeholder={k}
            value={form[k]}
            onChange={(e) =>
              setForm({ ...form, [k]: e.target.value })
            }
          />
        ))}
      </div>

      <button onClick={submit}>Add Employee</button>

      <table width="100%" border="1" cellPadding="8" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Dept</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {employees.data?.map((e) => (
            <tr key={e.employee_id}>
              <td>{e.employee_id}</td>
              <td>{e.full_name}</td>
              <td>{e.email}</td>
              <td>{e.department}</td>
              <td>
                <button
                  className="danger"
                  onClick={() =>
                    api.delete(`/employees/${e.employee_id}`).then(load)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 12 }}>
        <button
          className="secondary"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <span style={{ margin: "0 10px" }}>Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
