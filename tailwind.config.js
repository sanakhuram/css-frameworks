/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: "class",
  content: ["./**/*.{html,js}", "!./node_modules/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        darkBlue: "#2B2D42",
        lightBlue: "#8D99AE",
        lightGray: "#EDF2F4",
        red: "#EF233C",
        darkRed: "#D90429",
      },
      fontFamily: {
        sans: ["Poppins", "Arial", "sans-serif"], // Replace Inter/Roboto with Poppins
        serif: ["Playfair Display", "Georgia", "serif"],
        mono: ["Fira Code", "Courier New", "monospace"],
      },
      boxShadow: {
        "red-yellow":
          "0 4px 6px -1px rgba(239, 35, 60, 0.5), 0 2px 4px -1px rgba(252, 211, 77, 0.5)",
        "yellow-glow": "0 8px 15px rgba(252, 211, 77, 0.6)",
        "red-glow": "0 8px 15px rgba(239, 35, 60, 0.6)",
        "soft-dark": "0 2px 8px rgba(0, 0, 0, 0.4)",
      },
      keyframes: {
        slideIn: {
          from: { transform: "translateX(50px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        writing: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(10px)" },
        },
      },
      animation: {
        slideIn: "slideIn 0.3s ease-in-out",
        writing: "writing 0.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
