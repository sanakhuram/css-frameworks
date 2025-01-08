/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'], 
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
        sans: ['Poppins', 'Arial', 'sans-serif'], 
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};



