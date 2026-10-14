/** Sellable plans. Prices are Kenyan shillings and are never taken from the browser. */
export const packages = [
  { id: "pkg-daily", name: "Daily", price: 50, duration_days: 1, speed_mbps: 10, data_limit_gb: 5, description: "Perfect for a day" },
  { id: "pkg-weekly", name: "Weekly", price: 250, duration_days: 7, speed_mbps: 15, data_limit_gb: 30, description: "Great for a week" },
  { id: "pkg-monthly", name: "Monthly", price: 800, duration_days: 30, speed_mbps: 20, data_limit_gb: 100, description: "Our most popular plan" },
  { id: "pkg-premium", name: "Premium", price: 1500, duration_days: 30, speed_mbps: 50, data_limit_gb: null, description: "Unlimited data, fastest speed" },
];

export function getPackage(id) {
  return packages.find((plan) => plan.id === id) || null;
}
