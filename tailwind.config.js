/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
    },
  },
  plugins: [],
}

