/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FFE223",
        secondary: "#ffffff",
        whiteless: "#6e6c6c84",
        tertiary: "#111002ff",
        gray: "#cdcdcd",
        red: "#ad1616",
        transp: "#ffffff2f"
      },
    },
  },
  plugins: [],
};
