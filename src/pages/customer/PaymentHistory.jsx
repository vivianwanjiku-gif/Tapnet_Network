import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { formatWhen, kes } from "../../lib/format";
import { myPayments } from "../../services/paymentsApi";

const statusClass = { success: "badge-success", pending: "badge-warning", failed: "badge-danger" };

export default function PaymentHistory() {
  const [payments, setPayments] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    myPayments()
      .then((data) => setPayments(data.payments || []))
      .catch((err) => {
        setPayments([]);
        setError(err.message);
      });
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader title="Payment history" lede="M-Pesa and Airtel Money payments on this account, including ones still waiting for confirmation." />
      {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
      {payments === null ? (
        <p className="text-ink-soft" role="status">Loading payments…</p>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="data-table">
            <caption className="sr-only">Your payments</caption>
            <thead>
              <tr>
                <th>Reference</th>
                <th>When</th>
                <th>Package</th>
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
                  <td>{payment.package_name}</td>
                  <td>{kes(payment.amount)}</td>
                  <td className="capitalize">{payment.method === "airtel" ? "Airtel Money" : "M-Pesa"}</td>
                  <td><span className={statusClass[payment.status] || "badge-gray"}>{payment.status}</span></td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr><td colSpan="6" className="text-ink-soft">No payments yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
