import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#16A34A',
        secondary: '#22C55E',
        background: '#FFFFFF',
        surface: '#F8FAFC',
        dark: '#0F172A',
        text: '#111827',
        muted: '#6B7280',
        border: '#E5E7EB',
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
