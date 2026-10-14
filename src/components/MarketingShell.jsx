import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import Logo from "./Logo";
import { whatsappHref } from "../data/site";

const links = [
  { to: "/plans", label: "Plans" },
  { to: "/#why", label: "Why TapNet" },
  { to: "/#how", label: "How it works" },
  { to: "/#coverage", label: "Coverage" },
  { to: "/#faq", label: "FAQ" },
  { to: "/#contact", label: "Contact" },
];

function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/90 text-paper backdrop-blur">
      <div className="mx-auto flex max-w-page items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Logo tone="light" />
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="text-sm font-medium text-mist hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Link to="/login" className="btn-ghost">Sign in</Link>
          <Link to="/register" className="btn-light">Get connected</Link>
        </div>
        <button
          type="button"
          className="rounded-full border border-white/20 p-2 lg:hidden"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <Icon name={open ? "close" : "menu"} />
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>
      {open && (
        <nav id="site-menu" className="space-y-1 border-t border-white/10 px-5 py-4 lg:hidden" aria-label="Mobile">
          {links.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 text-base text-paper hover:bg-white/10">
              {link.label}
            </Link>
          ))}
          <div className="grid gap-2 pt-3">
            <Link to="/login" onClick={() => setOpen(false)} className="btn-ghost w-full">Sign in</Link>
            <Link to="/register" onClick={() => setOpen(false)} className="btn-light w-full">Get connected</Link>
          </div>
        </nav>
      )}
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto grid max-w-page gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-sm text-sm leading-6 text-mist">
            Affordable prepaid internet for homes and small businesses in Kenya. Pay with M-Pesa or Airtel Money, watch your usage, and renew when you need to.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-signal-200">Explore</h2>
          <ul className="mt-4 space-y-2 text-sm text-mist">
            <li><Link className="hover:text-white" to="/plans">Plans and prices</Link></li>
            <li><Link className="hover:text-white" to="/#coverage">Coverage</Link></li>
            <li><Link className="hover:text-white" to="/#faq">Questions</Link></li>
            <li><Link className="hover:text-white" to="/#contact">Contact</Link></li>
            <li><a className="hover:text-white" href={whatsappHref()} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-signal-200">Account</h2>
          <ul className="mt-4 space-y-2 text-sm text-mist">
            <li><Link className="hover:text-white" to="/login">Customer sign in</Link></li>
            <li><Link className="hover:text-white" to="/register">Create an account</Link></li>
            <li><Link className="hover:text-white" to="/forgot-password">Reset password</Link></li>
            <li><Link className="hover:text-white" to="/admin/login">Staff sign in</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-page flex-col gap-2 px-5 py-5 text-xs text-mist sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} TapNet Network. Nairobi, Mombasa, Kisumu, and Nakuru.</p>
          <p>Prices in Kenyan shillings. Prepaid plans, no long contract.</p>
        </div>
      </div>
    </footer>
  );
}

export default function MarketingShell({ title, children }) {
  useEffect(() => {
    document.title = title || "TapNet Network — Affordable internet in Kenya";
  }, [title]);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <a href="#main" className="skip-link">Skip to content</a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </div>
  );
}
