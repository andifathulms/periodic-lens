/**
 * The two depth views (PRD.md §10.6 and M6), held to the same rules as the
 * grid: every element present exactly once, and no unknown value given a
 * position on any scale.
 *
 * Elevation is the sharper case. On the grid an unknown is a hatch, which is
 * obviously not a colour. In a relief rendering, "no height" looks exactly
 * like "smallest value" — so the assertion here is that unknown never becomes
 * a number at all, not merely that it becomes zero.
 */
import { describe, expect, it } from 'vitest'
import { ELEMENTS } from '@/lib/elements/data'
import { LENS_IDS, domain, kindOf } from '@/lib/elements/lens'
import { MAX_LIFT, elevation, elevations } from '@/lib/elements/topography'
import { timeline } from '@/lib/elements/timeline'
import { VIEW_IDS, resolve, supports } from '@/lib/elements/view'
import { isKnown } from '@/lib/elements/unknown'

describe('views', () => {
  it('refuses topography for categorical lenses rather than inventing an order', () => {
    for (const lens of LENS_IDS) {
      expect(supports('topography', lens), lens).toBe(kindOf(lens) === 'continuous')
    }
  })

  it('falls back to the grid instead of rendering a view that cannot be honest', () => {
    expect(resolve('topography', 'category')).toBe('grid')
    expect(resolve('topography', 'electronegativity')).toBe('topography')
    for (const view of VIEW_IDS) {
      for (const lens of LENS_IDS) {
        expect(supports(resolve(view, lens), lens), `${view}/${lens}`).toBe(true)
      }
    }
  })
})

describe('property topography', () => {
  const continuous = LENS_IDS.filter((lens) => kindOf(lens) === 'continuous')

  it.each(continuous)('%s covers all 118 elements exactly once', (lens) => {
    const map = elevations(lens)
    expect(map.size).toBe(118)
    for (let z = 1; z <= 118; z += 1) expect(map.has(z)).toBe(true)
  })

  it.each(continuous)('%s never gives an unknown value a height', (lens) => {
    const d = domain(lens, ELEMENTS)
    for (const element of ELEMENTS) {
      const result = elevation(lens, element, d)
      if (result.type === 'known') continue
      // Not "lift === 0" — the property must be absent, so no caller can read
      // a number off a missing value at all.
      expect(result).toEqual({ type: 'unknown' })
      expect(result).not.toHaveProperty('lift')
    }
  })

  it.each(continuous)('%s keeps every lift inside the frame', (lens) => {
    for (const [z, result] of elevations(lens)) {
      if (result.type !== 'known') continue
      expect(result.lift, `Z=${z}`).toBeGreaterThanOrEqual(0)
      expect(result.lift, `Z=${z}`).toBeLessThanOrEqual(MAX_LIFT)
    }
  })

  it('rises monotonically with the value', () => {
    const d = domain('electronegativity', ELEMENTS)
    const known = ELEMENTS.filter((e) => isKnown(e.electronegativity))
      .map((e) => ({
        value: isKnown(e.electronegativity) ? e.electronegativity.value : 0,
        lift: elevation('electronegativity', e, d),
      }))
      .filter((row) => row.lift.type === 'known')
      .sort((a, b) => a.value - b.value)
    for (let i = 1; i < known.length; i += 1) {
      const previous = known[i - 1]!.lift
      const current = known[i]!.lift
      if (previous.type !== 'known' || current.type !== 'known') continue
      expect(current.lift).toBeGreaterThanOrEqual(previous.lift)
    }
  })

  it('puts francium at the floor and fluorine at the ceiling on electronegativity', () => {
    // Francium at 0.70, not caesium at 0.79 — the floor is whatever the data
    // says it is, and the domain is read from the known values rather than
    // assumed from the group.
    const d = domain('electronegativity', ELEMENTS)
    const fr = elevation('electronegativity', ELEMENTS.find((e) => e.z === 87)!, d)
    const f = elevation('electronegativity', ELEMENTS.find((e) => e.z === 9)!, d)
    expect(fr).toEqual({ type: 'known', lift: 0, fraction: 0 })
    expect(f.type === 'known' && f.lift).toBe(MAX_LIFT)
  })
})

describe('the discovery timeline', () => {
  const line = timeline()

  it('contains all 118 elements exactly once, across the axis and the unrecorded group', () => {
    const placed = [...line.decades.flatMap((d) => d.elements), ...line.unrecorded]
    expect(placed).toHaveLength(118)
    expect(new Set(placed.map((e) => e.z)).size).toBe(118)
  })

  it('never places an element with no recorded year on the axis', () => {
    for (const decade of line.decades) {
      for (const element of decade.elements) {
        expect(isKnown(element.discovery), element.symbol).toBe(true)
      }
    }
    for (const element of line.unrecorded) {
      expect(element.discovery.type, element.symbol).toBe('unknown')
    }
  })

  it('groups the metals of antiquity as unrecorded rather than dating them', () => {
    const symbols = line.unrecorded.map((e) => e.symbol).sort()
    expect(symbols).toContain('Au')
    expect(symbols).toContain('Cu')
    expect(symbols).toContain('Pb')
    expect(symbols).toContain('Fe')
    // And none of them appears at the left end of the axis.
    const earliest = line.decades.find((d) => d.elements.length > 0)
    expect(earliest?.elements.map((e) => e.symbol) ?? []).not.toContain('Au')
  })

  it('keeps the axis linear, empty decades included', () => {
    for (let i = 1; i < line.decades.length; i += 1) {
      expect(line.decades[i]!.decade - line.decades[i - 1]!.decade).toBe(10)
    }
    expect(line.decades[0]!.decade).toBe(line.first)
    expect(line.decades[line.decades.length - 1]!.decade).toBe(line.last)
  })

  it('reports a peak stack the view can size itself from', () => {
    expect(line.peak).toBeGreaterThan(0)
    expect(line.peak).toBe(Math.max(...line.decades.map((d) => d.elements.length)))
  })
})
