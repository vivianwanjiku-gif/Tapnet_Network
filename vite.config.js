import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { paymentsDevPlugin } from "./server/paymentsDevPlugin.js";

export default defineConfig({
  plugins: [react(), paymentsDevPlugin()],
  server: { port: 5173 },
});
