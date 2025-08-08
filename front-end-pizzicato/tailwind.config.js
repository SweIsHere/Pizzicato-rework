/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Habilitar modo oscuro con clase
  theme: {
    extend: {
      fontFamily: {
        jacquard: ['"Jacquard 12 Charted"', 'sans-serif'],
        jacquard24: ['"Jacquard 24"', 'sans-serif'],
        inria: ['"Inria Serif"', 'serif'],
      },
    },
  },
  plugins: [],
}