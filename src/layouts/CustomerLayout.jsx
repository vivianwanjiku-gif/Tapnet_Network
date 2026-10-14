import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import AppShell from "../components/AppShell";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: "home" },
  { to: "/packages", label: "Packages", icon: "package" },
  { to: "/pay", label: "Make payment", icon: "card" },
  { to: "/payments", label: "Payments", icon: "receipt" },
  { to: "/usage", label: "Data usage", icon: "chart" },
  { to: "/devices", label: "Devices", icon: "device" },
  { to: "/notifications", label: "Notifications", icon: "bell" },
  { to: "/support", label: "Support", icon: "support" },
  { to: "/profile", label: "Profile", icon: "user" },
];

export default function CustomerLayout() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <AppShell portal="Customer portal" nav={nav} user={user} detail={user?.email} onLogout={handleLogout}>
      <Outlet />
    </AppShell>
  );
}
