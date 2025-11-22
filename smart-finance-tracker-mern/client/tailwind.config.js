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
          kombu: '#354024',
          dark: '#2A3319',
          moss: '#889063',
          light: '#E8EFE0',
        },
        accent: {
          cafe: '#4C3D19',
          'cafe-dark': '#3D3114',
          tan: '#CFBB99',
          bone: '#E5D7C4',
          sage: '#A8B89E',
          terracotta: '#C88B7A',
          sand: '#E3D5C1',
          seafoam: '#B8D4D0',
        },
        bg: {
          primary: '#FDFDFB',
          secondary: '#F8F7F3',
          card: '#FFFFFF',
          overlay: '#F5F3EE',
        },
        text: {
          primary: '#2A2D22',
          secondary: '#5F6355',
          muted: '#8B8E82',
          light: '#A8A99D',
        },
        border: {
          primary: '#E5E3DA',
          secondary: '#D4D2C8',
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        slideUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        fadeIn: 'fadeIn 0.3s ease-out',
        fadeInUp: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        slideUp: 'slideUp 0.3s ease-out',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(53, 64, 36, 0.08)',
        'md': '0 4px 8px rgba(53, 64, 36, 0.10)',
        'lg': '0 8px 20px rgba(53, 64, 36, 0.12)',
        'xl': '0 12px 30px rgba(53, 64, 36, 0.15)',
      },
      borderRadius: {
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      backdropBlur: {
        'sm': '4px',
      }
    },
  },
  plugins: [],
}