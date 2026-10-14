import { useEffect, useState } from "react";
import api from "../../services/api";
import PageHeader from "../../components/PageHeader";
import { formatWhen } from "../../lib/format";

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  useEffect(() => { api.get("/admin/audit-logs").then((response) => setLogs(response.data)); }, []);

  return (
    <div className="space-y-8">
      <PageHeader title="Audit logs" lede="Who changed a package, a customer, or another record." />
      <div className="card overflow-x-auto p-0">
        <table className="data-table">
          <caption className="sr-only">Audit logs</caption>
          <thead>
            <tr>
              <th>Time</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Entity</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="text-ink-soft">{formatWhen(log.created_at)}</td>
                <td className="font-mono text-xs">{log.actor_id}</td>
                <td>{log.action}</td>
                <td className="text-ink-soft">{log.entity_type} · {log.entity_id}</td>
                <td className="font-mono text-xs">{log.ip_address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
