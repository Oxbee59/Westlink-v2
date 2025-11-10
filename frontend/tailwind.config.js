/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#f7c948",
        dark: "#1a1a1a",
      },
    },
  },
  plugins: [],
};
