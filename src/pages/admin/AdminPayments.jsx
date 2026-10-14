import { useEffect, useState } from "react";
import api from "../../services/api";
import PageHeader from "../../components/PageHeader";
import { formatWhen, kes } from "../../lib/format";

const statusClass = { successful: "badge-success", pending: "badge-warning", failed: "badge-danger" };

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  useEffect(() => { api.get("/admin/payments").then((response) => setPayments(response.data)); }, []);

  return (
    <div className="space-y-8">
      <PageHeader title="Payments" lede="Every collection on the network, including pending and failed ones." />
      <div className="card overflow-x-auto p-0">
        <table className="data-table">
          <caption className="sr-only">All payments</caption>
          <thead>
            <tr>
              <th>Reference</th>
              <th>When</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="font-mono text-xs">{payment.reference}</td>
                <td className="text-ink-soft">{formatWhen(payment.created_at)}</td>
                <td className="font-mono text-xs">{payment.customer_id}</td>
                <td>{kes(payment.amount)}</td>
                <td className="capitalize">{payment.method}</td>
                <td><span className={statusClass[payment.status] || "badge-gray"}>{payment.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
