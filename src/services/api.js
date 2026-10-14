import {
  mockPackages, mockCustomers, mockPayments, mockSubscriptions,
  mockRouters, mockTickets, mockAuditLogs, mockNotifications,
} from "./mockData";

const USE_MOCK = true;
const BASE_URL = "http://localhost:5000/api";

const db = {
  packages: [...mockPackages],
  customers: [...mockCustomers],
  payments: [...mockPayments],
  subscriptions: [...mockSubscriptions],
  routers: [...mockRouters],
  tickets: [...mockTickets],
  auditLogs: [...mockAuditLogs],
  notifications: [...mockNotifications],
};

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));
const genRef = () => "TAP-" + Math.random().toString(36).slice(2, 12).toUpperCase();

async function mockRequest(method, url, body) {
  await delay();
  const path = url.split("?")[0];
  const qs = new URLSearchParams(url.split("?")[1] || "");

  if (path === "/auth/login" || path === "/auth/admin/login") {
    const isAdmin = path.includes("admin");
    const user = isAdmin
      ? { id: "admin-1", email: body.email, full_name: "Super Admin", role: "super_admin", is_active: true }
      : { id: "c-1", email: body.email, full_name: "John Kamau", phone: "254712345678", location: "Nairobi", role: "customer", is_active: true };
    return { data: { user, access_token: "mock-token", refresh_token: "mock-refresh" } };
  }
  if (path === "/auth/register") {
    const user = { id: "c-new", full_name: body.full_name, email: body.email, phone: body.phone, location: body.location, role: "customer", is_active: true };
    return { data: { user, access_token: "mock-token", refresh_token: "mock-refresh" } };
  }
  if (path === "/auth/forgot-password") return { data: { message: "Sent." } };
  if (path === "/customer/dashboard") {
    const sub = db.subscriptions.find((s) => s.customer_id === "c-1" && s.status === "active");
    return { data: { internet_status: sub ? "ONLINE" : "OFFLINE", current_package: sub?.package || null, subscription: sub || null } };
  }
  if (path === "/customer/profile") return { data: { id: "c-1", full_name: "John Kamau", email: "john@example.com", phone: "254712345678", location: "Nairobi" } };
  if (path === "/customer/tickets" && method === "get") return { data: db.tickets.filter((t) => t.customer_id === "c-1") };
  if (path === "/customer/tickets" && method === "post") {
    const ticket = { id: "t-" + Date.now(), customer_id: "c-1", ...body, status: "open", created_at: new Date().toISOString() };
    db.tickets.push(ticket);
    return { data: ticket };
  }
  if (path === "/customer/devices") return { data: [
    { id: "d-1", mac_address: "AA:BB:CC:DD:EE:01", device_name: "John's iPhone", last_connected: new Date().toISOString() },
  ]};
  if (path === "/packages" && method === "get") {
    const all = qs.get("all") === "true";
    return { data: all ? db.packages : db.packages.filter((p) => p.status === "active") };
  }
  if (path === "/packages" && method === "post") {
    const pkg = { id: "pkg-" + Date.now(), ...body, status: "active" };
    db.packages.push(pkg);
    return { data: pkg };
  }
  if (path.startsWith("/packages/") && method === "put") {
    const id = path.split("/")[2];
    const pkg = db.packages.find((p) => p.id === id);
    Object.assign(pkg, body);
    return { data: pkg };
  }
  if (path.startsWith("/packages/") && method === "delete") {
    const id = path.split("/")[2];
    const pkg = db.packages.find((p) => p.id === id);
    if (pkg) pkg.status = "inactive";
    return { data: { message: "OK" } };
  }
  if (path === "/payments" && method === "get") return { data: db.payments.filter((p) => p.customer_id === "c-1") };
  if (path === "/payments/initiate") {
    return { data: { error: "Use /api/payments/initiate. A package starts only after M-Pesa or Airtel Money confirms payment." } };
  }
  if (path === "/admin/dashboard") {
    const revenue = db.payments.filter((p) => p.status === "successful").reduce((s, p) => s + p.amount, 0);
    return { data: {
      total_customers: db.customers.length,
      active_subscriptions: db.subscriptions.filter((s) => s.status === "active").length,
      open_tickets: db.tickets.filter((t) => ["open", "in_progress"].includes(t.status)).length,
      total_revenue: revenue,
      pending_payments: db.payments.filter((p) => p.status === "pending").length,
      failed_payments: db.payments.filter((p) => p.status === "failed").length,
    }};
  }
  if (path === "/admin/customers") {
    const q = qs.get("q")?.toLowerCase() || "";
    return { data: db.customers.filter((c) => !q || c.full_name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)) };
  }
  if (path.startsWith("/admin/customers/") && path.endsWith("/status")) {
    const id = path.split("/")[3];
    const c = db.customers.find((x) => x.id === id);
    if (c) c.is_active = body.is_active;
    return { data: c };
  }
  if (path === "/admin/payments") {
    const status = qs.get("status");
    return { data: status ? db.payments.filter((p) => p.status === status) : db.payments };
  }
  if (path === "/admin/audit-logs") return { data: db.auditLogs };
  if (path === "/admin/reports/revenue") {
    return { data: [
      { period: "2026-04", revenue: 45000 }, { period: "2026-05", revenue: 52000 },
      { period: "2026-06", revenue: 48000 }, { period: "2026-07", revenue: 61000 },
      { period: "2026-08", revenue: 72000 }, { period: "2026-09", revenue: 38000 },
    ]};
  }
  if (path === "/subscriptions") {
    const status = qs.get("status");
    return { data: status ? db.subscriptions.filter((s) => s.status === status) : db.subscriptions };
  }
  if (path.startsWith("/subscriptions/") && path.endsWith("/status")) {
    const id = path.split("/")[2];
    const sub = db.subscriptions.find((s) => s.id === id);
    if (sub) sub.status = body.status;
    return { data: sub };
  }
  if (path === "/network/routers" && method === "get") return { data: db.routers };
  if (path === "/network/routers" && method === "post") {
    const r = { id: "r-" + Date.now(), ...body, status: "online" };
    db.routers.push(r);
    return { data: r };
  }
  if (path.startsWith("/network/routers/") && method === "put") {
    const id = path.split("/")[3];
    const r = db.routers.find((x) => x.id === id);
    Object.assign(r, body);
    return { data: r };
  }
  if (path === "/support/tickets" && method === "get") {
    const status = qs.get("status");
    return { data: status ? db.tickets.filter((t) => t.status === status) : db.tickets };
  }
  if (path.startsWith("/support/tickets/") && method === "put") {
    const id = path.split("/")[3];
    const t = db.tickets.find((x) => x.id === id);
    Object.assign(t, body);
    return { data: t };
  }
  if (path === "/notifications") return { data: db.notifications };
  return { data: { error: "Unknown route", path } };
}

const api = {
  get: (url) => mockRequest("get", url),
  post: (url, body) => mockRequest("post", url, body),
  put: (url, body) => mockRequest("put", url, body),
  delete: (url) => mockRequest("delete", url),
};

export default api;
