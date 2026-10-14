import { handleMpesa } from "../../server/payments/router.js";

export default function handler(req, res) {
  return handleMpesa(req, res);
}
