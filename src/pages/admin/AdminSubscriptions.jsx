import { useEffect, useState } from "react";
import api from "../../services/api";
import PageHeader from "../../components/PageHeader";

const statusClass = { active: "badge-success", pending: "badge-warning", suspended: "badge-danger", expired: "badge-gray" };

export default function AdminSubscriptions() {
  const [subs, setSubs] = useState([]);
  const load = () => api.get("/subscriptions").then((response) => setSubs(response.data));
  useEffect(() => { load(); }, []);
  const setStatus = async (sub, status) => {
    await api.post(`/subscriptions/${sub.id}/status`, { status });
    load();
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Subscriptions" lede="Activate a line or suspend it without deleting the record." />
      <div className="card overflow-x-auto p-0">
        <table className="data-table">
          <caption className="sr-only">Subscriptions</caption>
          <thead>
            <tr>
              <th>Package</th>
              <th>Customer</th>
              <th>Expiry</th>
              <th>Status</th>
              <th><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {subs.map((sub) => (
              <tr key={sub.id}>
                <td className="font-medium">{sub.package?.name}</td>
                <td className="font-mono text-xs">{sub.customer_id}</td>
                <td>{sub.expiry_date ? new Date(sub.expiry_date).toLocaleDateString("en-KE") : "—"}</td>
                <td><span className={statusClass[sub.status] || "badge-gray"}>{sub.status}</span></td>
                <td className="text-right">
                  {sub.status !== "active" && <button type="button" onClick={() => setStatus(sub, "active")} className="text-sm font-semibold text-signal-700">Activate</button>}
                  {sub.status === "active" && <button type="button" onClick={() => setStatus(sub, "suspended")} className="text-sm font-semibold text-red-700">Suspend</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
