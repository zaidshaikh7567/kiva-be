/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",               // For Vite projects
    "./src/**/*.{js,ts,jsx,tsx}", // For React components
  ],
  theme: {
    extend: {
      fontFamily: {
        "sorts-mill-gloudy": ["sorts-mill-gloudy"],
        "montserrat-black-900": ["montserrat-black-900"],
        "montserrat-bold-700": ["montserrat-bold-700"],
        "montserrat-semibold-600": ["montserrat-semibold-600"],
        "montserrat-medium-500": ["montserrat-medium-500"],
        "montserrat-regular-400": ["montserrat-regular-400"],
        "montserrat-light-300": ["montserrat-light-300"],
        "montserrat-extralight-200": ["montserrat-extralight-200"],
        "montserrat-thin-100": ["montserrat-thin-100"],
      },
    },
    colors: {
      "primary": "#E0C0B0",
      "primary-dark": "#D9B5A1",
      "primary-light": "#EBDCD3",
      "secondary": "#F6F4F2",
      "black":"#051F34",
      "black-light":"#445665",
      "white":"#FFFFFF",
      "gray": {
        50: "#f9fafb",
        100: "#f3f4f6",
        200: "#e5e7eb",
        300: "#d1d5db",
        400: "#9ca3af",
        500: "#6b7280",
        600: "#4b5563",
        700: "#374151",
        800: "#1f2937",
        900: "#111827"
      },
      "green": {
        50: "#ecfdf5",
        100: "#d1fae5",
        500: "#10b981",
        600: "#059669"
      },
      "red": {
        50: "#fef2f2",
        100: "#fee2e2",
        500: "#ef4444",
        600: "#dc2626"
      },
      "blue": {
        50: "#eff6ff",
        100: "#dbeafe",
        500: "#3b82f6",
        600: "#2563eb"
      },
      "purple": {
        50: "#faf5ff",
        100: "#f3e8ff",
        500: "#8b5cf6",
        600: "#7c3aed"
      },
      "yellow": {
        400: "#fbbf24"
      },
      "orange": {
        500: "#f97316",
        600: "#ea580c"
      },
      "pink": {
        500: "#ec4899",
        600: "#db2777"
      }
    }
  },
  plugins: [],
}

