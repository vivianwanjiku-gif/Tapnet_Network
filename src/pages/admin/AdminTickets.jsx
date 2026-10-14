import { useEffect, useState } from "react";
import api from "../../services/api";
import PageHeader from "../../components/PageHeader";
import { formatWhen } from "../../lib/format";

const statusClass = { open: "badge-warning", in_progress: "badge-info", resolved: "badge-success" };
const statuses = [
  { id: "open", label: "Open" },
  { id: "in_progress", label: "In progress" },
  { id: "resolved", label: "Resolved" },
];

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const load = () => api.get("/support/tickets").then((response) => setTickets(response.data));
  useEffect(() => { load(); }, []);
  const update = async (ticket, status) => {
    await api.put(`/support/tickets/${ticket.id}`, { status });
    load();
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Support tickets" lede="Move a ticket from open, to in progress, to resolved." />
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <article key={ticket.id} className="card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{ticket.subject}</h2>
                <p className="mt-1 text-xs text-ink-faint">{ticket.ticket_type?.replaceAll("_", " ")} · {formatWhen(ticket.created_at)}</p>
              </div>
              <span className={statusClass[ticket.status] || "badge-gray"}>{ticket.status?.replaceAll("_", " ")}</span>
            </div>
            <p className="mt-3 text-sm text-ink-soft">{ticket.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={status.id}
                  type="button"
                  onClick={() => update(ticket, status.id)}
                  aria-pressed={ticket.status === status.id}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${ticket.status === status.id ? "border-ink bg-ink text-paper" : "border-line"}`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
