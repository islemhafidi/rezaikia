/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        algerian: {
          green: '#006233',
          red: '#D21034',
          gold: '#D4AF37',
          'gold-hover': '#B8972E',
          'gold-light': '#F6EBC7',
          dark: '#03170D',
          darkSecondary: '#072A19',
          cream: '#FAF8F5',
        }
      },
      fontFamily: {
        arabic: ['Cairo', 'Amiri', 'sans-serif'],
        tajawal: ['Tajawal', 'Cairo', 'sans-serif'],
        english: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'zellige-pattern': "url('/assets/zellige-pattern.svg')",
      }
    },
  },
  plugins: [],
}
