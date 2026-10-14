export const mockPackages = [
  { id: "pkg-daily", name: "Daily", price: 50, duration_days: 1, speed_mbps: 10, data_limit_gb: 5, description: "Perfect for a day", status: "active" },
  { id: "pkg-weekly", name: "Weekly", price: 250, duration_days: 7, speed_mbps: 15, data_limit_gb: 30, description: "Great for a week", status: "active" },
  { id: "pkg-monthly", name: "Monthly", price: 800, duration_days: 30, speed_mbps: 20, data_limit_gb: 100, description: "Our most popular plan", status: "active" },
  { id: "pkg-premium", name: "Premium", price: 1500, duration_days: 30, speed_mbps: 50, data_limit_gb: null, description: "Unlimited data, fastest speed", status: "active" },
];
export const mockCustomers = [
  { id: "c-1", full_name: "John Kamau", email: "john@example.com", phone: "254712345678", location: "Nairobi", is_active: true, role: "customer" },
  { id: "c-2", full_name: "Jane Wanjiku", email: "jane@example.com", phone: "254723456789", location: "Mombasa", is_active: true, role: "customer" },
  { id: "c-3", full_name: "Peter Otieno", email: "peter@example.com", phone: "254734567890", location: "Kisumu", is_active: false, role: "customer" },
  { id: "c-4", full_name: "Mary Njeri", email: "mary@example.com", phone: "254745678901", location: "Nakuru", is_active: true, role: "customer" },
];
export const mockPayments = [
  { id: "pay-1", customer_id: "c-1", amount: 800, method: "mpesa", status: "successful", reference: "TAP-A1B2C3D4E5", created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: "pay-2", customer_id: "c-2", amount: 1500, method: "airtel", status: "successful", reference: "TAP-F6G7H8I9J0", created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: "pay-3", customer_id: "c-3", amount: 50, method: "mpesa", status: "pending", reference: "TAP-K1L2M3N4O5", created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: "pay-4", customer_id: "c-4", amount: 250, method: "mpesa", status: "failed", reference: "TAP-P6Q7R8S9T0", created_at: new Date(Date.now() - 259200000).toISOString() },
];
export const mockSubscriptions = [
  { id: "sub-1", customer_id: "c-1", package: mockPackages[2], status: "active", start_date: new Date(Date.now() - 604800000).toISOString(), expiry_date: new Date(Date.now() + 2000000000).toISOString(), price_paid: 800 },
  { id: "sub-2", customer_id: "c-2", package: mockPackages[3], status: "active", start_date: new Date(Date.now() - 1209600000).toISOString(), expiry_date: new Date(Date.now() + 1200000000).toISOString(), price_paid: 1500 },
];
export const mockRouters = [
  { id: "r-1", name: "Nairobi CBD-01", ip_address: "192.168.1.1", mac_address: "00:1A:2B:3C:4D:5E", location: "Nairobi CBD", status: "online", bandwidth_capacity_mbps: 500 },
  { id: "r-2", name: "Westlands-02", ip_address: "192.168.1.2", mac_address: "00:1A:2B:3C:4D:5F", location: "Westlands", status: "online", bandwidth_capacity_mbps: 300 },
  { id: "r-3", name: "Karen-03", ip_address: "192.168.1.3", mac_address: "00:1A:2B:3C:4D:60", location: "Karen", status: "offline", bandwidth_capacity_mbps: 200 },
];
export const mockTickets = [
  { id: "t-1", customer_id: "c-1", ticket_type: "slow_internet", subject: "Very slow connection since morning", description: "My internet has been very slow since 8am today.", status: "open", created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: "t-2", customer_id: "c-2", ticket_type: "payment_issue", subject: "Payment not reflected", description: "I paid via M-Pesa but my subscription is still pending.", status: "in_progress", created_at: new Date(Date.now() - 86400000).toISOString() },
];
export const mockAuditLogs = [
  { id: "a-1", actor_id: "admin-1", action: "package.created", entity_type: "package", entity_id: "pkg-monthly", ip_address: "127.0.0.1", created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: "a-2", actor_id: "admin-1", action: "customer.status_changed", entity_type: "customer", entity_id: "c-3", ip_address: "127.0.0.1", created_at: new Date(Date.now() - 7200000).toISOString() },
];
export const mockNotifications = [
  { id: "n-1", title: "Payment received", message: "Your payment of KSh 800 has been received.", channel: "in_app", is_read: false, created_at: new Date(Date.now() - 600000).toISOString() },
  { id: "n-2", title: "Package activated", message: "Your Monthly package is now active.", channel: "in_app", is_read: false, created_at: new Date(Date.now() - 3600000).toISOString() },
];
