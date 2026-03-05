import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    // I produktion vill vi att alla länkar i index.html ska börja med /showtime/
    base: mode === "production" ? "/showtime/" : "/",
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:5001", // Din lokala C#-port
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});