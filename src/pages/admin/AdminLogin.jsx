import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../store/authSlice";
import AuthLayout from "../../components/AuthLayout";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@tapnet.co.ke");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await dispatch(login({ email, password, admin: true })).unwrap();
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err?.message || "Could not sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Staff sign in"
      lede="Customers, packages, subscriptions, payments, and the network live in the admin console."
      aside="The console is for TapNet staff. Customer accounts use the other sign-in."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{error}</div>}
        <div>
          <label className="label" htmlFor="admin-email">Email</label>
          <input id="admin-email" className="input" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </div>
        <div>
          <label className="label" htmlFor="admin-password">Password</label>
          <input id="admin-password" className="input" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </div>
        <p className="text-xs text-ink-faint">Preview staff sign-in is filled in. This demo does not use a real password store.</p>
        <button className="btn-primary w-full" disabled={submitting}>{submitting ? "Signing in…" : "Sign in"}</button>
      </form>
      <p className="mt-6 text-sm text-ink-soft">
        Customer instead? <Link to="/login" className="link">Use the customer sign-in</Link>
      </p>
    </AuthLayout>
  );
}
