/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfaf6',
          100: '#faf4eb',
          200: '#f5e8d3',
          300: '#eddbb8',
          400: '#e3c99a',
          500: '#d9b67c',
        },
        maroon: {
          50: '#fdf2f2',
          100: '#fce4e4',
          200: '#f9c5c5',
          300: '#f49090',
          400: '#ec5a5a',
          500: '#c0392b',
          600: '#9b2335',
          700: '#7a1a28',
          800: '#5e1320',
          900: '#4a0f19',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#c8972a',
          600: '#a67c20',
          700: '#856318',
          800: '#6b4f12',
          900: '#573f0e',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Jost"', 'system-ui', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(200, 151, 42, 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(200, 151, 42, 0)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
