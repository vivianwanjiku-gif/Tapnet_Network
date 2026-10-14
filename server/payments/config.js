function required(name) {
  const value = process.env[name];
  if (!value) {
    const error = new Error(`${name} is not set.`);
    error.status = 503;
    throw error;
  }
  return value;
}

function mode(name) {
  const value = (process.env[name] || "sandbox").toLowerCase();
  if (value !== "sandbox" && value !== "live") {
    const error = new Error(`${name} must be sandbox or live.`);
    error.status = 503;
    throw error;
  }
  return value;
}

export function mpesaConfig() {
  const env = mode("MPESA_ENV");
  const appUrl = (process.env.APP_URL || "").replace(/\/$/, "");
  const callbackUrl = process.env.MPESA_CALLBACK_URL || (appUrl ? `${appUrl}/api/payments/mpesa-callback` : "");
  if (!callbackUrl) {
    const error = new Error("Set MPESA_CALLBACK_URL or APP_URL so Safaricom can confirm the payment.");
    error.status = 503;
    throw error;
  }
  return {
    consumerKey: required("MPESA_CONSUMER_KEY"),
    consumerSecret: required("MPESA_CONSUMER_SECRET"),
    shortcode: required("MPESA_SHORTCODE"),
    passkey: required("MPESA_PASSKEY"),
    env,
    callbackUrl,
    transactionType: process.env.MPESA_TRANSACTION_TYPE || "CustomerPayBillOnline",
  };
}

export function intasendConfig() {
  return {
    publishableKey: required("INTASEND_PUBLISHABLE_KEY"),
    secretKey: required("INTASEND_SECRET_KEY"),
    env: mode("INTASEND_ENV"),
    webhookChallenge: process.env.INTASEND_WEBHOOK_CHALLENGE || "",
  };
}

export function databaseUrl() {
  return required("DATABASE_URL");
}
