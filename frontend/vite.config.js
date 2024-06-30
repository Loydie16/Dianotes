import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://dianotes-api.vercel.app", // Make sure this is the correct protocol (http or https)
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        secure: true, // Ensures that the proxy works over HTTPS if your target is using HTTPS
        headers: {
          "Access-Control-Allow-Origin": "*", // Optionally add headers for debugging CORS
        },
      },
    },
  },
});
