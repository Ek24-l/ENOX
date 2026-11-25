/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bosque: "#344E41",
        oscuro: "#3A5A40",
        verde: "#588157",
        salvia: "#A3B18A",
        crema: "#DAD7CD",
      },
    },
  },
  plugins: [],
};