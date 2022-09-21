/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'travolta': "url('./assets/travolta.gif')",
      },
      fontFamily: {
        logo: ['All Round Gothic', 'sans-serif']
      }
    },
  },
  plugins: [],
}
