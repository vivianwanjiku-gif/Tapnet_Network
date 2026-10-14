import { useEffect, useState } from "react";
import api from "../../services/api";
import PageHeader from "../../components/PageHeader";

const statusClass = { online: "badge-success", offline: "badge-danger", maintenance: "badge-warning" };

export default function AdminNetwork() {
  const [routers, setRouters] = useState([]);
  const load = () => api.get("/network/routers").then((response) => setRouters(response.data));
  useEffect(() => { load(); }, []);
  const setStatus = async (router, status) => {
    await api.put(`/network/routers/${router.id}`, { status });
    load();
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Network" lede="Mark a router online or offline. Capacity stays on the record." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {routers.map((router) => (
          <article key={router.id} className="card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{router.name}</h2>
                <p className="font-mono text-xs text-ink-faint">{router.ip_address}</p>
              </div>
              <span className={statusClass[router.status] || "badge-gray"}>{router.status}</span>
            </div>
            <dl className="mt-4 space-y-1 text-sm text-ink-soft">
              <div className="flex justify-between"><dt>Location</dt><dd>{router.location}</dd></div>
              <div className="flex justify-between"><dt>Capacity</dt><dd>{router.bandwidth_capacity_mbps} Mbps</dd></div>
              <div className="flex justify-between gap-4"><dt>MAC</dt><dd className="font-mono text-xs">{router.mac_address}</dd></div>
            </dl>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => setStatus(router, "online")} className="rounded-full bg-signal-50 px-3 py-1.5 text-xs font-semibold text-signal-800">Online</button>
              <button type="button" onClick={() => setStatus(router, "offline")} className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-800">Offline</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
