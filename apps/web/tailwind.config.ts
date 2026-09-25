import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#080c14',
          surface: '#0f172a',
          card: '#131c31',
          hover: '#1e293b',
          border: '#1e293b',
          borderHighlight: '#334155',
          accent: '#6366f1',
          accentGlow: '#818cf8',
          cyan: '#06b6d4',
          purple: '#8b5cf6',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          textMuted: '#94a3b8',
          textLight: '#f8fafc',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.25)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.25)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.25)',
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.25)',
        'card-subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 75%)',
        'hero-gradient': 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(8, 12, 20, 1) 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
