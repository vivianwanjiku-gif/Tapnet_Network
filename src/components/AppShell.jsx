import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import Icon from "./Icon";
import Logo from "./Logo";

export default function AppShell({ portal, nav, user, detail, onLogout, width = "max-w-6xl", children }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="min-h-screen bg-paper text-ink lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)]">
      <a href="#main" className="skip-link">Skip to content</a>
      {open && (
        <button type="button" className="fixed inset-0 z-30 bg-ink/50 lg:hidden" aria-label="Close menu" onClick={close} />
      )}
      <aside
        id="portal-nav"
        className={`fixed inset-y-0 left-0 z-40 flex w-[17.5rem] flex-col bg-ink text-paper lg:sticky lg:top-0 lg:z-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full max-lg:invisible"
        }`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-5">
          <div>
            <Logo tone="light" />
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-mist">{portal}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="rounded-full border border-white/15 p-2 lg:hidden"
            onClick={close}
            aria-label="Close menu"
          >
            <Icon name="close" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label={portal}>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={close}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? "bg-white text-ink" : "text-mist hover:bg-white/10 hover:text-paper"
                }`
              }
            >
              <Icon name={item.icon} className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <p className="truncate text-sm font-semibold">{user?.full_name || "Signed in"}</p>
          <p className="truncate text-xs text-mist">{detail}</p>
          <button type="button" onClick={onLogout} className="mt-3 inline-flex items-center gap-2 text-sm text-ember-soft hover:text-white">
            <Icon name="logout" className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-paper/90 px-4 py-3 backdrop-blur lg:hidden">
          <Logo compact />
          <button
            type="button"
            className="btn-secondary !px-3"
            aria-expanded={open}
            aria-controls="portal-nav"
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" />
            <span className="sr-only">Open menu</span>
          </button>
        </header>
        <main id="main" className={`px-4 py-6 sm:px-6 lg:px-10 lg:py-8 ${width}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
