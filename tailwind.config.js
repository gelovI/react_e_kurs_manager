/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        title1: ["ArchivoBlack"], 
        title2: ["Satisfy"],
      },
      rotate: {
        clockwise: "15deg",
        counterClockwise: "-15deg",
      },
    },
  },
  plugins: [],
};
