import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import AuthLayout from "../components/AuthLayout";

export default function ForgotPassword() {
  const [id, setId] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/auth/forgot-password", { email: id, phone: id });
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Reset password"
      lede="Enter the email or phone on the account. If it matches, reset instructions are sent."
      aside="We only send a reset when the email or phone is already on an account."
    >
      {sent ? (
        <div className="rounded-2xl border border-signal-200 bg-signal-50 px-4 py-4 text-sm text-signal-800" role="status">
          If an account exists, reset instructions have been sent.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="identifier">Email or phone</label>
            <input id="identifier" className="input" value={id} onChange={(event) => setId(event.target.value)} required />
          </div>
          <button className="btn-primary w-full" disabled={submitting}>{submitting ? "Sending…" : "Send instructions"}</button>
        </form>
      )}
      <p className="mt-6 text-sm"><Link to="/login" className="link">Back to sign in</Link></p>
    </AuthLayout>
  );
}
