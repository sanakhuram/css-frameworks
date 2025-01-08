/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./**/*.{html,js,ts}', '!./node_modules/**/*'],
  theme: {
    extend: {
      colors: {
        darkBlue: '#2B2D42', // Dark Blue
        lightBlue: '#8D99AE', // Light Blue
        lightGray: '#EDF2F4', // Light Gray
        red: '#EF233C', // Bright Red
        darkRed: '#D90429', // Dark Red
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Arial', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};



