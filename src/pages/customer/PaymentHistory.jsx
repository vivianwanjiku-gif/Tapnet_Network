import { useEffect, useState } from "react";
import api from "../../services/api";
import PageHeader from "../../components/PageHeader";
import { formatWhen, kes } from "../../lib/format";

const statusClass = { successful: "badge-success", pending: "badge-warning", failed: "badge-danger" };

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  useEffect(() => { api.get("/payments").then((response) => setPayments(response.data)); }, []);

  return (
    <div className="space-y-8">
      <PageHeader title="Payment history" lede="References for the payments on this account." />
      <div className="card overflow-x-auto p-0">
        <table className="data-table">
          <caption className="sr-only">Your payments</caption>
          <thead>
            <tr>
              <th>Reference</th>
              <th>When</th>
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
                <td>{kes(payment.amount)}</td>
                <td className="capitalize">{payment.method}</td>
                <td><span className={statusClass[payment.status] || "badge-gray"}>{payment.status}</span></td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan="5" className="text-ink-soft">No payments yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
