const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        poppins: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'deep-blue': '#1a1d29',
        'dark-slate': '#2d3748',
        'vibrant-purple': '#6366f1', // #6366f1
        'bright-blue': '#8b5cf6',   // #8b5cf6
      },
      animation: {
        'subtle-pulse': 'subtle-pulse 2s infinite',
      },
      keyframes: {
        'subtle-pulse': {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(99, 102, 241, 0.4)' }, // vibrant-purple
          '50%': { transform: 'scale(1.03)', boxShadow: '0 0 0 10px rgba(99, 102, 241, 0)' },
        }
      }
    },
  },
  plugins: [],
}
