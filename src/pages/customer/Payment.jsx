import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import PageHeader from "../../components/PageHeader";
import { kes } from "../../lib/format";

export default function Payment() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const packageId = params.get("package_id");

  const [packages, setPackages] = useState([]);
  const [selected, setSelected] = useState(packageId || "");
  const [phone, setPhone] = useState("254712345678");
  const [method, setMethod] = useState("mpesa");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const redirectTimer = useRef(null);

  useEffect(() => () => clearTimeout(redirectTimer.current), []);

  useEffect(() => {
    api.get("/packages").then((response) => {
      setPackages(response.data);
      if (!selected && response.data[0]) setSelected(response.data[0].id);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const payload = { package_id: selected, method };
      if (method === "mpesa" || method === "airtel") payload.phone = phone;

      const { data } = await api.post("/payments/initiate", payload);

      if (method === "stripe" && data.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }

      const payment = data.payment || data;
      setResult({
        success: true,
        payment,
        message: data.message || "Payment received. Your package is now active.",
      });

      clearTimeout(redirectTimer.current);
      redirectTimer.current = setTimeout(() => navigate("/payments"), 3000);
    } catch (err) {
      setResult({
        success: false,
        message: err.response?.data?.error || "Payment failed",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPkg = packages.find((plan) => plan.id === selected);
  const methods = [
    { id: "mpesa", label: "M-Pesa", hint: "STK push" },
    { id: "airtel", label: "Airtel Money", hint: "Phone prompt" },
    { id: "stripe", label: "Card", hint: "Stripe" },
    { id: "cash", label: "Cash", hint: "Recorded" },
  ];

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader title="Make a payment" lede="Pay for a package with mobile money, card, or cash." />

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
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
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

        {(method === "mpesa" || method === "airtel") && (
          <div>
            <label className="label" htmlFor="phone">
              {method === "mpesa" ? "M-Pesa phone number" : "Airtel phone number"}
            </label>
            <input id="phone" className="input" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="254712345678" inputMode="tel" required />
            <p className="mt-1.5 text-xs text-ink-faint">
              {method === "mpesa"
                ? "You will get an STK push on this number."
                : "Approve the Airtel Money prompt on your phone."}
            </p>
          </div>
        )}

        {method === "stripe" && (
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950">
            Card payments open Stripe’s secure checkout when a checkout link is available.
          </div>
        )}

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
          <div role="status" className={`rounded-xl px-3 py-3 text-sm ${result.success ? "bg-signal-50 text-signal-800" : "bg-red-50 text-red-800"}`}>
            {result.success
              ? `${result.message}${result.payment?.reference ? ` Ref: ${result.payment.reference}` : ""}`
              : result.message}
          </div>
        )}

        <button disabled={submitting || !selectedPkg} className="btn-primary w-full">
          {submitting ? "Processing…" : `Pay ${kes(selectedPkg?.price || 0)}`}
        </button>
      </form>
    </div>
  );
}
