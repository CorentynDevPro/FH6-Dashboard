/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef3e2',
          100: '#fde8c5',
          200: '#fbd18a',
          300: '#f9ba4f',
          400: '#f7a614',
          500: '#e5920a',
          600: '#c47808',
          700: '#9b5e06',
          800: '#724505',
          900: '#492c03',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
