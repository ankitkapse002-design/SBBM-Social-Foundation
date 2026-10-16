/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        foundation: {
          ivory: '#FDFBF7',
          forest: '#1B4332',
          forestDark: '#0D2818',
          forestLight: '#2D6A4F',
          sage: '#52796F',
          sageLight: '#84A98C',
          sandstone: '#E9DCC9',
          gold: '#D4AF37',
          goldLight: '#F3E5AB',
          charcoal: '#1F2421',
          terracotta: '#BC4749',
          warmGray: '#F4F1EA',
          borderMuted: '#E2DBD0',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px rgba(27, 67, 50, 0.06)',
        'soft': '0 8px 30px rgba(27, 67, 50, 0.08)',
        'soft-lg': '0 14px 45px rgba(27, 67, 50, 0.12)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.25)',
      }
    },
  },
  plugins: [],
}
