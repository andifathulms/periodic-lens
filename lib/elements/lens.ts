/**
 * Value → scale position, per lens.
 *
 * Invariant 1: exactly one lens is active at a time. Nothing here composites,
 * and there is no way to ask for two fills at once — the return type is a
 * single fill, not a list.
 *
 * Invariant 2: every missing value leaves this module as { type: 'unknown' }.
 * There is no path from an unknown property to a ramp index.
 */
import {
  BLOCK_COLOURS,
  CATEGORY_COLOURS,
  NOT_PRODUCED_GLYPH,
  ORIGIN_COLOURS,
  RAMPS,
} from '../design/palette'
import { blockOf } from './aufbau'
import { SOURCES } from './sources'
import { isKnown } from './unknown'
import type { Element, PropertyValue } from './types'

export type LensId =
  | 'category'
  | 'block'
  | 'origin'
  | 'production-id'
  | 'electronegativity'
  | 'atomic-radius'
  | 'ionisation-energy'
  | 'melting-point'
  | 'density'
  | 'discovery'
  | 'unmeasured'

export const LENS_IDS: readonly LensId[] = [
  'category',
  'block',
  'origin',
  'production-id',
  'electronegativity',
  'atomic-radius',
  'ionisation-energy',
  'melting-point',
  'density',
  'discovery',
  'unmeasured',
]

export type LensKind = 'categorical' | 'continuous' | 'production'

/**
 * What a cell is painted with. Three shapes, because there are three facts:
 * a value, no value, and — for production only — a value of none.
 */
export type Fill =
  | { readonly type: 'value'; readonly token: string; readonly label: string }
  | { readonly type: 'unknown' }
  | {
      readonly type: 'absent'
      readonly token: string
      readonly label: string
      readonly glyph: string
    }

const UNKNOWN_FILL: Fill = { type: 'unknown' }

export function tokenFor(lens: LensId, key: string): string {
  return `--lens-${lens}-${key}`
}

/** Continuous lenses that need a log scale, because their range spans decades. */
const LOG_SCALED: readonly LensId[] = ['density', 'production-id']

type Continuous = Extract<LensId, keyof typeof RAMPS>

/**
 * The properties the unmeasured lens counts over. This list is the lens's
 * definition, and it is the list named in the citation on SOURCES.unknownCount
 * — the two must stay in step, which tests/lens asserts.
 */
const UNMEASURED_FIELDS: readonly ((e: Element) => PropertyValue<number>)[] = [
  (e) => e.mass,
  (e) => e.discovery,
  (e) => e.electronegativity,
  (e) => e.atomicRadius,
  (e) => e.ionisationEnergy,
  (e) => e.meltingPoint,
  (e) => e.density,
]

const CONTINUOUS_READERS: Readonly<
  Record<Continuous, (e: Element) => PropertyValue<number>>
> = {
  electronegativity: (e) => e.electronegativity,
  'atomic-radius': (e) => e.atomicRadius,
  'ionisation-energy': (e) => e.ionisationEnergy,
  'melting-point': (e) => e.meltingPoint,
  density: (e) => e.density,
  discovery: (e) => e.discovery,
  'production-id': (e) =>
    e.production.type === 'produced'
      ? {
          type: 'known',
          value: e.production.production.share,
          unit: 'share of world output',
          source: e.production.production.source,
        }
      : { type: 'unknown' },
  /*
   * The lens that counts absence. Its own value is always known — an element
   * with five missing properties is a fact, not a gap — which is why this
   * reader never returns unknown and why nothing is ever hatched on this lens.
   * The legend has to say so; see the note in the legend component.
   *
   * Production is not counted. It is not a property of the element, and USGS
   * not tracking a commodity is a different kind of absence from nobody having
   * measured a melting point.
   */
  unmeasured: (e) => ({
    type: 'known',
    value: UNMEASURED_FIELDS.filter((read) => !isKnown(read(e))).length,
    /* The denominator is part of the fact: five missing out of seven is a
     * different statement from five missing out of forty. */
    unit: `of ${UNMEASURED_FIELDS.length} tracked properties`,
    source: SOURCES.unknownCount,
  }),
}

export type Domain = { readonly min: number; readonly max: number; readonly unit: string }

