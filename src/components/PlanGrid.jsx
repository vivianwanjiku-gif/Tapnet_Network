import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { kes, periodWord } from "../lib/format";
import Icon from "./Icon";

function featuredId(plans) {
  if (plans.some((plan) => plan.id === "pkg-monthly")) return "pkg-monthly";
  return plans.find((plan) => /popular/i.test(plan.description || ""))?.id;
}

export default function PlanGrid({ mode = "public" }) {
  const [packages, setPackages] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let live = true;
    api.get("/packages").then((response) => {
      if (live) setPackages(Array.isArray(response.data) ? response.data : []);
    });
    return () => {
      live = false;
    };
  }, []);

  if (!packages) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-hidden="true">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-80 animate-pulse rounded-3xl bg-line/80" />
        ))}
      </div>
    );
  }

  if (packages.length === 0) {
    return <p className="text-ink-soft">No plans are on sale right now. Check back shortly, or contact us about coverage.</p>;
  }

  return (
    <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {packages.map((plan) => {
        const featured = plan.id === featuredId(packages);
        const facts = [
          `${plan.speed_mbps} Mbps`,
          plan.data_limit_gb ? `${plan.data_limit_gb} GB data` : "Unlimited data",
          `${plan.duration_days} day${plan.duration_days === 1 ? "" : "s"} of access`,
          "M-Pesa or Airtel Money",
        ];
        const actionClass = `${featured ? "btn-light" : "btn-primary"} mt-6 w-full`;
        return (
          <article
            key={plan.id}
            className={`plan-card ${featured ? "border-signal-400 bg-ink text-paper hover:border-signal-300" : ""}`}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-2xl">{plan.name}</h3>
              {featured && <span className="rounded-full bg-signal-400 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink">Most chosen</span>}
            </div>
            {plan.description && (
              <p className={`mt-2 text-sm ${featured ? "text-mist" : "text-ink-soft"}`}>{plan.description}</p>
            )}
            <p className="mt-6">
              <span className="font-display text-4xl">{kes(plan.price)}</span>
              <span className={`mt-1 block text-sm ${featured ? "text-mist" : "text-ink-faint"}`}>per {periodWord(plan.duration_days)}</span>
            </p>
            <ul className="mt-6 flex-1 space-y-2.5 text-sm">
              {facts.map((fact) => (
                <li key={fact} className="flex items-start gap-2">
                  <Icon name="check" className={`mt-0.5 h-4 w-4 shrink-0 ${featured ? "text-signal-300" : "text-signal-600"}`} />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
            {mode === "account" ? (
              <button type="button" className={actionClass} onClick={() => navigate(`/pay?package_id=${plan.id}`)}>
                Subscribe
              </button>
            ) : (
              <Link className={actionClass} to={`/login?package_id=${encodeURIComponent(plan.id)}`}>
                Subscribe
              </Link>
            )}
          </article>
        );
      })}
    </div>
  );
}
