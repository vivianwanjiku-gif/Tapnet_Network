import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { paymentPackages, paymentStatus, startPayment } from "../../services/paymentsApi";
import PageHeader from "../../components/PageHeader";
import { kes } from "../../lib/format";

const methods = [
  { id: "mpesa", label: "M-Pesa", hint: "Daraja STK push" },
  { id: "airtel", label: "Airtel Money", hint: "IntaSend prompt" },
];

export default function Payment() {
  const [params] = useSearchParams();
  const packageId = params.get("package_id");
  const [packages, setPackages] = useState([]);
  const [selected, setSelected] = useState(packageId || "");
  const [phone, setPhone] = useState("0712345678");
  const [method, setMethod] = useState("mpesa");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    paymentPackages().then((data) => {
      const plans = data.packages || [];
      setPackages(plans);
      if (!selected && plans[0]) setSelected(plans[0].id);
    }).catch((error) => {
      setResult({ message: error.message || "The package list could not be loaded." });
    });
  }, []);

  useEffect(() => {
    if (!result?.payment || result.payment.status !== "pending") return undefined;
    let stopped = false;
    const tick = async () => {
      try {
        const data = await paymentStatus(result.payment.id);
        if (stopped) return;
        if (data.payment.status !== "pending") {
          setResult({
            payment: data.payment,
            message: data.payment.status === "success"
              ? "Payment confirmed. Your package is active."
              : (data.payment.failure_reason || "The payment was not completed."),
          });
        }
      } catch {
        /* keep the pending state until the next check */
      }
    };
    const timer = setInterval(tick, 4000);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [result?.payment?.id, result?.payment?.status]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const data = await startPayment({ packageId: selected, method, phone });
      setResult({ payment: data.payment, message: data.message });
    } catch (error) {
      setResult({ message: error.message || "Payment failed" });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPkg = packages.find((plan) => plan.id === selected);
  const status = result?.payment?.status;

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader title="Make a payment" lede="M-Pesa and Airtel Money prompts are in Kenyan shillings. The package starts only after the payment is confirmed." />

      <form onSubmit={onSubmit} className="card space-y-5">
        <div>
          <label className="label" htmlFor="package">Package</label>
          <select id="package" className="input" value={selected} onChange={(event) => setSelected(event.target.value)} required>
            {packages.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} — KSh {plan.price} ({plan.duration_days}d, {plan.speed_mbps} Mbps)
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className="label">Payment method</legend>
          <div className="grid grid-cols-2 gap-2">
            {methods.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setMethod(item.id)}
                aria-pressed={method === item.id}
                className={`rounded-2xl border px-3 py-3 text-left text-sm ${
                  method === item.id ? "border-ink bg-ink text-paper" : "border-line bg-paper-raised text-ink"
                }`}
              >
                <span className="block font-semibold">{item.label}</span>
                <span className={`text-xs ${method === item.id ? "text-mist" : "text-ink-faint"}`}>{item.hint}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label className="label" htmlFor="phone">
            {method === "mpesa" ? "M-Pesa phone number" : "Airtel Money phone number"}
          </label>
          <input id="phone" className="input" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="0712345678" inputMode="tel" autoComplete="tel" required />
          <p className="mt-1.5 text-xs text-ink-faint">
            {method === "mpesa"
              ? "Safaricom sends an STK push to this number. Enter your M-Pesa PIN to approve it."
              : "IntaSend sends an Airtel Money prompt to this number."}
          </p>
        </div>

        {selectedPkg && (
          <div className="space-y-1 rounded-2xl bg-paper p-4 text-sm">
            <div className="flex justify-between"><span>Package</span><span className="font-medium">{selectedPkg.name}</span></div>
            <div className="flex justify-between"><span>Duration</span><span>{selectedPkg.duration_days} days</span></div>
            <div className="flex justify-between"><span>Speed</span><span>{selectedPkg.speed_mbps} Mbps</span></div>
            <div className="mt-2 flex justify-between border-t border-line pt-2 text-base">
              <span className="font-medium">Total</span>
              <span className="font-display text-2xl">{kes(selectedPkg.price)}</span>
            </div>
          </div>
        )}

        {result && (
          <div
            role="status"
            className={`rounded-xl px-3 py-3 text-sm ${
              status === "success" ? "bg-signal-50 text-signal-800" : status === "failed" || !result.payment ? "bg-red-50 text-red-800" : "bg-amber-50 text-amber-950"
            }`}
          >
            <p>{result.message}</p>
            {result.payment?.reference && <p className="mt-1 font-mono text-xs">Ref: {result.payment.reference}</p>}
            {status === "pending" && <p className="mt-1">Waiting for confirmation. This page checks again every few seconds.</p>}
            {status === "success" && <p className="mt-2"><Link className="link" to="/payments">View payment history</Link></p>}
          </div>
        )}

        <button disabled={submitting || !selectedPkg || status === "pending"} className="btn-primary w-full">
          {submitting ? "Sending prompt…" : status === "pending" ? "Waiting for confirmation…" : `Pay ${kes(selectedPkg?.price || 0)}`}
        </button>
      </form>
    </div>
  );
}
