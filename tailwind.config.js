/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#680909",
        accent: "#C6A96A",
        footer: "#463F41",
        surface: "#282828",
      },
      fontFamily: {
        serif: ["'Roboto Serif'", "serif"],
      },
    },
  },
  plugins: [],
}

