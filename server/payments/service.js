import { randomBytes } from "node:crypto";
import { getPackage } from "./catalog.js";
import { intasendConfig, mpesaConfig } from "./config.js";
import { parseStkCallback, stkPush, stkQuery } from "./daraja.js";
import { challengesMatch, paymentStatus, pushAirtel } from "./intasend.js";
import { normalizeKenyanPhone } from "./phone.js";
import { applySettlement } from "./settle.js";
import { store } from "./store.js";

function paymentError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function newId(prefix) {
  return `${prefix}_${randomBytes(9).toString("hex")}`;
}

function publicPayment(payment) {
  if (!payment) return null;
  return {
    id: payment.id,
    customer_id: payment.customer_id,
    package_id: payment.package_id,
    package_name: payment.package_name,
    amount: payment.amount,
    currency: payment.currency,
    method: payment.method,
    status: payment.status,
    reference: payment.receipt || payment.provider_ref || payment.id,
    receipt: payment.receipt,
    failure_reason: payment.failure_reason,
    created_at: payment.created_at,
    completed_at: payment.completed_at,
  };
}

function subscriptionPayload(plan) {
  const start = new Date();
  const expiry = new Date(start.getTime() + plan.duration_days * 86400000);
  return {
    id: newId("sub"),
    package_name: plan.name,
    start_date: start.toISOString(),
    expiry_date: expiry.toISOString(),
    speed_mbps: plan.speed_mbps,
    data_limit_gb: plan.data_limit_gb,
  };
}

function assertCustomer(customerId) {
  if (!customerId || !/^[A-Za-z0-9_-]{1,80}$/.test(customerId)) {
    throw paymentError(401, "Sign in before paying.");
  }
}

export async function initiatePayment({ customerId, packageId, method, phone }, deps = {}) {
  assertCustomer(customerId);
  const plan = getPackage(packageId);
  if (!plan) throw paymentError(400, "That package is not available.");
  if (method !== "mpesa" && method !== "airtel") {
    throw paymentError(400, "Choose M-Pesa or Airtel Money.");
  }
  let normalized;
  try {
    normalized = normalizeKenyanPhone(phone);
  } catch (error) {
    throw paymentError(400, error.message);
  }

  const payment = await (deps.store || store).insertPending({
    id: newId("pay"),
    customer_id: customerId,
    package_id: plan.id,
    package_name: plan.name,
    amount: plan.price,
    method,
    phone: normalized,
  });

  try {
    if (method === "mpesa") {
      const config = mpesaConfig();
      const pushed = await stkPush({
        config,
        phone: normalized,
        amount: plan.price,
        accountReference: payment.id.slice(-12),
        fetchImpl: deps.fetchImpl,
      });
      const saved = await (deps.store || store).setProviderRef(payment.id, {
        providerRef: pushed.checkoutRequestId,
        merchantRequestId: pushed.merchantRequestId,
      });
      return { payment: publicPayment(saved), message: pushed.customerMessage };
    }

    const config = intasendConfig();
    const pushed = await pushAirtel({
      config,
      phone: normalized,
      amount: plan.price,
      apiRef: payment.id,
      fetchImpl: deps.fetchImpl,
    });
    const saved = await (deps.store || store).setProviderRef(payment.id, { providerRef: pushed.invoiceId });
    return { payment: publicPayment(saved), message: pushed.customerMessage };
  } catch (error) {
    await applySettlement(deps.store || store, {
      paymentId: payment.id,
      nextStatus: "failed",
      reason: error.message || "The payment prompt could not be sent.",
      subscription: null,
    });
    throw paymentError(502, error.message || "The payment prompt could not be sent.");
  }
}

async function settleFromProvider(payment, outcome, deps) {
  if (!payment || outcome.state === "pending") return payment;
  let decision = outcome;
  const plan = getPackage(payment.package_id);
  if (decision.state === "success" && !plan) {
    decision = { state: "failed", reason: "The package is no longer sold." };
  } else if (decision.state === "success") {
    if (decision.amount != null && Math.round(Number(decision.amount)) !== payment.amount) {
      decision = { state: "failed", reason: "The amount confirmed by the provider did not match the package price." };
    } else if (decision.phone && normalizeComparable(decision.phone) !== normalizeComparable(payment.phone)) {
      decision = { state: "failed", reason: "The phone number that paid did not match the prompt." };
    }
  }
  const result = await applySettlement(deps.store || store, {
    paymentId: payment.id,
    nextStatus: decision.state === "success" ? "success" : "failed",
    receipt: decision.receipt,
    reason: decision.reason,
    subscription: decision.state === "success" ? subscriptionPayload(plan) : null,
  });
  return result.payment;
}

