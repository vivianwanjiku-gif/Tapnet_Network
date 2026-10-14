import { handlePackages } from "../../server/payments/router.js";

export default function handler(req, res) {
  return handlePackages(req, res);
}
