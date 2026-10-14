/**
 * Apply a terminal result once. A second success or failure for the same
 * payment does not create another subscription.
 */
export async function applySettlement(store, { paymentId, nextStatus, receipt, reason, subscription }) {
  if (nextStatus !== "success" && nextStatus !== "failed") {
    throw new Error("Settlement status must be success or failed.");
  }
  return store.transaction(async (tx) => {
    const current = await tx.lockPayment(paymentId);
    if (!current) return { ok: false, error: "not_found" };
    if (current.status === "success" || current.status === "failed") {
      const existing = current.status === "success" ? await tx.findSubscription(paymentId) : null;
      return { ok: true, duplicate: true, payment: current, subscription: existing };
    }
    const payment = await tx.updatePayment(paymentId, {
      status: nextStatus,
      receipt: receipt || null,
      failure_reason: nextStatus === "failed" ? (reason || "Payment failed") : null,
      completed_at: new Date().toISOString(),
    });
    let created = null;
    if (nextStatus === "success") {
      created = await tx.insertSubscriptionOnce({
        ...subscription,
        payment_id: paymentId,
        customer_id: current.customer_id,
        package_id: current.package_id,
        price_paid: current.amount,
      });
    }
    return { ok: true, duplicate: false, payment, subscription: created };
  });
}
