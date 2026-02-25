/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'geometric-light': "repeating-linear-gradient(45deg, rgba(0,100,0,0.03) 0px, rgba(0,100,0,0.03) 2px, transparent 2px, transparent 8px)",
        'geometric-dark': "repeating-linear-gradient(45deg, rgba(255,215,0,0.05) 0px, rgba(255,215,0,0.05) 2px, transparent 2px, transparent 8px)",
      },
    },
  },
  plugins: [],
}