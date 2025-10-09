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
      colors: {
        "primary": "#E0C0B0",
        "primary-dark": "#D9B5A1",
        "primary-light": "#EBDCD3",
        "secondary": "#F6F4F2",
        "black":"#051F34",
        "black-light":"#445665",
        "white":"#FFFFFF"
      }
    }
  },
  plugins: [],
}

