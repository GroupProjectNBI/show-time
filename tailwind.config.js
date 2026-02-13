/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#680909", // Default mörkröda
        accent: "#C6A96A",  // Guldiga för stolarna
        footer: "#463F41",
        booked: "#4a0606",  // En ännu mörkare röd för krysset/linjen om man vill
      },
      fontFamily: {
        serif: ["'Roboto Serif'", "serif"],
      },
    },
  },
  plugins: [],
}