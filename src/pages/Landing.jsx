import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import MarketingShell from "../components/MarketingShell";
import PlanGrid from "../components/PlanGrid";
import Icon from "../components/Icon";
import { coverageTowns, faqs, reasons, steps, stories, trustSignals, whatsappHref } from "../data/site";

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
        <div className="hero-aurora aurora-drift absolute inset-0" />
        <div className="hero-grid absolute inset-0" />
        <div className="relative mx-auto grid max-w-page items-center gap-12 px-5 pb-24 pt-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-20">
          <div className="rise">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-signal-200">
              <span className="h-1.5 w-1.5 rounded-full bg-signal-300" />
              Prepaid internet across Kenya
            </p>
            <h1 className="mt-6 max-w-xl font-display text-5xl leading-[0.98] text-paper sm:text-6xl lg:text-7xl">
              Switch the Wi-Fi on. Pay with M-Pesa.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-mist">
              Home and shop lines from KSh 50 a day, up to 50 Mbps. Approve M-Pesa or Airtel Money on your phone. The package starts only after that payment is confirmed.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/plans" className="btn-light">
                View plans and pay with M-Pesa
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <a className="btn-ghost" href={whatsappHref()} target="_blank" rel="noopener noreferrer">
                Chat on WhatsApp
              </a>
            </div>
            <p className="mt-5 text-sm text-mist">No contract. Nairobi, Mombasa, Kisumu, and Nakuru.</p>
          </div>
          <HeroArt />
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-12 max-w-page px-5 sm:px-8">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trustSignals.map((item) => (
            <li key={item.label} className="rounded-2xl border border-line bg-paper-raised px-5 py-5 shadow-lift">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-faint">{item.label}</p>
              <p className="mt-2 font-display text-3xl text-ink">{item.value}</p>
              <p className="mt-1 text-sm text-ink-soft">{item.detail}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#1b8f4a] px-3 py-1.5 text-xs font-semibold text-white">M-Pesa</span>
          <span className="rounded-full bg-[#e40000] px-3 py-1.5 text-xs font-semibold text-white">Airtel Money</span>
          <span className="text-sm text-ink-soft">Both prompts are in Kenyan shillings.</span>
        </div>
      </div>

      <section id="plans" className="mx-auto max-w-page px-5 py-20 sm:px-8 sm:py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">Plans</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl">Prices in shillings. The popular plan is marked.</h2>
            <p className="mt-4 text-lg text-ink-soft">
              Speed, data, and the number of days are on the card. Subscribe opens sign-in, then the same M-Pesa or Airtel Money screen.
            </p>
          </div>
          <Link to="/plans" className="link">Open the full plans page</Link>
        </div>
        <div className="mt-10">
          <PlanGrid spotlight />
        </div>
      </section>

      <section id="why" className="border-y border-line bg-paper-raised">
        <div className="mx-auto max-w-page px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow">Why TapNet</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl">A line you can start, see, and stop.</h2>
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

      <section id="how" className="relative overflow-hidden bg-ink text-paper">
        <div className="hero-aurora absolute inset-0 opacity-70" />
        <div className="relative mx-auto max-w-page px-5 py-20 sm:px-8 sm:py-24">
          <p className="eyebrow-light">How it works</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl text-paper sm:text-5xl">Online in three steps. Renew the same way.</h2>
          <ol className="mt-12 grid gap-6 lg:grid-cols-3">
            {steps.map((step) => (
              <li key={step.n} className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
                <p className="font-display text-4xl text-signal-300">{step.n}</p>
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
            <h2 className="display mt-3 text-4xl sm:text-5xl">Live in four towns, estate by estate.</h2>
            <p className="mt-4 text-lg text-ink-soft">
              We light up neighbourhoods we can actually support. If yours is not listed, ask on WhatsApp and we will say so plainly.
            </p>
            <a className="btn-primary mt-6" href={whatsappHref("Hello TapNet, is my estate covered?")} target="_blank" rel="noopener noreferrer">
              Ask about coverage
            </a>
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
            {stories.map((story, index) => (
              <figure key={story.name} className={`flex h-full flex-col rounded-3xl p-6 text-paper ${index === 1 ? "bg-gradient-to-br from-signal-800 to-ink" : "bg-ink"}`}>
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

      <section id="contact" className="relative overflow-hidden border-t border-line bg-ink text-paper">
        <div className="hero-aurora pointer-events-none absolute inset-0 opacity-80" />
        <div className="relative mx-auto grid max-w-page gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-2">
          <div>
            <p className="eyebrow-light">Contact</p>
            <h2 className="mt-3 font-display text-4xl text-paper sm:text-5xl">Ask about an estate, or message the desk on WhatsApp.</h2>
            <p className="mt-4 text-lg text-mist">
              Coverage questions can start here. If you already have an account, a support ticket stays attached to your line.
            </p>
            <a className="btn-light mt-8" href={whatsappHref()} target="_blank" rel="noopener noreferrer">
              WhatsApp TapNet
              <Icon name="arrow" className="h-4 w-4" />
            </a>
            <dl className="mt-8 space-y-4 text-sm">
              <div>
                <dt className="text-mist">Support</dt>
                <dd className="font-medium">24/7, by ticket or WhatsApp</dd>
              </div>
              <div>
                <dt className="text-mist">Desk</dt>
                <dd className="font-medium">Nairobi, serving Mombasa, Kisumu, and Nakuru</dd>
              </div>
              <div>
                <dt className="text-mist">Existing customers</dt>
                <dd><Link to="/login" className="font-semibold text-signal-200 underline-offset-4 hover:underline">Sign in and open a ticket</Link></dd>
              </div>
            </dl>
          </div>
          {sent ? (
            <div className="h-fit rounded-3xl bg-paper p-6 text-ink shadow-lift" role="status">
              <h3 className="font-display text-3xl">Thanks, {contact.name.split(" ")[0]}.</h3>
              <p className="mt-3 text-sm leading-6 text-ink-soft">
                We noted your question about {contact.town}. If you already pay for a line, sign in and open a support ticket so staff can reply on the account.
              </p>
              <button type="button" className="btn-secondary mt-6" onClick={() => setSent(false)}>Send another note</button>
            </div>
          ) : (
            <form onSubmit={onContact} className="space-y-4 rounded-3xl bg-paper p-6 text-ink shadow-lift">
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

function HeroArt() {
  return (
    <div className="rise rise-2 relative" aria-hidden="true">
      <div className="absolute -left-6 top-8 h-40 w-40 rounded-full bg-signal-400/30 blur-3xl" />
      <div className="absolute -right-4 bottom-6 h-36 w-36 rounded-full bg-ember/30 blur-3xl" />
      <div className="relative rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-lift backdrop-blur">
        <svg viewBox="0 0 480 520" className="h-auto w-full">
          <defs>
            <linearGradient id="tapnet-wash" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#5ec4b4" />
              <stop offset="55%" stopColor="#149a8c" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
            <linearGradient id="tapnet-card" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fffcf6" />
              <stop offset="100%" stopColor="#f3f0e8" />
            </linearGradient>
          </defs>
          <rect x="36" y="28" width="408" height="464" rx="36" fill="#101820" />
          <circle cx="360" cy="110" r="86" fill="url(#tapnet-wash)" opacity="0.9" />
          <circle cx="120" cy="390" r="70" fill="#2cb8a6" opacity="0.35" />
          <path d="M150 168c48-46 132-46 180 0" fill="none" stroke="#fffcf6" strokeWidth="8" strokeLinecap="round" opacity="0.9" />
          <path d="M178 196c32-30 92-30 124 0" fill="none" stroke="#96d6cb" strokeWidth="8" strokeLinecap="round" />
          <circle cx="240" cy="228" r="8" fill="#fffcf6" />
          <rect x="78" y="268" width="324" height="176" rx="24" fill="url(#tapnet-card)" />
          <text x="102" y="312" fill="#4e5c66" fontFamily="Outfit, sans-serif" fontSize="16">Monthly · most popular</text>
          <text x="102" y="352" fill="#101820" fontFamily="Fraunces, serif" fontSize="36">KSh 800</text>
          <text x="102" y="384" fill="#3e4c55" fontFamily="Outfit, sans-serif" fontSize="16">20 Mbps · 100 GB · 30 days</text>
          <rect x="102" y="402" width="196" height="14" rx="7" fill="#e4dcd0" />
          <rect x="102" y="402" width="84" height="14" rx="7" fill="#149a8c" />
        </svg>
        <div className="absolute left-8 top-8 rounded-full bg-paper px-3 py-1 text-xs font-semibold text-ink">Online</div>
        <div className="absolute bottom-10 right-8 rounded-2xl bg-ink/90 px-4 py-3 text-paper shadow-lift">
          <p className="text-[11px] uppercase tracking-[0.14em] text-signal-200">Last payment</p>
          <p className="mt-1 text-sm font-semibold">KSh 800 · M-Pesa</p>
        </div>
      </div>
    </div>
  );
}
