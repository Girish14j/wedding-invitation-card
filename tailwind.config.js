/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        royalty: {
          burgundy: '#4A0404',
          maroon: '#670A17',
          deepMaroon: '#2B0202',
          gold: '#D4AF37',
          champagne: '#F3E5AB',
          champagneLight: '#FAF3DC',
          ivory: '#FFFFF0',
          blush: '#F7E7CE',
          warmBeige: '#F5F2EB',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        script: ['Great Vibes', 'Allura', 'cursive'],
        sans: ['Montserrat', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'royal-gradient': 'linear-gradient(135deg, #4A0404 0%, #2B0202 50%, #150000 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #F3E5AB 0%, #D4AF37 50%, #AA771C 100%)',
      },
    },
  },
  plugins: [],
};