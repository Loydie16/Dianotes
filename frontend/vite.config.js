import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
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
        target: "https://dianotes-api.onrender.com"/* "http://localhost:5000" */ /* "https://dianotes-api.vercel.app" */,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
