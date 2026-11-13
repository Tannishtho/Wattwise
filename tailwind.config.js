/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B1220',
        card: '#141F30',
        'card-hover': '#1B2A40',
        secondary: '#172C39',
        emerald: {
          DEFAULT: '#20C997',
          400: '#38D9A9',
          500: '#20C997',
          600: '#12B886',
        },
        warning: {
          DEFAULT: '#F5B942',
          400: '#FCC419',
          500: '#F5B942',
        },
        danger: {
          DEFAULT: '#F06464',
          400: '#FF6B6B',
          500: '#F06464',
        },
        primaryText: '#F5F7FA',
        secondaryText: '#A5B1C2',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(32, 201, 151, 0.25)',
        'glow-danger': '0 0 20px rgba(240, 100, 100, 0.35)',
        'glow-warning': '0 0 20px rgba(245, 185, 66, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