function normalizeComparable(phone) {
  return String(phone).replace(/\D/g, "").slice(-9);
}

export async function refreshPayment(payment, deps = {}) {
  if (!payment || payment.status !== "pending" || !payment.provider_ref) return payment;
  if (payment.method === "mpesa") {
    const outcome = await stkQuery({
      config: mpesaConfig(),
      checkoutRequestId: payment.provider_ref,
      fetchImpl: deps.fetchImpl,
    });
    return settleFromProvider(payment, outcome, deps);
  }
  const outcome = await paymentStatus({
    config: intasendConfig(),
    invoiceId: payment.provider_ref,
    fetchImpl: deps.fetchImpl,
  });
  if (outcome.apiRef && outcome.apiRef !== payment.id) {
    return payment;
  }
  if (outcome.currency && String(outcome.currency).toUpperCase() !== "KES" && outcome.state === "success") {
    return settleFromProvider(payment, { state: "failed", reason: "The payment was not in Kenyan shillings." }, deps);
  }
  return settleFromProvider(payment, outcome, deps);
}

export async function getPaymentForCustomer(id, customerId) {
  assertCustomer(customerId);
  const payment = await store.getById(id);
  if (!payment || payment.customer_id !== customerId) return null;
  const refreshed = await refreshPayment(payment);
  return publicPayment(refreshed);
}

export async function listPayments({ customerId, scope, role, adminToken }, deps = {}) {
  let rows;
  if (scope === "all") {
    const expected = process.env.PAYMENTS_ADMIN_TOKEN;
    const allowedRole = ["admin", "super_admin", "support_staff"].includes(role);
    if (expected) {
      if (adminToken !== expected) throw paymentError(403, "Admin payment access was refused.");
    } else if (!allowedRole) {
      throw paymentError(403, "Admin payment access was refused.");
    }
    rows = await (deps.store || store).listAll();
  } else {
    assertCustomer(customerId);
    rows = await (deps.store || store).listForCustomer(customerId);
  }
  const visible = [];
  let refreshed = 0;
  for (const row of rows) {
    if (row.status === "pending" && row.provider_ref && refreshed < 8) {
      refreshed += 1;
      visible.push(await refreshPayment(row, deps).catch(() => row));
    } else {
      visible.push(row);
    }
  }
  return visible.map(publicPayment);
}

export async function currentSubscription(customerId) {
  assertCustomer(customerId);
  return store.currentSubscription(customerId);
}

export async function handleMpesaCallback(body, deps = {}) {
  const parsed = parseStkCallback(body);
  if (!parsed) return { accepted: true };
  const payment = await (deps.store || store).getByProviderRef(parsed.checkoutRequestId);
  if (!payment) return { accepted: true };
  const query = await stkQuery({
    config: mpesaConfig(),
    checkoutRequestId: parsed.checkoutRequestId,
    fetchImpl: deps.fetchImpl,
  });
  await settleFromProvider(payment, {
    state: query.state,
    receipt: query.receipt || parsed.receipt,
    reason: query.reason || parsed.resultDesc,
  }, deps);
  return { accepted: true };
}

export async function handleIntasendWebhook(body, deps = {}) {
  const config = intasendConfig();
  if (!challengesMatch(config.webhookChallenge, body?.challenge)) {
    throw paymentError(401, "Webhook challenge did not match.");
  }
  const invoiceId = body?.invoice_id ? String(body.invoice_id) : "";
  if (!invoiceId) return { accepted: true };
  const payment = await (deps.store || store).getByProviderRef(invoiceId);
  if (!payment || payment.method !== "airtel") return { accepted: true };
  await refreshPayment(payment, deps);
  return { accepted: true };
}
