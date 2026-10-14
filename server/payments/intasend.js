import { timingSafeEqual } from "node:crypto";

/** IntaSend collection method for an Airtel Money Kenya phone prompt. */
export const AIRTEL_METHOD = "AIRTEL-MONEY";

export function intasendOrigin(env) {
  return env === "live" ? "https://api.intasend.com" : "https://sandbox.intasend.com";
}

export function challengesMatch(expected, received) {
  if (!expected || received == null) return false;
  const left = Buffer.from(String(expected));
  const right = Buffer.from(String(received));
  if (left.length !== right.length || left.length === 0) return false;
  return timingSafeEqual(left, right);
}

export function intasendState(state) {
  const value = String(state || "").toUpperCase();
  if (value === "COMPLETE" || value === "COMPLETED") return "success";
  if (value === "FAILED" || value === "CANCELED" || value === "CANCELLED") return "failed";
  return "pending";
}

export function invoiceAmountMatches(expectedKes, value) {
  if (value == null || value === "") return false;
  const amount = Number(value);
  return Number.isFinite(amount) && Math.round(amount) === Number(expectedKes);
}

function headers(config) {
  return {
    Authorization: `Bearer ${config.secretKey}`,
    INTASEND_PUBLIC_API_KEY: config.publishableKey,
    "Content-Type": "application/json",
  };
}

function invoiceFrom(body) {
  return body?.invoice || body;
}

export async function pushAirtel({ config, phone, amount, apiRef, fetchImpl = fetch }) {
  const response = await fetchImpl(`${intasendOrigin(config.env)}/api/v1/payment/collection/`, {
    method: "POST",
    headers: headers(config),
    body: JSON.stringify({
      public_key: config.publishableKey,
      currency: "KES",
      country: "KE",
      method: AIRTEL_METHOD,
      amount,
      phone_number: phone,
      api_ref: apiRef,
      name: "TapNet customer",
    }),
  });
  const body = await response.json().catch(() => ({}));
  const invoice = invoiceFrom(body);
  const invoiceId = invoice?.invoice_id || invoice?.id;
  if (!response.ok || !invoiceId) {
    const detail = body.detail || body.message || body.errors || body.error;
    const message = typeof detail === "string" ? detail : "IntaSend did not start the Airtel Money prompt.";
    throw new Error(message);
  }
  return {
    invoiceId: String(invoiceId),
    state: intasendState(invoice.state),
    customerMessage: "Approve the Airtel Money prompt on your phone.",
  };
}

export async function paymentStatus({ config, invoiceId, fetchImpl = fetch }) {
  const response = await fetchImpl(`${intasendOrigin(config.env)}/api/v1/payment/status/`, {
    method: "POST",
    headers: headers(config),
    body: JSON.stringify({
      invoice_id: invoiceId,
      public_key: config.publishableKey,
    }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    return { state: "pending", reason: "IntaSend has not confirmed this payment yet." };
  }
  const invoice = invoiceFrom(body);
  return {
    state: intasendState(invoice.state),
    amount: invoice.value,
    currency: invoice.currency || "KES",
    apiRef: invoice.api_ref || null,
    receipt: invoice.provider_ref || invoice.mpesa_reference || null,
    reason: invoice.failed_reason || null,
  };
}
