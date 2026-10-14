/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#101820",
          soft: "#3e4c55",
          faint: "#4e5c66",
        },
        paper: {
          DEFAULT: "#f3f0e8",
          raised: "#fffcf6",
        },
        line: "#e4dcd0",
        mist: "#d5e0da",
        signal: {
          50: "#e7f6f3",
          100: "#c9ebe4",
          200: "#96d6cb",
          300: "#5ec4b4",
          400: "#2cb8a6",
          500: "#149a8c",
          600: "#0e7c71",
          700: "#0c6159",
          800: "#0a4842",
          900: "#08332f",
        },
        ember: {
          DEFAULT: "#c2410c",
          soft: "#fff1e8",
        },
      },
      fontFamily: {
        sans: ["Outfit", "Segoe UI", "sans-serif"],
        display: ["Fraunces", "Iowan Old Style", "Palatino", "serif"],
      },
      boxShadow: {
        card: "0 1px 0 rgba(16, 24, 32, 0.04)",
        lift: "0 18px 40px -24px rgba(16, 24, 32, 0.45)",
      },
      maxWidth: {
        page: "72rem",
      },
    },
  },
  plugins: [],
};
