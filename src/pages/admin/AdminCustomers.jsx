import { useEffect, useState } from "react";
import api from "../../services/api";
import PageHeader from "../../components/PageHeader";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState("");

  const load = (q = query) => {
    const url = q ? `/admin/customers?q=${encodeURIComponent(q)}` : "/admin/customers";
    return api.get(url).then((response) => setCustomers(response.data));
  };

  useEffect(() => { load(""); }, []);

  const toggle = async (customer) => {
    await api.post(`/admin/customers/${customer.id}/status`, { is_active: !customer.is_active });
    load();
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Customers"
        lede="Find an account and suspend or restore it."
        action={(
          <form onSubmit={(event) => { event.preventDefault(); load(); }} className="w-full sm:w-72">
            <label className="label" htmlFor="customer-search">Search</label>
            <input
              id="customer-search"
              className="input"
              type="search"
              placeholder="Name or email"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                load(event.target.value);
              }}
            />
          </form>
        )}
      />
      <div className="card overflow-x-auto p-0">
        <table className="data-table">
          <caption className="sr-only">Customers</caption>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Status</th>
              <th><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="font-medium">{customer.full_name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.location}</td>
                <td><span className={customer.is_active ? "badge-success" : "badge-gray"}>{customer.is_active ? "active" : "suspended"}</span></td>
                <td className="text-right">
                  <button type="button" onClick={() => toggle(customer)} className="text-sm font-semibold text-signal-700">
                    {customer.is_active ? "Suspend" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && <tr><td colSpan="6" className="text-ink-soft">No customers match that search.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
