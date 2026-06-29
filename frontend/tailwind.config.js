/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        accent: "#F59E0B",

        success: "#27AE60",
        warning: "#E67E22",
        danger: "#E74C3C",

        background: "#F5F7FA",
        surface: "#FFFFFF",

        textPrimary: "#374151",
        textSecondary: "#6B7280",

        border: "#E5E7EB",
      },

      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
    },
  },
  plugins: [],
}