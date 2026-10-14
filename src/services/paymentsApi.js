function sessionHeaders() {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("tapnet_user") || "null");
  } catch {
    user = null;
  }
  const headers = {
    "Content-Type": "application/json",
    "x-customer-id": user?.id || "",
    "x-user-role": user?.role || "",
  };
  const adminToken = import.meta.env.VITE_PAYMENTS_ADMIN_TOKEN;
  if (adminToken) headers.Authorization = `Bearer ${adminToken}`;
  return headers;
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { ...sessionHeaders(), ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || "The payment request failed.");
    error.status = response.status;
    throw error;
  }
  return data;
}

export function paymentPackages() {
  return request("/api/payments/packages");
}

export function startPayment({ packageId, method, phone }) {
  return request("/api/payments/initiate", {
    method: "POST",
    body: JSON.stringify({ package_id: packageId, method, phone }),
  });
}

export function paymentStatus(id) {
  return request(`/api/payments/status?id=${encodeURIComponent(id)}`);
}

export function myPayments() {
  return request("/api/payments");
}

export function allPayments() {
  return request("/api/payments?scope=all");
}

export function currentSubscription() {
  return request("/api/subscriptions/current");
}
