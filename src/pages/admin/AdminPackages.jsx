import { useEffect, useState } from "react";
import api from "../../services/api";
import PageHeader from "../../components/PageHeader";
import { kes } from "../../lib/format";

const empty = { name: "", price: "", duration_days: 30, speed_mbps: 20, data_limit_gb: 100, description: "" };

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState(empty);
  const [show, setShow] = useState(false);
  const load = () => api.get("/packages?all=true").then((response) => setPackages(response.data));
  useEffect(() => { load(); }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    await api.post("/packages", {
      ...form,
      price: parseFloat(form.price),
      duration_days: parseInt(form.duration_days, 10),
      speed_mbps: parseInt(form.speed_mbps, 10),
      data_limit_gb: form.data_limit_gb === "" ? null : parseInt(form.data_limit_gb, 10),
    });
    setForm(empty);
    setShow(false);
    load();
  };

  const toggle = async (plan) => {
    if (plan.status === "active") await api.delete(`/packages/${plan.id}`);
    else await api.put(`/packages/${plan.id}`, { status: "active" });
    load();
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Packages"
        lede="Create a plan or take one off sale. Inactive plans stay in this list."
        action={<button type="button" onClick={() => setShow(!show)} className="btn-primary">{show ? "Cancel" : "New package"}</button>}
      />
      {show && (
        <form onSubmit={onSubmit} className="card grid gap-4 md:grid-cols-2">
          <div>
            <label className="label" htmlFor="pkg-name">Name</label>
            <input id="pkg-name" className="input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </div>
          <div>
            <label className="label" htmlFor="pkg-price">Price (KSh)</label>
            <input id="pkg-price" type="number" min="0" className="input" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required />
          </div>
          <div>
            <label className="label" htmlFor="pkg-days">Days</label>
            <input id="pkg-days" type="number" min="1" className="input" value={form.duration_days} onChange={(event) => setForm({ ...form, duration_days: event.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="pkg-speed">Speed (Mbps)</label>
            <input id="pkg-speed" type="number" min="1" className="input" value={form.speed_mbps} onChange={(event) => setForm({ ...form, speed_mbps: event.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="pkg-data">Data (GB)</label>
            <input id="pkg-data" type="number" min="0" className="input" value={form.data_limit_gb} onChange={(event) => setForm({ ...form, data_limit_gb: event.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="pkg-description">Description</label>
            <input id="pkg-description" className="input" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </div>
          <div className="md:col-span-2"><button className="btn-primary">Create package</button></div>
        </form>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {packages.map((plan) => (
          <article key={plan.id} className="card flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-2xl">{plan.name}</h2>
              <span className={plan.status === "active" ? "badge-success" : "badge-gray"}>{plan.status}</span>
            </div>
            <p className="mt-3 font-display text-3xl">{kes(plan.price)}</p>
            <p className="mt-2 flex-1 text-sm text-ink-soft">{plan.speed_mbps} Mbps · {plan.data_limit_gb == null ? "Unlimited data" : `${plan.data_limit_gb} GB`} · {plan.duration_days} days</p>
            <button type="button" onClick={() => toggle(plan)} className="btn-secondary mt-4 w-full">
              {plan.status === "active" ? "Deactivate" : "Activate"}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
