import assert from "node:assert/strict";
import test from "node:test";
import { darajaQueryState, parseStkCallback, resetDarajaTokenCache, stkPassword, stkTimestamp } from "./daraja.js";
import { AIRTEL_METHOD, challengesMatch, intasendState, invoiceAmountMatches } from "./intasend.js";
import { normalizeKenyanPhone } from "./phone.js";
import { applySettlement } from "./settle.js";
import { handleIntasendWebhook, handleMpesaCallback, initiatePayment, refreshPayment } from "./service.js";

test("normalizes Kenyan mobile numbers", () => {
  assert.equal(normalizeKenyanPhone("0712 345 678"), "254712345678");
  assert.equal(normalizeKenyanPhone("+254112345678"), "254112345678");
  assert.throws(() => normalizeKenyanPhone("12345"), /Kenyan mobile/);
});

test("builds the Daraja STK password from the shortcode, passkey, and timestamp", () => {
  const timestamp = stkTimestamp(new Date("2026-01-02T03:04:05Z"));
  assert.equal(timestamp, "20260102030405");
  assert.equal(stkPassword("174379", "passkey", timestamp), Buffer.from("174379passkey20260102030405").toString("base64"));
});

test("reads an M-Pesa callback without treating it as paid on its own", () => {
  const parsed = parseStkCallback({
    Body: {
      stkCallback: {
        CheckoutRequestID: "ws_CO_1",
        ResultCode: 0,
        ResultDesc: "ok",
        CallbackMetadata: {
          Item: [
            { Name: "Amount", Value: 800 },
            { Name: "MpesaReceiptNumber", Value: "ABC123" },
            { Name: "PhoneNumber", Value: 254712345678 },
          ],
        },
      },
    },
  });
  assert.equal(parsed.checkoutRequestId, "ws_CO_1");
  assert.equal(parsed.receipt, "ABC123");
  assert.equal(parsed.amount, 800);
  assert.equal(darajaQueryState({ ResultCode: 0 }).state, "success");
  assert.equal(darajaQueryState({ ResultCode: 1032, ResultDesc: "Cancelled" }).state, "failed");
  assert.equal(darajaQueryState({ errorCode: "500.001.1001" }).state, "pending");
});

test("checks the IntaSend challenge and Airtel amount before success", () => {
  assert.equal(AIRTEL_METHOD, "AIRTEL-MONEY");
  assert.equal(challengesMatch("secret-value", "secret-value"), true);
  assert.equal(challengesMatch("secret-value", "secret-valuX"), false);
  assert.equal(challengesMatch("", "secret-value"), false);
  assert.equal(intasendState("COMPLETE"), "success");
  assert.equal(intasendState("COMPLETED"), "success");
  assert.equal(intasendState("PROCESSING"), "pending");
  assert.equal(intasendState("PARTIAL"), "pending");
  assert.equal(intasendState("FAILED"), "failed");
  assert.equal(intasendState("CANCELED"), "failed");
  assert.equal(invoiceAmountMatches(800, "800.00"), true);
  assert.equal(invoiceAmountMatches(800, "50"), false);
});

function memoryStore() {
  const payments = new Map();
  const subs = [];
  let chain = Promise.resolve();
  const tx = {
    async lockPayment(id) {
      const row = payments.get(id);
      return row ? { ...row } : null;
    },
    async updatePayment(id, patch) {
      const next = { ...payments.get(id), ...patch };
      payments.set(id, next);
      return { ...next };
    },
    async findSubscription(paymentId) {
      return subs.find((item) => item.payment_id === paymentId) || null;
    },
    async insertSubscriptionOnce(sub) {
      const existing = subs.find((item) => item.payment_id === sub.payment_id);
      if (existing) return existing;
      subs.push(sub);
      return sub;
    },
  };
  return {
    payments,
    subs,
    async insertPending(payment) {
      const row = { ...payment, status: "pending", currency: "KES", provider_ref: null, receipt: null };
      payments.set(payment.id, row);
      return { ...row };
    },
    async setProviderRef(id, { providerRef, merchantRequestId }) {
      const next = { ...payments.get(id), provider_ref: providerRef, merchant_request_id: merchantRequestId || null };
      payments.set(id, next);
      return { ...next };
    },
    async getByProviderRef(providerRef) {
      return [...payments.values()].find((row) => row.provider_ref === providerRef) || null;
    },
    transaction(fn) {
      const run = chain.then(() => fn(tx));
      chain = run.then(() => {}, () => {});
      return run;
    },
  };
}

