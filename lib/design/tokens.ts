/**
 * Ground tokens and the motion/space scale. DESIGN.md §1, §4, §5.
 * These are the only values Tailwind is allowed to know about; lens palettes
 * live in lib/design/palette.ts and reach components as CSS custom properties.
 */
export const ground = {
  paper: '#F7F6F2',
  ink: '#1B1D1C',
  rule: '#D5D3CB',
  muted: '#6E706B',
} as const

/** DESIGN.md §1 — 4px base. */
export const space = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128] as const

/** DESIGN.md §5. */
export const duration = {
  fast: 120,
  state: 240,
  lens: 500,
  layout: 600,
} as const

export const easing = 'cubic-bezier(0.2,0,0,1)'

/** DESIGN.md §7 — 1.25 ratio. */
export const typeScale = [14, 16, 18, 22, 28, 36, 46] as const
