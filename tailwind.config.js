/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-green': '#0A1E28',
        'green': {
          600: '#4CAF50',
          700: '#45A049'
        }
      }
    }
  },
  plugins: [],
}