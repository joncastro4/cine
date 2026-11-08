/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cinema: {
          dark: '#0f172a',
          card: '#1e293b',
          accent: '#e11d48',
          gold: '#f59e0b',
        },
      },
    },
  },
  plugins: [],
};

