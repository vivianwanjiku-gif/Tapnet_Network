import { useEffect, useState } from "react";
import api from "../../services/api";
import PageHeader from "../../components/PageHeader";

export default function Profile() {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", location: "" });
  const [saved, setSaved] = useState(false);
  useEffect(() => { api.get("/customer/profile").then((response) => setForm(response.data)); }, []);
  const onChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const onSubmit = (event) => {
    event.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader title="Profile" lede="The name, phone, and place on this account. Email stays as the sign-in." />
      <form onSubmit={onSubmit} className="card space-y-4">
        <div>
          <label className="label" htmlFor="full_name">Full name</label>
          <input id="full_name" name="full_name" className="input" value={form.full_name || ""} onChange={onChange} />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" className="input" value={form.email || ""} disabled />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input id="phone" name="phone" className="input" value={form.phone || ""} onChange={onChange} />
        </div>
        <div>
          <label className="label" htmlFor="location">Location</label>
          <input id="location" name="location" className="input" value={form.location || ""} onChange={onChange} />
        </div>
        {saved && <p className="text-sm text-signal-700" role="status">Saved on this device for the preview.</p>}
        <button className="btn-primary">Save profile</button>
      </form>
    </div>
  );
}
