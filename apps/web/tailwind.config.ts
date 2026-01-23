import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/shared/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFC800',
          dark: '#E5A400',
          light: '#FFF8E1',
        },
        background: '#F8F9FA',
        'text-primary': '#2C3E50',
        'text-muted': '#6C7A89',
        border: '#E0E6EB',
        success: '#58CC02',
        warning: '#F59E0B',
        error: '#FF2B8F',
        streak: '#FF7A00',
      },
      fontFamily: {
        sans: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};

export default config;
