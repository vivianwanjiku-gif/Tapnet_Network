export function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

export async function readJson(req) {
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    return req.body;
  }
  if (typeof req.body === "string") {
    return req.body ? JSON.parse(req.body) : {};
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  return JSON.parse(raw);
}

export function customerIdFrom(req) {
  return String(req.headers["x-customer-id"] || "").trim();
}

export function roleFrom(req) {
  return String(req.headers["x-user-role"] || "").trim();
}

export function bearerFrom(req) {
  const header = String(req.headers.authorization || "");
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : "";
}

export function queryFrom(req) {
  const url = new URL(req.url || "/", "http://localhost");
  return url.searchParams;
}

export async function run(res, fn) {
  try {
    await fn();
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? "The payment service could not finish that request." : error.message;
    sendJson(res, status, { error: message });
  }
}
