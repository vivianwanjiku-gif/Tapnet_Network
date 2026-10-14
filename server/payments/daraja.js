import { Buffer } from "node:buffer";

export function stkTimestamp(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}`;
}

export function stkPassword(shortcode, passkey, timestamp) {
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
}

export function darajaOrigin(env) {
  return env === "live" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";
}

export function metadataMap(items) {
  const mapped = {};
  for (const item of items || []) {
    if (item?.Name) mapped[item.Name] = item.Value;
  }
  return mapped;
}

export function parseStkCallback(body) {
  const callback = body?.Body?.stkCallback;
  if (!callback?.CheckoutRequestID) return null;
  const meta = metadataMap(callback.CallbackMetadata?.Item);
  return {
    checkoutRequestId: String(callback.CheckoutRequestID),
    merchantRequestId: callback.MerchantRequestID ? String(callback.MerchantRequestID) : null,
    resultCode: Number(callback.ResultCode),
    resultDesc: callback.ResultDesc ? String(callback.ResultDesc) : "",
    amount: meta.Amount == null ? null : Number(meta.Amount),
    receipt: meta.MpesaReceiptNumber ? String(meta.MpesaReceiptNumber) : null,
    phone: meta.PhoneNumber == null ? null : String(meta.PhoneNumber),
  };
}

/** Daraja query codes that mean the prompt is still open. */
export function darajaQueryState(payload) {
  const errorCode = payload?.errorCode ? String(payload.errorCode) : "";
  if (errorCode === "500.001.1001" || errorCode === "500.001.1002") {
    return { state: "pending", reason: payload.errorMessage || "The prompt is still open." };
  }
  if (payload?.ResultCode == null && payload?.responseCode == null) {
    return { state: "pending", reason: "Safaricom has not finished the request." };
  }
  const code = Number(payload.ResultCode ?? payload.responseCode);
  if (code === 0) {
    return { state: "success", receipt: payload.MpesaReceiptNumber ? String(payload.MpesaReceiptNumber) : null };
  }
  if (code === 4999) {
    return { state: "pending", reason: payload.ResultDesc || "The payment is still processing." };
  }
  return { state: "failed", reason: payload.ResultDesc || payload.errorMessage || `M-Pesa returned code ${code}.` };
}

let tokenCache = { token: "", expiresAt: 0, key: "" };

export async function darajaToken({ consumerKey, consumerSecret, env, fetchImpl = fetch }) {
  const cacheKey = `${env}:${consumerKey}`;
  if (tokenCache.key === cacheKey && tokenCache.expiresAt > Date.now() + 15000) {
    return tokenCache.token;
  }
  const basic = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  const response = await fetchImpl(`${darajaOrigin(env)}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${basic}` },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.access_token) {
    throw new Error("Safaricom did not issue an access token. Check the Daraja app keys and MPESA_ENV.");
  }
  tokenCache = {
    token: body.access_token,
    expiresAt: Date.now() + Number(body.expires_in || 3600) * 1000,
    key: cacheKey,
  };
  return body.access_token;
}

export function resetDarajaTokenCache() {
  tokenCache = { token: "", expiresAt: 0, key: "" };
}

export async function stkPush({ config, phone, amount, accountReference, fetchImpl = fetch }) {
  const timestamp = stkTimestamp();
  const token = await darajaToken({ ...config, fetchImpl });
  const response = await fetchImpl(`${darajaOrigin(config.env)}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: config.shortcode,
      Password: stkPassword(config.shortcode, config.passkey, timestamp),
      Timestamp: timestamp,
      TransactionType: config.transactionType || "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: config.shortcode,
      PhoneNumber: phone,
      CallBackURL: config.callbackUrl,
      AccountReference: accountReference,
      TransactionDesc: "TapNet Wi-Fi",
    }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || String(body.ResponseCode ?? body.responseCode) !== "0" || !body.CheckoutRequestID) {
    const message = body.errorMessage || body.ResponseDescription || body.errorMessage || "Safaricom rejected the STK push.";
    throw new Error(message);
  }
  return {
    checkoutRequestId: String(body.CheckoutRequestID),
    merchantRequestId: body.MerchantRequestID ? String(body.MerchantRequestID) : null,
    customerMessage: body.CustomerMessage || "Check your phone for the M-Pesa prompt.",
  };
}

export async function stkQuery({ config, checkoutRequestId, fetchImpl = fetch }) {
  const timestamp = stkTimestamp();
  const token = await darajaToken({ ...config, fetchImpl });
  const response = await fetchImpl(`${darajaOrigin(config.env)}/mpesa/stkpushquery/v1/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: config.shortcode,
      Password: stkPassword(config.shortcode, config.passkey, timestamp),
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok && !body.errorCode && body.ResultCode == null) {
    return { state: "pending", reason: "Could not reach Safaricom to confirm the payment." };
  }
  return darajaQueryState(body);
}