/** The observed range of KNOWN values. Unknowns are not in the domain at all. */
export function domain(lens: LensId, elements: readonly Element[]): Domain | undefined {
  if (!(lens in CONTINUOUS_READERS)) return undefined
  const read = CONTINUOUS_READERS[lens as Continuous]
  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY
  let unit = ''
  for (const element of elements) {
    const value = read(element)
    if (!isKnown(value)) continue
    min = Math.min(min, value.value)
    max = Math.max(max, value.value)
    unit = value.unit
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) return undefined
  return { min, max, unit }
}

/** Ramp index for a known number. Never called with an unknown. */
export function rampIndex(lens: Continuous, value: number, d: Domain): number {
  const stops = RAMPS[lens].length
  const scale = (v: number) => (LOG_SCALED.includes(lens) ? Math.log10(Math.max(v, 1e-9)) : v)
  const lo = scale(d.min)
  const hi = scale(d.max)
  if (hi <= lo) return 0
  const t = (scale(value) - lo) / (hi - lo)
  return Math.min(stops - 1, Math.max(0, Math.round(t * (stops - 1))))
}

export function kindOf(lens: LensId): LensKind {
  switch (lens) {
    case 'category':
    case 'block':
    case 'origin':
      return 'categorical'
    case 'production-id':
      return 'production'
    case 'electronegativity':
    case 'atomic-radius':
    case 'ionisation-energy':
    case 'melting-point':
    case 'density':
    case 'discovery':
    case 'unmeasured':
      return 'continuous'
    default: {
      const never: never = lens
      return never
    }
  }
}

/**
 * The one function that decides what a cell looks like.
 *
 * The switch is exhaustive with a `never` default on purpose: adding a lens id
 * makes the compiler point at every site that has to handle it, which is how
 * invariant 1 survives contact with a future feature.
 */
export function fill(lens: LensId, element: Element, d?: Domain): Fill {
  switch (lens) {
    case 'category':
      return {
        type: 'value',
        token: tokenFor('category', element.category),
        label: element.category,
      }
    case 'block': {
      const block = blockOf(element.z)
      return { type: 'value', token: tokenFor('block', block), label: block }
    }
    case 'origin':
      return {
        type: 'value',
        token: tokenFor('origin', element.origin),
        label: element.origin,
      }
    case 'production-id': {
      switch (element.production.type) {
        case 'unknown':
          return UNKNOWN_FILL
        case 'not-produced':
          return {
            type: 'absent',
            token: tokenFor('production-id', 'none'),
            label: 'not produced',
            glyph: NOT_PRODUCED_GLYPH,
          }
        case 'produced': {
          if (!d) return UNKNOWN_FILL
          const index = rampIndex(
            'production-id',
            element.production.production.share,
            d,
          )
          return {
            type: 'value',
            token: tokenFor('production-id', String(index)),
            label: `${(element.production.production.share * 100).toFixed(1)}%`,
          }
        }
        default: {
          const never: never = element.production
          return never
        }
      }
    }
    case 'electronegativity':
    case 'atomic-radius':
    case 'ionisation-energy':
    case 'melting-point':
    case 'density':
    case 'discovery':
    case 'unmeasured': {
      const value = CONTINUOUS_READERS[lens](element)
      if (!isKnown(value) || !d) return UNKNOWN_FILL
      const index = rampIndex(lens, value.value, d)
      return {
        type: 'value',
        token: tokenFor(lens, String(index)),
        label: `${value.value} ${value.unit}`.trim(),
      }
    }
    default: {
      const never: never = lens
      return never
    }
  }
}

/** The element's value for the active lens, in words. DESIGN.md §9. */
export function textValue(lens: LensId, element: Element): PropertyValue<number | string> {
  switch (kindOf(lens)) {
    case 'categorical': {
      const f = fill(lens, element)
      return f.type === 'value'
        ? { type: 'known', value: f.label, unit: '', source: element.configuration.source }
        : { type: 'unknown' }
    }
    case 'production':
      // Invariant 9 in the text channel too: "not produced" is an answer,
      // "not known" is the absence of one, and they must not be spoken alike.
      switch (element.production.type) {
        case 'produced':
          return {
            type: 'known',
            value: element.production.production.share,
            unit: 'share of world mine production',
            source: element.production.production.source,
          }
        case 'not-produced':
          return {
            type: 'known',
            value: 'not produced',
            unit: '',
            source: element.production.source,
          }
        case 'unknown':
          return { type: 'unknown' }
        default: {
          const never: never = element.production
          return never
        }
      }
    case 'continuous':
      return CONTINUOUS_READERS[lens as Continuous](element)
    default:
      return { type: 'unknown' }
  }
}
