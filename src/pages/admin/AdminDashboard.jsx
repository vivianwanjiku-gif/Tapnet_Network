import { useEffect, useState } from "react";
import api from "../../services/api";
import PageHeader from "../../components/PageHeader";
import { kes } from "../../lib/format";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const cards = [
  { key: "total_customers", label: "Customers" },
  { key: "active_subscriptions", label: "Active subscriptions" },
  { key: "open_tickets", label: "Open tickets" },
  { key: "total_revenue", label: "Revenue", money: true },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState([]);
  useEffect(() => {
    api.get("/admin/dashboard").then((response) => setStats(response.data));
    api.get("/admin/reports/revenue").then((response) => setRevenue(response.data));
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader title="Admin dashboard" lede="Customers, live subscriptions, open tickets, and what has been collected." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.key} className="card">
            <p className="text-sm text-ink-faint">{card.label}</p>
            <p className="mt-3 font-display text-4xl">
              {stats ? (card.money ? kes(stats[card.key]) : stats[card.key]) : "—"}
            </p>
          </article>
        ))}
      </div>
      <section className="card">
        <h2 className="text-lg font-semibold">Revenue</h2>
        <p className="mt-1 text-sm text-ink-soft">Successful collections by month.</p>
        <div className="mt-4 h-72">
          <ResponsiveContainer>
            <LineChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4dcd0" />
              <XAxis dataKey="period" tick={{ fill: "#4e5c66", fontSize: 12 }} />
              <YAxis tick={{ fill: "#4e5c66", fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#0e7c71" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
