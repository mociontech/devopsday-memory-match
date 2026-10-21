import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Kiosk build: small bundle, no legacy browser targets to keep polyfill weight out.
export default defineConfig({
  plugins: [react()],
  // Puerto fijo: coincide con ALLOWED_ORIGINS de la API (backend/README.md).
  server: { host: "127.0.0.1", port: 5504, strictPort: true },
  preview: { host: "127.0.0.1", port: 5504, strictPort: true },
  build: {
    target: "es2020",
    cssCodeSplit: true,
  },
  test: {
    environment: "jsdom",
    watch: false,
  },
});
