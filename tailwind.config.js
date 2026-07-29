/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        scorcher: {
          gold: '#D4AF37',       // Premium Gold
          'gold-light': '#F3E5AB',
          'gold-dark': '#AA8C2C',
          black: '#0A0A0A',      // Deep Black
          card: '#141414',       // Slightly lighter black for cards
          border: '#2A2A2A',     // Subtle borders
        }
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #AA8C2C 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(20,20,20,0.8) 0%, rgba(10,10,10,0.9) 100%)',
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.15)',
      }
    },
  },
  plugins: [],
}