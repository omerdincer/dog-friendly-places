/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',  // Ensure Tailwind applies to all JSX/TSX files
  ],
  theme: {
    extend: {
      colors: {
      'custom-gray': '#4c6066',
      'custom-sidebar-text': '#93a492',
    },
  },
  },
  plugins: [],
};
