import { handleIntasend } from "../../server/payments/router.js";

export default function handler(req, res) {
  return handleIntasend(req, res);
}
