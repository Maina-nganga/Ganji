/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0E0E10",
        gold: "#D4AF37",
        goldLight: "#F5D061",
        card: "rgba(255,255,255,0.05)"
      },
      boxShadow: {
        glow: "0 0 20px rgba(212,175,55,0.4)"
      }
    },
  },
  plugins: [],
}
