/**
 * Lens integrity. DESIGN.md §4 and §9, invariants 1, 2, 6, 7, 8, 9.
 *
 * A lens value that fails contrast is a bug in the lens, not a styling detail,
 * so it fails here rather than being noticed later on a screen.
 */
import { describe, expect, it } from 'vitest'
import {
  BLOCK_COLOURS,
  CATEGORY_COLOURS,
  NOT_PRODUCED_COLOUR,
  ORIGIN_COLOURS,
  RAMPS,
  UNKNOWN_HATCH,
} from '@/lib/design/palette'
import { ground } from '@/lib/design/tokens'
import { ELEMENTS } from '@/lib/elements/data'
import { LENS_IDS, domain, fill, kindOf, textValue } from '@/lib/elements/lens'
import { isKnown } from '@/lib/elements/unknown'

function channel(component: number): number {
  const c = component / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function luminance(hex: string): number {
  const value = hex.replace('#', '')
  const r = channel(parseInt(value.slice(0, 2), 16))
  const g = channel(parseInt(value.slice(2, 4), 16))
  const b = channel(parseInt(value.slice(4, 6), 16))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: string, b: string): number {
  const la = luminance(a)
  const lb = luminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

const CATEGORICAL = {
  category: CATEGORY_COLOURS,
  block: BLOCK_COLOURS,
  origin: ORIGIN_COLOURS,
} as const

const everyLensValue = [
  ...Object.values(RAMPS).flat(),
  ...Object.values(CATEGORICAL).flatMap((palette) => Object.values(palette)),
  NOT_PRODUCED_COLOUR,
]

describe('scale integrity', () => {
  it('keeps every continuous ramp single-hue and strictly luminance-monotonic', () => {
    for (const [lens, ramp] of Object.entries(RAMPS)) {
      const luminances = ramp.map(luminance)
      for (let i = 1; i < luminances.length; i += 1) {
        expect(luminances[i]!, `${lens} stop ${i}`).toBeLessThan(luminances[i - 1]!)
      }
    }
  })

  it('never puts a rainbow on a continuous lens', () => {
    // A single-hue ramp keeps one channel dominant across every stop; a
    // rainbow does not.
    for (const [lens, ramp] of Object.entries(RAMPS)) {
      const dominant = ramp.map((hex) => {
        const v = hex.replace('#', '')
        const parts = [v.slice(0, 2), v.slice(2, 4), v.slice(4, 6)].map((p) => parseInt(p, 16))
        return parts.indexOf(Math.max(...parts))
      })
      expect(new Set(dominant).size, `${lens} changes hue family across the ramp`).toBe(1)
    }
  })

  it('caps categorical lenses at eight values', () => {
    for (const [lens, palette] of Object.entries(CATEGORICAL)) {
      expect(Object.keys(palette).length, lens).toBeLessThanOrEqual(8)
    }
  })

  it('gives categorical values distinct colours, with no collisions', () => {
    for (const [lens, palette] of Object.entries(CATEGORICAL)) {
      const values = Object.values(palette)
      expect(new Set(values).size, lens).toBe(values.length)
    }
  })

  it('clears AA against --ink at cell type size for every lens value', () => {
    for (const value of everyLensValue) {
      expect(contrast(value, ground.ink), `${value} against --ink`).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('keeps not-produced visibly out of the production ramp — invariant 9', () => {
    for (const stop of RAMPS['production-id']) {
      expect(contrast(NOT_PRODUCED_COLOUR, stop), stop).not.toBe(1)
      expect(NOT_PRODUCED_COLOUR).not.toBe(stop)
    }
  })

  it('paints unknown with a pattern, never a flat colour', () => {
    expect(UNKNOWN_HATCH).toContain('repeating-linear-gradient')
    expect(everyLensValue).not.toContain(UNKNOWN_HATCH)
  })
})

describe('unknown handling — invariant 2', () => {
  it.each(LENS_IDS)('%s never gives an unknown value a ramp position', (lens) => {
    const d = domain(lens, ELEMENTS)
    for (const element of ELEMENTS) {
      const value = textValue(lens, element)
      if (isKnown(value)) continue
      expect(fill(lens, element, d), `${element.symbol} on ${lens}`).toEqual({
        type: 'unknown',
      })
    }
  })

  it.each(LENS_IDS)('%s never produces a numeric zero for a missing value', (lens) => {
    const d = domain(lens, ELEMENTS)
    for (const element of ELEMENTS) {
      const result = fill(lens, element, d)
      if (result.type !== 'unknown') continue
      expect(result).not.toHaveProperty('token')
      expect(result).not.toHaveProperty('label')
    }
  })

  it('excludes unknown values from every continuous domain', () => {
    for (const lens of LENS_IDS) {
      if (kindOf(lens) !== 'continuous') continue
      const d = domain(lens, ELEMENTS)
      expect(d, lens).toBeDefined()
      expect(Number.isFinite(d!.min) && Number.isFinite(d!.max), lens).toBe(true)
      expect(d!.unit.length, `${lens} scale must be named with a unit`).toBeGreaterThan(0)
    }
  })

  it('hatches oganesson on electronegativity rather than placing it low', () => {
    const og = ELEMENTS.find((e) => e.z === 118)!
    expect(og.electronegativity.type).toBe('unknown')
    expect(fill('electronegativity', og, domain('electronegativity', ELEMENTS))).toEqual({
      type: 'unknown',
    })
  })
})

describe('the production lens — invariants 9 and 10', () => {
  it('separates not-produced from low-produced', () => {
    const d = domain('production-id', ELEMENTS)
    const produced = ELEMENTS.filter((e) => e.production.type === 'produced')
    const absent = ELEMENTS.filter((e) => e.production.type === 'not-produced')
    expect(produced.length).toBeGreaterThan(0)
    expect(absent.length).toBeGreaterThan(0)
    for (const element of absent) {
      expect(fill('production-id', element, d).type).toBe('absent')
    }
    for (const element of produced) {
      expect(fill('production-id', element, d).type).toBe('value')
    }
  })

  it('marks not-produced with a glyph as well as a colour', () => {
    const absent = ELEMENTS.find((e) => e.production.type === 'not-produced')!
    const result = fill('production-id', absent, domain('production-id', ELEMENTS))
    expect(result.type === 'absent' && result.glyph.length).toBeGreaterThan(0)
  })

  it('carries an edition year and a stage on every figure', () => {
    for (const element of ELEMENTS) {
      if (element.production.type !== 'produced') continue
      const p = element.production.production
      expect(p.edition, element.symbol).toBeGreaterThan(2000)
      expect(['mined', 'refined']).toContain(p.stage)
      expect(p.source.cite, element.symbol).toContain('Geological Survey')
    }
  })

  it('treats an element USGS does not track as unknown, not as zero', () => {
    const untracked = ELEMENTS.find((e) => e.production.type === 'unknown')!
    expect(fill('production-id', untracked, domain('production-id', ELEMENTS))).toEqual({
      type: 'unknown',
    })
  })
})

describe('one lens at a time — invariant 1', () => {
  it('returns exactly one fill per cell, never a list', () => {
    for (const lens of LENS_IDS) {
      const d = domain(lens, ELEMENTS)
      for (const element of ELEMENTS) {
        const result = fill(lens, element, d)
        expect(Array.isArray(result)).toBe(false)
        expect(['value', 'unknown', 'absent']).toContain(result.type)
      }
    }
  })

  it('names a token for every painted value, so no component holds a hex', () => {
    for (const lens of LENS_IDS) {
      const d = domain(lens, ELEMENTS)
      for (const element of ELEMENTS) {
        const result = fill(lens, element, d)
        if (result.type === 'unknown') continue
        expect(result.token.startsWith('--lens-'), `${lens}/${element.symbol}`).toBe(true)
      }
    }
  })
})

/**
 * The lens that counts absence. It inverts the usual risk — instead of an
 * unknown leaking onto a ramp, the danger is the count silently drifting out
 * of step with the citation that defines it, or the ramp gaining a stop that
 * no count can reach.
 */
describe('the unmeasured lens', () => {
  const TRACKED = [
    'mass',
    'discovery',
    'electronegativity',
    'atomicRadius',
    'ionisationEnergy',
    'meltingPoint',
    'density',
  ] as const

  it('counts exactly the properties its citation names', () => {
    for (const element of ELEMENTS) {
      const expected = TRACKED.filter((field) => element[field].type === 'unknown').length
      const value = textValue('unmeasured', element)
      expect(isKnown(value) && value.value, element.symbol).toBe(expected)
    }
  })

  it('names every tracked field in the citation, so the count is traceable', () => {
    const value = textValue('unmeasured', ELEMENTS[0]!)
    expect(isKnown(value)).toBe(true)
    if (!isKnown(value)) return
    expect(value.unit).toContain(String(TRACKED.length))
    for (const phrase of [
      'atomic weight',
      'discovery year',
      'electronegativity',
      'atomic radius',
      'ionisation energy',
      'melting point',
      'density',
    ]) {
      expect(value.source.cite.toLowerCase(), phrase).toContain(phrase)
    }
  })

  it('hatches nothing, because the count is always known', () => {
    const d = domain('unmeasured', ELEMENTS)
    for (const element of ELEMENTS) {
      expect(fill('unmeasured', element, d).type, element.symbol).toBe('value')
    }
  })

  it('gives one ramp stop per reachable count, so the colour IS the number', () => {
    const d = domain('unmeasured', ELEMENTS)!
    expect(d.min).toBe(0)
    expect(RAMPS.unmeasured.length).toBeGreaterThan(d.max)
    for (const element of ELEMENTS) {
      const value = textValue('unmeasured', element)
      if (!isKnown(value) || typeof value.value !== 'number') throw new Error('unreachable')
      const painted = fill('unmeasured', element, d)
      expect(painted.type === 'value' && painted.token, element.symbol).toBe(
        `--lens-unmeasured-${value.value}`,
      )
    }
  })

  it('excludes production, which is a different kind of absence', () => {
    // Francium is tracked by nobody for production and has known properties
    // beyond the two it is missing; if production were counted its number
    // would be higher than the property count above.
    const fr = ELEMENTS.find((e) => e.z === 87)!
    expect(fr.production.type).not.toBe('produced')
    const value = textValue('unmeasured', fr)
    expect(isKnown(value) && value.value).toBe(
      TRACKED.filter((field) => fr[field].type === 'unknown').length,
    )
  })
})
