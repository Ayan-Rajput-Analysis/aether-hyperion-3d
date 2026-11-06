/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hyperion: {
          bg: "#050608",
          dark: "#090B0E",
          card: "rgba(13, 16, 23, 0.75)",
          border: "rgba(255, 255, 255, 0.08)",
          accent: "#00F0FF",
          glow: "rgba(0, 240, 255, 0.4)",
          amber: "#FF7A00",
          crimson: "#FF0055"
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Syncopate"', '"Space Grotesk"', 'sans-serif']
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
