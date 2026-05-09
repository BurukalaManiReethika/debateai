/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        pro: {
          light: "#E1F5EE",
          DEFAULT: "#1D9E75",
          dark: "#0F6E56",
        },
        con: {
          light: "#FAECE7",
          DEFAULT: "#D85A30",
          dark: "#993C1D",
        },
        ink: {
          50: "#F7F6F3",
          100: "#EDEBE4",
          200: "#D6D3C8",
          400: "#9C9889",
          600: "#5C5A52",
          800: "#2A2925",
          900: "#161512",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.35s ease forwards",
        "pulse-dot": "pulseDot 1.2s ease-in-out infinite",
        "typing-cursor": "blink 1s step-end infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: "translateY(12px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        pulseDot: { "0%,100%": { opacity: 0.3, transform: "scale(0.8)" }, "50%": { opacity: 1, transform: "scale(1.2)" } },
        blink: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0 } },
      },
    },
  },
  plugins: [],
};
