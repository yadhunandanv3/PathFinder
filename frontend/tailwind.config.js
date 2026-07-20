/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pf-lime': '#B8FF22',         // Pathfinder Jolly Lime (#B8FF22)
        'pf-lime-text': '#5A6E10',    // Dark green-lime text on light background
        'pf-dark': '#0F172A',         // Pathfinder Dark Slate (#0F172A)
        'pf-glass-active': '#2D2D2DBF', // Translucent dark glassmorphism
        'pf-cyan': '#22D3EE',         // Active cyan accent icon color
        'pf-forest': '#3F6212',       // Dark forest green
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],          // Primary body/labels font
        display: ['League Gothic', 'sans-serif'],   // Tall compressed heading font
        serif: ['Playfair Display', 'serif'],      // Italic accent serif font
      },
      boxShadow: {
        'pf-card': '0 15px 30px rgba(15, 23, 42, 0.08)',
        'pf-capsule': '18px 30px 18px rgba(15, 23, 42, 0.18)',
        'pf-logo': '0 8px 24px rgba(184, 255, 34, 0.45)',
      }
    },
  },
  plugins: [],
}
