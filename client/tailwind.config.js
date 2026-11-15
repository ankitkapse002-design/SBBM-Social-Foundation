/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* =========================================================================
           60:30:10 COLOR SYSTEM DESIGN TOKENS
           ========================================================================= */
        // 60% DOMINANT: Serene Sanctuary Canvas & Surfaces
        canvas: {
          base: '#FBFBFA',        // 60% Dominant page canvas - comfortable, warm porcelain
          subtle: '#F4F3EE',      // Alternating section background - gentle alabaster
          card: '#FFFFFF',        // Pristine white for cards and surface elevation
          border: '#E8E6E1',      // Refined 1px card and divider tone
          borderMedium: '#D8D5CD',// Interactive borders for inputs and buttons
        },

        // 30% SECONDARY: Deep Institutional Slate & Typography
        secondary: {
          base: '#0E1726',        // 30% Deep midnight slate - institutional trust & governance
          surface: '#131F33',     // Dark section / card surface
          dark: '#0A111A',        // Deepest footer / backdrop base
          border: '#1E293B',      // Dark divider tone
        },

        // 10% ACCENT: Filial Seva Crimson & Temple Gold
        accent: {
          crimson: '#9B1B22',     // 10% Primary Action Crimson - compassion & active seva
          crimsonDark: '#7D131A', // Active / hover state
          crimsonLight: '#FDF2F2',// Soft crimson badge / pill background
          crimsonBorder: '#FCDADA',// Delicate crimson border
          gold: '#C5A059',        // Auspicious institutional gold for official seals & 80G
          goldLight: '#FDF8EE',   // Soft gold badge background
          goldBorder: '#F0E5CC',  // Soft gold border
        },

        // Typography Color Scale
        content: {
          heading: '#0E1726',     // Deep midnight slate: High-contrast (15:1), authoritative
          body: '#334155',        // Slate-700: Natural, warm, highly readable body copy (9.8:1)
          muted: '#64748B',       // Slate-500: Subtitles, metadata, captions
          subtle: '#94A3B8',      // Slate-400: Timestamps, placeholder text
        },

        // Feedback & Semantic Status
        status: {
          success: '#15803D',
          successBg: '#F0FDF4',
          warning: '#B45309',
          warningBg: '#FFFBEB',
          error: '#B91C1C',
          errorBg: '#FEF2F2',
        },

        /* Backward-compatible Aliases for Existing Components */
        brand: {
          crimson: '#9B1B22',
          crimsonDark: '#7D131A',
          crimsonLight: '#FDF2F2',
          gold: '#C5A059',
          goldLight: '#FDF8EE',
        },
        surface: {
          canvas: '#FBFBFA',
          card: '#FFFFFF',
          subtle: '#F4F3EE',
          muted: '#E8E6E1',
        },
        foundation: {
          ivory: '#FBFBFA',
          forest: '#9B1B22',
          forestDark: '#0E1726',
          forestLight: '#B3262E',
          crimson: '#9B1B22',
          crimsonDark: '#7D131A',
          ruby: '#9B1B22',
          sage: '#475569',
          sageLight: '#94A3B8',
          sandstone: '#F4F3EE',
          gold: '#C5A059',
          goldLight: '#FDF8EE',
          charcoal: '#0E1726',
          terracotta: '#9B1B22',
          warmGray: '#F4F3EE',
          borderMuted: '#E8E6E1',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
      },
      fontSize: {
        'readable-hero': ['2.75rem', { lineHeight: '1.18', letterSpacing: '-0.02em' }],   // ~44px
        'readable-h1': ['2.25rem', { lineHeight: '1.22', letterSpacing: '-0.02em' }],     // ~36px
        'readable-h2': ['1.75rem', { lineHeight: '1.28', letterSpacing: '-0.015em' }],    // ~28px
        'readable-h3': ['1.375rem', { lineHeight: '1.35', letterSpacing: '-0.01em' }],    // ~22px
        'readable-body': ['1.0625rem', { lineHeight: '1.7' }],                            // 17px
        'readable-lg': ['1.125rem', { lineHeight: '1.75' }],                              // 18px
        'readable-sub': ['0.9375rem', { lineHeight: '1.6' }],                             // 15px
      },
      boxShadow: {
        'subtle-xs': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 14px -2px rgba(14, 23, 38, 0.05), 0 2px 6px -2px rgba(14, 23, 38, 0.03)',
        'elevated': '0 12px 24px -4px rgba(14, 23, 38, 0.08), 0 4px 8px -4px rgba(14, 23, 38, 0.03)',
        'elevated-lg': '0 20px 32px -6px rgba(14, 23, 38, 0.1), 0 8px 12px -6px rgba(14, 23, 38, 0.04)',
        'soft-sm': '0 1px 3px rgba(14, 23, 38, 0.04)',
        'soft': '0 4px 16px rgba(14, 23, 38, 0.05)',
        'soft-lg': '0 12px 30px rgba(14, 23, 38, 0.07)',
        'crimson-glow': '0 4px 14px rgba(155, 27, 34, 0.25)',
        'gold-glow': '0 0 15px rgba(197, 160, 89, 0.25)',
      }
    },
  },
  plugins: [],
}
