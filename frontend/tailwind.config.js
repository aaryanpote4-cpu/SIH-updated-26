/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F7FAFC',
          primary: '#1769AA',
          primaryHover: '#13558A',
          accent: '#19B5E6',
          navy: '#12355B',
          muted: '#4A607A',
          surface: '#FFFFFF',
          border: '#E2E8F0',
          tint: '#F0F7FD',
          tintBorder: '#D4E8F8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
