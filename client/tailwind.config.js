/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design system UBB — valeurs définies dans src/styles/tokens.css
        ubb: {
          brand: {
            50: 'rgb(var(--ubb-brand-50) / <alpha-value>)',
            100: 'rgb(var(--ubb-brand-100) / <alpha-value>)',
            200: 'rgb(var(--ubb-brand-200) / <alpha-value>)',
            300: 'rgb(var(--ubb-brand-300) / <alpha-value>)',
            400: 'rgb(var(--ubb-brand-400) / <alpha-value>)',
            500: 'rgb(var(--ubb-brand-500) / <alpha-value>)',
            600: 'rgb(var(--ubb-brand-600) / <alpha-value>)',
            700: 'rgb(var(--ubb-brand-700) / <alpha-value>)',
            800: 'rgb(var(--ubb-brand-800) / <alpha-value>)',
            900: 'rgb(var(--ubb-brand-900) / <alpha-value>)',
            950: 'rgb(var(--ubb-brand-950) / <alpha-value>)',
            DEFAULT: 'rgb(var(--ubb-brand-900) / <alpha-value>)',
          },
          accent: {
            50: 'rgb(var(--ubb-accent-50) / <alpha-value>)',
            100: 'rgb(var(--ubb-accent-100) / <alpha-value>)',
            300: 'rgb(var(--ubb-accent-300) / <alpha-value>)',
            500: 'rgb(var(--ubb-accent-500) / <alpha-value>)',
            600: 'rgb(var(--ubb-accent-600) / <alpha-value>)',
            ink: 'rgb(var(--ubb-accent-ink) / <alpha-value>)',
            DEFAULT: 'rgb(var(--ubb-accent-500) / <alpha-value>)',
          },
          mist: 'rgb(var(--ubb-brand-100) / <alpha-value>)',
          ink: {
            DEFAULT: 'rgb(var(--ubb-ink) / <alpha-value>)',
            muted: 'rgb(var(--ubb-ink-muted) / <alpha-value>)',
          },
          paper: {
            DEFAULT: 'rgb(var(--ubb-paper) / <alpha-value>)',
            soft: 'rgb(var(--ubb-paper-soft) / <alpha-value>)',
          },
        },
        // vitalCHECK Green - Growth, trust, knowledge
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#00751B', // vitalCHECK Green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Earthy and Grounded Foundation - Rich browns, warm ochre
        secondary: {
          50: '#fef7ed',
          100: '#fdedd3',
          200: '#fbd7a5',
          300: '#f8b86d',
          400: '#f59332',
          500: '#d97706', // Warm ochre
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
        },
        // Vibrant African Accents - Bold yellows, oranges, reds
        accent: {
          50: '#fffdf7',
          100: '#fef9e7',
          200: '#fef2c7',
          300: '#fde68a',
          400: '#fcd34d',
          500: '#F4C542', // vitalCHECK Yellow
          600: '#f59e0b',
          700: '#d97706',
          800: '#b45309',
          900: '#92400e',
        },
        // Deep greens - Growth, resilience, connection to land
        earth: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Deep green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Green
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Amber
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444', // Red
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        }
      },
      fontFamily: {
        // Professional and Readable Sans-Serif
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // Display font with subtle African influences
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        // Body text - clean and contemporary
        body: ['Inter', 'system-ui', 'sans-serif'],
        // Design system UBB
        heading: ['var(--ubb-font-heading)'],
        text: ['var(--ubb-font-text)'],
      },
      fontSize: {
        // Échelle UBB — fluide entre mobile (360px) et desktop (1280px)
        'ubb-display': ['clamp(2.25rem, 1.6rem + 3.2vw, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.025em', fontWeight: '700' }],
        'ubb-title': ['clamp(1.75rem, 1.4rem + 1.8vw, 2.75rem)', { lineHeight: '1.12', letterSpacing: '-0.02em', fontWeight: '700' }],
        'ubb-subtitle': ['clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' }],
        'ubb-lead': ['clamp(1.0625rem, 1rem + 0.35vw, 1.25rem)', { lineHeight: '1.6' }],
        'ubb-body': ['1rem', { lineHeight: '1.65' }],
        'ubb-small': ['0.875rem', { lineHeight: '1.5' }],
      },
      borderRadius: {
        'ubb-chip': 'var(--ubb-radius-chip)',
        'ubb-field': 'var(--ubb-radius-field)',
        'ubb-card': 'var(--ubb-radius-card)',
        'ubb-panel': 'var(--ubb-radius-panel)',
      },
      boxShadow: {
        'ubb-sm': 'var(--ubb-shadow-sm)',
        'ubb-md': 'var(--ubb-shadow-md)',
        'ubb-lg': 'var(--ubb-shadow-lg)',
      },
      spacing: {
        'ubb-header': 'var(--ubb-header-h)',
      },
      maxWidth: {
        'ubb-prose': '68ch',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
