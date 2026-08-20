/**
 * Ground tokens and the motion/space scale. DESIGN.md §1, §4, §5.
 * These are the only values Tailwind is allowed to know about; lens palettes
 * live in lib/design/palette.ts and reach components as CSS custom properties.
 */

/**
 * Contrast against --paper, measured (WCAG 2.1 relative luminance):
 *
 *   ink   on paper   15.67:1   AAA at every size
 *   muted on paper    4.63:1   AA  at every size — the floor for secondary text
 *   rule  on paper    1.39:1   borders only, never text
 *
 * There is no fifth ground colour, and no alpha variant of ink. Fading ink
 * over a lens fill is what broke AA inside the cell; every lens value clears
 * 5.1:1 against *full* ink and nothing less than full ink is used on one.
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

/** DESIGN.md §7 — 1.25 ratio. The canonical scale, stated in px as the
 * document states it. */
export const typeScale = [14, 16, 18, 22, 28, 36, 46] as const

/**
 * The same steps in rem, which is what actually ships.
 *
 * px font sizes ignore a reader's default font size entirely: full-page zoom
 * scales them, but text-only zoom and a raised browser font setting do not
 * touch them, which is WCAG 1.4.4. rem tracks the root, so the whole scale
 * moves with whatever the reader has asked for.
 *
 * 16px is the root, so the divisor is 16 and the numbers above stay the
 * definition — DESIGN.md §7 remains literally true.
 */
export const rem = (px: number): string => `${px / 16}rem`

/**
 * The same scale, named by the role it plays. Components name the role;
 * only this file knows which step a role lands on, so retuning the hierarchy
 * is one edit here rather than a sweep through every page.
 *
 * `micro` is the floor for prose (14px, secondary only); body copy is 16px
 * per the house type floor. The cell is the single exception and it carries
 * its own metrics below.
 */
export const typeRoles = {
  micro: 14,
  body: 16,
  lead: 18,
  title: 22,
  section: 28,
  page: 36,
  display: 46,
} as const
