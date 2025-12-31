/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores primárias
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#0f172a',
        },
        // Cores semânticas financeiras - Entradas
        income: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          900: '#064e3b',
        },
        // Cores semânticas financeiras - Saídas
        expense: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          900: '#7f1d1d',
        },
        // Cores de estado
        success: {
          100: '#dcfce7',
          600: '#16a34a',
        },
        warning: {
          100: '#ffedd5',
          500: '#f97316',
          600: '#ea580c',
          900: '#7c2d12',
        },
        error: {
          100: '#fee2e2',
          600: '#dc2626',
        },
        info: {
          100: '#e0f2fe',
          600: '#0284c7',
        },
        // Escala de neutros
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          600: '#525252',
          700: '#404040',
          900: '#171717',
          950: '#0a0a0a',
        },
        // Compatibilidade com código existente (manter temporariamente)
        entrada: {
          DEFAULT: '#10b981',
          light: '#d1fae5',
          dark: '#059669',
        },
        saida: {
          DEFAULT: '#ef4444',
          light: '#fee2e2',
          dark: '#dc2626',
        },
        saldo: {
          DEFAULT: '#3b82f6',
          light: '#dbeafe',
          dark: '#2563eb',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.4' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.5' }],
        'lg': ['1.125rem', { lineHeight: '1.4' }],
        'xl': ['1.25rem', { lineHeight: '1.3' }],
        '2xl': ['1.5rem', { lineHeight: '1.25' }],
        '3xl': ['1.75rem', { lineHeight: '1.2' }],
      },
    },
  },
  plugins: [],
}


