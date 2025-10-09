/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // In theme.extend
// In theme.extend
animation: {
  'jiggle': 'jiggle 0.4s ease-in-out',
},
keyframes: {
  jiggle: {
    '0%, 100%': { transform: 'translateX(0)' },
    '25%': { transform: 'translateX(-1px)' },
    '75%': { transform: 'translateX(1px)' },
  }
}
    },
  },
};
export default config;
