import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2D5A4A',
        secondary: '#8B7355',
        accent: '#F5F0E8',
        text: '#2C2C2C',
      },
    },
  },
  plugins: [],
}
export default config
