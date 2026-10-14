import { handleStatus } from "../../server/payments/router.js";

export default function handler(req, res) {
  return handleStatus(req, res);
}
