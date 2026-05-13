import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Raw Skills FC brand tokens (sampled from crest)
        club: {
          red: '#D7261E',
          'red-dark': '#A81912',
          black: '#1B1A18',
          white: '#F5F2EC',
          accent: '#C6FF3D',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
        screens: { '2xl': '1280px' },
      },
    },
  },
  plugins: [],
}

export default config
