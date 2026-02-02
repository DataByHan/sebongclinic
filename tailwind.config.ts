import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f6',
          100: '#e0f2eb',
          200: '#c7e8dc',
          300: '#a5dac7',
          400: '#7cc9b0',
          500: '#55b59d',
          600: '#3f9a85',
          700: '#367a6a',
          800: '#2D5A4A',
          900: '#26493d',
          950: '#1a332a',
        },
        secondary: {
          50: '#faf8f5',
          100: '#f5efe6',
          200: '#e9ddd0',
          300: '#d9c6b4',
          400: '#c7ab92',
          500: '#b69275',
          600: '#a27a5d',
          700: '#8B7355',
          800: '#6f5d46',
          900: '#5a4b3a',
          950: '#3d3228',
        },
        accent: {
          50: '#fffbf7',
          100: '#fef7f0',
          200: '#fcebd8',
          300: '#f9d9bb',
          400: '#f6c197',
          500: '#F5F0E8',
          600: '#d4c9b5',
          700: '#b3a392',
          800: '#927d70',
          900: '#74635c',
          950: '#4d423d',
        },
        text: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#868e96',
          700: '#495057',
          800: '#2C2C2C',
          900: '#212529',
          950: '#141618',
        },
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 12px rgba(0, 0, 0, 0.06)',
        'strong': '0 8px 24px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 20px rgba(45, 90, 74, 0.15)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.05)',
        'floating': '0 8px 32px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '128': '32rem',
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
export default config
