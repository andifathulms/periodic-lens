/**
 * Elevation for the topography view. PRD.md §10.6 — periodicity as visible
 * waves across the grid rather than as a word.
 *
 * Pure, and computed here rather than in the component (invariant 18).
 *
 * Invariant 2 is the whole difficulty of this module. A missing value must not
 * become a height, and it must not become zero height either — a cell sitting
 * flat on the baseline reads as "small", which is exactly the false statement
 * the hatch exists to prevent. So an unknown returns { type: 'unknown' } and
 * the view draws it as a void spanning the full range, which cannot be read as
 * a position on the scale.
 */
import { ELEMENTS } from './data'
import { type Domain, type LensId, domain, isLogScaled, kindOf, textValue } from './lens'
import { isKnown } from './unknown'
import type { Element } from './types'

/** Maximum lift in pixels. Beyond this the rows collide and the relief reads as noise. */
export const MAX_LIFT = 40

export type Elevation =
  | { readonly type: 'known'; readonly lift: number; readonly fraction: number }
  | { readonly type: 'unknown' }

export function elevation(lens: LensId, element: Element, d: Domain | undefined): Elevation {
  if (kindOf(lens) !== 'continuous' || !d) return { type: 'unknown' }
  const value = textValue(lens, element)
  if (!isKnown(value) || typeof value.value !== 'number') return { type: 'unknown' }
  const scale = (v: number) => (isLogScaled(lens) ? Math.log10(Math.max(v, 1e-9)) : v)
  const lo = scale(d.min)
  const hi = scale(d.max)
  const fraction = hi <= lo ? 0 : (scale(value.value) - lo) / (hi - lo)
  return { type: 'known', lift: Math.round(fraction * MAX_LIFT), fraction }
}

/** Every elevation for a lens, keyed by atomic number. */
export function elevations(lens: LensId): ReadonlyMap<number, Elevation> {
  const d = domain(lens, ELEMENTS)
  return new Map(ELEMENTS.map((element) => [element.z, elevation(lens, element, d)]))
}
