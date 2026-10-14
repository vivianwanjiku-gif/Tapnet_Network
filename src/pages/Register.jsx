import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { register } from "../store/authSlice";
import AuthLayout from "../components/AuthLayout";

const empty = { full_name: "", email: "", phone: "", password: "", location: "" };

export default function Register() {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [params] = useSearchParams();
  const packageId = params.get("package_id");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await dispatch(register(form)).unwrap();
      navigate(packageId ? `/pay?package_id=${packageId}` : "/dashboard");
    } catch (err) {
      setError(err?.message || "Could not create the account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      lede="Tell us where the line should live. You can subscribe as soon as the account exists."
      aside="A TapNet account is how you pay, renew, and ask for help."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{error}</div>}
        <div>
          <label className="label" htmlFor="full_name">Full name</label>
          <input id="full_name" name="full_name" className="input" autoComplete="name" onChange={onChange} required />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" className="input" onChange={onChange} required />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" className="input" onChange={onChange} required />
        </div>
        <div>
          <label className="label" htmlFor="location">Location</label>
          <input id="location" name="location" className="input" placeholder="Estate and town" onChange={onChange} />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="new-password" className="input" onChange={onChange} required minLength={6} />
        </div>
        <button className="btn-primary w-full" disabled={submitting}>{submitting ? "Creating account…" : "Create account"}</button>
      </form>
      <p className="mt-6 text-sm text-ink-soft">
        Already have an account? <Link to={packageId ? `/login?package_id=${encodeURIComponent(packageId)}` : "/login"} className="link">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
