import { useEffect } from "react";

export default function PageHeader({ title, lede, action }) {
  useEffect(() => {
    document.title = `${title} · TapNet Network`;
  }, [title]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="display text-3xl sm:text-4xl">{title}</h1>
        {lede && <p className="mt-2 max-w-2xl text-ink-soft">{lede}</p>}
      </div>
      {action}
    </div>
  );
}
