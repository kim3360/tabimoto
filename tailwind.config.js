/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        cream: '#fbf9f6',
        ink: '#1b1c1a',
        muted: '#4a4640',
        secondary: '#6b5c4a',
        sand: '#f1dcc6',
        stone: '#f5f3f0',
      },
      fontFamily: { editorial: ['PlayfairDisplay-Italic'] },
    },
  },
  plugins: [],
};
