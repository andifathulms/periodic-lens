import type { Config } from 'tailwindcss'
import { duration, easing, ground, space, typeScale } from './lib/design/tokens'

const spacing = Object.fromEntries(space.map((s) => [String(s), `${s}px`]))
const fontSize = Object.fromEntries(typeScale.map((s) => [String(s), `${s}px`]))

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { ...ground },
      spacing,
      fontSize,
      borderRadius: { DEFAULT: '2px', sm: '2px', md: '2px', lg: '2px' },
      transitionTimingFunction: { house: easing },
      transitionDuration: Object.fromEntries(
        Object.entries(duration).map(([k, v]) => [k, `${v}ms`]),
      ),
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