test("activates one subscription and ignores a second confirmation", async () => {
  const db = memoryStore();
  db.payments.set("pay_1", {
    id: "pay_1",
    customer_id: "c-1",
    package_id: "pkg-daily",
    amount: 50,
    status: "pending",
  });
  const first = await applySettlement(db, {
    paymentId: "pay_1",
    nextStatus: "success",
    receipt: "RCPT1",
    subscription: { id: "sub_1", package_name: "Daily", start_date: "2026-01-01", expiry_date: "2026-01-02" },
  });
  const second = await applySettlement(db, {
    paymentId: "pay_1",
    nextStatus: "success",
    receipt: "RCPT1",
    subscription: { id: "sub_2", package_name: "Daily", start_date: "2026-01-01", expiry_date: "2026-01-02" },
  });
  assert.equal(first.duplicate, false);
  assert.equal(second.duplicate, true);
  assert.equal(db.subs.length, 1);
  assert.equal(db.payments.get("pay_1").status, "success");
});

test("charges the catalog price in KES and leaves the subscription pending", async () => {
  const db = memoryStore();
  let charged = null;
  process.env.MPESA_CONSUMER_KEY = "key";
  process.env.MPESA_CONSUMER_SECRET = "secret";
  process.env.MPESA_SHORTCODE = "174379";
  process.env.MPESA_PASSKEY = "passkey";
  process.env.MPESA_ENV = "sandbox";
  process.env.MPESA_CALLBACK_URL = "https://example.com/api/payments/mpesa-callback";
  const fetchImpl = async (url, options) => {
    if (String(url).includes("oauth")) {
      return { ok: true, json: async () => ({ access_token: "token", expires_in: 3600 }) };
    }
    charged = JSON.parse(options.body);
    return {
      ok: true,
      json: async () => ({
        ResponseCode: "0",
        CheckoutRequestID: "ws_CO_test",
        MerchantRequestID: "m_1",
        CustomerMessage: "Prompt sent",
      }),
    };
  };
  const result = await initiatePayment({
    customerId: "c-1",
    packageId: "pkg-monthly",
    method: "mpesa",
    phone: "0712345678",
    amount: 1,
  }, { store: db, fetchImpl });
  assert.equal(charged.Amount, 800);
  assert.equal(charged.TransactionType, "CustomerPayBillOnline");
  assert.equal(result.payment.status, "pending");
  assert.equal(result.payment.currency, "KES");
  assert.equal(db.subs.length, 0);
});

test("Airtel Money uses the IntaSend catalog amount and stays pending", async () => {
  const db = memoryStore();
  process.env.INTASEND_PUBLISHABLE_KEY = "pub_test";
  process.env.INTASEND_SECRET_KEY = "sec_test";
  process.env.INTASEND_ENV = "sandbox";
  let charged = null;
  const fetchImpl = async (url, options) => {
    charged = { url: String(url), body: JSON.parse(options.body) };
    return { ok: true, json: async () => ({ invoice_id: "inv_1", state: "PENDING" }) };
  };
  const result = await initiatePayment({
    customerId: "c-1",
    packageId: "pkg-weekly",
    method: "airtel",
    phone: "0112345678",
    amount: 1,
  }, { store: db, fetchImpl });
  assert.match(charged.url, /^https:\/\/sandbox\.intasend\.com\/api\/v1\/payment\/collection\/$/);
  assert.equal(charged.body.method, AIRTEL_METHOD);
  assert.equal(charged.body.currency, "KES");
  assert.equal(charged.body.country, "KE");
  assert.equal(charged.body.amount, 250);
  assert.equal(result.payment.status, "pending");
  assert.equal(db.subs.length, 0);
});

