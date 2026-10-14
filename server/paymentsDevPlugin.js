import { handleInitiate, handleIntasend, handleList, handleMpesa, handlePackages, handleStatus, handleSubscription } from "./payments/router.js";

function match(url, path) {
  return url === path || url.startsWith(`${path}?`);
}

export function paymentsDevPlugin() {
  return {
    name: "tapnet-payments",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || "";
        if (match(url, "/api/payments/packages")) return handlePackages(req, res);
        if (match(url, "/api/payments/initiate")) return handleInitiate(req, res);
        if (match(url, "/api/payments/status")) return handleStatus(req, res);
        if (match(url, "/api/payments/mpesa-callback")) return handleMpesa(req, res);
        if (match(url, "/api/payments/intasend-webhook")) return handleIntasend(req, res);
        if (match(url, "/api/payments")) return handleList(req, res);
        if (match(url, "/api/subscriptions/current")) return handleSubscription(req, res);
        return next();
      });
    },
  };
}
