import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { login } from "../store/authSlice";
import AuthLayout from "../components/AuthLayout";

export default function Login() {
  const [email, setEmail] = useState("john@example.com");
  const [password, setPassword] = useState("password");
  const [params] = useSearchParams();
  const packageId = params.get("package_id");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const user = await dispatch(login({ email, password })).unwrap();
      if (user.role === "customer") {
        navigate(packageId ? `/pay?package_id=${packageId}` : "/dashboard");
      } else {
        navigate("/admin/dashboard");
      }
    } catch {
      /* error is stored on the auth slice */
    }
  };

  const registerTo = packageId ? `/register?package_id=${encodeURIComponent(packageId)}` : "/register";

  return (
    <AuthLayout
      title="Sign in"
      lede={packageId ? "Sign in to finish subscribing. You will land on the payment screen for the plan you chose." : "Use your TapNet account to pay, check usage, and talk to support."}
      aside="Your line, your balance, and the next renewal — in one place."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{error}</div>}
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" className="input" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="label mb-0" htmlFor="password">Password</label>
            <Link to="/forgot-password" className="text-sm link">Forgot password?</Link>
          </div>
          <input id="password" className="input mt-1.5" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </div>
        <p className="text-xs text-ink-faint">Preview sign-in is filled in for you. This demo accepts the account shown here.</p>
        <button disabled={loading} className="btn-primary w-full">{loading ? "Signing in…" : "Sign in"}</button>
      </form>
      <p className="mt-6 text-sm text-ink-soft">
        New to TapNet? <Link to={registerTo} className="link">Create an account</Link>
      </p>
      <p className="mt-2 text-sm text-ink-soft">
        Staff? <Link to="/admin/login" className="link">Open the admin console</Link>
      </p>
    </AuthLayout>
  );
}
