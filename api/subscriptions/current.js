import { handleSubscription } from "../../server/payments/router.js";

export default function handler(req, res) {
  return handleSubscription(req, res);
}
