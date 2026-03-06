import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // Du kan även ta bort denna helt om du vill, / är standard
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5001", // Din lokala C#-port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});