import { useEffect, useState } from "react";
import api from "../../services/api";
import PageHeader from "../../components/PageHeader";

export default function Usage() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get("/customer/dashboard").then((response) => setData(response.data)); }, []);
  const pkg = data?.current_package;
  const total = pkg?.data_limit_gb || 100;
  const used = 42.8;
  const remaining = Math.max(total - used, 0);
  const percent = Math.min(100, Math.round((used / total) * 100));

  return (
    <div className="space-y-8">
      <PageHeader title="Data usage" lede="How much of the current allowance is already gone." />
      <div className="grid gap-4 md:grid-cols-3">
        <article className="card"><p className="text-sm text-ink-faint">Used</p><p className="mt-3 font-display text-4xl">{used} GB</p></article>
        <article className="card"><p className="text-sm text-ink-faint">Remaining</p><p className="mt-3 font-display text-4xl">{remaining.toFixed(1)} GB</p></article>
        <article className="card"><p className="text-sm text-ink-faint">Allowance</p><p className="mt-3 font-display text-4xl">{pkg?.data_limit_gb ? `${total} GB` : "Unlimited"}</p></article>
      </div>
      <section className="card">
        <div className="mb-3 flex justify-between text-sm">
          <span className="font-medium">{pkg?.name || "Current plan"}</span>
          <span className="text-ink-soft">{percent}% used</span>
        </div>
        <div className="h-3 rounded-full bg-line" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Data used">
          <div className="h-3 rounded-full bg-signal-500" style={{ width: `${percent}%` }} />
        </div>
      </section>
    </div>
  );
}
