import { useEffect, useState } from "react";
import api from "../../services/api";
import PageHeader from "../../components/PageHeader";
import { formatWhen } from "../../lib/format";

export default function Notifications() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/notifications").then((response) => setItems(response.data)); }, []);

  return (
    <div className="space-y-8">
      <PageHeader title="Notifications" lede="Payments, activations, and anything else TapNet sends to this account." />
      <div className="space-y-3">
        {items.map((item) => (
          <article key={item.id} className="card flex gap-4">
            <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${item.is_read ? "bg-line" : "bg-signal-500"}`} aria-hidden="true" />
            <div>
              <h2 className="font-semibold">{item.title}</h2>
              <p className="mt-1 text-sm text-ink-soft">{item.message}</p>
              <p className="mt-2 text-xs text-ink-faint">{formatWhen(item.created_at)} · {item.channel?.replaceAll("_", " ")}</p>
            </div>
          </article>
        ))}
        {items.length === 0 && <p className="text-sm text-ink-soft">No notifications yet.</p>}
      </div>
    </div>
  );
}
