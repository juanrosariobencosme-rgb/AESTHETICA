/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#725a37',
        'primary-container': '#b89b72',
        'on-primary-container': '#473313',
        background: '#fcf9f4',
        'on-background': '#1c1c19',
        surface: '#fcf9f4',
        'on-surface': '#1c1c19',
        'surface-variant': '#e5e2dd',
        'on-surface-variant': '#4d463c',
        'surface-container': '#f0ede9',
        'surface-container-low': '#f6f3ee',
        'surface-container-high': '#ebe8e3',
        'surface-container-highest': '#e5e2dd',
        outline: '#7f766a',
        'outline-variant': '#d1c5b7',
        secondary: '#4f644e',
        'secondary-container': '#d2e9cd',
        'on-secondary-container': '#556a54',
        'secondary-fixed': '#d2e9cd',
        'secondary-fixed-dim': '#b6cdb2',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
