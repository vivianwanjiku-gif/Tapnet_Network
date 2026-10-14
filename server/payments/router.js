import { packages } from "./catalog.js";
import {
  currentSubscription,
  getPaymentForCustomer,
  handleIntasendWebhook,
  handleMpesaCallback,
  initiatePayment,
  listPayments,
} from "./service.js";
import { bearerFrom, customerIdFrom, queryFrom, readJson, roleFrom, run, sendJson } from "./http.js";

export function handlePackages(req, res) {
  return run(res, async () => {
    if (req.method !== "GET") return sendJson(res, 405, { error: "Use GET." });
    sendJson(res, 200, {
      packages: packages.map((plan) => ({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        duration_days: plan.duration_days,
        speed_mbps: plan.speed_mbps,
        data_limit_gb: plan.data_limit_gb,
      })),
    });
  });
}

export function handleInitiate(req, res) {
  return run(res, async () => {
    if (req.method !== "POST") return sendJson(res, 405, { error: "Use POST." });
    const body = await readJson(req);
    const result = await initiatePayment({
      customerId: customerIdFrom(req),
      packageId: body.package_id,
      method: body.method,
      phone: body.phone,
    });
    sendJson(res, 202, result);
  });
}

export function handleStatus(req, res) {
  return run(res, async () => {
    if (req.method !== "GET") return sendJson(res, 405, { error: "Use GET." });
    const payment = await getPaymentForCustomer(queryFrom(req).get("id"), customerIdFrom(req));
    if (!payment) return sendJson(res, 404, { error: "Payment not found." });
    sendJson(res, 200, { payment });
  });
}

export function handleList(req, res) {
  return run(res, async () => {
    if (req.method !== "GET") return sendJson(res, 405, { error: "Use GET." });
    const scope = queryFrom(req).get("scope") || "";
    const payments = await listPayments({
      customerId: customerIdFrom(req),
      scope,
      role: roleFrom(req),
      adminToken: bearerFrom(req),
    });
    sendJson(res, 200, { payments });
  });
}

export function handleMpesa(req, res) {
  return run(res, async () => {
    if (req.method !== "POST") return sendJson(res, 405, { error: "Use POST." });
    const body = await readJson(req);
    await handleMpesaCallback(body);
    sendJson(res, 200, { ResultCode: 0, ResultDesc: "Accepted" });
  });
}

export function handleIntasend(req, res) {
  return run(res, async () => {
    if (req.method !== "POST") return sendJson(res, 405, { error: "Use POST." });
    const body = await readJson(req);
    await handleIntasendWebhook(body);
    sendJson(res, 200, { accepted: true });
  });
}

export function handleSubscription(req, res) {
  return run(res, async () => {
    if (req.method !== "GET") return sendJson(res, 405, { error: "Use GET." });
    const subscription = await currentSubscription(customerIdFrom(req));
    sendJson(res, 200, { subscription });
  });
}
