import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/shared/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode semantic colors (defaults)
        background: 'var(--color-background)',
        'background-secondary': 'var(--color-background-secondary)',
        'card-background': 'var(--color-card-background)',
        foreground: 'var(--color-foreground)',
        'foreground-muted': 'var(--color-foreground-muted)',
        border: 'var(--color-border)',

        // Primary (yellow)
        primary: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
          light: 'var(--color-primary-light)',
        },

        // Semantic colors
        success: '#58CC02',
        warning: '#F59E0B',
        error: '#FF2B8F',
        streak: '#FF7A00',

        // Section colors (HP test sections)
        section: {
          ord: '#5B9BD5',
          las: '#4A7FC1',
          mek: '#7B68C1',
          elf: '#9B68C1',
          xyz: '#5BC1A0',
          kva: '#5BC1C1',
          nog: '#5BC15B',
          dtk: '#7BC15B',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        'button-3d': '0 4px 0 var(--color-primary-dark)',
        'button-3d-pressed': '0 2px 0 var(--color-primary-dark)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.06)',
        'card-dark': '0 2px 12px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 20px var(--color-primary)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 200, 0, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 200, 0, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
