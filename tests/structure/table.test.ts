/**
 * Structural invariants (PRD.md §12) and layout completeness (invariant 5).
 *
 * The positions are derived from the filling order, so these assertions are
 * checking the rule against the table everyone already knows — if the rule
 * were wrong, oxygen would not land in group 16.
 */
import { describe, expect, it } from 'vitest'
import { blockOf } from '@/lib/elements/aufbau'
import { ELEMENTS, elementAt } from '@/lib/elements/data'
import {
  ALL_Z,
  BLOCK_WIDTHS,
  HELIUM_POSITION_EXCEPTION,
  LAYOUT_IDS,
  PERIOD_LENGTHS,
  groupOf,
  periodOf,
  position,
} from '@/lib/elements/layout'
import type { Block } from '@/lib/elements/types'

describe('period and block structure', () => {
  it('has period lengths 2, 8, 8, 18, 18, 32, 32', () => {
    const counts = PERIOD_LENGTHS.map((_, index) =>
      ALL_Z.filter((z) => periodOf(z) === index + 1).length,
    )
    expect(counts).toEqual([2, 8, 8, 18, 18, 32, 32])
  })

  it('accounts for all 118 elements across the seven periods', () => {
    expect(PERIOD_LENGTHS.reduce((a, b) => a + b, 0)).toBe(118)
  })

  it('has block widths 2, 6, 10, 14 in every period that has the block', () => {
    for (const block of Object.keys(BLOCK_WIDTHS) as Block[]) {
      const rows = new Map<number, number>()
      for (const z of ALL_Z) {
        if (blockOf(z) !== block) continue
        rows.set(periodOf(z), (rows.get(periodOf(z)) ?? 0) + 1)
      }
      for (const [period, count] of rows) {
        expect(count, `${block}-block in period ${period}`).toBe(BLOCK_WIDTHS[block])
      }
    }
  })

  it('gives every element a block matching its stored record', () => {
    for (const element of ELEMENTS) {
      expect(element.block, element.symbol).toBe(blockOf(element.z))
    }
  })

  it('puts every element in a group consistent with its block', () => {
    for (const z of ALL_Z) {
      const group = groupOf(z)
      const block = blockOf(z)
      if (block === 'f') {
        expect(group, `Z=${z}`).toBe(0)
        continue
      }
      if (z === HELIUM_POSITION_EXCEPTION) {
        // The one documented positional exception: helium is s-block and sits
        // with the noble gases on chemistry, not configuration.
        expect(group).toBe(18)
        continue
      }
      if (block === 's') expect(group, `Z=${z}`).toBeLessThanOrEqual(2)
      if (block === 'd') expect(group, `Z=${z}`).toBeGreaterThanOrEqual(3)
      if (block === 'd') expect(group, `Z=${z}`).toBeLessThanOrEqual(12)
      if (block === 'p') expect(group, `Z=${z}`).toBeGreaterThanOrEqual(13)
    }
  })

  /** Landmarks a chemist would notice immediately if they moved. */
  it.each([
    [8, 'O', 16, 2, 'p'],
    [26, 'Fe', 8, 4, 'd'],
    [17, 'Cl', 17, 3, 'p'],
    [56, 'Ba', 2, 6, 's'],
    [71, 'Lu', 3, 6, 'd'],
    [92, 'U', 0, 7, 'f'],
    [118, 'Og', 18, 7, 'p'],
  ])('Z=%i %s sits in group %i, period %i, %s-block', (z, symbol, group, period, block) => {
    expect(elementAt(z as number).symbol).toBe(symbol)
    expect(groupOf(z as number)).toBe(group)
    expect(periodOf(z as number)).toBe(period)
    expect(blockOf(z as number)).toBe(block)
  })
})

describe('layout completeness — invariant 5', () => {
  it.each(LAYOUT_IDS)('%s contains all 118 elements exactly once', (layout) => {
    const points = ALL_Z.map((z) => position(layout, z))
    expect(points).toHaveLength(118)
    const keys = new Set(points.map((p) => `${p.x.toFixed(4)},${p.y.toFixed(4)}`))
    expect(keys.size, 'no two elements may share a position').toBe(118)
  })

  it('cannot lose or invent an element between layouts', () => {
    const sets = LAYOUT_IDS.map(
      (layout) => new Set(ALL_Z.filter((z) => position(layout, z) !== undefined)),
    )
    for (const set of sets) {
      expect([...set].sort((a, b) => a - b)).toEqual([...ALL_Z])
    }
  })

  it('places the f-block in the footnote rows of the standard layout', () => {
    for (const z of ALL_Z) {
      if (blockOf(z) !== 'f') continue
      expect(position('standard', z).y, `Z=${z}`).toBeGreaterThanOrEqual(8)
    }
  })

  it('right-aligns the left-step table so the s-block is its last two columns', () => {
    for (const z of ALL_Z) {
      if (blockOf(z) !== 's' || z === HELIUM_POSITION_EXCEPTION) continue
      expect(position('left-step', z).x, `Z=${z}`).toBeGreaterThanOrEqual(30)
    }
  })
})
