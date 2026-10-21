import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { apiLocal } from "./vite.api.ts";

// Kiosk build: small bundle, no legacy browser targets to keep polyfill weight out.
export default defineConfig({
  plugins: [apiLocal(), react()],
  // Puerto fijo en local. /api/* lo sirve el plugin apiLocal (en Netlify, la función netlify/functions/api.mts).
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
