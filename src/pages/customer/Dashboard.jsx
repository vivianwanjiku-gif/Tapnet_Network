import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { currentSubscription } from "../../services/paymentsApi";
import PageHeader from "../../components/PageHeader";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [liveSub, setLiveSub] = useState(null);
  useEffect(() => {
    api.get("/customer/dashboard").then((response) => setData(response.data));
    currentSubscription().then((response) => setLiveSub(response.subscription)).catch(() => setLiveSub(null));
  }, []);
  if (!data) return <p role="status" className="text-ink-soft">Loading your line…</p>;

  const sub = liveSub || data.subscription;
  const pkg = liveSub
    ? { name: liveSub.package_name, speed_mbps: liveSub.speed_mbps }
    : data.current_package;
  const isActive = liveSub ? liveSub.status === "active" : data.internet_status === "ONLINE";

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" lede="Your connection, the package on it, and when it expires." />
      <div className="grid gap-4 md:grid-cols-3">
        <article className="card">
          <p className="text-sm text-ink-faint">Status</p>
          <p className={`mt-3 font-display text-4xl ${isActive ? "text-signal-700" : "text-red-700"}`}>{isActive ? "ONLINE" : "OFFLINE"}</p>
          <p className="mt-2 text-sm text-ink-soft">{isActive ? "The line is active." : "Buy a package to come back online."}</p>
        </article>
        <article className="card">
          <p className="text-sm text-ink-faint">Package</p>
          <p className="mt-3 font-display text-4xl">{pkg?.name || "None"}</p>
          <p className="mt-2 text-sm text-ink-soft">{pkg ? `${pkg.speed_mbps} Mbps` : "No package selected yet."}</p>
        </article>
        <article className="card">
          <p className="text-sm text-ink-faint">Expires</p>
          <p className="mt-3 font-display text-4xl">{sub?.expiry_date ? new Date(sub.expiry_date).toLocaleDateString("en-KE", { day: "numeric", month: "short" }) : "—"}</p>
          <p className="mt-2 text-sm text-ink-soft">{sub?.expiry_date ? new Date(sub.expiry_date).getFullYear() : "Renew after you subscribe."}</p>
        </article>
      </div>
      <section className="card">
        <h2 className="text-lg font-semibold">Quick actions</h2>
        <p className="mt-1 text-sm text-ink-soft">The things people open this account to do.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/packages" className="btn-primary">Buy a package</Link>
          <Link to="/pay" className="btn-secondary">Make a payment</Link>
          <Link to="/usage" className="btn-secondary">View usage</Link>
          <Link to="/support" className="btn-secondary">Get support</Link>
        </div>
      </section>
    </div>
  );
}
