import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load all env vars (not only VITE_) so we can reuse BACKEND_URL if desired.
  const env = loadEnv(mode, process.cwd(), "");

  const port = parseInt(env.VITE_DEV_PORT || "3000", 10);
  const proxyTarget =
    env.VITE_DEV_PROXY_TARGET || env.BACKEND_URL || "http://localhost:5000";

  return {
    plugins: [react()],
    server: {
      port,
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
