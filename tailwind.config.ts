import type { Config } from 'tailwindcss'
import { duration, easing, ground, space, typeRoles, typeScale } from './lib/design/tokens'

const spacing = Object.fromEntries(space.map((s) => [String(s), `${s}px`]))

/*
 * Both spellings of the one scale: the numeric step (text-16) for the places
 * that genuinely mean "that step", and the semantic role (text-lead) for
 * everything expressing hierarchy. New work should reach for the role — the
 * step exists so the scale stays visible in the config.
 */
const fontSize = {
  ...Object.fromEntries(typeScale.map((s) => [String(s), `${s}px`])),
  ...Object.fromEntries(Object.entries(typeRoles).map(([role, s]) => [role, `${s}px`])),
}

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
