import { useEffect, useState } from "react";
import api from "../../services/api";
import PageHeader from "../../components/PageHeader";

const statusClass = { open: "badge-warning", in_progress: "badge-info", resolved: "badge-success" };
const empty = { ticket_type: "internet_problem", subject: "", description: "" };

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState(empty);

  const load = () => api.get("/customer/tickets").then((response) => setTickets(response.data));
  useEffect(() => { load(); }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    await api.post("/customer/tickets", form);
    setForm(empty);
    load();
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Support" lede="Tell us what the line is doing. Tickets stay on this account." />
      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={onSubmit} className="card space-y-3">
          <h2 className="text-lg font-semibold">New ticket</h2>
          <div>
            <label className="label" htmlFor="ticket-type">Type</label>
            <select id="ticket-type" className="input" value={form.ticket_type} onChange={(event) => setForm({ ...form, ticket_type: event.target.value })}>
              <option value="internet_problem">Internet problem</option>
              <option value="slow_internet">Slow internet</option>
              <option value="payment_issue">Payment issue</option>
              <option value="package_issue">Package issue</option>
              <option value="router_issue">Router issue</option>
              <option value="account_issue">Account issue</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="subject">Subject</label>
            <input id="subject" className="input" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} required />
          </div>
          <div>
            <label className="label" htmlFor="description">What happened</label>
            <textarea id="description" className="input" rows="4" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
          </div>
          <button className="btn-primary w-full">Submit ticket</button>
        </form>
        <section className="card lg:col-span-2">
          <h2 className="text-lg font-semibold">Your tickets</h2>
          {tickets.length === 0 && <p className="mt-4 text-sm text-ink-soft">No tickets yet.</p>}
          <div className="mt-4 space-y-3">
            {tickets.map((ticket) => (
              <article key={ticket.id} className="rounded-2xl border border-line p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-medium">{ticket.subject}</h3>
                  <span className={statusClass[ticket.status] || "badge-gray"}>{ticket.status.replace(/_/g, " ")}</span>
                </div>
                <p className="mt-2 text-sm text-ink-soft">{ticket.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
