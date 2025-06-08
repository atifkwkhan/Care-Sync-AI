/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-teal': '#147d6c',
        'brand-cyan': '#1effff',
      },
    },
  },
  plugins: [],
}; 