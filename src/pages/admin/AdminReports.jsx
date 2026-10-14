import { useEffect, useState } from "react";
import api from "../../services/api";
import PageHeader from "../../components/PageHeader";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function AdminReports() {
  const [revenue, setRevenue] = useState([]);
  useEffect(() => { api.get("/admin/reports/revenue").then((response) => setRevenue(response.data)); }, []);

  return (
    <div className="space-y-8">
      <PageHeader title="Reports" lede="Monthly revenue from successful payments." />
      <section className="card">
        <div className="h-80">
          <ResponsiveContainer>
            <BarChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4dcd0" />
              <XAxis dataKey="period" tick={{ fill: "#4e5c66", fontSize: 12 }} />
              <YAxis tick={{ fill: "#4e5c66", fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#0e7c71" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
