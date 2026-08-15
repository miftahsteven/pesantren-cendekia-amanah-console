/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0B2F6B',
          blue: '#1F5FD0',
          lightBlue: '#EBF3FF',
          green: '#17804A',
          lightGreen: '#EAF7EF',
          red: '#D8232A',
          gold: '#F0BD28',
          bg: '#F4F7FB',
          surface: '#FFFFFF',
          border: '#DDE6F1',
          textMain: '#1A293B',
          textMuted: '#64748B'
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
