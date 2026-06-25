/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--tw-border))',
        input: 'hsl(var(--tw-input))',
        ring: 'hsl(var(--tw-ring))',
        background: 'hsl(var(--tw-background))',
        foreground: 'hsl(var(--tw-foreground))',
        primary: {
          DEFAULT: 'hsl(var(--tw-primary))',
          foreground: 'hsl(var(--tw-primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--tw-secondary))',
          foreground: 'hsl(var(--tw-secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--tw-destructive))',
          foreground: 'hsl(var(--tw-destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--tw-muted))',
          foreground: 'hsl(var(--tw-muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--tw-accent))',
          foreground: 'hsl(var(--tw-accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--tw-popover))',
          foreground: 'hsl(var(--tw-popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--tw-card))',
          foreground: 'hsl(var(--tw-card-foreground))',
        },
        success: 'hsl(var(--tw-success))',
        warning: 'hsl(var(--tw-warning))',
        danger: 'hsl(var(--tw-danger))',
        info: 'hsl(var(--tw-info))',
      },
      fontFamily: {
        sans: [
          '"SF Pro Text"',
          '"SF Pro Display"',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Inter"',
          'sans-serif',
        ],
        display: [
          '"SF Pro Display"',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Inter"',
          'sans-serif',
        ],
        mono: [
          '"SF Mono"',
          '"JetBrains Mono"',
          'ui-monospace',
          'monospace',
        ],
      },
      fontSize: {
        hero: ['56px', { lineHeight: '1.1', fontWeight: '700' }],
        'display-lg': ['40px', { lineHeight: '1.1', fontWeight: '700' }],
        'display-md': ['34px', { lineHeight: '1.15', fontWeight: '700' }],
        lead: ['28px', { lineHeight: '1.2', fontWeight: '600' }],
        tagline: ['21px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['17px', { lineHeight: '1.5', fontWeight: '400' }],
        body: ['17px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
        caption: ['12px', { lineHeight: '1.3', fontWeight: '400' }],
        'fine-print': ['10px', { lineHeight: '1.2', fontWeight: '400' }],
      },
      borderRadius: {
        none: '0',
        xs: '5px',
        sm: '8px',
        md: '11px',
        lg: '18px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '40px',
        full: '9999px',
      },
      spacing: {
        section: '5rem',
        xxl: '3rem',
        xl: '2rem',
        lg: '1.5rem',
        md: '17px',
        sm: '12px',
        xs: '8px',
        xxs: '4px',
      },
      boxShadow: {
        product: '3px 5px 30px 0px rgba(0, 0, 0, 0.22)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'float-in': 'floatIn 0.45s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(100%)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        floatIn: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