test("rejects an IntaSend webhook whose challenge does not match", async () => {
  process.env.INTASEND_PUBLISHABLE_KEY = "pub_test";
  process.env.INTASEND_SECRET_KEY = "sec_test";
  process.env.INTASEND_ENV = "sandbox";
  process.env.INTASEND_WEBHOOK_CHALLENGE = "expected-challenge";
  await assert.rejects(
    () => handleIntasendWebhook({ challenge: "wrong", invoice_id: "inv_1", state: "COMPLETE" }, { store: memoryStore() }),
    /challenge/i,
  );
});

test("does not activate Airtel Money when the confirmed amount is wrong", async () => {
  const db = memoryStore();
  process.env.INTASEND_PUBLISHABLE_KEY = "pub_test";
  process.env.INTASEND_SECRET_KEY = "sec_test";
  process.env.INTASEND_ENV = "sandbox";
  db.payments.set("pay_airtel", {
    id: "pay_airtel",
    customer_id: "c-1",
    package_id: "pkg-daily",
    amount: 50,
    status: "pending",
    phone: "254712345678",
    provider_ref: "inv_1",
    method: "airtel",
  });
  const fetchImpl = async () => ({
    ok: true,
    json: async () => ({ invoice_id: "inv_1", state: "COMPLETE", value: "800", currency: "KES", api_ref: "pay_airtel" }),
  });
  const result = await refreshPayment(db.payments.get("pay_airtel"), { store: db, fetchImpl });
  assert.equal(result.status, "failed");
  assert.equal(db.subs.length, 0);
});

test("activates M-Pesa only after Daraja confirms the checkout request", async () => {
  resetDarajaTokenCache();
  const db = memoryStore();
  process.env.MPESA_CONSUMER_KEY = "key";
  process.env.MPESA_CONSUMER_SECRET = "secret";
  process.env.MPESA_SHORTCODE = "174379";
  process.env.MPESA_PASSKEY = "passkey";
  process.env.MPESA_ENV = "sandbox";
  process.env.MPESA_CALLBACK_URL = "https://example.com/api/payments/mpesa-callback";
  db.payments.set("pay_cb", {
    id: "pay_cb",
    customer_id: "c-1",
    package_id: "pkg-monthly",
    amount: 800,
    status: "pending",
    phone: "254712345678",
    provider_ref: "ws_CO_1",
    method: "mpesa",
  });
  let queries = 0;
  const fetchImpl = async (url) => {
    if (String(url).includes("oauth")) {
      return { ok: true, json: async () => ({ access_token: "token", expires_in: 3600 }) };
    }
    queries += 1;
    if (queries === 1) return { ok: true, json: async () => ({ ResultCode: 4999, ResultDesc: "Still processing" }) };
    return { ok: true, json: async () => ({ ResultCode: 0, MpesaReceiptNumber: "RCPT9" }) };
  };
  const callback = {
    Body: {
      stkCallback: {
        CheckoutRequestID: "ws_CO_1",
        ResultCode: 0,
        ResultDesc: "The service request is processed successfully.",
        CallbackMetadata: { Item: [{ Name: "Amount", Value: 1 }, { Name: "MpesaReceiptNumber", Value: "SPOOF" }] },
      },
    },
  };
  await handleMpesaCallback(callback, { store: db, fetchImpl });
  assert.equal(db.payments.get("pay_cb").status, "pending");
  assert.equal(db.subs.length, 0);
  await handleMpesaCallback(callback, { store: db, fetchImpl });
  await handleMpesaCallback(callback, { store: db, fetchImpl });
  assert.equal(db.payments.get("pay_cb").status, "success");
  assert.equal(db.payments.get("pay_cb").receipt, "RCPT9");
  assert.equal(db.subs.length, 1);
});
