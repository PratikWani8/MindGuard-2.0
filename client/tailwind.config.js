/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        body: ['"Inter"', "sans-serif"],
      },
      colors: {
        ink: {
          900: "#181425",
          800: "#241f38",
          700: "#332c4d",
          500: "#5d5578",
          400: "#87809e",
          300: "#b3adc4",
        },
        haze: {
          50: "#faf9fd",
          100: "#f3f1fa",
          200: "#e9e5f5",
        },
        violet: {
          50: "#f4f2fe",
          100: "#ebe7fd",
          200: "#d5cdfb",
          300: "#b6a5f7",
          400: "#9679f0",
          500: "#7c5ce6",
          600: "#6a41d6",
          700: "#5731b8",
          800: "#472a93",
          900: "#3b2676",
        },
        aqua: {
          400: "#5ecbd8",
          500: "#3bb3c4",
        },
        calm: {
          green: "#3fb886",
          amber: "#e8a53d",
          orange: "#e8823d",
          red: "#e85d5d",
        },
      },
      boxShadow: {
        soft: "0 8px 30px -8px rgba(60, 42, 120, 0.18)",
        glow: "0 0 0 1px rgba(255,255,255,0.5) inset, 0 8px 30px -8px rgba(60,42,120,0.25)",
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      animation: {
        breathe: "breathe 6s ease-in-out infinite",
        drift: "drift 18s ease-in-out infinite",
        'fade-up': 'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: 0.55 },
          '50%': { transform: 'scale(1.12)', opacity: 0.85 },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0,0) rotate(0deg)' },
          '33%': { transform: 'translate(20px,-30px) rotate(6deg)' },
          '66%': { transform: 'translate(-15px,20px) rotate(-4deg)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(14px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
