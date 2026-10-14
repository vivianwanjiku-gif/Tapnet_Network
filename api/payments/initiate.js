import { handleInitiate } from "../../server/payments/router.js";

export default function handler(req, res) {
  return handleInitiate(req, res);
}
