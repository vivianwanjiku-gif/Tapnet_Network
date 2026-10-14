import { useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function AuthLayout({ title, lede, children, aside }) {
  useEffect(() => {
    document.title = `${title} · TapNet Network`;
  }, [title]);

  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-2">
      <a href="#auth-main" className="skip-link">Skip to form</a>
      <aside className="relative hidden overflow-hidden bg-ink text-paper lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="hero-grid absolute inset-0" />
        <div className="absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-signal-500/25 blur-3xl" />
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-ember/20 blur-3xl" />
        <div className="relative">
          <Logo tone="light" />
        </div>
        <div className="relative max-w-md">
          <p className="font-display text-4xl leading-tight xl:text-5xl">{aside}</p>
          <ul className="mt-8 space-y-3 text-sm text-mist">
            <li>Plans from KSh 50 a day</li>
            <li>M-Pesa or Airtel Money, confirmed before the line starts</li>
            <li>Usage, devices, and support in one account</li>
          </ul>
        </div>
        <p className="relative text-xs uppercase tracking-[0.16em] text-mist">Nairobi · Mombasa · Kisumu · Nakuru</p>
      </aside>
      <div className="flex flex-col px-5 py-8 sm:px-10 lg:px-16">
        <div className="mb-10 flex items-center justify-between lg:hidden">
          <Logo />
          <Link to="/" className="text-sm font-semibold text-signal-700">Back home</Link>
        </div>
        <div id="auth-main" className="m-auto w-full max-w-md">
          <h1 className="display text-4xl">{title}</h1>
          {lede && <p className="mt-3 text-ink-soft">{lede}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
