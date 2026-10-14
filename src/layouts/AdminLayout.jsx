import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import AppShell from "../components/AppShell";

const nav = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "chart" },
  { to: "/admin/customers", label: "Customers", icon: "users" },
  { to: "/admin/packages", label: "Packages", icon: "package" },
  { to: "/admin/subscriptions", label: "Subscriptions", icon: "refresh" },
  { to: "/admin/payments", label: "Payments", icon: "card" },
  { to: "/admin/network", label: "Network", icon: "server" },
  { to: "/admin/reports", label: "Reports", icon: "chart" },
  { to: "/admin/tickets", label: "Support", icon: "support" },
  { to: "/admin/audit-logs", label: "Audit logs", icon: "log" },
];

export default function AdminLayout() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login");
  };

  return (
    <AppShell portal="Admin console" nav={nav} user={user} detail={user?.role?.replaceAll("_", " ")} onLogout={handleLogout} width="max-w-7xl">
      <Outlet />
    </AppShell>
  );
}
