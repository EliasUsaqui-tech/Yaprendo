/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        utec: {
          primary: "#1e40af",
          secondary: "#059669",
          danger: "#dc2626",
          light: "#f1f5f9",
        },
      },
    },
  },
  plugins: [],
};