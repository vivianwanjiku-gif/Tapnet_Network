import pg from "pg";
import { databaseUrl } from "./config.js";

const schemaSql = `
CREATE TABLE IF NOT EXISTS tapnet_payments (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  package_id TEXT NOT NULL,
  package_name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KES',
  method TEXT NOT NULL,
  status TEXT NOT NULL,
  phone TEXT NOT NULL,
  provider_ref TEXT UNIQUE,
  merchant_request_id TEXT,
  receipt TEXT,
  failure_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
CREATE UNIQUE INDEX IF NOT EXISTS tapnet_payments_receipt_unique
  ON tapnet_payments (receipt)
  WHERE receipt IS NOT NULL AND receipt <> '';
CREATE INDEX IF NOT EXISTS tapnet_payments_customer_idx ON tapnet_payments (customer_id, created_at DESC);
CREATE TABLE IF NOT EXISTS tapnet_subscriptions (
  id TEXT PRIMARY KEY,
  payment_id TEXT UNIQUE NOT NULL REFERENCES tapnet_payments(id),
  customer_id TEXT NOT NULL,
  package_id TEXT NOT NULL,
  package_name TEXT NOT NULL,
  status TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  expiry_date TIMESTAMPTZ NOT NULL,
  price_paid INTEGER NOT NULL,
  speed_mbps INTEGER,
  data_limit_gb INTEGER
);
`;

let schemaPromise = null;

async function ensureSchema(db) {
  if (!schemaPromise) {
    schemaPromise = db.query(schemaSql).catch((error) => {
      schemaPromise = null;
      throw error;
    });
  }
  await schemaPromise;
}

function client() {
  const connectionString = databaseUrl();
  const local = /localhost|127\.0\.0\.1/.test(connectionString);
  return new pg.Client({
    connectionString,
    ssl: local ? undefined : { rejectUnauthorized: false },
  });
}

async function withClient(fn) {
  const db = client();
  await db.connect();
  try {
    await ensureSchema(db);
    return await fn(db);
  } finally {
    await db.end();
  }
}

function rowToPayment(row) {
  if (!row) return null;
  return {
    id: row.id,
    customer_id: row.customer_id,
    package_id: row.package_id,
    package_name: row.package_name,
    amount: Number(row.amount),
    currency: row.currency,
    method: row.method,
    status: row.status,
    phone: row.phone,
    provider_ref: row.provider_ref,
    merchant_request_id: row.merchant_request_id,
    receipt: row.receipt,
    failure_reason: row.failure_reason,
    created_at: row.created_at,
    completed_at: row.completed_at,
  };
}

function rowToSubscription(row) {
  if (!row) return null;
  return {
    id: row.id,
    payment_id: row.payment_id,
    customer_id: row.customer_id,
    package_id: row.package_id,
    package_name: row.package_name,
    status: row.status,
    start_date: row.start_date,
    expiry_date: row.expiry_date,
    price_paid: Number(row.price_paid),
    speed_mbps: row.speed_mbps,
    data_limit_gb: row.data_limit_gb,
  };
}

export const store = {
  async insertPending(payment) {
    return withClient(async (db) => {
      const result = await db.query(
        `INSERT INTO tapnet_payments
          (id, customer_id, package_id, package_name, amount, currency, method, status, phone)
         VALUES ($1,$2,$3,$4,$5,'KES',$6,'pending',$7)
         RETURNING *`,
        [payment.id, payment.customer_id, payment.package_id, payment.package_name, payment.amount, payment.method, payment.phone],
      );
      return rowToPayment(result.rows[0]);
    });
  },

  async setProviderRef(id, { providerRef, merchantRequestId }) {
    return withClient(async (db) => {
      const result = await db.query(
        `UPDATE tapnet_payments
         SET provider_ref = $2, merchant_request_id = COALESCE($3, merchant_request_id), updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [id, providerRef, merchantRequestId || null],
      );
      return rowToPayment(result.rows[0]);
    });
  },

  async getById(id) {
    return withClient(async (db) => {
      const result = await db.query("SELECT * FROM tapnet_payments WHERE id = $1", [id]);
      return rowToPayment(result.rows[0]);
    });
  },

  async getByProviderRef(providerRef) {
    return withClient(async (db) => {
      const result = await db.query("SELECT * FROM tapnet_payments WHERE provider_ref = $1", [providerRef]);
      return rowToPayment(result.rows[0]);
    });
  },

  async listForCustomer(customerId) {
    return withClient(async (db) => {
      const result = await db.query(
        "SELECT * FROM tapnet_payments WHERE customer_id = $1 ORDER BY created_at DESC",
        [customerId],
      );
      return result.rows.map(rowToPayment);
    });
  },

  async listAll() {
    return withClient(async (db) => {
      const result = await db.query("SELECT * FROM tapnet_payments ORDER BY created_at DESC LIMIT 200");
      return result.rows.map(rowToPayment);
    });
  },

  async currentSubscription(customerId) {
    return withClient(async (db) => {
      const result = await db.query(
        `SELECT * FROM tapnet_subscriptions
         WHERE customer_id = $1 AND status = 'active' AND expiry_date > NOW()
         ORDER BY expiry_date DESC
         LIMIT 1`,
        [customerId],
      );
      return rowToSubscription(result.rows[0]);
    });
  },

  async transaction(fn) {
    return withClient(async (db) => {
      await db.query("BEGIN");
      try {
        const tx = {
          async lockPayment(id) {
            const result = await db.query("SELECT * FROM tapnet_payments WHERE id = $1 FOR UPDATE", [id]);
            return rowToPayment(result.rows[0]);
          },
          async updatePayment(id, patch) {
            const result = await db.query(
              `UPDATE tapnet_payments
               SET status = $2, receipt = $3, failure_reason = $4, completed_at = $5, updated_at = NOW()
               WHERE id = $1
               RETURNING *`,
              [id, patch.status, patch.receipt, patch.failure_reason, patch.completed_at],
            );
            return rowToPayment(result.rows[0]);
          },
          async findSubscription(paymentId) {
            const result = await db.query("SELECT * FROM tapnet_subscriptions WHERE payment_id = $1", [paymentId]);
            return rowToSubscription(result.rows[0]);
          },
          async insertSubscriptionOnce(sub) {
            const result = await db.query(
              `INSERT INTO tapnet_subscriptions
                (id, payment_id, customer_id, package_id, package_name, status, start_date, expiry_date, price_paid, speed_mbps, data_limit_gb)
               VALUES ($1,$2,$3,$4,$5,'active',$6,$7,$8,$9,$10)
               ON CONFLICT (payment_id) DO NOTHING
               RETURNING *`,
              [sub.id, sub.payment_id, sub.customer_id, sub.package_id, sub.package_name, sub.start_date, sub.expiry_date, sub.price_paid, sub.speed_mbps, sub.data_limit_gb],
            );
            if (result.rows[0]) return rowToSubscription(result.rows[0]);
            return tx.findSubscription(sub.payment_id);
          },
        };
        const value = await fn(tx);
        await db.query("COMMIT");
        return value;
      } catch (error) {
        await db.query("ROLLBACK");
        throw error;
      }
    });
  },
};
