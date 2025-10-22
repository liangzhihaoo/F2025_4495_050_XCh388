import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ""); // read .env at project root
  if (!env.ADMIN_API_KEY) {
    console.warn(
      "Missing ADMIN_API_KEY in .env for dev proxy header injection."
    );
  }
  if (!env.VITE_ADMIN_BACKEND_URL) {
    console.warn("Missing VITE_ADMIN_BACKEND_URL in .env");
  }

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        // Any request to /admin/* will be proxied to your backend
        "/admin": {
          target: env.VITE_ADMIN_BACKEND_URL,
          changeOrigin: true,
          // Inject admin secret only in dev server (Node side)
          headers: { "X-Admin-Secret": env.ADMIN_API_KEY || "" },
        },
      },
    },
  };
});
