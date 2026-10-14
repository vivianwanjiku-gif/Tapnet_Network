import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function Logo({ tone = "dark", compact = false }) {
  const onDark = tone === "light";
  return (
    <Link to="/" className="inline-flex items-center gap-2.5 rounded-xl" aria-label="TapNet Network home">
      <span className={`grid h-9 w-9 place-items-center rounded-xl ${onDark ? "bg-signal-400 text-ink" : "bg-ink text-signal-300"}`}>
        <Icon name="wifi" className="h-5 w-5" />
      </span>
      <span className="leading-none">
        <span className={`block font-display text-xl tracking-tight ${onDark ? "text-paper" : "text-ink"}`}>TapNet</span>
        {!compact && (
          <span className={`mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] ${onDark ? "text-mist" : "text-ink-faint"}`}>
            Network
          </span>
        )}
      </span>
    </Link>
  );
}
