/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          crimson: '#8B1D24',       // Primary brand crimson/burgundy - rich, grounded, institutional
          crimsonDark: '#6E1419',   // Darker shade for active/hover states
          crimsonLight: '#FDF2F2',  // Subtle tint for badge backgrounds
          gold: '#C5A059',          // Refined institutional brass/gold for official accents
          goldLight: '#FDF8EE',     // Soft gold wash
        },
        surface: {
          canvas: '#FAFAF9',        // Warm neutral stone canvas - comfortable for eyes
          card: '#FFFFFF',          // Crisp pure white for cards
          subtle: '#F4F4F5',        // Soft alternating section background
          muted: '#E5E7EB',         // Crisp 1px border tone
        },
        content: {
          heading: '#0F172A',       // Slate-900: High contrast, sharp, legible headings
          body: '#334155',          // Slate-700: Natural, comfortable, readable body copy
          muted: '#64748B',         // Slate-500: Subtitles, metadata, captions
          subtle: '#94A3B8',        // Slate-400: Timestamps, dividers
        },
        foundation: {
          ivory: '#FAFAF9',
          forest: '#8B1D24',        // Aligned to Primary Brand Crimson
          forestDark: '#0F172A',    // Aligned to Executive Deep Slate
          forestLight: '#A82B33',   // Aligned to Hover Brand Crimson
          crimson: '#8B1D24',
          crimsonDark: '#6E1419',
          ruby: '#9E2228',
          sage: '#475569',
          sageLight: '#94A3B8',
          sandstone: '#F5F2EB',
          gold: '#C5A059',
          goldLight: '#FDF8EE',
          charcoal: '#0F172A',
          terracotta: '#9E2228',
          warmGray: '#F4F4F5',
          borderMuted: '#E5E7EB',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle-xs': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.03)',
        'elevated-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        'soft-sm': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'soft': '0 4px 12px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 12px 28px rgba(0, 0, 0, 0.07)',
        'gold-glow': '0 0 15px rgba(197, 160, 89, 0.2)',
      }
    },
  },
  plugins: [],
}
