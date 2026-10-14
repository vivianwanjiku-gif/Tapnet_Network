import { Link } from "react-router-dom";
import MarketingShell from "../components/MarketingShell";
import PlanGrid from "../components/PlanGrid";

const included = [
  { title: "Prepaid, on purpose", body: "You pay for a day, a week, or 30 days. When it ends, the dashboard shows the line as offline until you renew." },
  { title: "The speed on the card", body: "10 to 50 Mbps depending on the plan. Premium is the one with unlimited data." },
  { title: "A receipt you can find", body: "Every payment keeps a TapNet reference, the method, and the status in your history." },
];

export default function Plans() {
  return (
    <MarketingShell title="Plans and prices · TapNet Network">
      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-page px-5 py-16 sm:px-8 sm:py-20">
          <p className="eyebrow-light">Plans and prices</p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl leading-tight text-paper sm:text-6xl">Pick a plan, then pay on your phone.</h1>
          <p className="mt-5 max-w-2xl text-lg text-mist">
            Prices are in Kenyan shillings. Subscribe signs you in — or creates an account — and opens the same payment screen customers already use.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="btn-light">Create an account</Link>
            <Link to="/login" className="btn-ghost">I already have one</Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-page px-5 py-16 sm:px-8">
        <PlanGrid />
        <p className="mt-6 text-sm text-ink-soft">No installation fee on these plans. Data caps are listed on the card; Premium does not have one.</p>
      </section>
      <section className="border-t border-line bg-paper-raised">
        <div className="mx-auto grid max-w-page gap-4 px-5 py-16 sm:px-8 md:grid-cols-3">
          {included.map((item) => (
            <article key={item.title} className="card">
              <h2 className="font-display text-2xl">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-ink-soft">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
