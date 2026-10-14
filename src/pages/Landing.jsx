import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import MarketingShell from "../components/MarketingShell";
import PlanGrid from "../components/PlanGrid";
import Icon from "../components/Icon";
import { coverageTowns, faqs, reasons, steps, stories } from "../data/site";

const highlights = [
  { label: "Starting at", value: "KSh 50" },
  { label: "Pay with", value: "M-Pesa · Airtel" },
  { label: "Contract", value: "None" },
  { label: "Towns live", value: "4" },
];

export default function Landing() {
  const [sent, setSent] = useState(false);
  const [contact, setContact] = useState({ name: "", phone: "", town: "Nairobi", message: "" });
  const { hash } = useLocation();

  useEffect(() => {
    if (!/^#[A-Za-z0-9-]+$/.test(hash)) return;
    document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  const onContact = (event) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <MarketingShell>
      <section className="relative overflow-hidden bg-ink text-paper">
        <div className="hero-grid absolute inset-0" />
        <div className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-signal-500/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-ember/20 blur-3xl" />
        <div className="pointer-events-none absolute right-[18%] top-24 hidden h-48 w-48 lg:block" aria-hidden="true">
          <span className="pulse-ring absolute inset-0 rounded-full border border-signal-300/50" />
          <span className="pulse-ring absolute inset-6 rounded-full border border-signal-300/40" style={{ animationDelay: "1.4s" }} />
          <span className="pulse-ring absolute inset-12 rounded-full border border-white/30" style={{ animationDelay: "2.6s" }} />
        </div>
        <div className="relative mx-auto grid max-w-page items-center gap-12 px-5 pb-28 pt-14 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:pb-36 lg:pt-20">
          <div className="rise">
            <p className="eyebrow-light">Home and small-business internet</p>
            <h1 className="mt-4 max-w-xl font-display text-5xl leading-[1.02] text-paper sm:text-6xl lg:text-[4.5rem]">
              Pay for the days you are actually online.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-mist">
              TapNet sells straightforward Wi-Fi across Kenya, from KSh 50 a day. Approve an M-Pesa or Airtel Money prompt, watch what you use, and renew only when you need the line.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/plans" className="btn-light">
                See plans and prices
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link to="/register" className="btn-ghost">Create an account</Link>
            </div>
          </div>
          <div className="rise rise-2" aria-hidden="true">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4 shadow-lift backdrop-blur">
              <div className="rounded-2xl bg-paper p-5 text-ink">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-ink-faint">Your line</p>
                  <span className="badge-success">Online</span>
                </div>
                <p className="mt-4 font-display text-3xl">Monthly</p>
                <p className="text-sm text-ink-soft">20 Mbps · 100 GB · renews in 23 days</p>
                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-xs text-ink-faint">
                    <span>42.8 GB used</span>
                    <span>57.2 GB left</span>
                  </div>
                  <div className="h-2 rounded-full bg-line">
                    <div className="h-2 w-[43%] rounded-full bg-signal-500" />
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between rounded-xl bg-paper px-3 py-3 ring-1 ring-line">
                  <span className="text-sm">Last payment</span>
                  <span className="text-sm font-semibold">KSh 800 · M-Pesa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-16 max-w-page px-5 sm:px-8">
        <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <li key={item.label} className="bg-paper-raised px-5 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-faint">{item.label}</p>
              <p className="mt-2 font-display text-3xl">{item.value}</p>
            </li>
          ))}
        </ul>
      </div>

      <section id="plans" className="mx-auto max-w-page px-5 py-20 sm:px-8 sm:py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">Plans</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl">Simple prices. Nothing buried in the fine print.</h2>
            <p className="mt-4 text-lg text-ink-soft">
              Four prepaid options. Speed, data, and the number of days are on the card before you pay.
            </p>
          </div>
          <Link to="/plans" className="link">Open the plans page</Link>
        </div>
        <div className="mt-10">
          <PlanGrid />
        </div>
      </section>

      <section id="why" className="border-y border-line bg-paper-raised">
        <div className="mx-auto max-w-page px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow">Why TapNet</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl">An internet account that behaves like a product, not a counter.</h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason, index) => (
              <article key={reason.title} className="rounded-3xl border border-line bg-paper p-6">
                <p className="font-display text-2xl text-signal-700">0{index + 1}</p>
                <h3 className="mt-4 text-lg font-semibold">{reason.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft">{reason.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="bg-ink text-paper">
        <div className="mx-auto max-w-page px-5 py-20 sm:px-8 sm:py-24">
          <p className="eyebrow-light">How it works</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl text-paper sm:text-5xl">Online in three steps. Renew the same way.</h2>
          <ol className="mt-12 grid gap-6 lg:grid-cols-3">
            {steps.map((step) => (
              <li key={step.n} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="font-display text-3xl text-signal-300">{step.n}</p>
                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-mist">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="coverage" className="mx-auto max-w-page px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Coverage</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl">Live in four towns, and growing by estate.</h2>
            <p className="mt-4 text-lg text-ink-soft">
              We light up neighbourhoods we can actually support. If yours is not on the list, ask and we will say so plainly.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {coverageTowns.map((place) => (
              <li key={place.town} className="card">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl">{place.town}</h3>
                  <span className="badge-success">Live</span>
                </div>
                <p className="mt-3 text-sm font-medium">{place.areas}</p>
                <p className="mt-2 text-sm text-ink-soft">{place.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-line bg-paper-raised" aria-labelledby="stories-title">
        <div className="mx-auto max-w-page px-5 py-20 sm:px-8 sm:py-24">
          <h2 id="stories-title" className="display text-4xl sm:text-5xl">What customers notice first</h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {stories.map((story) => (
              <figure key={story.name} className="flex h-full flex-col rounded-3xl bg-ink p-6 text-paper">
                <blockquote className="flex-1 font-display text-2xl leading-snug">“{story.quote}”</blockquote>
                <figcaption className="mt-6 text-sm text-mist">
                  <span className="block font-semibold text-paper">{story.name}</span>
                  {story.place}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-page px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl">Before you pay, the short answers.</h2>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {faqs.map((item) => (
              <details key={item.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold">
                  {item.q}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-signal-700 transition group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="max-w-2xl pb-2 pt-3 text-sm leading-6 text-ink-soft">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-line bg-paper-raised">
        <div className="mx-auto grid max-w-page gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Contact</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl">Ask about an estate, a plan, or a line that misbehaves.</h2>
            <p className="mt-4 text-lg text-ink-soft">
              Coverage questions can start here. If you already have an account, a support ticket is faster — it stays attached to your line.
            </p>
            <dl className="mt-8 space-y-4 text-sm">
              <div>
                <dt className="text-ink-faint">Hours</dt>
                <dd className="font-medium">Every day, 8:00–20:00 EAT</dd>
              </div>
              <div>
                <dt className="text-ink-faint">Desk</dt>
                <dd className="font-medium">Nairobi, serving Mombasa, Kisumu, and Nakuru</dd>
              </div>
              <div>
                <dt className="text-ink-faint">Existing customers</dt>
                <dd><Link to="/login" className="link">Sign in and open a ticket</Link></dd>
              </div>
            </dl>
          </div>
          {sent ? (
            <div className="card h-fit" role="status">
              <h3 className="font-display text-3xl">Thanks, {contact.name.split(" ")[0]}.</h3>
              <p className="mt-3 text-sm leading-6 text-ink-soft">
                We noted your question about {contact.town}. If you already pay for a line, sign in and open a support ticket so staff can reply on the account.
              </p>
              <button type="button" className="btn-secondary mt-6" onClick={() => setSent(false)}>Send another note</button>
            </div>
          ) : (
            <form onSubmit={onContact} className="card space-y-4">
              <div>
                <label className="label" htmlFor="contact-name">Name</label>
                <input id="contact-name" className="input" autoComplete="name" required value={contact.name} onChange={(event) => setContact({ ...contact, name: event.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="contact-phone">Phone</label>
                <input id="contact-phone" className="input" type="tel" autoComplete="tel" inputMode="tel" required placeholder="07…" value={contact.phone} onChange={(event) => setContact({ ...contact, phone: event.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="contact-town">Town</label>
                <select id="contact-town" className="input" value={contact.town} onChange={(event) => setContact({ ...contact, town: event.target.value })}>
                  {coverageTowns.map((place) => <option key={place.town}>{place.town}</option>)}
                  <option>Somewhere else</option>
                </select>
              </div>
              <div>
                <label className="label" htmlFor="contact-message">Message</label>
                <textarea id="contact-message" className="input" rows="4" required value={contact.message} onChange={(event) => setContact({ ...contact, message: event.target.value })} />
              </div>
              <button className="btn-primary w-full sm:w-auto">Send message</button>
            </form>
          )}
        </div>
      </section>
    </MarketingShell>
  );
}
