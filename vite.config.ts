import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://logistics-app-be-4.onrender.com", // URL del backend
        changeOrigin: true, // Cambia el origen para evitar problemas de CORS
      },
    },
  },
});