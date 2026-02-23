import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Redundant colors removed - using CSS variables via @theme
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Poppins', 'sans-serif'],
        body: ['var(--font-body)', 'Open Sans', 'sans-serif'],
        script: ['var(--font-script)', 'Great Vibes', 'cursive'],
        primary: ['var(--font-primary)', 'sans-serif'],
      },
      fontSize: {
        hero: 'var(--font-size-hero, 338)px',
        h1: 'var(--font-size-h1, 147)px',
        h2: 'var(--font-size-h2, 82)px',
        h3: 'var(--font-size-h3, 28)px',
        nav: 'var(--font-size-nav, 24)px',
      },
      spacing: {
        section: 'var(--spacing-section, 120)px',
        container: 'var(--spacing-container, 108)px',
        element: 'var(--spacing-element, 40)px',
      },
      maxWidth: {
        container: 'var(--layout-max-width, 1920)px',
      },
      borderRadius: {
        theme: 'var(--layout-border-radius, 42)px',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      transitionDuration: {
        theme: 'var(--effect-transition-duration, 300)ms',
      },
      scale: {
        hover: 'var(--effect-hover-scale, 1.05)',
      },
      aspectRatio: {
        '3/4': '3 / 4',
        '4/3': '4 / 3',
      },
    },
  },
  plugins: [],
}
export default config
