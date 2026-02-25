/**
 * Tripify Travel Planner - Tailwind CSS Configuration
 * Generated: February 8, 2026
 * Version: 1.0.0
 *
 * Usage:
 * - Copy this to your project root as tailwind.config.js
 * - Run: npm install -D tailwindcss
 * - Import in CSS: @tailwind base; @tailwind components; @tailwind utilities;
 */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primitive colors
        green: {
          500: '#34C759',
          600: '#2ECC71',
          700: '#27AE60',
        },
        teal: {
          500: '#5AC8FA',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F5F5F5',
          200: '#E5E5EA',
          300: '#D1D1D6',
          400: '#C7C7CC',
          500: '#AEAEB2',
          600: '#8E8E93',
          700: '#636366',
          800: '#48484A',
          900: '#1C1C1E',
        },
        red: {
          500: '#FF3B30',
        },
        blue: {
          500: '#007AFF',
        },
        // Semantic colors
        primary: '#34C759',
        'primary-hover': '#2ECC71',
        'primary-pressed': '#27AE60',
        destructive: '#FF3B30',
        accent: '#5AC8FA',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'Segoe UI',
          'system-ui',
          'sans-serif',
        ],
      },
      fontSize: {
        'display-lg': ['32px', { lineHeight: '1.2' }],
        'heading-xl': ['28px', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-lg': ['24px', { lineHeight: '1.2', fontWeight: '600' }],
        'heading-md': ['20px', { lineHeight: '1.5', fontWeight: '600' }],
        'heading-sm': ['18px', { lineHeight: '1.5', fontWeight: '600' }],
        'body-lg': ['17px', { lineHeight: '1.5' }],
        'body-md': ['16px', { lineHeight: '1.5' }],
        'body-sm': ['14px', { lineHeight: '1.5' }],
        'caption': ['12px', { lineHeight: '1.5' }],
        'micro': ['10px', { lineHeight: '1.5' }],
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        heavy: '800',
      },
      spacing: {
        // Base scale (4px grid)
        '0': '0px',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '9': '36px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        // Semantic spacing
        'card': '16px',
        'section': '20px',
        'list-item': '16px',
      },
      borderRadius: {
        'none': '0px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        'full': '9999px',
        // Semantic radius
        'card': '12px',
        'button': '24px',
        'chip': '20px',
        'modal': '16px',
        'input': '8px',
      },
      boxShadow: {
        'none': 'none',
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'lg': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'xl': '0 8px 24px rgba(0, 0, 0, 0.15)',
        // Semantic shadows
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'modal': '0 8px 32px rgba(0, 0, 0, 0.2)',
        'button': '0 2px 4px rgba(52, 199, 89, 0.2)',
      },
      opacity: {
        'disabled': '0.4',
        'hover': '0.8',
        'overlay': '0.5',
        'subtle': '0.6',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '350ms',
      },
      transitionTimingFunction: {
        'ease': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backdropBlur: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'backdrop': '20px',
      },
      zIndex: {
        'dropdown': '100',
        'sticky': '200',
        'fixed': '300',
        'modal-backdrop': '400',
        'modal': '500',
        'popover': '600',
        'tooltip': '700',
      },
      minHeight: {
        'button': '48px',
        'button-sm': '40px',
        'button-lg': '56px',
        'tap-target': '44px',
      },
      maxWidth: {
        'modal': '340px',
      },
    },
  },
  plugins: [
    // Custom plugin for component classes
    function({ addComponents }) {
      addComponents({
        '.btn-primary': {
          '@apply bg-primary text-white rounded-button px-6 py-3.5 text-body-lg font-semibold shadow-button min-h-button': {},
          'transition': 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            '@apply bg-primary-hover': {},
          },
          '&:active': {
            '@apply bg-primary-pressed': {},
          },
          '&:disabled': {
            '@apply opacity-disabled cursor-not-allowed': {},
          },
        },
        '.btn-secondary': {
          '@apply bg-white text-gray-900 border border-gray-200 rounded-button px-6 py-3.5 text-body-lg font-semibold min-h-button': {},
          'transition': 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            '@apply bg-gray-50': {},
          },
        },
        '.card': {
          '@apply bg-white rounded-card shadow-card overflow-hidden': {},
        },
        '.chip': {
          '@apply inline-flex items-center gap-2 bg-white border border-gray-200 rounded-chip px-4 py-2 text-body-sm': {},
        },
        '.input': {
          '@apply bg-white border border-gray-200 rounded-input px-4 py-3 text-body-md min-h-button': {},
          '&:focus': {
            '@apply outline-none border-blue-500 ring-2 ring-blue-500 ring-opacity-20': {},
          },
          '&::placeholder': {
            '@apply text-gray-500': {},
          },
        },
      })
    },
  ],
}
