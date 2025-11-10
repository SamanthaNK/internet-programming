/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E8EFE0',
          100: '#D4DFC4',
          200: '#B8C9A3',
          300: '#9CB382',
          400: '#889063',
          500: '#354024',
          600: '#2A3319',
          700: '#1F2612',
          800: '#14190C',
          900: '#0A0D06',
        },
        accent: {
          sage: '#A8B89E',
          terracotta: '#C88B7A',
          seafoam: '#B8D4D0',
          tan: '#CFBB99',
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

