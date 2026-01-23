/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary - Duolingo Yellow
        primary: {
          DEFAULT: "#FFC800",
          light: "#FFF8E1",
          dark: "#E5A400",
        },
        // Backgrounds - Light theme
        background: "#F8F9FA",
        foreground: "#2C3E50",
        // Muted text
        muted: {
          DEFAULT: "#6C7A89",
          foreground: "#6C7A89",
        },
        // Card
        card: {
          DEFAULT: "#FFFFFF",
          border: "#E0E6EB",
        },
        // Semantic
        success: {
          DEFAULT: "#58CC02",
          light: "#D1FAE5",
        },
        error: {
          DEFAULT: "#FF2B8F",
          light: "#FFE4EC",
        },
        streak: "#FF7A00",
        blue: {
          DEFAULT: "#00E5FF",
          dark: "#00B8CC",
        },
      },
      fontFamily: {
        sans: ["Nunito_400Regular"],
        medium: ["Nunito_500Medium"],
        semibold: ["Nunito_600SemiBold"],
        bold: ["Nunito_700Bold"],
        extrabold: ["Nunito_800ExtraBold"],
        black: ["Nunito_900Black"],
      },
      borderRadius: {
        "4xl": "24px",
      },
    },
  },
  plugins: [],
};
