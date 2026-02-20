/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#137fec",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
        "surface-dark": "#1a2632",
        "surface-darker": "#131d26",
      },
      fontFamily: {
        "display": ["Lexend", "sans-serif"],
      }
    },
  },
  plugins: [],
}