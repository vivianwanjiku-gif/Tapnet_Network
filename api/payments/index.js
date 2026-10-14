import { handleList } from "../../server/payments/router.js";

export default function handler(req, res) {
  return handleList(req, res);
}
