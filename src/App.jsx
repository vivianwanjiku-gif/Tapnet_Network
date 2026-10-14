import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Landing from "./pages/Landing";
import Plans from "./pages/Plans";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import CustomerLayout from "./layouts/CustomerLayout";
import Dashboard from "./pages/customer/Dashboard";
import Packages from "./pages/customer/Packages";
import Payment from "./pages/customer/Payment";
import PaymentHistory from "./pages/customer/PaymentHistory";
import Usage from "./pages/customer/Usage";
import Support from "./pages/customer/Support";
import Profile from "./pages/customer/Profile";
import Devices from "./pages/customer/Devices";
import Notifications from "./pages/customer/Notifications";
import AdminLayout from "./layouts/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminPackages from "./pages/admin/AdminPackages";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminNetwork from "./pages/admin/AdminNetwork";
import AdminTickets from "./pages/admin/AdminTickets";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports"));

function ChartPage({ children }) {
  return <Suspense fallback={<p className="text-ink-soft" role="status">Loading report…</p>}>{children}</Suspense>;
}

function RequireAuth({ children, role }) {
  const user = useSelector((s) => s.auth.user);
  if (!user) return <Navigate to={role === "admin" ? "/admin/login" : "/login"} replace />;
  if (role === "admin" && !["admin", "super_admin", "support_staff"].includes(user.role))
    return <Navigate to="/dashboard" replace />;
  if (role === "customer" && user.role !== "customer")
    return <Navigate to="/admin/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/plans" element={<Plans />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route element={<RequireAuth role="customer"><CustomerLayout /></RequireAuth>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/pay" element={<Payment />} />
        <Route path="/payments" element={<PaymentHistory />} />
        <Route path="/usage" element={<Usage />} />
        <Route path="/support" element={<Support />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<RequireAuth role="admin"><AdminLayout /></RequireAuth>}>
        <Route path="/admin/dashboard" element={<ChartPage><AdminDashboard /></ChartPage>} />
        <Route path="/admin/customers" element={<AdminCustomers />} />
        <Route path="/admin/packages" element={<AdminPackages />} />
        <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
        <Route path="/admin/payments" element={<AdminPayments />} />
        <Route path="/admin/network" element={<AdminNetwork />} />
        <Route path="/admin/reports" element={<ChartPage><AdminReports /></ChartPage>} />
        <Route path="/admin/tickets" element={<AdminTickets />} />
        <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
